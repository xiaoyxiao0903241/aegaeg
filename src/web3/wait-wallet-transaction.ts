import {
  createPublicClient,
  custom,
  type EIP1193Provider,
  type Hash,
  type TransactionReceipt,
} from 'viem'
import { bsc } from 'viem/chains'

const RECEIPT_POLL_MS = 2_000
/** Max wait for a broadcast tx to mine. */
const RECEIPT_TIMEOUT_MS = 60_000
/** Public RPC never sees the hash — wallet-local failure / not broadcast. */
const NOT_ON_CHAIN_FAIL_MS = 8_000
/** Pending tx visible but no receipt — MetaMask can leave a local pending entry after failed send. */
const PENDING_WITHOUT_RECEIPT_MS = 20_000

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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
 * `failed` — the tx is definitively not going to land (never broadcast / reverted);
 * resubmitting is safe. `unknown` — the tx was seen pending but no receipt arrived
 * in time; it may still confirm, so resubmitting risks double execution.
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
        `Transaction was not broadcast to BNB Chain (wallet may have failed locally). Hash: ${hash}`,
      )
    }

    if (seenOnChain && pendingSince > 0 && Date.now() - pendingSince >= PENDING_WITHOUT_RECEIPT_MS) {
      throw new WalletTransactionWaitError(
        hash,
        `Transaction stayed pending without confirmation (wallet may have failed after confirm). Hash: ${hash}`,
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
