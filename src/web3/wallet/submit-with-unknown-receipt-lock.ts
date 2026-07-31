import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import {
  clearUnknownReceiptLock,
  isUnknownReceiptLocked,
  lockUnknownReceipt,
  type WritePath,
} from '~/web3/wallet/unknown-receipt-lock'

export type SubmitWithUnknownReceiptLockResult<T> =
  { ok: true; value: T } | { ok: false; error: unknown }

/**
 * Money-path envelope: unknown-receipt lock ordering only.
 * - Already latched → reject with `whenLocked`
 * - Success → clear latch (caller still owns invalidate*)
 * - Unknown submit outcome → lock latch
 *
 * Does not own gates, approve, or invalidate. Soft block failures should throw
 * a non-unknown error so they never latch.
 */
export async function submitWithUnknownReceiptLock<T>(args: {
  path: WritePath
  whenLocked: unknown
  run: () => Promise<T>
}): Promise<SubmitWithUnknownReceiptLockResult<T>> {
  if (isUnknownReceiptLocked(args.path)) {
    return { ok: false, error: args.whenLocked }
  }

  try {
    const value = await args.run()
    clearUnknownReceiptLock(args.path)
    return { ok: true, value }
  } catch (error) {
    if (isUnknownSubmitOutcome(error)) {
      lockUnknownReceipt(args.path)
    }
    return { ok: false, error }
  }
}
