import { ApiError } from '~/shared/api/client'

/** Stored in auth `loginError` when backend rejects login with 403 banned. */
export const ACCOUNT_BANNED_SENTINEL = 'ACCOUNT_BANNED'

/** Stable loginError sentinels — never store backend/wallet raw English. */
export const LOGIN_ERROR = {
  ACCOUNT_BANNED: ACCOUNT_BANNED_SENTINEL,
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  USER_REJECTED: 'LOGIN_USER_REJECTED',
  SIGNATURE_REJECTED: 'LOGIN_SIGNATURE_REJECTED',
  FAILED: 'LOGIN_FAILED',
} as const

const ACCOUNT_BANNED_TOAST_ID = 'account-banned'

/** Suppress duplicate fan-out when many APIs return 403 in the same burst. */
const REPORT_COOLDOWN_MS = 3_000

type AccountBannedListener = () => void
const listeners = new Set<AccountBannedListener>()
let lastReportedAt = 0

export function isAccountBannedError(error: unknown): boolean {
  if (error instanceof ApiError) return error.code === 403
  return (
    error instanceof Error &&
    error.name === 'ApiError' &&
    'code' in error &&
    (error as ApiError).code === 403
  )
}

export function subscribeAccountBanned(listener: AccountBannedListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Fan-out once per burst; Sonner id + cooldown dedupe parallel 403s. */
export function reportAccountBanned(): void {
  const now = Date.now()
  if (now - lastReportedAt < REPORT_COOLDOWN_MS) return
  lastReportedAt = now

  for (const listener of listeners) {
    listener()
  }
}

/** Global API response interceptor — call from `apiRequest` before rethrowing. */
export function interceptApiError(error: unknown): void {
  if (isAccountBannedError(error)) {
    reportAccountBanned()
  }
}

/** Test-only: module notify state survives across ssrLoadModule when Vite server is reused. */
export function resetAccountBannedReportCooldownForTests(): void {
  lastReportedAt = 0
}

export function getAccountBannedToastId(): string {
  return ACCOUNT_BANNED_TOAST_ID
}

export function resolveAuthLoginErrorMessage(
  error: string | null,
  messages: {
    accountBanned: string
    walletNotConnected: string
    loginFailed: string
    loginSignatureRejected: string
  },
): string | null {
  if (!error) return null
  if (error === ACCOUNT_BANNED_SENTINEL || error === LOGIN_ERROR.ACCOUNT_BANNED) {
    return messages.accountBanned
  }
  if (error === LOGIN_ERROR.WALLET_NOT_CONNECTED) return messages.walletNotConnected
  if (error === LOGIN_ERROR.USER_REJECTED) return null
  if (error === LOGIN_ERROR.SIGNATURE_REJECTED) return messages.loginSignatureRejected
  if (error === LOGIN_ERROR.FAILED) return messages.loginFailed
  // Legacy raw strings must not surface — treat as generic login failure.
  return messages.loginFailed
}
