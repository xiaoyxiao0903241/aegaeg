import { parseAbi } from 'viem'
import { SWAP_CONFIG } from '~/config/swap'
import { POOL_V3_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'

const poolAbi = parseAbi([
  POOL_V3_METHODS.fee,
  POOL_V3_METHODS.token0,
  POOL_V3_METHODS.token1,
  POOL_V3_METHODS.slot0,
])

export interface SwapPoolImmutableMetadata {
  fee: number
  token0: `0x${string}`
  token1: `0x${string}`
}

export interface SwapPoolSpotPrice {
  sqrtPriceX96: bigint
  tick: number
}

let cachedImmutablePool: SwapPoolImmutableMetadata | null = null

export function resetSwapPoolMetadataCache() {
  cachedImmutablePool = null
}

export async function readSwapPoolImmutableMetadata(
  poolAddress: `0x${string}` = SWAP_CONFIG.pool,
): Promise<SwapPoolImmutableMetadata> {
  if (cachedImmutablePool) return cachedImmutablePool

  const [fee, token0, token1] = await Promise.all([
    bscReadClient.readContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: 'fee',
    }),
    bscReadClient.readContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: 'token0',
    }),
    bscReadClient.readContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: 'token1',
    }),
  ])

  cachedImmutablePool = {
    fee: Number(fee),
    token0,
    token1,
  }

  return cachedImmutablePool
}

export async function readSwapPoolSpotPrice(
  poolAddress: `0x${string}` = SWAP_CONFIG.pool,
): Promise<SwapPoolSpotPrice> {
  const slot0 = await bscReadClient.readContract({
    address: poolAddress,
    abi: poolAbi,
    functionName: 'slot0',
  })

  return {
    sqrtPriceX96: slot0[0],
    tick: Number(slot0[1]),
  }
}
