import { parseAbi } from 'viem'
import { BSC_CONTRACTS } from '~/config/contracts'
import { calcSqrtPriceImpactBps } from '~/lib/swap/calc-sqrt-price-impact-bps'
import { quoteV3ExactInputSingle } from '~/lib/swap/quote-v3-exact-input'
import { SWAP_CONFIG } from '~/config/swap'
import { ERC20_METHODS } from '~/web3/abis'
import {
  readSwapPoolImmutableMetadata,
  readSwapPoolSpotPrice,
} from '~/web3/read-swap-pool'
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
}: {
  amountIn: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  client?: ChainReadClient
}): Promise<SwapQuoteResult> {
  const [pool, spot] = await Promise.all([
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

  const priceImpactBps = calcSqrtPriceImpactBps(spot.sqrtPriceX96, quote.sqrtPriceX96After)

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

export async function readPairSpotRate({
  usdt = BSC_CONTRACTS.usdt,
  usd1 = BSC_CONTRACTS.usd1,
  client = bscReadClient,
}: {
  usdt?: `0x${string}`
  usd1?: `0x${string}`
  client?: ChainReadClient
} = {}): Promise<{ usd1PerXx: number; xxPerUsd1: number } | null> {
  const unit = 10n ** 18n

  try {
    const pool = await readSwapPoolImmutableMetadata(SWAP_CONFIG.pool, client)

    const [usd1Out, usdtOut] = await Promise.all([
      quoteV3ExactInputSingle({
        quoter: SWAP_CONFIG.quoter,
        tokenIn: usdt,
        tokenOut: usd1,
        amountIn: unit,
        fee: pool.fee,
        client,
      }),
      quoteV3ExactInputSingle({
        quoter: SWAP_CONFIG.quoter,
        tokenIn: usd1,
        tokenOut: usdt,
        amountIn: unit,
        fee: pool.fee,
        client,
      }),
    ])

    const usd1PerXx = Number(usd1Out.amountOut) / Number(unit)
    const xxPerUsd1 = Number(usdtOut.amountOut) / Number(unit)

    if (!Number.isFinite(usd1PerXx) || !Number.isFinite(xxPerUsd1)) return null

    return { usd1PerXx, xxPerUsd1 }
  } catch {
    return null
  }
}

export { readSwapPoolImmutableMetadata, readSwapPoolSpotPrice } from '~/web3/read-swap-pool'
