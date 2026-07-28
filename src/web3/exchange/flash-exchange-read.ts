import { parseAbi } from 'viem'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { ERC20_METHODS, USD1_SWAP_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import type { FlashPairId } from '~/core/exchange/flash-pair'
import type { FlashUsd1SwapConfig } from '~/core/exchange/flash-usd1-swap-gates'

const usd1ExchangeReadAbi = parseAbi([USD1_SWAP_METHODS.quoteUsd1Out, USD1_SWAP_METHODS.getConfig])
const erc20ReadAbi = parseAbi([ERC20_METHODS.balanceOf, ERC20_METHODS.allowance])

export async function readUsd1SwapConfig(
  client: ChainReadClient = bscReadClient,
): Promise<FlashUsd1SwapConfig> {
  const result = await client.readContract({
    address: BSC_CONTRACTS.usd1Swap,
    abi: usd1ExchangeReadAbi,
    functionName: 'getConfig',
  })
  const [, , , currentRateBps, usdtDec, usd1Dec, isPaused, minIn, maxIn, reserve] = result
  return {
    rateBps: currentRateBps,
    usdtDec: Number(usdtDec),
    usd1Dec: Number(usd1Dec),
    isPaused,
    minIn,
    maxIn,
    reserve,
  }
}

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

/** gAGX↔AGX wrap/redeem is 1:1 raw units — no on-chain quoter. */
export async function readFlashRedeemQuote(amountIn: bigint): Promise<bigint> {
  return amountIn
}

export async function readFlashPairQuote(
  pairId: FlashPairId,
  amountIn: bigint,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  if (pairId === 'gagx') return readFlashRedeemQuote(amountIn)
  return readFlashExchangeQuote(amountIn, client)
}

export async function readFlashUsdtBalances(
  owner: string,
  client: ChainReadClient = bscReadClient,
) {
  const ownerAddress = owner as `0x${string}`
  const [sell, buy, approved] = await Promise.all([
    client.readContract({
      address: BSC_CONTRACTS.usdt,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    client.readContract({
      address: BSC_CONTRACTS.usd1,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    client.readContract({
      address: BSC_CONTRACTS.usdt,
      abi: erc20ReadAbi,
      functionName: 'allowance',
      args: [ownerAddress, BSC_CONTRACTS.usd1Swap],
    }),
  ])
  return { sell, buy, approved }
}

/** forward = redeem (sell gAGX); reverse = wrap (sell AGX, approve RewardGAGX). */
export async function readFlashGagxBalances(
  owner: string,
  direction: ExchangeDirection,
  client: ChainReadClient = bscReadClient,
) {
  const ownerAddress = owner as `0x${string}`
  const sellToken = direction === 'forward' ? BSC_CONTRACTS.gagx : BSC_CONTRACTS.agx
  const buyToken = direction === 'forward' ? BSC_CONTRACTS.agx : BSC_CONTRACTS.gagx

  const [sell, buy] = await Promise.all([
    client.readContract({
      address: sellToken,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    client.readContract({
      address: buyToken,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
  ])

  if (direction === 'forward') {
    return { sell, buy, approved: 0n }
  }

  const approved = await client.readContract({
    address: BSC_CONTRACTS.agx,
    abi: erc20ReadAbi,
    functionName: 'allowance',
    args: [ownerAddress, BSC_CONTRACTS.gagx],
  })
  return { sell, buy, approved }
}

export async function readFlashPairBalances(
  pairId: FlashPairId,
  direction: ExchangeDirection,
  owner: string,
  client: ChainReadClient = bscReadClient,
) {
  return pairId === 'gagx'
    ? readFlashGagxBalances(owner, direction, client)
    : readFlashUsdtBalances(owner, client)
}
