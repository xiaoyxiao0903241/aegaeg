import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { useActiveAccount } from '~/views/dapp/web3/thirdweb-react'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { ApiError } from '~/shared/api/client'
import {
  ACCOUNT_BANNED_SENTINEL,
  LOGIN_ERROR,
  isAccountBannedError,
} from '~/shared/api/account-banned'
import {
  buildLoginAttemptKey,
  deriveAuthAction,
  deriveAuthState,
  isPermanentLoginErrorMessage,
} from '~/core/auth/auth-machine'
import { loginWithWallet } from '~/views/dapp/auth/login-with-wallet'
import { defaultChain } from '~/views/dapp/web3/thirdweb'
import { useAuthStore } from '~/stores/auth-store'
import {
  createStoreAuthSessionStorage,
  createStoreLoginSignatureStorage,
} from '~/stores/auth-storage-adapters'
import {
  clearApiQueries,
  invalidateAfterAuthLogin,
  invalidateAfterWalletSwitch,
} from '~/shared/api/query/invalidate'
import { AuthContext, type AuthContextValue } from '~/app/bootstrap/use-auth'
import { isUserRejectedWalletError } from '~/views/dapp/web3/resolve-contract-error-message'

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
  /** Fingerprint of the last fired silent-login; the loop guard (see machine). */
  const lastAttemptRef = useRef<string | null>(null)

  // Single source of truth: the whole auth status is derived from the connected
  // wallet plus the address-keyed JWT cache. No standalone session to sync.
  const authState = useMemo(
    () => deriveAuthState({ walletAddress, sessionsByAddress }),
    [walletAddress, sessionsByAddress],
  )
  const session = authState.kind === 'authenticated' ? authState.session : null
  const isAuthenticated = authState.kind === 'authenticated'
  const token = session?.token ?? null

  const runLogin = useCallback(async () => {
    if (loginInProgressRef.current) return
    if (!account) {
      useAuthStore.getState().setLoginError(LOGIN_ERROR.WALLET_NOT_CONNECTED)
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
      if (isAccountBannedError(error)) {
        useAuthStore.getState().setLoginError(ACCOUNT_BANNED_SENTINEL)
      } else if (isUserRejectedWalletError(error)) {
        useAuthStore.getState().setLoginError(LOGIN_ERROR.USER_REJECTED)
      } else if (
        error instanceof ApiError &&
        /nonce|signature|expired|invalid/i.test(`${error.error} ${error.message}`)
      ) {
        useAuthStore.getState().setLoginError(LOGIN_ERROR.SIGNATURE_REJECTED)
      } else if (error instanceof ApiError) {
        // Transport / unknown business codes — allow retry (transient).
        useAuthStore.getState().setLoginError(null)
      } else if (error instanceof Error) {
        const text = error.message
        if (/rejected|denied|cancel/i.test(text)) {
          useAuthStore.getState().setLoginError(LOGIN_ERROR.USER_REJECTED)
        } else if (/nonce|signature|expired|invalid/i.test(text)) {
          useAuthStore.getState().setLoginError(LOGIN_ERROR.SIGNATURE_REJECTED)
        } else if (isPermanentLoginErrorMessage(text)) {
          useAuthStore.getState().setLoginError(LOGIN_ERROR.FAILED)
        } else {
          useAuthStore.getState().setLoginError(null)
        }
      } else {
        useAuthStore.getState().setLoginError(null)
      }
      throw error
    } finally {
      loginInProgressRef.current = false
      useAuthStore.getState().setIsLoggingIn(false)
    }
  }, [account])

  /**
   * The one and only auth executor. Reads the action the machine derives and
   * performs it: a silent login now, or a renewal timer before expiry. Renewal
   * resets the loop guard so the post-renewal cycle can silently recover once.
   */
  useEffect(() => {
    if (!hasHydrated || !walletAddress) return

    const signature = signaturesByAddress[walletAddress.toLowerCase()] ?? null
    const attemptKey = buildLoginAttemptKey(walletAddress, session, signature)

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
        const loginError = useAuthStore.getState().loginError
        if (!isPermanentLoginErrorMessage(loginError)) {
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

  /**
   * Side channel: keep the react-query cache aligned with auth transitions.
   * Login → warm authenticated screens; logout/expiry → drop stale user data;
   * wallet switch → refresh for the new account regardless of current auth state.
   */
  const prevAuthedRef = useRef(false)
  const prevAddressRef = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (!hasHydrated) return

    const wasAuthed = prevAuthedRef.current
    const prevAddress = prevAddressRef.current
    if (isAuthenticated && !wasAuthed) {
      invalidateAfterAuthLogin(walletAddress)
    } else if (!isAuthenticated && wasAuthed) {
      clearApiQueries()
    }

    // Detect wallet address changes independently of auth state. Switching
    // wallets often passes through a transient disconnected / needsLogin state,
    // so waiting for isAuthenticated to flip would miss the transition and
    // leave stale data on screen.
    if (
      prevAddress &&
      walletAddress &&
      prevAddress.toLowerCase() !== walletAddress.toLowerCase()
    ) {
      invalidateAfterWalletSwitch(prevAddress, walletAddress, activeTab)
    }

    prevAuthedRef.current = isAuthenticated
    // Keep the last known connected address across transient disconnects.
    // Wallet switches often go: A → undefined → B. If we clear the ref on
    // disconnect, the B mount looks like a first connection and we never
    // run the wallet-switch cleanup that refreshes user-scoped data.
    if (walletAddress) {
      prevAddressRef.current = walletAddress
    }
  }, [hasHydrated, isAuthenticated, walletAddress, activeTab])

  /** Manual login (user pressed sign-in): always allowed, may prompt a signature. */
  const login = useCallback(async () => {
    lastAttemptRef.current = null
    useAuthStore.getState().setLoginError(null)
    await runLogin()
  }, [runLogin])

  /**
   * 401 handler. Purge only the current address's JWT and keep the signature so
   * the executor can mint a fresh one silently. We deliberately do NOT reset the
   * loop guard here: if the freshly-minted token is rejected again the attempt
   * key is unchanged, so the silent retry stops and the user is asked to re-sign.
   */
  const invalidateSession = useCallback(() => {
    const store = useAuthStore.getState()
    if (walletAddress) {
      store.removeSessionForAddress(walletAddress)
    }
    store.setLoginError(null)
  }, [walletAddress])

  /** User-initiated logout: drop both JWT and signature so we don't auto re-login. */
  const logout = useCallback(() => {
    const store = useAuthStore.getState()
    if (walletAddress) {
      store.removeSessionForAddress(walletAddress)
      store.clearSignatureForAddress(walletAddress)
    }
    store.setLoginError(null)
    lastAttemptRef.current = null
  }, [walletAddress])

  const clearAuthOnDisconnect = useCallback(() => {
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
      isAuthenticated,
      needsSignIn: authState.kind === 'needsLogin' && !isLoggingIn,
      hasHydrated,
      isLoggingIn,
      loginError,
      login,
      retryLogin: login,
      logout,
      clearAuthOnDisconnect,
      invalidateSession,
      clearLoginError,
    }),
    [
      authState.kind,
      clearAuthOnDisconnect,
      clearLoginError,
      hasHydrated,
      invalidateSession,
      isAuthenticated,
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
