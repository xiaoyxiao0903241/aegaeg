import { isJwtExpired } from '~/lib/api/auth/jwt'
import { isSessionForAddress, type StoredAuthSession } from '~/lib/api/auth/session'

export interface ResolvedAuthStatus {
  isAuthenticated: boolean
  needsSignIn: boolean
  token: string | null
}

export function resolveAuthStatus({
  session,
  walletAddress,
  now = Date.now(),
}: {
  session: StoredAuthSession | null
  walletAddress: string | undefined
  now?: number
}): ResolvedAuthStatus {
  const walletReady = Boolean(walletAddress)

  if (!session?.token || isJwtExpired(session.token, now)) {
    return {
      isAuthenticated: false,
      needsSignIn: walletReady,
      token: null,
    }
  }

  if (!walletReady || !isSessionForAddress(session, walletAddress)) {
    return {
      isAuthenticated: false,
      needsSignIn: walletReady,
      token: null,
    }
  }

  return {
    isAuthenticated: true,
    needsSignIn: false,
    token: session.token,
  }
}
