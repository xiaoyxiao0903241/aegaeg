export interface StoredAuthSession {
  address: string
  token: string
  savedAt: number
  /** JWT exp claim in ms — cached for proactive expiry checks. */
  expiresAt?: number
}

export interface AuthSessionStorage {
  read(): StoredAuthSession | null
  write(session: StoredAuthSession): void
  clear(): void
}

export const AUTH_SESSION_STORAGE_KEY = 'aegis.auth.session'
export const AUTH_SIGNATURE_STORAGE_KEY = 'aegis.auth.signature'

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

export function isSessionForAddress(
  session: StoredAuthSession | null,
  address: string | undefined,
): session is StoredAuthSession {
  if (!session || !address) return false
  return session.address.toLowerCase() === address.toLowerCase()
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
