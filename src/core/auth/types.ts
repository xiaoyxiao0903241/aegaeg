export interface StoredAuthSession {
  address: string
  token: string
  savedAt: number
  /** JWT exp claim in ms — cached for proactive expiry checks. */
  expiresAt?: number
}

export interface StoredLoginSignature {
  address: string
  message: string
  signature: string
  savedAt: number
}

export function isSessionForAddress(
  session: StoredAuthSession | null,
  address: string | undefined,
): session is StoredAuthSession {
  if (!session || !address) return false
  return session.address.toLowerCase() === address.toLowerCase()
}
