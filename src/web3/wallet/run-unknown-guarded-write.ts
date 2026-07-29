import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import {
  clearUnknownReceiptLock,
  isUnknownReceiptLocked,
  lockUnknownReceipt,
  type WritePath,
} from '~/web3/wallet/unknown-receipt-lock'

export type UnknownGuardedWriteResult<T> = { ok: true; value: T } | { ok: false; error: unknown }

/**
 * Narrow money-path envelope: owns unknown-receipt ordering only.
 * - Entry reject when path is latched
 * - Success → clear latch (caller still owns invalidate*)
 * - Unknown submit outcome → lock latch
 *
 * Does not own gates, approve, or invalidate. Soft gate failures should throw
 * a non-unknown error (or return before calling this) so they never latch.
 */
export async function runUnknownGuardedWrite<T>(args: {
  path: WritePath
  lockedError: unknown
  run: () => Promise<T>
}): Promise<UnknownGuardedWriteResult<T>> {
  if (isUnknownReceiptLocked(args.path)) {
    return { ok: false, error: args.lockedError }
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
