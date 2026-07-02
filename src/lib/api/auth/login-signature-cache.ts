import { AUTH_SIGNATURE_STORAGE_KEY } from '~/lib/api/auth/session'

export interface StoredLoginSignature {
  address: string
  message: string
  signature: string
  savedAt: number
}

export interface LoginSignatureStorage {
  readForAddress(address: string): StoredLoginSignature | null
  write(signature: StoredLoginSignature): void
  clearForAddress(address: string): void
}

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
  if (!address) return null

  const cached = storage.readForAddress(address)
  if (!isLoginSignatureForAddress(cached, address)) return null
  if (!isLoginSignatureUsable(cached, now)) return null
  return cached
}
