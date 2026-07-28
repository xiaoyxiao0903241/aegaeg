import { parseAbi } from 'viem'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { POOL_V3_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

const poolAbi = parseAbi([
  POOL_V3_METHODS.fee,
  POOL_V3_METHODS.token0,
  POOL_V3_METHODS.token1,
  POOL_V3_METHODS.slot0,
])

export interface ExchangePoolImmutableMetadata {
  fee: number
  token0: `0x${string}`
  token1: `0x${string}`
}

export interface ExchangePoolSpotPrice {
  sqrtPriceX96: bigint
  tick: number
}

// Keyed by pool address — a single-slot cache would serve stale metadata if
// callers ever read more than one pool.
const cachedImmutablePools = new Map<string, ExchangePoolImmutableMetadata>()

/** Test helper — pool fee/token0/token1 are cached for the process lifetime. */
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

  const [fee, token0, token1] = await Promise.all([
    client.readContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: 'fee',
    }),
    client.readContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: 'token0',
    }),
    client.readContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: 'token1',
    }),
  ])

  const metadata: ExchangePoolImmutableMetadata = {
    fee: Number(fee),
    token0,
    token1,
  }
  cachedImmutablePools.set(cacheKey, metadata)

  return metadata
}

export async function readExchangePoolSpotPrice(
  poolAddress: `0x${string}` = EXCHANGE_CONFIG.pool,
  client: ChainReadClient = bscReadClient,
): Promise<ExchangePoolSpotPrice> {
  const slot0 = await client.readContract({
    address: poolAddress,
    abi: poolAbi,
    functionName: 'slot0',
  })

  return {
    sqrtPriceX96: slot0[0],
    tick: Number(slot0[1]),
  }
}
