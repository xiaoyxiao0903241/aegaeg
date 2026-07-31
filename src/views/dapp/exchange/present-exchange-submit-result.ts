import { toast } from 'sonner'
import { presentUserFacingError } from '~/web3/present-user-facing-error'

type ExchangeSubmitResult = { ok: true } | { ok: false; error: unknown | null }

/** Shared flash / burn / market-trade submit → success toast or error toast. */
export async function presentExchangeSubmitResult(
  result: ExchangeSubmitResult,
  successMessage: string,
  resolveMessage: (error: unknown) => string | null | undefined,
): Promise<void> {
  if (result.ok) {
    toast.success(successMessage)
    return
  }
  if (result.error != null) {
    presentUserFacingError(result.error, resolveMessage)
  }
}
