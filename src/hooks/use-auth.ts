import { createContext, useContext } from 'react'
import type { StoredAuthSession } from '~/core/auth/types'

export interface AuthContextValue {
  token: string | null
  session: StoredAuthSession | null
  /** 业务已登录：钱包已连且当前地址 JWT 有效。 */
  sessionReady: boolean
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
