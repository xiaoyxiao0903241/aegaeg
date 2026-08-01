import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import {
  clearUnknownReceiptLock,
  endWritePath,
  lockUnknownReceipt,
  tryBeginWritePath,
  type WritePath,
} from '~/web3/wallet/unknown-receipt-lock'

export type SubmitWithUnknownReceiptLockResult<T> =
  { ok: true; value: T } | { ok: false; error: unknown }

/**
 * Money-path envelope: unknown-receipt lock + per-path in-flight mutex.
 * - Already latched → reject with `whenLocked` (silent at useChainMutation)
 * - Already in-flight → reject with `whenInFlight` (toast; must not equal whenLocked)
 * - Success → owner-scoped clear (paired defense only — does not unlock a prior unknown)
 * - Unknown submit outcome → lock latch with this call's owner
 *
 * Does not own gates, approve, or invalidate. Soft block failures should throw
 * a non-unknown error so they never latch.
 */
export async function submitWithUnknownReceiptLock<T>(args: {
  path: WritePath
  whenLocked: unknown
  whenInFlight: unknown
  run: () => Promise<T>
}): Promise<SubmitWithUnknownReceiptLockResult<T>> {
  const began = tryBeginWritePath(args.path)
  if (!began.ok) {
    return {
      ok: false,
      error: began.reason === 'locked' ? args.whenLocked : args.whenInFlight,
    }
  }

  const { owner } = began
  try {
    const value = await args.run()
    clearUnknownReceiptLock(args.path, owner)
    return { ok: true, value }
  } catch (error) {
    if (isUnknownSubmitOutcome(error)) {
      lockUnknownReceipt(args.path, owner)
    }
    return { ok: false, error }
  } finally {
    endWritePath(args.path)
  }
}
