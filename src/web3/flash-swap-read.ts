import { parseAbi } from 'viem'
import { BSC_CONTRACTS } from '~/config/contracts'
import { ERC20_METHODS, USD1_SWAP_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'

/** Flash Swap tokens — BSC USDT / USD1 (same as Trade Swap). */
const FLASH_SWAP_USDT = BSC_CONTRACTS.usdt
const FLASH_SWAP_USD1 = BSC_CONTRACTS.usd1

const usd1SwapReadAbi = parseAbi([USD1_SWAP_METHODS.quoteUsd1Out])

const erc20ReadAbi = parseAbi([ERC20_METHODS.balanceOf, ERC20_METHODS.allowance])

export async function readFlashSwapQuote(usdtAmount: bigint): Promise<bigint> {
  if (usdtAmount === 0n) return 0n
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.usd1Swap,
    abi: usd1SwapReadAbi,
    functionName: 'quoteUsd1Out',
    args: [usdtAmount],
  })
}

export async function readFlashSwapBalances(owner: string) {
  const ownerAddress = owner as `0x${string}`
  const [usdt, usd1, approved] = await Promise.all([
    bscReadClient.readContract({
      address: FLASH_SWAP_USDT,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    bscReadClient.readContract({
      address: FLASH_SWAP_USD1,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    bscReadClient.readContract({
      address: FLASH_SWAP_USDT,
      abi: erc20ReadAbi,
      functionName: 'allowance',
      args: [ownerAddress, BSC_CONTRACTS.usd1Swap],
    }),
  ])
  return { usdt, usd1, approved }
}
