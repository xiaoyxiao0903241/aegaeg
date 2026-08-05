export interface JwtPayload {
  exp?: number
  [key: string]: unknown
}

/**
 * 本地解码 JWT payload（base64url → JSON）。
 *
 * 只读取过期时间，不校验签名（签名由后端签名服务保证）；
 * 格式非法或解码失败返回 null。
 */
function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const payloadSegment = parts[1]
  if (!payloadSegment) return null

  try {
    const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = atob(padded)
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

/**
 * 读取 JWT 过期时间（毫秒）。
 *
 * payload 无 exp 或解码失败返回 null，由调用方按「视为有效」处理。
 *
 * @param token JWT 字符串
 * @returns 过期时间（毫秒）；无 exp 或不可解析返回 null
 */
export function getJwtExpiresAtMs(token: string): number | null {
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') return null
  return payload.exp * 1000
}

/**
 * JWT 是否已过期。
 *
 * 缺少 exp 视为未过期，等待后端 401 兜底，避免本地误判踢出。
 *
 * @param token JWT 字符串
 * @param now 当前时间（毫秒）
 * @returns 已过期返回 true
 */
export function isJwtExpired(token: string, now = Date.now()): boolean {
  const expiresAt = getJwtExpiresAtMs(token)
  if (expiresAt === null) return false
  return now >= expiresAt
}

/**
 * 会话对象若无 expiresAt，则从 JWT exp 推导并回填。
 *
 * 推导失败时原样返回，不抛错。
 *
 * @param session 登录会话
 * @returns 可能补充 expiresAt 的会话
 */
export function withJwtExpiry<T extends { token: string; expiresAt?: number }>(session: T): T {
  const expiresAt = getJwtExpiresAtMs(session.token)
  return expiresAt === null ? session : { ...session, expiresAt }
}
