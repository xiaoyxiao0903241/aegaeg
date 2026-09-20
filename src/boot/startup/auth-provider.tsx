import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  deriveAuthState,
  FALLBACK_SESSION_TTL_MS,
  isLoginChainReady,
} from '~/core/auth/auth-machine'
import { getJwtExpiresAtMs } from '~/core/auth/jwt'
import type { AuthSessionStorage } from '~/core/auth/storage'
import type { StoredAuthSession } from '~/core/auth/types'
import { AuthContext, type AuthContextValue } from '~/hooks/use-auth'
import { LOGIN_ERROR, subscribeUnauthorized } from '~/shared/api/account-banned'
import {
  clearApiQueries,
  invalidateAfterAuthLogin,
  invalidateAfterWalletSwitch,
} from '~/shared/api/query/invalidate'
import { useAuthStore } from '~/stores/auth-store'
import { useDappHostStore } from '~/stores/dapp-host-store'
import { loginWithWallet, toLoginErrorSentinel } from '~/web3/auth/login-with-wallet'
import { useBindConnectedBscReadWallet } from '~/web3/chain-read-client'
import { defaultChain } from '~/web3/thirdweb'
import { useActiveAccount, useActiveWalletChain } from '~/web3/thirdweb-react'

type AuthStoreGetter = Pick<ReturnType<typeof useAuthStore.getState>, 'upsertSessionForAddress'>

/**
 * 会话存储适配层：登录写入按地址存入状态仓库。
 *
 * 读 / 清空返回空操作——会话没有独立对象，统一由 sessionsByAddress 派生。
 */
function createStoreAuthSessionStorage(
  getStore: () => AuthStoreGetter = () => useAuthStore.getState(),
): AuthSessionStorage {
  return {
    read: () => null,
    write: (session: StoredAuthSession) => {
      getStore().upsertSessionForAddress(session)
    },
    clear: () => {},
  }
}

const sessionStorage = createStoreAuthSessionStorage()

/**
 * 登录状态 Provider。
 *
 * 订阅钱包地址与按地址存储的 JWT，派生会话状态。
 * `/auth/login` 只在用户点击登录并完成钱包签名后调用；401 只退出，不换票。
 * JWT 到期只把 sessionReady 翻成 needsSignIn，等用户再点登录。
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  useBindConnectedBscReadWallet()
  const account = useActiveAccount()
  const walletChain = useActiveWalletChain()
  const liveChainId = walletChain?.id
  const walletAddress = account?.address
  const activeTab = useDappHostStore((state) => state.activeTab)
  const sessionsByAddress = useAuthStore((state) => state.sessionsByAddress)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn)
  const loginError = useAuthStore((state) => state.loginError)

  const loginInProgressRef = useRef(false)
  /** 当前时间：JWT 到期或页签回到前台时更新，用来立刻重算是否仍已登录。 */
  const [authNow, setAuthNow] = useState(() => Date.now())

  /** 会话状态由「当前钱包 + 按地址 JWT 表」派生，无独立 session 对象可同步。 */
  const authState = useMemo(
    () => deriveAuthState({ walletAddress, sessionsByAddress, now: authNow }),
    [walletAddress, sessionsByAddress, authNow],
  )
  const session = authState.kind === 'sessionReady' ? authState.session : null
  const sessionReady = authState.kind === 'sessionReady'
  const token = session?.token ?? null

  useEffect(() => {
    if (authState.kind !== 'sessionReady') return
    const expiresAt =
      authState.session.expiresAt ??
      getJwtExpiresAtMs(authState.session.token) ??
      authState.session.savedAt + FALLBACK_SESSION_TTL_MS
    const delay = Math.max(0, expiresAt - Date.now() + 1)
    const timerId = window.setTimeout(() => setAuthNow(Date.now()), delay)
    return () => window.clearTimeout(timerId)
  }, [authState])

  // 后台标签页可能推迟定时器；回到前台时立刻按当前时间重算是否仍已登录
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') setAuthNow(Date.now())
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  const runLogin = useCallback(async () => {
    if (loginInProgressRef.current) return
    if (!account) {
      useAuthStore.getState().setLoginError(LOGIN_ERROR.WALLET_NOT_CONNECTED)
      return
    }
    // 未知链：等 hydrate，不写错。
    if (liveChainId == null) return
    // 异网：仅抛哨兵供手动登录 toast；不写 loginError（避免 chip reconnect）。
    if (!isLoginChainReady(liveChainId, defaultChain.id)) {
      throw LOGIN_ERROR.WRONG_NETWORK
    }

    loginInProgressRef.current = true
    const { setIsLoggingIn, setLoginError } = useAuthStore.getState()
    setIsLoggingIn(true)
    setLoginError(null)

    const finishLoginAttempt = () => {
      loginInProgressRef.current = false
      useAuthStore.getState().setIsLoggingIn(false)
    }

    try {
      await loginWithWallet({
        account,
        chainId: defaultChain.id,
        liveChainId,
        storage: sessionStorage,
      })
      finishLoginAttempt()
    } catch (error) {
      // 先收尾再写 loginError：避免 setLoginError 抛错时 isLoggingIn 卡住；且不用 finally（Compiler 未支持）
      finishLoginAttempt()
      const sentinel = toLoginErrorSentinel(error)
      // 异网不落盘——环境由 live chain 判定，toast 吃 throw
      if (sentinel && sentinel !== LOGIN_ERROR.WRONG_NETWORK) {
        useAuthStore.getState().setLoginError(sentinel)
      }
      throw error
    }
  }, [account, liveChainId])

  /** 登录/登出/切钱包时对齐 React Query 缓存。 */
  const prevAuthedRef = useRef(false)
  const prevAddressRef = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (!hasHydrated) return

    const wasAuthed = prevAuthedRef.current
    const prevAddress = prevAddressRef.current
    if (sessionReady && !wasAuthed) {
      invalidateAfterAuthLogin(walletAddress)
    } else if (!sessionReady && wasAuthed) {
      clearApiQueries()
    }

    if (prevAddress && walletAddress && prevAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      invalidateAfterWalletSwitch(walletAddress, activeTab)
    }

    prevAuthedRef.current = sessionReady
    // 切钱包常为 A → undefined → B；断开时保留上一地址，才能识别真正的切换
    if (walletAddress) {
      prevAddressRef.current = walletAddress
    }
  }, [hasHydrated, sessionReady, walletAddress, activeTab])

  /** 用户点击登录：必须先签名再换票。 */
  const login = useCallback(async () => {
    useAuthStore.getState().setLoginError(null)
    await runLogin()
  }, [runLogin])

  /**
   * 退出当前地址：JWT 与残留签名一并清除。
   *
   * 用户登出与 401 共用；不请求登录接口。无当前地址时是空操作。
   */
  const logout = useCallback(() => {
    const store = useAuthStore.getState()
    if (walletAddress) {
      store.removeSessionForAddress(walletAddress)
      store.clearSignatureForAddress(walletAddress)
    }
    store.setLoginError(null)
  }, [walletAddress])

  useEffect(() => subscribeUnauthorized(logout), [logout])

  /** 钱包断开时仅清登录错误，不清会话表。 */
  const clearLoginErrorOnDisconnect = useCallback(() => {
    useAuthStore.getState().setLoginError(null)
  }, [])

  const clearLoginError = useCallback(() => {
    useAuthStore.getState().setLoginError(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      session,
      sessionReady,
      needsSignIn: authState.kind === 'needsSignIn' && !isLoggingIn,
      hasHydrated,
      isLoggingIn,
      loginError,
      login,
      logout,
      clearLoginErrorOnDisconnect,
      clearLoginError,
    }),
    [
      authState.kind,
      clearLoginError,
      clearLoginErrorOnDisconnect,
      hasHydrated,
      sessionReady,
      isLoggingIn,
      login,
      loginError,
      logout,
      session,
      token,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
