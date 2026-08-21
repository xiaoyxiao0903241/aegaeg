/**
 * 刷新后续等：对已存 hash 的闩调用同一个 `waitForWalletTransactionConfirmation`。
 *
 * 只补 wagmi 刷新丢掉内存 hash。无 hash 的闩不 wait。
 */

import { invalidateAfterWritePath } from '~/shared/api/query/invalidate'
import { bscReadClient } from '~/web3/bsc-read-client'
import {
  listUnknownReceiptLatches,
  settleUnknownReceiptLock,
  type UnknownReceiptLatch,
} from '~/web3/wallet/unknown-receipt-lock'
import {
  type ReceiptWaitClient,
  waitForWalletTransactionConfirmation,
  WalletTransactionWaitError,
} from '~/web3/wallet/wait-wallet-transaction'

async function resumeLatch(client: ReceiptWaitClient, latch: UnknownReceiptLatch): Promise<void> {
  if (!latch.hash) return
  try {
    await waitForWalletTransactionConfirmation({ hash: latch.hash, client })
  } catch (error) {
    if (error instanceof WalletTransactionWaitError) {
      settleUnknownReceiptLock(latch.path, latch.address)
    }
    return
  }
  if (!settleUnknownReceiptLock(latch.path, latch.address)) return
  invalidateAfterWritePath(latch.path, latch.address)
}

/**
 * 对当前闩启动续等（单测可注入 client）。
 *
 * @param client 公共读客户端
 */
export async function resumeUnknownReceiptLatches(
  client: ReceiptWaitClient = bscReadClient,
): Promise<void> {
  await Promise.all(listUnknownReceiptLatches().map((latch) => resumeLatch(client, latch)))
}

let started = false

/**
 * DApp 启动时续等已持久化的 hash（幂等）。
 */
export function startUnknownReceiptResume(client: ReceiptWaitClient = bscReadClient): void {
  if (typeof window === 'undefined') return
  if (started) return
  started = true
  void resumeUnknownReceiptLatches(client)
}
