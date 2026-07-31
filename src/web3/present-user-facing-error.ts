import { toast } from 'sonner'
import type { AppMessagesBundle } from '~/i18n/messages/app/types'
import { getErrorMessage } from '~/web3/errors/get-error-message'
import { isUserRejectedWalletError } from '~/web3/errors/wallet-error'

/**
 * Present a single user-facing error toast.
 * Default copy: `getErrorMessage`. Optional `messageFor` overrides (API / page-load).
 */
export function presentUserFacingError(
  error: unknown,
  t: AppMessagesBundle,
  options?: {
    id?: string
    messageFor?: (error: unknown) => string | null | undefined
  },
): void {
  if (error == null) return
  if (isUserRejectedWalletError(error)) return
  const message = options?.messageFor?.(error) ?? getErrorMessage(error, t)
  if (message) toast.error(message, options?.id ? { id: options.id } : undefined)
}
