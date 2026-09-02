import type { LoginSignatureStorage } from '~/core/auth/storage'
import type { StoredLoginSignature } from '~/core/auth/types'
import { AUTH_SIGNATURE_STORAGE_KEY } from '~/core/auth/types'

export type { LoginSignatureStorage } from '~/core/auth/storage'
export type { StoredLoginSignature } from '~/core/auth/types'

function isStoredLoginSignature(value: unknown): value is StoredLoginSignature {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<StoredLoginSignature>
  return Boolean(candidate.address && candidate.message && candidate.signature)
}

function readSignatureMap(
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
): Record<string, StoredLoginSignature> {
  const raw = storage.getItem(AUTH_SIGNATURE_STORAGE_KEY)
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw) as unknown
    if (isStoredLoginSignature(parsed)) {
      return { [parsed.address.toLowerCase()]: parsed }
    }

    if (!parsed || typeof parsed !== 'object') return {}

    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).flatMap(([address, value]) =>
        isStoredLoginSignature(value) ? [[address.toLowerCase(), value] as const] : [],
      ),
    )
  } catch {
    return {}
  }
}

/**
 * 基于 localStorage 的登录签名缓存。
 *
 * 兼容旧版单条与新版映射两种存储结构，key 统一按小写地址。
 *
 * @param storage 底层存储（localStorage 等）
 * @returns 登录签名存储实现
 */
export function createLocalLoginSignatureStorage(
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
): LoginSignatureStorage {
  const writeMap = (map: Record<string, StoredLoginSignature>) => {
    storage.setItem(AUTH_SIGNATURE_STORAGE_KEY, JSON.stringify(map))
  }

  return {
    readForAddress(address) {
      const entry = readSignatureMap(storage)[address.toLowerCase()]
      if (!entry) return null
      return entry
    },
    write(signature) {
      const map = readSignatureMap(storage)
      map[signature.address.toLowerCase()] = signature
      writeMap(map)
    },
    clearForAddress(address) {
      const map = readSignatureMap(storage)
      delete map[address.toLowerCase()]
      writeMap(map)
    },
  }
}

/**
 * 基于内存的登录签名缓存，仅本次会话有效。
 *
 * @returns 登录签名存储实现
 */
export function createMemoryLoginSignatureStorage(): LoginSignatureStorage {
  const values = new Map<string, StoredLoginSignature>()

  return {
    readForAddress(address) {
      return values.get(address.toLowerCase()) ?? null
    },
    write(signature) {
      values.set(signature.address.toLowerCase(), signature)
    },
    clearForAddress(address) {
      values.delete(address.toLowerCase())
    },
  }
}

/**
 * 判断缓存签名是否属于指定地址（大小写不敏感）。
 *
 * @param cached 缓存签名，可为 null
 * @param address 目标地址，可为 undefined
 * @returns 属于该地址时返回 true
 */
export function isLoginSignatureForAddress(
  cached: StoredLoginSignature | null,
  address: string | undefined,
): cached is StoredLoginSignature {
  if (!cached || !address) return false
  return cached.address.toLowerCase() === address.toLowerCase()
}

function parseSiweExpirationMs(message: string): number | null {
  const match = message.match(/^Expiration Time: (.+)$/m)
  const expirationText = match?.[1]
  if (!expirationText) return null
  const parsed = Date.parse(expirationText)
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * 判断 SIWE 签名消息是否仍在有效期内。
 *
 * 以消息中的 Expiration Time 为准；解析不到时退化为 5 分钟短窗
 * （login-message 生成的固定格式消息总会带上 Expiration Time）。
 *
 * @param cached 缓存签名
 * @param now 当前时间戳（毫秒），默认 Date.now()
 * @returns 未过期时返回 true
 */
export function isLoginSignatureUsable(cached: StoredLoginSignature, now = Date.now()): boolean {
  const expirationMs = parseSiweExpirationMs(cached.message)
  if (expirationMs === null) {
    // 无 Expiration Time：仅作 5 分钟短窗回退（login-message 生成的消息总会带上）。
    return now - cached.savedAt < 5 * 60 * 1000
  }

  return now < expirationMs
}

/**
 * 读取指定地址可用（未过期）的缓存签名。
 *
 * 任一条件不满足（无缓存、地址不符、已过期）都返回 null。
 *
 * @param address 钱包地址，可为 undefined
 * @param storage 签名存储
 * @param now 当前时间戳（毫秒），默认 Date.now()
 * @returns 可用缓存签名；无则返回 null
 */
export function readUsableLoginSignature(
  address: string | undefined,
  storage: LoginSignatureStorage,
  now = Date.now(),
): StoredLoginSignature | null {
  if (!address) return null

  const cached = storage.readForAddress(address)
  if (!isLoginSignatureForAddress(cached, address)) return null
  if (!isLoginSignatureUsable(cached, now)) return null
  return cached
}
