import { parseAbi } from 'viem'

import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { PANCAKE_PAIR_V2_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

const pairAbi = parseAbi([
  PANCAKE_PAIR_V2_METHODS.token0,
  PANCAKE_PAIR_V2_METHODS.token1,
  PANCAKE_PAIR_V2_METHODS.getReserves,
])

export interface ExchangePoolImmutableMetadata {
  token0: `0x${string}`
  token1: `0x${string}`
}

export interface ExchangePoolSpotPrice {
  reserve0: bigint
  reserve1: bigint
}

// Keyed by pair address — a single-slot cache would serve stale metadata if
// callers ever read more than one pair.
const cachedImmutablePools = new Map<string, ExchangePoolImmutableMetadata>()

/** Test helper — pair token0/token1 are cached for the process lifetime. */
export function clearExchangePoolImmutableCache() {
  cachedImmutablePools.clear()
}

export async function readExchangePoolImmutableMetadata(
  poolAddress: `0x${string}` = EXCHANGE_CONFIG.pool,
  client: ChainReadClient = bscReadClient,
): Promise<ExchangePoolImmutableMetadata> {
  const cacheKey = poolAddress.toLowerCase()
  const cached = cachedImmutablePools.get(cacheKey)
  if (cached) return cached

  const [token0, token1] = await Promise.all([
    client.readContract({
      address: poolAddress,
      abi: pairAbi,
      functionName: 'token0',
    }),
    client.readContract({
      address: poolAddress,
      abi: pairAbi,
      functionName: 'token1',
    }),
  ])

  const metadata: ExchangePoolImmutableMetadata = { token0, token1 }
  cachedImmutablePools.set(cacheKey, metadata)
  return metadata
}

export async function readExchangePoolSpotPrice(
  poolAddress: `0x${string}` = EXCHANGE_CONFIG.pool,
  client: ChainReadClient = bscReadClient,
): Promise<ExchangePoolSpotPrice> {
  const reserves = await client.readContract({
    address: poolAddress,
    abi: pairAbi,
    functionName: 'getReserves',
  })

  return {
    reserve0: reserves[0],
    reserve1: reserves[1],
  }
}

export function pairReservesForTokenIn({
  tokenIn,
  token0,
  token1,
  reserve0,
  reserve1,
}: {
  tokenIn: `0x${string}`
  token0: `0x${string}`
  token1: `0x${string}`
  reserve0: bigint
  reserve1: bigint
}): { reserveIn: bigint; reserveOut: bigint } | null {
  const inLower = tokenIn.toLowerCase()
  if (inLower === token0.toLowerCase()) {
    return { reserveIn: reserve0, reserveOut: reserve1 }
  }
  if (inLower === token1.toLowerCase()) {
    return { reserveIn: reserve1, reserveOut: reserve0 }
  }
  return null
}
