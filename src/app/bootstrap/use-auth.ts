import { createContext, useContext } from 'react'
import type { StoredAuthSession } from '~/views/dapp/auth/session'

export interface AuthContextValue {
  token: string | null
  session: StoredAuthSession | null
  isAuthenticated: boolean
  needsSignIn: boolean
  hasHydrated: boolean
  isLoggingIn: boolean
  loginError: string | null
  login: () => Promise<void>
  logout: () => void
  /** 钱包断开时清登录错误与静默 attempt，不清 JWT 表。 */
  clearLoginErrorOnDisconnect: () => void
  invalidateSession: () => void
  clearLoginError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
