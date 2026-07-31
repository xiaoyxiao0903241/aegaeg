import { toast } from 'sonner'
import { presentUserFacingError } from '~/web3/present-user-facing-error'

export type SubmitResult = { ok: true } | { ok: false; error: unknown | null }

/** Success toast, or user-facing error toast when submit failed with an error. */
export async function presentSubmitResult(
  result: SubmitResult,
  successMessage: string,
  toUserMessage: (error: unknown) => string | null | undefined,
): Promise<void> {
  if (result.ok) {
    toast.success(successMessage)
    return
  }
  if (result.error != null) {
    presentUserFacingError(result.error, toUserMessage)
  }
}
