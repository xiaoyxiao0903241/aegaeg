import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  clampRenewAtMs,
  deriveAuthAction,
  deriveAuthState,
  FALLBACK_SESSION_TTL_MS,
  isLoginChainReady,
  isSessionRenewHaltError,
  loginAttemptKey,
  renewNotBeforeAfterTransientFailureMs,
  shouldClearLoginAttemptAfterFailure,
} from '~/core/auth/auth-machine'
import { getJwtExpiresAtMs } from '~/core/auth/jwt'
import type { AuthSessionStorage, LoginSignatureStorage } from '~/core/auth/storage'
import type { StoredAuthSession } from '~/core/auth/types'
import { AuthContext, type AuthContextValue } from '~/hooks/use-auth'
import { LOGIN_ERROR } from '~/shared/api/account-banned'
import {
  clearApiQueries,
  invalidateAfterAuthLogin,
  invalidateAfterWalletSwitch,
} from '~/shared/api/query/invalidate'
import { useAuthStore } from '~/stores/auth-store'
import { useDappHostStore } from '~/stores/dapp-host-store'
import { loginWithWallet, toLoginErrorSentinel } from '~/web3/auth/login-with-wallet'
import { defaultChain } from '~/web3/thirdweb'
import { useActiveAccount, useActiveWalletChain } from '~/web3/thirdweb-react'

type AuthStoreGetter = Pick<
  ReturnType<typeof useAuthStore.getState>,
  | 'upsertSessionForAddress'
  | 'upsertSignatureForAddress'
  | 'readSignatureForAddress'
  | 'clearSignatureForAddress'
>

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

/** 登录签名存储适配层：签名按地址写入状态仓库。 */
function createStoreLoginSignatureStorage(
  getStore: () => AuthStoreGetter = () => useAuthStore.getState(),
): LoginSignatureStorage {
  return {
    readForAddress: (address) => getStore().readSignatureForAddress(address),
    write: (signature) => getStore().upsertSignatureForAddress(signature),
    clearForAddress: (address) => getStore().clearSignatureForAddress(address),
  }
}

const sessionStorage = createStoreAuthSessionStorage()
const signatureStorage = createStoreLoginSignatureStorage()

const RENEW_THRESHOLD_MS = 60_000

/**
 * 登录状态 Provider。
 *
 * 订阅钱包地址与按地址存储的 JWT / 签名，派生会话状态；
 * 根据状态机输出在后台静默登录、续期或等待用户操作。
 * 链未就绪时调度 idle；SIWE 消息始终声明期望链，不把异网写入 loginError。
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount()
  const walletChain = useActiveWalletChain()
  const liveChainId = walletChain?.id
  const walletAddress = account?.address
  const activeTab = useDappHostStore((state) => state.activeTab)
  const sessionsByAddress = useAuthStore((state) => state.sessionsByAddress)
  const signaturesByAddress = useAuthStore((state) => state.signaturesByAddress)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn)
  const loginError = useAuthStore((state) => state.loginError)

  const loginInProgressRef = useRef(false)
  /** 最近一次静默登录的尝试指纹，防止同一指纹反复重试。 */
  const lastAttemptRef = useRef<string | null>(null)
  /** 续期失败后，最早允许再试的时刻；为 0 表示不限制。 */
  const renewNotBeforeMsRef = useRef(0)
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
  const loginChainReady = isLoginChainReady(liveChainId, defaultChain.id)

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
    // 未知链：等 hydrate，不写错、不烧 attempt。
    if (liveChainId == null) return
    // 异网：仅抛哨兵供手动登录 toast；不写 loginError（避免 chip reconnect）。
    if (liveChainId !== defaultChain.id) {
      throw LOGIN_ERROR.WRONG_NETWORK
    }

    loginInProgressRef.current = true
    const { setIsLoggingIn, setLoginError, sessionsByAddress } = useAuthStore.getState()
    const existingSession = sessionsByAddress[account.address.toLowerCase()]
    const isSilentRenew = Boolean(existingSession?.token)
    // 续期不触发 isLoggingIn——页面把它当作整页骨架屏
    if (!isSilentRenew) {
      setIsLoggingIn(true)
    }
    setLoginError(null)

    const finishLoginAttempt = () => {
      loginInProgressRef.current = false
      if (!isSilentRenew) {
        useAuthStore.getState().setIsLoggingIn(false)
      }
    }

    try {
      await loginWithWallet({
        account,
        chainId: defaultChain.id,
        liveChainId,
        storage: sessionStorage,
        signatureStorage,
      })
      finishLoginAttempt()
    } catch (error) {
      // 先收尾再写 loginError：避免 setLoginError 抛错时 isLoggingIn 卡住；且不用 finally（Compiler 未支持）
      finishLoginAttempt()
      const sentinel = toLoginErrorSentinel(error)
      // 异网不落盘——环境由 loginChainReady 调度，toast 吃 throw
      if (sentinel && sentinel !== LOGIN_ERROR.WRONG_NETWORK) {
        useAuthStore.getState().setLoginError(sentinel)
      }
      throw error
    }
  }, [account, liveChainId])

  /** 执行机：按派生 action 发起静默登录，或在到期前安排续期。 */
  useEffect(() => {
    if (!hasHydrated || !walletAddress) return

    const signature = signaturesByAddress[walletAddress.toLowerCase()] ?? null
    const attemptKey = loginAttemptKey(walletAddress, session, signature)

    const action = deriveAuthAction({
      state: authState,
      isLoggingIn,
      loginError,
      lastAttemptKey: lastAttemptRef.current,
      attemptKey,
      renewThresholdMs: RENEW_THRESHOLD_MS,
      loginChainReady,
    })

    if (action.type === 'login') {
      lastAttemptRef.current = attemptKey
      void runLogin().catch(() => {
        const nextError = useAuthStore.getState().loginError
        if (shouldClearLoginAttemptAfterFailure(nextError)) {
          lastAttemptRef.current = null
        }
      })
      return
    }

    if (action.type === 'renewAt') {
      const targetAt = clampRenewAtMs(action.at, renewNotBeforeMsRef.current)
      const delay = Math.max(0, targetAt - Date.now())
      const timerId = window.setTimeout(() => {
        lastAttemptRef.current = null
        void runLogin()
          .then(() => {
            renewNotBeforeMsRef.current = 0
          })
          .catch(() => {
            const nextError = useAuthStore.getState().loginError
            if (isSessionRenewHaltError(nextError)) return
            // 瞬时失败：清掉错误并推迟再试，避免立刻连着重试
            useAuthStore.getState().setLoginError(null)
            renewNotBeforeMsRef.current = renewNotBeforeAfterTransientFailureMs(Date.now())
            setAuthNow(Date.now())
          })
      }, delay)
      return () => window.clearTimeout(timerId)
    }
  }, [
    hasHydrated,
    walletAddress,
    authState,
    session,
    signaturesByAddress,
    isLoggingIn,
    loginError,
    loginChainReady,
    runLogin,
  ])

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

  /** 用户点击登录：清除防重试锁定，允许再次弹出签名。 */
  const login = useCallback(async () => {
    lastAttemptRef.current = null
    renewNotBeforeMsRef.current = 0
    useAuthStore.getState().setLoginError(null)
    await runLogin()
  }, [runLogin])

  /**
   * 401 处理：只清当前地址的 JWT，保留签名以便静默换票。
   * 故意不重置防重试锁定——新票再被拒时，同一指纹会停止静默重试。
   */
  const invalidateSession = useCallback(() => {
    const store = useAuthStore.getState()
    if (walletAddress) {
      store.removeSessionForAddress(walletAddress)
    }
    store.setLoginError(null)
  }, [walletAddress])

  /** 用户登出：JWT 与签名一并清除，避免自动再登录。 */
  const logout = useCallback(() => {
    const store = useAuthStore.getState()
    if (walletAddress) {
      store.removeSessionForAddress(walletAddress)
      store.clearSignatureForAddress(walletAddress)
    }
    store.setLoginError(null)
    lastAttemptRef.current = null
  }, [walletAddress])

  /** 钱包断开时仅清登录错误与 attempt，不清会话表。 */
  const clearLoginErrorOnDisconnect = useCallback(() => {
    useAuthStore.getState().setLoginError(null)
    lastAttemptRef.current = null
  }, [])

  const clearLoginError = useCallback(() => {
    useAuthStore.getState().setLoginError(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      session,
      sessionReady,
      needsSignIn: authState.kind === 'needsLogin' && !isLoggingIn,
      hasHydrated,
      isLoggingIn,
      loginError,
      login,
      logout,
      clearLoginErrorOnDisconnect,
      invalidateSession,
      clearLoginError,
    }),
    [
      authState.kind,
      clearLoginError,
      clearLoginErrorOnDisconnect,
      hasHydrated,
      invalidateSession,
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
