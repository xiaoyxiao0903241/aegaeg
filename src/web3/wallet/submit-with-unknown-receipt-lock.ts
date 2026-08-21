import {
  clearUnknownReceiptLock,
  endWritePath,
  getUnknownReceiptLatchEvidence,
  listenForWriteHash,
  lockUnknownReceipt,
  tryBeginWritePath,
  type WritePath,
} from '~/web3/wallet/unknown-receipt-lock'
import { WalletTransactionWaitError } from '~/web3/wallet/wait-wallet-transaction'
import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'

export type SubmitWithUnknownReceiptLockResult<T> =
  { ok: true; value: T } | { ok: false; error: unknown }

/**
 * 资金提交信封：同路径在飞互斥 + 广播后把 hash 写入闩（刷新后续等）
 *
 * 已上锁 → 返回 `whenLocked`；在飞 → 返回 `whenInFlight`。
 * 成功 / revert / 其它确定失败：开闩。仅发送未拿到 hash 的 unknown：上闩且无观察。
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
  const stopListen = listenForWriteHash((hash) => {
    lockUnknownReceipt(args.path, owner, args.address, { hash })
  })
  try {
    const value = await args.run()
    clearUnknownReceiptLock(args.path, args.address, owner)
    return { ok: true, value }
  } catch (error) {
    if (error instanceof WalletTransactionWaitError) {
      clearUnknownReceiptLock(args.path, args.address, owner)
    } else if (isUnknownSubmitOutcome(error)) {
      lockUnknownReceipt(args.path, owner, args.address)
    } else if (!getUnknownReceiptLatchEvidence(args.path, args.address)?.hash) {
      clearUnknownReceiptLock(args.path, args.address, owner)
    }
    return { ok: false, error }
  } finally {
    stopListen()
    endWritePath(args.path, args.address)
  }
}
