import type { AuthSessionStorage } from '~/core/auth/storage'
import { AUTH_SESSION_STORAGE_KEY, type StoredAuthSession } from '~/core/auth/types'

export type { AuthSessionStorage } from '~/core/auth/storage'
export type { StoredAuthSession } from '~/core/auth/types'
export {
  AUTH_SESSION_STORAGE_KEY,
  AUTH_SIGNATURE_STORAGE_KEY,
  isSessionForAddress,
} from '~/core/auth/types'

/**
 * 基于 localStorage 的会话存储。
 *
 * 读取时校验 address / token 字段完整，解析失败视为无会话。
 *
 * @param storage 底层存储（localStorage 等）
 * @returns 会话存储实现
 */
export function createLocalAuthSessionStorage(
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
): AuthSessionStorage {
  return {
    read() {
      const raw = storage.getItem(AUTH_SESSION_STORAGE_KEY)
      if (!raw) return null

      try {
        const parsed = JSON.parse(raw) as StoredAuthSession
        if (!parsed.address || !parsed.token) return null
        return parsed
      } catch {
        return null
      }
    },
    write(session) {
      storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
    },
    clear() {
      storage.removeItem(AUTH_SESSION_STORAGE_KEY)
    },
  }
}

/**
 * 基于内存的会话存储，仅本次会话有效。
 *
 * @returns 会话存储实现
 */
export function createMemoryAuthSessionStorage(): AuthSessionStorage {
  let value: StoredAuthSession | null = null

  return {
    read() {
      return value
    },
    write(session) {
      value = session
    },
    clear() {
      value = null
    },
  }
}
