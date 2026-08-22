/**
 * 等待交易收据（照抄 viem `waitForTransactionReceipt`）。
 *
 * 等到成功收据才返回；链上 revert 抛 failed。`timeout: 0` 表示一直等，不把墙钟当成结果。
 *
 * @see https://viem.sh/docs/actions/public/waitForTransactionReceipt
 */

import type { Hash, TransactionReceipt } from 'viem'

import { bscReadClient } from '~/web3/bsc-read-client'

export class WalletTransactionWaitError extends Error {
  readonly hash: Hash
  readonly outcome = 'failed' as const

  constructor(hash: Hash, message: string) {
    super(message)
    this.name = 'WalletTransactionWaitError'
    this.hash = hash
  }
}

export type ReceiptWaitClient = {
  waitForTransactionReceipt: (args: { hash: Hash; timeout: number }) => Promise<TransactionReceipt>
}

/**
 * 等待已广播交易的链上收据
 *
 * @param hash 交易 hash
 * @param client 读客户端，默认 `bscReadClient`；单测可注入
 * @returns 成功收据；revert 抛 WalletTransactionWaitError
 */
export async function waitForWalletTransactionConfirmation({
  hash,
  client = bscReadClient,
}: {
  hash: Hash
  client?: ReceiptWaitClient
}): Promise<TransactionReceipt> {
  const receipt = await client.waitForTransactionReceipt({ hash, timeout: 0 })
  if (receipt.status === 'reverted') {
    throw new WalletTransactionWaitError(hash, `Transaction reverted on-chain (${hash})`)
  }
  return receipt
}
