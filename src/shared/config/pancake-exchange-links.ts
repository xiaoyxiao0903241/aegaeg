import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { appEnv } from '~/shared/config/env'

const pancakeSwapBase = appEnv.pancakeSwapBaseUrl.replace(/\/$/, '')

function buildPancakeSwapUrl(inputCurrency: string, outputCurrency: string): string {
  const params = new URLSearchParams({
    chain: 'bsc',
    inputCurrency,
    outputCurrency,
  })
  return `${pancakeSwapBase}?${params.toString()}`
}

/** PancakeSwap deep links for USDT ↔ USD1 on BSC (Exchange widget external open). */
export const PANCAKE_SWAP_DEEP_LINKS = {
  usdtToUsd1: buildPancakeSwapUrl(BSC_CONTRACTS.usdt, BSC_CONTRACTS.usd1),
  usd1ToUsdt: buildPancakeSwapUrl(BSC_CONTRACTS.usd1, BSC_CONTRACTS.usdt),
} as const

export function resolvePancakeSwapDeepLink(sellSymbol: string, buySymbol: string): string {
  if (sellSymbol === 'USDT' && buySymbol === 'USD1') {
    return PANCAKE_SWAP_DEEP_LINKS.usdtToUsd1
  }
  if (sellSymbol === 'USD1' && buySymbol === 'USDT') {
    return PANCAKE_SWAP_DEEP_LINKS.usd1ToUsdt
  }
  return PANCAKE_SWAP_DEEP_LINKS.usdtToUsd1
}

export function openPancakeSwapDeepLink(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
}
