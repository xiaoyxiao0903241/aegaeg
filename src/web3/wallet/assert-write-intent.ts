import type { Address } from 'viem'
import { getAddress } from 'thirdweb/utils'
import { WALLET_WRITE_ERROR } from '~/web3/errors/sentinels'
import { defaultChain } from '~/web3/thirdweb'

/** Immutable write intent captured before preflight / wallet prompt. */
export type WriteIntent = {
  expectedAddress: Address
  expectedChainId: number
}

export function createWriteIntent(address: string, chainId = defaultChain.id): WriteIntent {
  return {
    expectedAddress: getAddress(address) as Address,
    expectedChainId: chainId,
  }
}

/**
 * Fail-closed before eth_sendTransaction when the live wallet drifted
 * (account switch or wrong chain) after the write started.
 */
export function assertWriteIntentMatches({
  intent,
  liveAddress,
  liveChainId,
}: {
  intent: WriteIntent
  liveAddress: string | undefined | null
  liveChainId: number | undefined | null
}): void {
  if (!liveAddress) {
    throw new Error(WALLET_WRITE_ERROR.INTENT_ADDRESS_MISMATCH)
  }
  const normalizedLive = getAddress(liveAddress)
  if (normalizedLive.toLowerCase() !== intent.expectedAddress.toLowerCase()) {
    throw new Error(WALLET_WRITE_ERROR.INTENT_ADDRESS_MISMATCH)
  }
  if (liveChainId == null || liveChainId !== intent.expectedChainId) {
    throw new Error(WALLET_WRITE_ERROR.WRONG_CHAIN)
  }
}

export function parseEip1193ChainId(chainIdHex: string): number {
  const parsed = Number.parseInt(chainIdHex, 16)
  if (!Number.isFinite(parsed)) {
    throw new Error(WALLET_WRITE_ERROR.WRONG_CHAIN)
  }
  return parsed
}
