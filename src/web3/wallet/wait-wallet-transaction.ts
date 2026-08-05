import {
  createPublicClient,
  custom,
  type EIP1193Provider,
  type Hash,
  type TransactionReceipt,
} from 'viem'
import { bsc } from 'viem/chains'

import { sleep } from '~/shared/lib/sleep'

const RECEIPT_POLL_MS = 2_000
/** 广播交易等待出块的最长时间。 */
const RECEIPT_TIMEOUT_MS = 60_000
/** 公共 RPC 一直看不到该 hash：钱包本地失败或交易未广播。 */
const NOT_ON_CHAIN_FAIL_MS = 8_000
/** 交易可见但始终无收据：MetaMask 可能在发送失败后残留本地 pending 项。 */
const PENDING_WITHOUT_RECEIPT_MS = 20_000

async function readReceipt(
  client: { getTransactionReceipt: (args: { hash: Hash }) => Promise<TransactionReceipt | null> },
  hash: Hash,
): Promise<TransactionReceipt | null> {
  try {
    return await client.getTransactionReceipt({ hash })
  } catch {
    return null
  }
}

async function readTransaction(
  client: { getTransaction: (args: { hash: Hash }) => Promise<unknown | null> },
  hash: Hash,
): Promise<boolean> {
  try {
    const tx = await client.getTransaction({ hash })
    return tx !== null
  } catch {
    return false
  }
}

/**
 * `failed` — 交易确定不会上链（链上 revert），重提安全。
 * `unknown` — 确认不明确（尚未可见、无收据 pending 或超时）；
 *   它仍可能最终确认，重提有双花风险。
 * 钱包 RPC 慢不得归类为 `failed`：hash 暂缺几秒不能证明从未广播。
 */
export type WalletTransactionWaitOutcome = 'failed' | 'unknown'

export class WalletTransactionWaitError extends Error {
  readonly hash: Hash
  readonly outcome: WalletTransactionWaitOutcome

  constructor(hash: Hash, message: string, outcome: WalletTransactionWaitOutcome = 'failed') {
    super(message)
    this.name = 'WalletTransactionWaitError'
    this.hash = hash
    this.outcome = outcome
  }
}

/**
 * 通过钱包的 EIP-1193 provider 等待交易确认
 *
 * 轮询收据；revert 抛 failed，未广播 / 久挂 pending / 超时抛 unknown。
 * 只有拿到成功收据才返回，避免在结果不明确时让调用方重提。
 *
 * @param provider 钱包 EIP-1193 provider
 * @param hash 已广播的交易 hash
 * @returns 成功交易收据；revert 或超时抛 WalletTransactionWaitError
 */
export async function waitForWalletTransactionConfirmation({
  provider,
  hash,
}: {
  provider: EIP1193Provider
  hash: Hash
}): Promise<TransactionReceipt> {
  const walletReadClient = createPublicClient({
    chain: bsc,
    transport: custom(provider),
  })

  const startedAt = Date.now()
  const deadline = startedAt + RECEIPT_TIMEOUT_MS
  let seenOnChain = false
  let pendingSince = 0

  while (Date.now() < deadline) {
    const receipt = await readReceipt(walletReadClient, hash)

    if (receipt) {
      if (receipt.status === 'reverted') {
        throw new WalletTransactionWaitError(
          hash,
          `Transaction reverted on-chain (${hash})`,
          'failed',
        )
      }
      return receipt
    }

    const onChain = await readTransaction(walletReadClient, hash)
    seenOnChain = seenOnChain || onChain

    if (onChain) {
      pendingSince = pendingSince || Date.now()
    }

    const elapsed = Date.now() - startedAt
    if (!seenOnChain && elapsed >= NOT_ON_CHAIN_FAIL_MS) {
      throw new WalletTransactionWaitError(
        hash,
        `Transaction was not seen on BNB Chain yet — do not resubmit until it settles. Hash: ${hash}`,
        'unknown',
      )
    }

    if (
      seenOnChain &&
      pendingSince > 0 &&
      Date.now() - pendingSince >= PENDING_WITHOUT_RECEIPT_MS
    ) {
      throw new WalletTransactionWaitError(
        hash,
        `Transaction stayed pending without confirmation. Do not resubmit until it settles. Hash: ${hash}`,
        'unknown',
      )
    }

    await sleep(RECEIPT_POLL_MS)
  }

  throw new WalletTransactionWaitError(
    hash,
    `Transaction is still pending — do not resubmit until it settles. Check the hash on BscScan: ${hash}`,
    'unknown',
  )
}
