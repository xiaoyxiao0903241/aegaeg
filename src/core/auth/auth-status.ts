import { isJwtExpired } from '~/core/auth/jwt'
import { isSessionForAddress, type StoredAuthSession } from '~/core/auth/types'

export interface ResolvedAuthStatus {
  sessionReady: boolean
  needsSignIn: boolean
  token: string | null
}

/**
 * 判定登录会话是否可用（综合 JWT 过期与地址归属）。
 *
 * 任一条件不满足即 sessionReady=false；未连接钱包时 needsSignIn 为 false，
 * 连接了钱包但会话不可用才引导重新登录。
 *
 * @param session 存储的会话；无会话或 JWT 过期视为不可用
 * @param walletAddress 当前钱包地址；未连接时为 undefined
 * @param now 当前时间（毫秒），用于过期判定
 * @returns 会话可用性与是否需要登录
 * @see 手册 §1.3 前端全局状态
 */
export function authStatus({
  session,
  walletAddress,
  now = Date.now(),
}: {
  session: StoredAuthSession | null
  walletAddress: string | undefined
  now?: number
}): ResolvedAuthStatus {
  const walletReady = Boolean(walletAddress)

  if (!session?.token || isJwtExpired(session.token, now)) {
    return {
      sessionReady: false,
      needsSignIn: walletReady,
      token: null,
    }
  }

  if (!walletReady || !isSessionForAddress(session, walletAddress)) {
    return {
      sessionReady: false,
      needsSignIn: walletReady,
      token: null,
    }
  }

  return {
    sessionReady: true,
    needsSignIn: false,
    token: session.token,
  }
}
