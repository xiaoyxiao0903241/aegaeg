import { parseAbi } from 'viem'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { ERC20_METHODS, USD1_SWAP_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

/** Flash Exchange tokens — BSC USDT / USD1 (same as Market Trade). */
const FLASH_EXCHANGE_USDT = BSC_CONTRACTS.usdt
const FLASH_EXCHANGE_USD1 = BSC_CONTRACTS.usd1

const usd1ExchangeReadAbi = parseAbi([USD1_SWAP_METHODS.quoteUsd1Out])

const erc20ReadAbi = parseAbi([ERC20_METHODS.balanceOf, ERC20_METHODS.allowance])

export async function readFlashExchangeQuote(
  usdtAmount: bigint,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  if (usdtAmount === 0n) return 0n
  return client.readContract({
    address: BSC_CONTRACTS.usd1Swap,
    abi: usd1ExchangeReadAbi,
    functionName: 'quoteUsd1Out',
    args: [usdtAmount],
  })
}

export async function readFlashExchangeBalances(
  owner: string,
  client: ChainReadClient = bscReadClient,
) {
  const ownerAddress = owner as `0x${string}`
  const [usdt, usd1, approved] = await Promise.all([
    client.readContract({
      address: FLASH_EXCHANGE_USDT,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    client.readContract({
      address: FLASH_EXCHANGE_USD1,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    client.readContract({
      address: FLASH_EXCHANGE_USDT,
      abi: erc20ReadAbi,
      functionName: 'allowance',
      args: [ownerAddress, BSC_CONTRACTS.usd1Swap],
    }),
  ])
  return { usdt, usd1, approved }
}
