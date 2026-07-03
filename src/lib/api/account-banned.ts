import { ApiError } from '~/lib/api/client'

/** Stored in auth `loginError` when backend rejects login with 403 banned. */
export const ACCOUNT_BANNED_SENTINEL = 'ACCOUNT_BANNED'

const ACCOUNT_BANNED_TOAST_ID = 'account-banned'

type AccountBannedListener = () => void
const listeners = new Set<AccountBannedListener>()

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

/** Fan-out once per burst; UI layer dedupes the actual toast via Sonner id. */
export function reportAccountBanned(): void {
  for (const listener of listeners) {
    listener()
  }
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
