import { createContext, useContext } from 'react'

import type { StoredAuthSession } from '~/core/auth/types'

export interface AuthContextValue {
  token: string | null
  session: StoredAuthSession | null
  /** 业务已登录：钱包已连接且当前地址的 JWT 有效，可发起需登录的请求。 */
  sessionReady: boolean
  needsSignIn: boolean
  hasHydrated: boolean
  isLoggingIn: boolean
  loginError: string | null
  login: () => Promise<void>
  logout: () => void
  /** 钱包断开时仅清登录错误与静默重试状态，保留 JWT 表供下次连接直接复用。 */
  clearLoginErrorOnDisconnect: () => void
  invalidateSession: () => void
  clearLoginError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * 读取当前登录会话
 *
 * 必须在 AuthProvider 内调用；未包 Provider 时抛错，及早暴露接线错误。
 *
 * @returns 当前会话状态与登录/登出操作（字段见 AuthContextValue）
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
