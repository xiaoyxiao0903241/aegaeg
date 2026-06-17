import { AUTH_SIGNATURE_STORAGE_KEY } from '~/lib/api/auth/session'

export interface StoredLoginSignature {
  address: string
  message: string
  signature: string
  savedAt: number
}

export interface LoginSignatureStorage {
  read(): StoredLoginSignature | null
  write(signature: StoredLoginSignature): void
  clear(): void
}

export function createLocalLoginSignatureStorage(
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
): LoginSignatureStorage {
  return {
    read() {
      const raw = storage.getItem(AUTH_SIGNATURE_STORAGE_KEY)
      if (!raw) return null

      try {
        const parsed = JSON.parse(raw) as StoredLoginSignature
        if (!parsed.address || !parsed.message || !parsed.signature) return null
        return parsed
      } catch {
        return null
      }
    },
    write(signature) {
      storage.setItem(AUTH_SIGNATURE_STORAGE_KEY, JSON.stringify(signature))
    },
    clear() {
      storage.removeItem(AUTH_SIGNATURE_STORAGE_KEY)
    },
  }
}

export function createMemoryLoginSignatureStorage(): LoginSignatureStorage {
  let value: StoredLoginSignature | null = null

  return {
    read() {
      return value
    },
    write(signature) {
      value = signature
    },
    clear() {
      value = null
    },
  }
}

export function isLoginSignatureForAddress(
  cached: StoredLoginSignature | null,
  address: string | undefined,
): cached is StoredLoginSignature {
  if (!cached || !address) return false
  return cached.address.toLowerCase() === address.toLowerCase()
}

function parseSiweExpirationMs(message: string): number | null {
  const match = message.match(/^Expiration Time: (.+)$/m)
  if (!match) return null
  const parsed = Date.parse(match[1])
  return Number.isFinite(parsed) ? parsed : null
}

/** SIWE message still within its Expiration Time window. */
export function isLoginSignatureUsable(cached: StoredLoginSignature, now = Date.now()): boolean {
  const expirationMs = parseSiweExpirationMs(cached.message)
  if (expirationMs === null) {
    return now - cached.savedAt < 60 * 60 * 1000
  }

  return now < expirationMs
}

export function readUsableLoginSignature(
  address: string | undefined,
  storage: LoginSignatureStorage,
  now = Date.now(),
): StoredLoginSignature | null {
  const cached = storage.read()
  if (!isLoginSignatureForAddress(cached, address)) return null
  if (!isLoginSignatureUsable(cached, now)) return null
  return cached
}
