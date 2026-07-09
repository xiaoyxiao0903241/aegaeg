import { ApiError } from '~/shared/api/client'

/** Stored in auth `loginError` when backend rejects login with 403 banned. */
export const ACCOUNT_BANNED_SENTINEL = 'ACCOUNT_BANNED'

const ACCOUNT_BANNED_TOAST_ID = 'account-banned'

/** Suppress duplicate fan-out when many APIs return 403 in the same burst. */
const REPORT_COOLDOWN_MS = 3_000

type AccountBannedListener = () => void
const listeners = new Set<AccountBannedListener>()
let lastReportedAt = 0

export function isAccountBannedError(error: unknown): boolean {
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
  accountBannedMessage: string,
): string | null {
  if (!error) return null
  if (error === ACCOUNT_BANNED_SENTINEL) return accountBannedMessage
  return error
}
