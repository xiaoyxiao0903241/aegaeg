export interface StoredAuthSession {
  address: string
  token: string
  savedAt: number
  /** JWT exp（毫秒），用于主动续期。 */
  expiresAt?: number
}

export interface StoredLoginSignature {
  address: string
  message: string
  signature: string
  savedAt: number
}

export const AUTH_SESSION_STORAGE_KEY = 'aegis.auth.session'
export const AUTH_SIGNATURE_STORAGE_KEY = 'aegis.auth.signature'

export function isSessionForAddress(
  session: StoredAuthSession | null,
  address: string | undefined,
): session is StoredAuthSession {
  if (!session || !address) return false
  return session.address.toLowerCase() === address.toLowerCase()
}

export function normalizeAuthAddress(address: string): string {
  return address.toLowerCase()
}
