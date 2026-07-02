import { getContract, readContract, type ThirdwebClient } from 'thirdweb'
import type { Chain } from 'thirdweb/chains'
import { BSC_CONTRACTS } from '~/config/contracts'
import { USD1_SWAP_METHODS } from '~/web3/abis'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'
import { readErc20Allowance, readErc20Balance } from '~/web3/swap-read'

/** Flash Swap tokens — BSC USDT / USD1 (same as Trade Swap). */
const FLASH_SWAP_USDT = BSC_CONTRACTS.usdt
const FLASH_SWAP_USD1 = BSC_CONTRACTS.usd1

export function getUsd1SwapContract(client: ThirdwebClient = thirdwebClient, chain: Chain = defaultChain) {
  return getContract({
    client,
    chain,
    address: BSC_CONTRACTS.usd1Swap,
  })
}

export async function readFlashSwapQuote(
  usdtAmount: bigint,
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<bigint> {
  if (usdtAmount === 0n) return 0n
  const contract = getUsd1SwapContract(client, chain)
  return readContract({
    contract,
    method: USD1_SWAP_METHODS.quoteUsd1Out,
    params: [usdtAmount],
  })
}

export async function readFlashSwapRateBps(
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<bigint> {
  const contract = getUsd1SwapContract(client, chain)
  return readContract({
    contract,
    method: USD1_SWAP_METHODS.rateBps,
    params: [],
  })
}

export async function readFlashSwapBalances(
  owner: string,
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
) {
  const [usdt, usd1, approved] = await Promise.all([
    readErc20Balance(FLASH_SWAP_USDT, owner, client, chain),
    readErc20Balance(FLASH_SWAP_USD1, owner, client, chain),
    readErc20Allowance(FLASH_SWAP_USDT, owner, BSC_CONTRACTS.usd1Swap, client, chain),
  ])
  return { usdt, usd1, approved }
}
