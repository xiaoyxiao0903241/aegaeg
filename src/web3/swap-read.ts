import { getContract, readContract, type ThirdwebClient } from 'thirdweb'
import type { Chain } from 'thirdweb/chains'
import { BSC_CONTRACTS } from '~/config/contracts'
import { quoteV3ExactInputSingle } from '~/lib/swap/quote-v3-exact-input'
import { SWAP_CONFIG } from '~/config/swap'
import { ERC20_METHODS } from '~/web3/abis'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'

export interface SwapQuoteResult {
  quotedOut: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  fee: number
}

export function getErc20Contract(client: ThirdwebClient, chain: Chain, address: `0x${string}`) {
  return getContract({ client, chain, address })
}

export function getSwapRouterContract(client: ThirdwebClient, chain: Chain) {
  return getContract({
    client,
    chain,
    address: SWAP_CONFIG.router,
  })
}

export async function readErc20Balance(
  address: `0x${string}`,
  owner: string,
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<bigint> {
  const contract = getErc20Contract(client, chain, address)
  return readContract({
    contract,
    method: ERC20_METHODS.balanceOf,
    params: [owner],
  })
}

export async function readErc20Allowance(
  token: `0x${string}`,
  owner: string,
  spender: `0x${string}`,
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<bigint> {
  const contract = getErc20Contract(client, chain, token)
  return readContract({
    contract,
    method: ERC20_METHODS.allowance,
    params: [owner, spender],
  })
}

export async function fetchSwapQuote({
  amountIn,
  tokenIn,
  tokenOut,
}: {
  amountIn: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
}): Promise<SwapQuoteResult> {
  const quotedOut = await quoteV3ExactInputSingle({
    quoter: SWAP_CONFIG.quoter,
    tokenIn,
    tokenOut,
    amountIn,
    fee: SWAP_CONFIG.feeTier,
  })

  return {
    quotedOut,
    tokenIn,
    tokenOut,
    fee: SWAP_CONFIG.feeTier,
  }
}

export async function readPairSpotRate({
  usdt = BSC_CONTRACTS.usdt,
  usd1 = BSC_CONTRACTS.usd1Official,
}: {
  usdt?: `0x${string}`
  usd1?: `0x${string}`
} = {}): Promise<{ usd1PerXx: number; xxPerUsd1: number } | null> {
  const unit = 10n ** 18n

  try {
    const [usd1Out, usdtOut] = await Promise.all([
      quoteV3ExactInputSingle({
        quoter: SWAP_CONFIG.quoter,
        tokenIn: usdt,
        tokenOut: usd1,
        amountIn: unit,
        fee: SWAP_CONFIG.feeTier,
      }),
      quoteV3ExactInputSingle({
        quoter: SWAP_CONFIG.quoter,
        tokenIn: usd1,
        tokenOut: usdt,
        amountIn: unit,
        fee: SWAP_CONFIG.feeTier,
      }),
    ])

    const usd1PerXx = Number(usd1Out) / Number(unit)
    const xxPerUsd1 = Number(usdtOut) / Number(unit)

    if (!Number.isFinite(usd1PerXx) || !Number.isFinite(xxPerUsd1)) return null

    return { usd1PerXx, xxPerUsd1 }
  } catch {
    return null
  }
}
