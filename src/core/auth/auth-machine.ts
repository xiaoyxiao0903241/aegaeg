import { authStatus } from '~/core/auth/auth-status'
import type { StoredAuthSession } from '~/core/auth/types'

/** JWT 缺省 exp 时按 1 小时视为过期；与 SIWE 消息有效期无关，也不触发换票。 */
export const FALLBACK_SESSION_TTL_MS = 60 * 60 * 1000

/**
 * 认证状态完全由两个事实推导：当前连接的钱包地址与「地址 → JWT」缓存。
 *
 * 不存在独立的「当前会话」需要同步——切换钱包只是改变了状态指向的缓存条目。
 */
export type AuthState =
  | { kind: 'disconnected' }
  | { kind: 'sessionReady'; session: StoredAuthSession }
  | { kind: 'needsSignIn' }

/**
 * 根据连接地址与会话缓存推导认证状态。
 *
 * 会话归属地址须与当前钱包一致，且 JWT 未过期才算 sessionReady；
 * 地址不一致或会话缺失时回到 needsSignIn。到期只翻状态，不请求登录接口。
 *
 * @param walletAddress 当前连接的钱包地址；未连接时为 undefined
 * @param sessionsByAddress 按地址（小写）索引的会话缓存
 * @param now 当前时间（毫秒），用于过期判定
 * @returns 认证状态
 * @see 手册 §1.3 前端全局状态
 */
export function deriveAuthState({
  walletAddress,
  sessionsByAddress,
  now = Date.now(),
}: {
  walletAddress: string | undefined
  sessionsByAddress: Record<string, StoredAuthSession>
  now?: number
}): AuthState {
  if (!walletAddress) return { kind: 'disconnected' }

  const session = sessionsByAddress[walletAddress.toLowerCase()] ?? null
  const status = authStatus({ session, walletAddress, now })

  if (status.sessionReady && session) {
    return { kind: 'sessionReady', session }
  }
  return { kind: 'needsSignIn' }
}

/**
 * 登录链是否就绪：仅当 live 已知且等于期望链（BSC）才允许签名换票。
 *
 * `null`/`undefined` 视为未知（等 hydrate），与异网同为「未就绪」——不写 loginError。
 */
export function isLoginChainReady(
  liveChainId: number | null | undefined,
  expectedChainId: number,
): boolean {
  return liveChainId != null && liveChainId === expectedChainId
}
