import { type ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'

import {
  deriveAuthAction,
  deriveAuthState,
  loginAttemptKey,
  shouldClearLoginAttemptAfterFailure,
} from '~/core/auth/auth-machine'
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
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { loginWithWallet, toLoginErrorSentinel } from '~/web3/auth/login-with-wallet'
import { defaultChain } from '~/web3/thirdweb'
import { useActiveAccount } from '~/web3/thirdweb-react'

type AuthStoreGetter = Pick<
  ReturnType<typeof useAuthStore.getState>,
  | 'upsertSessionForAddress'
  | 'upsertSignatureForAddress'
  | 'readSignatureForAddress'
  | 'clearSignatureForAddress'
>

/** loginWithWallet → 按地址 Zustand 表；read/clear 为空（会话由 sessionsByAddress 派生）。 */
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount()
  const walletAddress = account?.address
  const activeTab = useDappShellStore((state) => state.activeTab)
  const sessionsByAddress = useAuthStore((state) => state.sessionsByAddress)
  const signaturesByAddress = useAuthStore((state) => state.signaturesByAddress)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn)
  const loginError = useAuthStore((state) => state.loginError)

  const loginInProgressRef = useRef(false)
  /** 最近一次静默登录的 attempt 指纹，防止同指纹死循环。 */
  const lastAttemptRef = useRef<string | null>(null)

  /** 会话状态由「当前钱包 + 按地址 JWT 表」派生，无独立 session 对象可同步。 */
  const authState = useMemo(
    () => deriveAuthState({ walletAddress, sessionsByAddress }),
    [walletAddress, sessionsByAddress],
  )
  const session = authState.kind === 'sessionReady' ? authState.session : null
  const sessionReady = authState.kind === 'sessionReady'
  const token = session?.token ?? null

  const runLogin = useCallback(async () => {
    if (loginInProgressRef.current) return
    if (!account) {
      useAuthStore.getState().setLoginError(LOGIN_ERROR.WALLET_NOT_CONNECTED)
      return
    }

    loginInProgressRef.current = true
    const { setIsLoggingIn, setLoginError, sessionsByAddress } = useAuthStore.getState()
    const existingSession = sessionsByAddress[account.address.toLowerCase()]
    const isSilentRenew = Boolean(existingSession?.token)
    // Renew must not flip isLoggingIn — pages treat it as full-page skeleton.
    if (!isSilentRenew) {
      setIsLoggingIn(true)
    }
    setLoginError(null)

    try {
      await loginWithWallet({
        account,
        chainId: defaultChain.id,
        storage: sessionStorage,
        signatureStorage,
      })
    } catch (error) {
      useAuthStore.getState().setLoginError(toLoginErrorSentinel(error))
      throw error
    } finally {
      loginInProgressRef.current = false
      if (!isSilentRenew) {
        useAuthStore.getState().setIsLoggingIn(false)
      }
    }
  }, [account])

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
      const delay = Math.max(0, action.at - Date.now())
      const timerId = window.setTimeout(() => {
        lastAttemptRef.current = null
        void runLogin().catch(() => undefined)
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
    // 切钱包常为 A → undefined → B；断开时保留上一地址，才能识别真正的切换。
    if (walletAddress) {
      prevAddressRef.current = walletAddress
    }
  }, [hasHydrated, sessionReady, walletAddress, activeTab])

  /** 用户点击登录：清闩锁，可弹出签名。 */
  const login = useCallback(async () => {
    lastAttemptRef.current = null
    useAuthStore.getState().setLoginError(null)
    await runLogin()
  }, [runLogin])

  /**
   * 401：只清当前地址 JWT，保留签名以便静默换票。
   * 故意不重置 attempt 闩锁——新票再被拒时同指纹停止静默重试。
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
