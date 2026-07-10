import { toast } from 'sonner'
import { isUserRejectedWalletError } from '~/web3/resolve-contract-error-message'

/**
 * Present a single user-facing error toast. Skips wallet rejection and empty messages.
 * Call from submit handlers or a single effect — avoid status + error double toasts.
 * Pass `id` so language switches replace the same toast instead of stacking.
 */
export function presentUserFacingError(
  error: unknown,
  resolveMessage: (error: unknown) => string | null | undefined,
  options?: { id?: string },
): void {
  if (error == null) return
  if (isUserRejectedWalletError(error)) return
  const message = resolveMessage(error)
  if (message) toast.error(message, options?.id ? { id: options.id } : undefined)
}
