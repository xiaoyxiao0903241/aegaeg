import {
  AUTH_SESSION_STORAGE_KEY,
  type StoredAuthSession,
} from '~/core/auth/types'
import type { AuthSessionStorage } from '~/core/auth/storage'

export type { StoredAuthSession } from '~/core/auth/types'
export type { AuthSessionStorage } from '~/core/auth/storage'
export {
  isSessionForAddress,
  AUTH_SESSION_STORAGE_KEY,
  AUTH_SIGNATURE_STORAGE_KEY,
} from '~/core/auth/types'

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
