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
 * 钱路信封：unknown 闩锁 + 同 path 在飞互斥。
 * 已闩锁 → `whenLocked`；在飞 → `whenInFlight`（须与 whenLocked 区分，供 toast）。
 * 成功仅做 owner 配对清除（不解历史 unknown）；unknown 结果用本调用 owner 上锁。
 * 不拥有门闸 / approve / invalidate；软失败须抛非 unknown，以免误闩。
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
