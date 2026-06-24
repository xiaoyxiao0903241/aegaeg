import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { useActiveAccount, useActiveWallet } from 'thirdweb/react'
import { ApiError } from '~/lib/api/client'
import {
  buildSilentLoginAttemptKey,
  readStoredSessionForWallet,
} from '~/lib/api/auth/auth-sync'

import {
  isUnauthorizedError,
  loginWithWallet,
} from '~/lib/api/auth/login-with-wallet'
import { resolveAuthStatus } from '~/lib/api/auth/resolve-auth-status'
import type { StoredAuthSession } from '~/lib/api/auth/session'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'
import { useAuthStore } from '~/stores/auth-store'
import {
  createStoreAuthSessionStorage,
  createStoreLoginSignatureStorage,
} from '~/stores/auth-storage-adapters'
import { useDappActions } from '~/stores/dapp-actions'
import {
  normalizeWalletAddress,
  useWalletProviderAccountChange,
} from '~/lib/web3/wallet-provider-account-change'

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

const RENEW_THRESHOLD_MS = 60_000

export function AuthProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount()
  const walletAddress = account?.address
  const session = useAuthStore((state) => state.session)
  const loginError = useAuthStore((state) => state.loginError)
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const wallet = useActiveWallet()
  const silentLoginAttemptRef = useRef<string | null>(null)
  const wasAuthenticatedRef = useRef(false)
  const previousWalletRef = useRef<string | undefined>(undefined)
  const loginInProgressRef = useRef(false)
  const disconnectTimerRef = useRef<number | null>(null)

  const reconcileWalletAccount = useCallback(
    async (source: 'wallet-event' | 'provider-event', detectedAddress: string) => {
      const activeAddress = normalizeWalletAddress(walletAddress)
      if (detectedAddress === activeAddress) return

      if (!wallet) {
        useAuthStore.getState().clearSession()
        useAuthStore.getState().setLoginError(null)
        silentLoginAttemptRef.current = null
        useDappActions.getState().afterAuthLogout()
        return
      }

      if (source === 'wallet-event') {
        return
      }

      // `provider-event`: the provider reports a different address than thirdweb.
      // Some injected wallets emit spurious `accountsChanged` events while the
      // user is signing a transaction, so we must not disconnect the wallet here.
      // Instead, back up the current session and try to restore the session for
      // the address reported by the provider. If no valid session exists for that
      // address, we only clear the auth state and let the user re-login while
      // keeping the wallet connection alive.
      const store = useAuthStore.getState()
      if (store.session) {
        store.upsertSessionForAddress(store.session)
      }
      store.clearSession()
      store.setLoginError(null)
      silentLoginAttemptRef.current = null

      const restored = readStoredSessionForWallet(store.sessionsByAddress, detectedAddress)
      if (restored) {
        store.setSession(restored)
        return
      }

      useDappActions.getState().afterAuthLogout()
    },
    [wallet, walletAddress],
  )

  useEffect(() => {
    if (!wallet) return

    const unsubAccount = wallet.subscribe('accountChanged', (newAccount) => {
      const detectedAddress = normalizeWalletAddress(newAccount.address)
      if (!detectedAddress) return
      void reconcileWalletAccount('wallet-event', detectedAddress)
    })

    const unsubChain = wallet.subscribe('chainChanged', () => undefined)
    const unsubDisconnect = wallet.subscribe('disconnect', () => undefined)

    return () => {
      unsubAccount()
      unsubChain()
      unsubDisconnect()
    }
  }, [wallet, walletAddress, reconcileWalletAccount])

  useWalletProviderAccountChange({
    activeAddress: walletAddress,
    enabled: wallet ? wallet.id !== 'walletConnect' : false,
    onMismatch: (providerAddress) => {
      void reconcileWalletAccount('provider-event', providerAddress)
    },
  })

  useEffect(() => {
    silentLoginAttemptRef.current = null
  }, [wallet, walletAddress])

  useEffect(() => {
    if (walletAddress && disconnectTimerRef.current) {
      window.clearTimeout(disconnectTimerRef.current)
      disconnectTimerRef.current = null
    }
  }, [walletAddress])

  useEffect(() => {
    if (!hasHydrated) return

    const isAuthenticated = resolveAuthStatus({ session, walletAddress }).isAuthenticated
    if (isAuthenticated && !wasAuthenticatedRef.current) {
      useDappActions.getState().afterAuthLogin(walletAddress)
    }

    wasAuthenticatedRef.current = isAuthenticated
  }, [hasHydrated, session, walletAddress])

  useEffect(() => {
    if (!hasHydrated) return

    const previousAddress = previousWalletRef.current
    if (
      previousAddress &&
      walletAddress &&
      previousAddress.toLowerCase() !== walletAddress.toLowerCase()
    ) {
      silentLoginAttemptRef.current = null
      useDappActions.getState().afterWalletSwitch(previousAddress, walletAddress)
    }

    previousWalletRef.current = walletAddress
  }, [hasHydrated, walletAddress])

  const login = useCallback(async () => {
    if (loginInProgressRef.current) return
    if (!account) {
      useAuthStore.getState().setLoginError('Wallet not connected')
      return
    }

    loginInProgressRef.current = true
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
    } catch (error) {
      const message =
        error instanceof ApiError || error instanceof Error ? error.message : 'Login failed'
      setLoginError(message)
      throw error
    } finally {
      loginInProgressRef.current = false
      useAuthStore.getState().setIsLoggingIn(false)
    }
  }, [account])

  /**
   * Core auth lifecycle:
   * 1. If the current session is valid, do nothing (renewal is handled by the
   *    dedicated timer effect below).
   * 2. If the session belongs to a different wallet address, back it up and try
   *    to restore the session for the new address.
   * 3. If there is no valid session for the current wallet, attempt a silent
   *    auto-login using the cached SIWE signature.
   */
  useEffect(() => {
    if (!hasHydrated || !walletAddress || loginInProgressRef.current) return

    const store = useAuthStore.getState()
    const status = resolveAuthStatus({ session: store.session, walletAddress })

    if (status.isAuthenticated) return

    if (
      store.session &&
      store.session.address.toLowerCase() !== walletAddress.toLowerCase()
    ) {
      store.upsertSessionForAddress(store.session)
      store.clearSession()
      store.setLoginError(null)
      silentLoginAttemptRef.current = null

      const restored = readStoredSessionForWallet(store.sessionsByAddress, walletAddress)
      if (restored) {
        store.setSession(restored)
        return
      }

      useDappActions.getState().afterAuthLogout()
      // Fall through to auto-login: the new wallet has no cached session, so
      // try silent login with the cached SIWE signature.
    }

    const attemptKey = buildSilentLoginAttemptKey(walletAddress, store.session)
    if (silentLoginAttemptRef.current !== attemptKey && !store.loginError) {
      silentLoginAttemptRef.current = attemptKey
      void login().catch(() => undefined)
    }
  }, [hasHydrated, walletAddress, session?.token, login, loginError])

  /**
   * Renew the JWT before it expires. When the token has less than
   * RENEW_THRESHOLD_MS left, trigger a silent login with the cached SIWE
   * signature. The timer is reset whenever the session or wallet changes.
   */
  useEffect(() => {
    if (!session?.expiresAt || !walletAddress) return
    if (loginInProgressRef.current) return

    const delay = session.expiresAt - Date.now()
    const renewDelay = Math.max(0, delay - RENEW_THRESHOLD_MS)

    if (renewDelay <= 0) {
      if (delay > 0) {
        void login().catch(() => undefined)
      }
      return
    }

    const timerId = window.setTimeout(() => {
      void login().catch(() => undefined)
    }, renewDelay)

    return () => window.clearTimeout(timerId)
  }, [session?.expiresAt, session?.token, walletAddress, login])

  const retryLogin = useCallback(async () => {
    silentLoginAttemptRef.current = null
    useAuthStore.getState().setLoginError(null)
    await login()
  }, [login])

  /**
   * When the backend rejects the JWT (401), try silent re-login first. Only
   * clear the session if re-login fails. This keeps the wallet connected and
   * avoids forcing the user to sign again unless the cached SIWE signature has
   * also expired.
   */
  const invalidateSession = useCallback(() => {
    const store = useAuthStore.getState()
    store.clearSession()
    store.setLoginError(null)
    silentLoginAttemptRef.current = null
    useDappActions.getState().afterAuthLogout()
  }, [])

  const logout = useCallback(() => {
    const { session, clearSession, removeSessionForAddress, setLoginError } =
      useAuthStore.getState()
    if (session?.address) {
      removeSessionForAddress(session.address)
    }
    clearSession()
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
