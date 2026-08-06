import {
  clearUnknownReceiptLock,
  endWritePath,
  lockUnknownReceipt,
  tryBeginWritePath,
  type WritePath,
} from '~/web3/wallet/unknown-receipt-lock'
import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'

export type SubmitWithUnknownReceiptLockResult<T> =
  { ok: true; value: T } | { ok: false; error: unknown }

/**
 * 资金提交信封：未知结果锁 + 同地址同路径在飞互斥
 *
 * 已上锁 → 返回 `whenLocked`；在飞 → 返回 `whenInFlight`
 * （两者须区分，供 toast 不同提示）。成功仅做 owner 配对清除，
 * 不解历史 unknown；unknown 结果用本调用 owner 上锁。
 *
 * @param args.path 写路径键（WRITE_PATH 之一）
 * @param args.address 会话钱包地址（锁键的一部分）
 * @param args.whenLocked 已锁时的返回错误
 * @param args.whenInFlight 在飞时的返回错误
 * @param args.run 实际提交逻辑
 */
export async function submitWithUnknownReceiptLock<T>(args: {
  path: WritePath
  address: string
  whenLocked: unknown
  whenInFlight: unknown
  run: () => Promise<T>
}): Promise<SubmitWithUnknownReceiptLockResult<T>> {
  const began = tryBeginWritePath(args.path, args.address)
  if (!began.ok) {
    return {
      ok: false,
      error: began.reason === 'locked' ? args.whenLocked : args.whenInFlight,
    }
  }

  const { owner } = began
  try {
    const value = await args.run()
    clearUnknownReceiptLock(args.path, args.address, owner)
    return { ok: true, value }
  } catch (error) {
    if (isUnknownSubmitOutcome(error)) {
      lockUnknownReceipt(args.path, owner, args.address)
    }
    return { ok: false, error }
  } finally {
    endWritePath(args.path, args.address)
  }
}
