import { isJwtExpired } from '~/lib/api/auth/jwt'
import { resolveAuthStatus } from '~/lib/api/auth/resolve-auth-status'
import type { StoredAuthSession } from '~/lib/api/auth/session'

export function buildSilentLoginAttemptKey(
  walletAddress: string,
  session: StoredAuthSession | null,
): string {
  return `${walletAddress.toLowerCase()}:${session?.token ?? 'none'}`
}

/** Wallet connected but no valid JWT — attempt login once (cached SIWE or fresh signature). */
export function shouldAttemptAutoLogin({
  hasHydrated,
  walletAddress,
  session,
  isLoggingIn,
  loginError,
  attemptedKey,
}: {
  hasHydrated: boolean
  walletAddress: string | undefined
  session: StoredAuthSession | null
  isLoggingIn: boolean
  loginError: string | null
  attemptedKey: string | null
}): boolean {
  if (!hasHydrated || !walletAddress || isLoggingIn || loginError) {
    return false
  }

  const status = resolveAuthStatus({ session, walletAddress })
  if (!status.needsSignIn) {
    return false
  }

  const nextKey = buildSilentLoginAttemptKey(walletAddress, session)
  return attemptedKey !== nextKey
}

/** @deprecated Use shouldAttemptAutoLogin */
export const shouldAttemptSilentLogin = shouldAttemptAutoLogin

export function shouldClearSessionForWalletMismatch(
  session: StoredAuthSession | null,
  walletAddress: string | undefined,
): boolean {
  if (!session || !walletAddress) return false
  return session.address.toLowerCase() !== walletAddress.toLowerCase()
}

export function shouldPurgeExpiredSession(session: StoredAuthSession | null, now = Date.now()): boolean {
  if (!session?.token) return false
  return isJwtExpired(session.token, now)
}
