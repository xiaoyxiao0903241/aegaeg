import { getContract, readContract, type ThirdwebClient } from 'thirdweb'
import type { Chain } from 'thirdweb/chains'
import { SWAP_CONFIG } from '~/config/swap'
import { BSC_CONTRACTS } from '~/config/contracts'
import { ERC20_METHODS, PAIR_V2_METHODS, ROUTER_V2_METHODS } from '~/web3/abis'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'
import { quoteSwapOut } from '~/lib/swap/quote-swap-out'

export function getErc20Contract(client: ThirdwebClient, chain: Chain, address: `0x${string}`) {
  return getContract({ client, chain, address })
}

export function getRouterContract(client: ThirdwebClient, chain: Chain) {
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
  client = thirdwebClient,
  chain = defaultChain,
}: {
  amountIn: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  client?: ThirdwebClient
  chain?: Chain
}) {
  const router = getRouterContract(client, chain)

  return quoteSwapOut({
    amountIn,
    tokenIn,
    tokenOut,
    wbnb: SWAP_CONFIG.wbnb,
    getAmountsOut: async (input, path) =>
      readContract({
        contract: router,
        method: ROUTER_V2_METHODS.getAmountsOut,
        params: [input, path],
      }),
  })
}

export async function readPairSpotRate({
  pair = BSC_CONTRACTS.xxUsd1Pair,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  pair?: `0x${string}`
  client?: ThirdwebClient
  chain?: Chain
} = {}): Promise<{ usd1PerXx: number; xxPerUsd1: number } | null> {
  const contract = getContract({ client, chain, address: pair })

  try {
    const [reserve0, reserve1] = await readContract({
      contract,
      method: PAIR_V2_METHODS.getReserves,
      params: [],
    })

    const [token0, token1] = await Promise.all([
      readContract({ contract, method: PAIR_V2_METHODS.token0, params: [] }),
      readContract({ contract, method: PAIR_V2_METHODS.token1, params: [] }),
    ])

    const usd1Addr = BSC_CONTRACTS.usd1.toLowerCase()
    const xxAddr = BSC_CONTRACTS.xxToken.toLowerCase()

    let usd1Reserve: bigint
    let xxReserve: bigint

    if (token0.toLowerCase() === usd1Addr && token1.toLowerCase() === xxAddr) {
      usd1Reserve = reserve0
      xxReserve = reserve1
    } else if (token0.toLowerCase() === xxAddr && token1.toLowerCase() === usd1Addr) {
      usd1Reserve = reserve1
      xxReserve = reserve0
    } else {
      return null
    }

    if (xxReserve === 0n) return null

    const usd1PerXx = Number(usd1Reserve) / Number(xxReserve)
    const xxPerUsd1 = Number(xxReserve) / Number(usd1Reserve)

    if (!Number.isFinite(usd1PerXx) || !Number.isFinite(xxPerUsd1)) return null

    return { usd1PerXx, xxPerUsd1 }
  } catch {
    return null
  }
}
