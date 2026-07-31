import { isJwtExpired } from '~/core/auth/jwt'
import { isSessionForAddress, type StoredAuthSession } from '~/core/auth/types'

export interface ResolvedAuthStatus {
  sessionReady: boolean
  needsSignIn: boolean
  token: string | null
}

export function authStatus({
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
      sessionReady: false,
      needsSignIn: walletReady,
      token: null,
    }
  }

  if (!walletReady || !isSessionForAddress(session, walletAddress)) {
    return {
      sessionReady: false,
      needsSignIn: walletReady,
      token: null,
    }
  }

  return {
    sessionReady: true,
    needsSignIn: false,
    token: session.token,
  }
}
