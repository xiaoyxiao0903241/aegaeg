import { parseAbi } from 'viem'

import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { PANCAKE_PAIR_V2_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'

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

// 按交易对地址缓存：若用单槽缓存，调用方读取多个交易对时会拿到过期元数据
const cachedImmutablePools = new Map<string, ExchangePoolImmutableMetadata>()

/** 测试辅助：清空 token0/token1 进程级缓存。 */
export function clearExchangePoolImmutableCache() {
  cachedImmutablePools.clear()
}

/**
 * 读取交易对不可变元数据（token0 / token1）
 *
 * token0/token1 永不变更，故按地址进程内缓存；第二次起直接命中。
 *
 * @param poolAddress 交易对合约地址
 * @returns token0 / token1 地址
 */
export async function readExchangePoolImmutableMetadata(
  poolAddress: `0x${string}` = EXCHANGE_CONFIG.pool,
): Promise<ExchangePoolImmutableMetadata> {
  const cacheKey = poolAddress.toLowerCase()
  const cached = cachedImmutablePools.get(cacheKey)
  if (cached) return cached

  const [token0, token1] = await Promise.all([
    bscReadClient.readContract({
      address: poolAddress,
      abi: pairAbi,
      functionName: 'token0',
    }),
    bscReadClient.readContract({
      address: poolAddress,
      abi: pairAbi,
      functionName: 'token1',
    }),
  ])

  const metadata: ExchangePoolImmutableMetadata = { token0, token1 }
  cachedImmutablePools.set(cacheKey, metadata)
  return metadata
}

/**
 * 读取交易对实时储备（价格相关，不缓存）
 *
 * 调用 `getReserves` 返回两个方向储备，用于报价与价格影响计算。
 *
 * @param poolAddress 交易对合约地址
 * @returns 两个方向的储备量
 */
export async function readExchangePoolSpotPrice(
  poolAddress: `0x${string}` = EXCHANGE_CONFIG.pool,
): Promise<ExchangePoolSpotPrice> {
  const reserves = await bscReadClient.readContract({
    address: poolAddress,
    abi: pairAbi,
    functionName: 'getReserves',
  })

  return {
    reserve0: reserves[0],
    reserve1: reserves[1],
  }
}

/**
 * 按输入代币方向取对应储备
 *
 * 输入代币不是交易对两币种之一时返回 null，表示无法计算该方向。
 *
 * @param tokenIn 输入代币地址
 * @param token0 交易对 token0
 * @param token1 交易对 token1
 * @param reserve0 token0 储备
 * @param reserve1 token1 储备
 * @returns 输入 / 输出方向储备；输入代币不在交易对内 → null
 */
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
  poolAddress: `0x${string}` = EXCHANGE_CONFIG.pool,
): Promise<bigint | null> {
  const [meta, spot] = await Promise.all([
    readExchangePoolImmutableMetadata(poolAddress),
    readExchangePoolSpotPrice(poolAddress),
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
