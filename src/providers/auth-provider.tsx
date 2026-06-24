import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { useActiveAccount, useActiveWallet, useDisconnect } from 'thirdweb/react'
import { ApiError } from '~/lib/api/client'
import {
  buildSilentLoginAttemptKey,
  readStoredSessionForWallet,
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount()
  const walletAddress = account?.address
  const session = useAuthStore((state) => state.session)
  const loginError = useAuthStore((state) => state.loginError)
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const wallet = useActiveWallet()
  const { disconnect } = useDisconnect()
  const silentLoginAttemptRef = useRef<string | null>(null)
  const wasAuthenticatedRef = useRef(false)
  const previousWalletRef = useRef<string | undefined>(undefined)
  const reconnectingRef = useRef(false)

  const reconcileWalletAccount = useCallback(
    async (source: 'wallet-event' | 'provider-event', detectedAddress: string) => {
      if (reconnectingRef.current) return

      const activeAddress = normalizeWalletAddress(walletAddress)
      if (detectedAddress === activeAddress) return

      if (!wallet) {
        // Wallet object not known — at least clear stale auth state so the UI
        // does not keep showing the previous account's data.
        useAuthStore.getState().clearSession()
        useAuthStore.getState().setLoginError(null)
        silentLoginAttemptRef.current = null
        useDappActions.getState().afterAuthLogout()
        return
      }

      // `wallet-event`: thirdweb already knows about the new account and
      // `useActiveAccount` will update on the next render. The previousWalletRef
      // effect will refresh data then. Nothing to do here.
      if (source === 'wallet-event') return

      // `provider-event`: the provider reports a different address than thirdweb.
      // Auto-reconnecting via `wallet.connect()` can deadlock some wallets (e.g.
      // MetaMask waiting for an authorization prompt). Disconnect and let the
      // user reconnect manually instead.
      reconnectingRef.current = true
      try {
        disconnect(wallet)
      } catch {
        // ignore disconnect errors
      } finally {
        reconnectingRef.current = false
      }

      useAuthStore.getState().clearSession()
      useAuthStore.getState().setLoginError(null)
      silentLoginAttemptRef.current = null
      useDappActions.getState().afterAuthLogout()
    },
    [disconnect, wallet, walletAddress],
  )

  // All wallets (injected, WalletConnect, Coinbase, etc.) emit accountChanged
  // through thirdweb's wallet emitter. Listen directly so we can recover when
  // thirdweb's connection manager fails to propagate the event to
  // useActiveAccount.
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

  // Extra fallback for injected wallets: some browser extensions fire
  // accountsChanged on window.ethereum but thirdweb's wallet emitter misses it.
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

  useEffect(() => {
    if (!hasHydrated) return

    const store = useAuthStore.getState()

    if (shouldPurgeExpiredSession(store.session)) {
      // Try silent re-login with the cached SIWE signature before logging out.
      if (walletAddress && account && !store.isLoggingIn) {
        void login().catch(() => {
          store.clearSession()
          useDappActions.getState().afterAuthLogout()
        })
      } else {
        store.clearSession()
        useDappActions.getState().afterAuthLogout()
      }
      return
    }

    if (shouldClearSessionForWalletMismatch(store.session, walletAddress)) {
      if (store.session) {
        store.upsertSessionForAddress(store.session)
      }

      store.clearSession()
      store.setLoginError(null)
      silentLoginAttemptRef.current = null

      const restored = readStoredSessionForWallet(store.sessionsByAddress, walletAddress)
      if (restored) {
        store.setSession(restored)
        return
      }

      useDappActions.getState().afterAuthLogout()
    }
  }, [hasHydrated, session?.expiresAt, session?.token, walletAddress, account, login])

  useEffect(() => {
    if (!session?.expiresAt || !walletAddress) return

    const store = useAuthStore.getState()
    if (store.isLoggingIn) return

    const delay = session.expiresAt - Date.now()
    const renewThreshold = 60_000
    const renewDelay = Math.max(0, delay - renewThreshold)

    if (renewDelay <= 0) {
      if (delay > 0) {
        // Token expires within the next minute — renew immediately.
        void login().catch(() => undefined)
      }
      return
    }

    const timerId = window.setTimeout(() => {
      void login().catch(() => undefined)
    }, renewDelay)

    return () => window.clearTimeout(timerId)
  }, [session?.expiresAt, session?.token, walletAddress, login])

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
    const store = useAuthStore.getState()
    // JWT expired or was rejected by the backend. Try silent re-login with the
    // cached SIWE signature before forcing the user to sign again.
    if (account && !store.isLoggingIn) {
      void login().catch(() => {
        store.clearSession()
        store.setLoginError(null)
        silentLoginAttemptRef.current = null
        useDappActions.getState().afterAuthLogout()
      })
      return
    }

    store.clearSession()
    store.setLoginError(null)
    silentLoginAttemptRef.current = null
    useDappActions.getState().afterAuthLogout()
  }, [account, login])

  const logout = useCallback(() => {
    const { session, clearSession, removeSessionForAddress, setLoginError } = useAuthStore.getState()
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
