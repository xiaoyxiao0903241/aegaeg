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

/**
 * 从 V2 储备推导「1 整枚 AGX → 多少 USD1 wei（18dec）」。
 * 即时 spot，非 TWAP；pair 非 AGX/USD1 或 AGX 储备为 0 → null。
 */
export function agxUsd1SpotPriceWeiFromReserves({
  token0,
  token1,
  reserve0,
  reserve1,
  agx,
  usd1,
  agxDecimals,
}: {
  token0: `0x${string}`
  token1: `0x${string}`
  reserve0: bigint
  reserve1: bigint
  agx: `0x${string}`
  usd1: `0x${string}`
  agxDecimals: number
}): bigint | null {
  const t0 = token0.toLowerCase()
  const t1 = token1.toLowerCase()
  const agxLower = agx.toLowerCase()
  const usd1Lower = usd1.toLowerCase()

  let reserveAgx: bigint
  let reserveUsd1: bigint
  if (t0 === agxLower && t1 === usd1Lower) {
    reserveAgx = reserve0
    reserveUsd1 = reserve1
  } else if (t0 === usd1Lower && t1 === agxLower) {
    reserveUsd1 = reserve0
    reserveAgx = reserve1
  } else {
    return null
  }

  if (reserveAgx === 0n) return null
  return (reserveUsd1 * 10n ** BigInt(agxDecimals)) / reserveAgx
}

/** AGX/USD1 Pair 即时价（USD1 wei / 1 AGX）。 */
export async function readAgxUsd1SpotPriceWei(
  client: ChainReadClient = bscReadClient,
  poolAddress: `0x${string}` = EXCHANGE_CONFIG.pool,
): Promise<bigint | null> {
  const [meta, spot] = await Promise.all([
    readExchangePoolImmutableMetadata(poolAddress, client),
    readExchangePoolSpotPrice(poolAddress, client),
  ])
  return agxUsd1SpotPriceWeiFromReserves({
    token0: meta.token0,
    token1: meta.token1,
    reserve0: spot.reserve0,
    reserve1: spot.reserve1,
    agx: EXCHANGE_CONFIG.tokens.agx.address,
    usd1: EXCHANGE_CONFIG.tokens.usd1.address,
    agxDecimals: EXCHANGE_CONFIG.tokens.agx.decimals,
  })
}
