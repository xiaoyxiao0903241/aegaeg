import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { ApiError } from '~/lib/api/client'
import {
  buildSilentLoginAttemptKey,
  shouldAttemptAutoLogin,
  shouldClearSessionForWalletMismatch,
  shouldPurgeExpiredSession,
} from '~/lib/api/auth/auth-sync'
import {
  isUnauthorizedError,
  loginWithWallet,
} from '~/lib/api/auth/login-with-wallet'
import { resolveAuthStatus } from '~/lib/api/auth/resolve-auth-status'
import type { StoredAuthSession } from '~/lib/api/auth/session'
import { defaultChain } from '~/web3/thirdweb'
import { useAuthStore } from '~/stores/auth-store'
import {
  createStoreAuthSessionStorage,
  createStoreLoginSignatureStorage,
} from '~/stores/auth-storage-adapters'
import { useDappActions } from '~/stores/dapp-actions'

export interface AuthContextValue {
  token: string | null
  session: StoredAuthSession | null
  isAuthenticated: boolean
  needsSignIn: boolean
  hasHydrated: boolean
  isLoggingIn: boolean
  loginError: string | null
  login: () => Promise<void>
  retryLogin: () => Promise<void>
  logout: () => void
  clearAuthOnDisconnect: () => void
  invalidateSession: () => void
  clearLoginError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const sessionStorage = createStoreAuthSessionStorage()
const signatureStorage = createStoreLoginSignatureStorage()

export function AuthProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount()
  const walletAddress = account?.address
  const session = useAuthStore((state) => state.session)
  const loginError = useAuthStore((state) => state.loginError)
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const silentLoginAttemptRef = useRef<string | null>(null)
  const wasAuthenticatedRef = useRef(false)

  useEffect(() => {
    silentLoginAttemptRef.current = null
  }, [walletAddress])

  useEffect(() => {
    if (!hasHydrated) return

    const isAuthenticated = resolveAuthStatus({ session, walletAddress }).isAuthenticated
    if (isAuthenticated && !wasAuthenticatedRef.current) {
      useDappActions.getState().afterAuthLogin(walletAddress)
    }

    wasAuthenticatedRef.current = isAuthenticated
  }, [hasHydrated, session, walletAddress])

  const login = useCallback(async () => {
    if (!account) {
      useAuthStore.getState().setLoginError('Wallet not connected')
      return
    }

    const { setIsLoggingIn, setLoginError } = useAuthStore.getState()
    setIsLoggingIn(true)
    setLoginError(null)

    try {
      await loginWithWallet({
        account,
        chainId: defaultChain.id,
        storage: sessionStorage,
        signatureStorage,
      })
      silentLoginAttemptRef.current = buildSilentLoginAttemptKey(
        account.address,
        useAuthStore.getState().session,
      )
    } catch (error) {
      if (error instanceof ApiError) {
        setLoginError(error.message)
      } else if (error instanceof Error) {
        setLoginError(error.message)
      } else {
        setLoginError('Login failed')
      }
      throw error
    } finally {
      useAuthStore.getState().setIsLoggingIn(false)
    }
  }, [account])

  useEffect(() => {
    if (!hasHydrated) return

    const store = useAuthStore.getState()

    if (shouldPurgeExpiredSession(store.session)) {
      store.clearSession()
      useDappActions.getState().afterAuthLogout()
      return
    }

    if (shouldClearSessionForWalletMismatch(store.session, walletAddress)) {
      store.clearWalletAuth()
      store.setLoginError(null)
      silentLoginAttemptRef.current = null
      useDappActions.getState().afterAuthLogout()
    }
  }, [hasHydrated, session?.expiresAt, session?.token, walletAddress])

  useEffect(() => {
    if (!session?.expiresAt) return

    const delay = session.expiresAt - Date.now()
    if (delay <= 0) {
      useAuthStore.getState().clearSession()
      useDappActions.getState().afterAuthLogout()
      return
    }

    const timerId = window.setTimeout(() => {
      useAuthStore.getState().clearSession()
      useDappActions.getState().afterAuthLogout()
    }, delay)

    return () => window.clearTimeout(timerId)
  }, [session?.expiresAt, session?.token])

  useEffect(() => {
    if (
      !shouldAttemptAutoLogin({
        hasHydrated,
        walletAddress,
        session,
        isLoggingIn,
        loginError,
        attemptedKey: silentLoginAttemptRef.current,
      })
    ) {
      return
    }

    silentLoginAttemptRef.current = buildSilentLoginAttemptKey(walletAddress!, session)
    void login().catch(() => {
      // login() records loginError; user can retry manually
    })
  }, [hasHydrated, isLoggingIn, login, loginError, session, walletAddress])

  const retryLogin = useCallback(async () => {
    silentLoginAttemptRef.current = null
    useAuthStore.getState().setLoginError(null)
    await login()
  }, [login])

  const invalidateSession = useCallback(() => {
    const { clearSession, setLoginError } = useAuthStore.getState()
    clearSession()
    setLoginError(null)
    silentLoginAttemptRef.current = null
    useDappActions.getState().afterAuthLogout()
  }, [])

  const logout = useCallback(() => {
    const { clearWalletAuth, setLoginError } = useAuthStore.getState()
    clearWalletAuth()
    setLoginError(null)
    silentLoginAttemptRef.current = null
    useDappActions.getState().afterAuthLogout()
  }, [])

  const clearAuthOnDisconnect = useCallback(() => {
    const { clearSession, setLoginError } = useAuthStore.getState()
    clearSession()
    setLoginError(null)
    silentLoginAttemptRef.current = null
    useDappActions.getState().afterAuthLogout()
  }, [])

  const clearLoginError = useCallback(() => {
    useAuthStore.getState().setLoginError(null)
  }, [])

  const authStatus = useMemo(
    () => resolveAuthStatus({ session, walletAddress }),
    [session, walletAddress],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      token: authStatus.token,
      session,
      isAuthenticated: authStatus.isAuthenticated,
      needsSignIn: authStatus.needsSignIn && !isLoggingIn,
      hasHydrated,
      isLoggingIn,
      loginError,
      login,
      retryLogin,
      logout,
      clearAuthOnDisconnect,
      invalidateSession,
      clearLoginError,
    }),
    [
      authStatus.isAuthenticated,
      authStatus.needsSignIn,
      authStatus.token,
      clearAuthOnDisconnect,
      clearLoginError,
      hasHydrated,
      invalidateSession,
      isLoggingIn,
      login,
      loginError,
      logout,
      retryLogin,
      session,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export { isUnauthorizedError }
