import { parseAbi } from 'viem'
import { calcV2PriceImpactBps } from '~/core/exchange/calc-price-impact-bps'
import { quoteV2AmountsOut } from '~/web3/exchange/quote-v2-amounts-out'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { ERC20_METHODS } from '~/web3/abis'
import {
  readExchangePoolImmutableMetadata,
  readExchangePoolSpotPrice,
  resolvePairReservesForTokenIn,
  type ExchangePoolImmutableMetadata,
  type ExchangePoolSpotPrice,
} from '~/web3/exchange/read-exchange-pool'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

export type ExchangePoolReadContext = {
  pool: ExchangePoolImmutableMetadata
  spot: ExchangePoolSpotPrice
}

export interface ExchangeQuoteResult {
  quotedOut: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  /** V2 has no quoter gas estimate; UI shows "—" when zero. */
  gasEstimate: bigint
  priceImpactBps: number
}

const erc20Abi = parseAbi([ERC20_METHODS.balanceOf, ERC20_METHODS.allowance])

export async function readErc20Balance(
  address: `0x${string}`,
  owner: string,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
    address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [owner as `0x${string}`],
  })
}

export async function readErc20Allowance(
  token: `0x${string}`,
  owner: string,
  spender: `0x${string}`,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
    address: token,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner as `0x${string}`, spender],
  })
}

export async function fetchExchangeQuote({
  amountIn,
  tokenIn,
  tokenOut,
  path: pathArg,
  client = bscReadClient,
  poolContext,
}: {
  amountIn: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  /** When omitted, path is the direct `[tokenIn, tokenOut]` hop. */
  path?: readonly `0x${string}`[]
  client?: ChainReadClient
  /** Reuse short-stale pool reads from React Query when available. */
  poolContext?: ExchangePoolReadContext
}): Promise<ExchangeQuoteResult> {
  const path = pathArg ?? ([tokenIn, tokenOut] as const)
  const [pool, spot] = poolContext
    ? [poolContext.pool, poolContext.spot]
    : await Promise.all([
        readExchangePoolImmutableMetadata(EXCHANGE_CONFIG.pool, client),
        readExchangePoolSpotPrice(EXCHANGE_CONFIG.pool, client),
      ])

  const quotedOut = await quoteV2AmountsOut({
    router: EXCHANGE_CONFIG.router,
    amountIn,
    path,
    client,
  })

  /** Price impact only for the known USD1/AGX pool direct hop; else honest 0 (UI shows —). */
  const isDirectUsd1AgxPoolHop =
    path.length === 2 &&
    path[0] === tokenIn &&
    path[1] === tokenOut &&
    ((tokenIn === pool.token0 && tokenOut === pool.token1) ||
      (tokenIn === pool.token1 && tokenOut === pool.token0))

  const reserves = isDirectUsd1AgxPoolHop
    ? resolvePairReservesForTokenIn({
        tokenIn,
        token0: pool.token0,
        token1: pool.token1,
        reserve0: spot.reserve0,
        reserve1: spot.reserve1,
      })
    : null

  const priceImpactBps = reserves
    ? calcV2PriceImpactBps({
        amountIn,
        amountOut: quotedOut,
        reserveIn: reserves.reserveIn,
        reserveOut: reserves.reserveOut,
      })
    : 0

  return {
    quotedOut,
    tokenIn,
    tokenOut,
    gasEstimate: 0n,
    priceImpactBps,
  }
}

export {
  readExchangePoolImmutableMetadata,
  readExchangePoolSpotPrice,
} from '~/web3/exchange/read-exchange-pool'
