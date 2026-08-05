/**
 * 持久化的登录会话：地址 → JWT 的缓存条目。
 *
 * 会话有效性由 authStatus 判定；expiresAt 由 JWT exp 推导填充，用于主动续期。
 *
 * @see 手册 §1.3 前端全局状态
 */
export interface StoredAuthSession {
  address: string
  token: string
  savedAt: number
  /** JWT exp（毫秒），用于主动续期。 */
  expiresAt?: number
}

/** 持久化的 SIWE 登录签名，用于免弹窗静默续期。 */
export interface StoredLoginSignature {
  address: string
  message: string
  signature: string
  savedAt: number
}

/** localStorage 中登录会话的键名。 */
export const AUTH_SESSION_STORAGE_KEY = 'aegis.auth.session'
/** localStorage 中登录签名的键名。 */
export const AUTH_SIGNATURE_STORAGE_KEY = 'aegis.auth.signature'

/**
 * 会话是否属于该地址（大小写不敏感）。
 *
 * 切换钱包后旧地址的会话不可复用，必须重新登录。
 *
 * @param session 存储的会话；null 视为不匹配
 * @param address 钱包地址；undefined 视为不匹配
 * @returns 会话存在且地址一致时返回 true
 */
export function isSessionForAddress(
  session: StoredAuthSession | null,
  address: string | undefined,
): session is StoredAuthSession {
  if (!session || !address) return false
  return session.address.toLowerCase() === address.toLowerCase()
}

/** 地址统一小写，作为会话 / 签名缓存的键。 */
export function normalizeAuthAddress(address: string): string {
  return address.toLowerCase()
}
