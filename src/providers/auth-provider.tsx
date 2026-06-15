import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  useActiveAccount,
  useIsAutoConnecting,
} from 'thirdweb/react'
import { ApiError } from '../lib/api/client'
import {
  clearWalletSession,
  isUnauthorizedError,
  loginWithWallet,
  readWalletSession,
} from '../lib/api/auth/login-with-wallet'
import {
  createLocalAuthSessionStorage,
  type StoredAuthSession,
} from '../lib/api/auth/session'
import { defaultChain } from '../web3/thirdweb'
import { isWalletRestorePending } from '../lib/web3/wallet-connection-state'
import { useDappActions } from '../stores/dapp-actions'

export interface AuthContextValue {
  token: string | null
  session: StoredAuthSession | null
  isAuthenticated: boolean
  isLoggingIn: boolean
  loginError: string | null
  login: () => Promise<void>
  retryLogin: () => Promise<void>
  logout: () => void
  clearLoginError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount()
  const isAutoConnecting = useIsAutoConnecting()
  const storage = useMemo(() => createLocalAuthSessionStorage(localStorage), [])
  const [session, setSession] = useState<StoredAuthSession | null>(() => storage.read())
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    const nextAddress = account?.address
    if (!nextAddress) {
      return
    }

    const stored = storage.read()
    if (stored && stored.address.toLowerCase() !== nextAddress.toLowerCase()) {
      clearWalletSession(storage)
      setSession(null)
      setLoginError(null)
      useDappActions.getState().afterAuthLogout()
      return
    }

    setSession(readWalletSession(nextAddress, storage))
  }, [account?.address, storage])

  const login = useCallback(async () => {
    if (!account) {
      setLoginError('Wallet not connected')
      return
    }

    setIsLoggingIn(true)
    setLoginError(null)

    try {
      const result = await loginWithWallet({
        account,
        chainId: defaultChain.id,
        storage,
      })

      setSession({
        address: account.address,
        token: result.token,
        savedAt: Date.now(),
      })
      useDappActions.getState().afterAuthLogin()
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
      setIsLoggingIn(false)
    }
  }, [account, storage])

  const retryLogin = useCallback(async () => {
    setLoginError(null)
    await login()
  }, [login])

  useEffect(() => {
    if (
      !account?.address ||
      isLoggingIn ||
      loginError ||
      isWalletRestorePending(account, isAutoConnecting)
    ) {
      return
    }

    const existing = readWalletSession(account.address, storage)
    if (existing?.token) {
      return
    }

    void login().catch(() => undefined)
  }, [account, isAutoConnecting, isLoggingIn, login, loginError, storage])

  const logout = useCallback(() => {
    clearWalletSession(storage)
    setSession(null)
    setLoginError(null)
    useDappActions.getState().afterAuthLogout()
  }, [storage])

  const clearLoginError = useCallback(() => {
    setLoginError(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token: session?.token ?? null,
      session,
      isAuthenticated: Boolean(session?.token),
      isLoggingIn,
      loginError,
      login,
      retryLogin,
      logout,
      clearLoginError,
    }),
    [clearLoginError, isLoggingIn, login, loginError, logout, retryLogin, session],
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
