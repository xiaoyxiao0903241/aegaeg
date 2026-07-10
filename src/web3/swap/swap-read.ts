import { parseAbi } from 'viem'
import { calcPriceImpactBps } from '~/core/swap/calc-price-impact-bps'
import { quoteV3ExactInputSingle } from '~/web3/swap/quote-v3-exact-input'
import { SWAP_CONFIG } from '~/shared/config/swap'
import { ERC20_METHODS } from '~/web3/abis'
import {
  readSwapPoolImmutableMetadata,
  readSwapPoolSpotPrice,
  type SwapPoolImmutableMetadata,
  type SwapPoolSpotPrice,
} from '~/web3/swap/read-swap-pool'

export type SwapPoolReadContext = {
  pool: SwapPoolImmutableMetadata
  spot: SwapPoolSpotPrice
}
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

export interface SwapQuoteResult {
  quotedOut: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  fee: number
  sqrtPriceX96After: bigint
  initializedTicksCrossed: number
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

export async function fetchSwapQuote({
  amountIn,
  tokenIn,
  tokenOut,
  client = bscReadClient,
  poolContext,
}: {
  amountIn: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  client?: ChainReadClient
  /** Reuse short-stale pool reads from React Query when available. */
  poolContext?: SwapPoolReadContext
}): Promise<SwapQuoteResult> {
  const [pool, spot] = poolContext
    ? [poolContext.pool, poolContext.spot]
    : await Promise.all([
        readSwapPoolImmutableMetadata(SWAP_CONFIG.pool, client),
        readSwapPoolSpotPrice(SWAP_CONFIG.pool, client),
      ])

  const quote = await quoteV3ExactInputSingle({
    quoter: SWAP_CONFIG.quoter,
    tokenIn,
    tokenOut,
    amountIn,
    fee: pool.fee,
    client,
  })

  const priceImpactBps = calcPriceImpactBps(spot.sqrtPriceX96, quote.sqrtPriceX96After)

  return {
    quotedOut: quote.amountOut,
    tokenIn,
    tokenOut,
    fee: pool.fee,
    sqrtPriceX96After: quote.sqrtPriceX96After,
    initializedTicksCrossed: quote.initializedTicksCrossed,
    gasEstimate: quote.gasEstimate,
    priceImpactBps,
  }
}

export { readSwapPoolImmutableMetadata, readSwapPoolSpotPrice } from '~/web3/swap/read-swap-pool'
