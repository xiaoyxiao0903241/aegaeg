import { isJwtExpired } from '~/lib/api/auth/jwt'
import type { StoredAuthSession } from '~/lib/api/auth/session'

export function buildSilentLoginAttemptKey(
  walletAddress: string,
  session: StoredAuthSession | null,
): string {
  return `${walletAddress.toLowerCase()}:${session?.token ?? 'none'}`
}

export function readStoredSessionForWallet(
  sessionsByAddress: Record<string, StoredAuthSession>,
  walletAddress: string | undefined,
  now = Date.now(),
): StoredAuthSession | null {
  if (!walletAddress) return null

  const session = sessionsByAddress[walletAddress.toLowerCase()]
  if (!session?.token || isJwtExpired(session.token, now)) {
    return null
  }

  return session
}
