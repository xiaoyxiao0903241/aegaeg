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
/** Max wait for a broadcast tx to mine. */
const RECEIPT_TIMEOUT_MS = 60_000
/** Public RPC never sees the hash — wallet-local failure / not broadcast. */
const NOT_ON_CHAIN_FAIL_MS = 8_000
/** Pending tx visible but no receipt — MetaMask can leave a local pending entry after failed send. */
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
 * `failed` — the tx definitively will not land (on-chain revert); resubmitting is safe.
 * `unknown` — confirmation is inconclusive (not yet visible, pending without receipt,
 * or timed out); it may still confirm, so resubmitting risks double execution.
 * Slow wallet RPC must not be classified as `failed` — a missing hash for a few seconds
 * is not proof the tx was never broadcast.
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
 * Waits for confirmation via the wallet's EIP-1193 provider only.
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
