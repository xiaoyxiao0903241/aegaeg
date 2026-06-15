import {
  readUsableLoginSignature,
  type LoginSignatureStorage,
} from './login-signature-cache'
import { isJwtExpired } from './jwt'
import { resolveAuthStatus } from './resolve-auth-status'
import type { StoredAuthSession } from './session'

export function buildSilentLoginAttemptKey(
  walletAddress: string,
  session: StoredAuthSession | null,
): string {
  return `${walletAddress.toLowerCase()}:${session?.token ?? 'none'}`
}

export function shouldAttemptSilentLogin({
  hasHydrated,
  walletAddress,
  session,
  isLoggingIn,
  loginError,
  signatureStorage,
  attemptedKey,
}: {
  hasHydrated: boolean
  walletAddress: string | undefined
  session: StoredAuthSession | null
  isLoggingIn: boolean
  loginError: string | null
  signatureStorage: LoginSignatureStorage
  attemptedKey: string | null
}): boolean {
  if (!hasHydrated || !walletAddress || isLoggingIn || loginError) {
    return false
  }

  const status = resolveAuthStatus({ session, walletAddress })
  if (!status.needsSignIn) {
    return false
  }

  if (!readUsableLoginSignature(walletAddress, signatureStorage)) {
    return false
  }

  const nextKey = buildSilentLoginAttemptKey(walletAddress, session)
  return attemptedKey !== nextKey
}

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
