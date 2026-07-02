import {
  createPublicClient,
  custom,
  type EIP1193Provider,
  type Hash,
  type TransactionReceipt,
} from 'viem'
import { bsc } from 'viem/chains'
import { bscReadClient } from '~/web3/bsc-read-client'

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

export class WalletTransactionWaitError extends Error {
  readonly hash: Hash

  constructor(hash: Hash, message: string) {
    super(message)
    this.name = 'WalletTransactionWaitError'
    this.hash = hash
  }
}

/**
 * Waits for confirmation using wallet provider RPC first, then app read RPC.
 * Broadcast detection uses the public app RPC only — wallet RPC pending entries
 * must not suppress the not-broadcast fast-fail (MetaMask confirm on reverting txs).
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
  let seenOnPublicRpc = false
  let pendingSince = 0

  while (Date.now() < deadline) {
    const receipt =
      (await readReceipt(walletReadClient, hash)) ?? (await readReceipt(bscReadClient, hash))

    if (receipt) {
      if (receipt.status === 'reverted') {
        throw new WalletTransactionWaitError(
          hash,
          `Transaction reverted on-chain (${hash})`,
        )
      }
      return receipt
    }

    const onWalletRpc = await readTransaction(walletReadClient, hash)
    const onAppRpc = await readTransaction(bscReadClient, hash)
    seenOnPublicRpc = seenOnPublicRpc || onAppRpc

    if (onWalletRpc || onAppRpc) {
      pendingSince = pendingSince || Date.now()
    }

    const elapsed = Date.now() - startedAt
    if (!seenOnPublicRpc && elapsed >= NOT_ON_CHAIN_FAIL_MS) {
      throw new WalletTransactionWaitError(
        hash,
        `Transaction was not broadcast to BNB Chain (wallet may have failed locally). Hash: ${hash}`,
      )
    }

    if (pendingSince > 0 && Date.now() - pendingSince >= PENDING_WITHOUT_RECEIPT_MS) {
      throw new WalletTransactionWaitError(
        hash,
        `Transaction stayed pending without confirmation (wallet may have failed after confirm). Hash: ${hash}`,
      )
    }

    await sleep(RECEIPT_POLL_MS)
  }

  throw new WalletTransactionWaitError(
    hash,
    `Timed out waiting for transaction confirmation. Hash: ${hash}`,
  )
}
