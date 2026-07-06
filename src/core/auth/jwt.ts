export interface JwtPayload {
  exp?: number
  [key: string]: unknown
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = atob(padded)
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

export function getJwtExpiresAtMs(token: string): number | null {
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') return null
  return payload.exp * 1000
}

/** Missing exp claim is treated as valid until the backend returns 401. */
export function isJwtExpired(token: string, now = Date.now()): boolean {
  const expiresAt = getJwtExpiresAtMs(token)
  if (expiresAt === null) return false
  return now >= expiresAt
}

export function withJwtExpiry<T extends { token: string; expiresAt?: number }>(
  session: T,
): T {
  const expiresAt = getJwtExpiresAtMs(session.token)
  return expiresAt === null ? session : { ...session, expiresAt }
}
