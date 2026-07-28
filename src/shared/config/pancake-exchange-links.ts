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

/** PancakeSwap deep links for Trade USD1 ↔ AGX on BSC. */
export const PANCAKE_SWAP_DEEP_LINKS = {
  usd1ToAgx: buildPancakeSwapUrl(BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx),
  agxToUsd1: buildPancakeSwapUrl(BSC_CONTRACTS.agx, BSC_CONTRACTS.usd1),
} as const

export function resolvePancakeSwapDeepLink(sellSymbol: string, buySymbol: string): string {
  if (sellSymbol === 'USD1' && buySymbol === 'AGX') {
    return PANCAKE_SWAP_DEEP_LINKS.usd1ToAgx
  }
  if (sellSymbol === 'AGX' && buySymbol === 'USD1') {
    return PANCAKE_SWAP_DEEP_LINKS.agxToUsd1
  }
  return PANCAKE_SWAP_DEEP_LINKS.usd1ToAgx
}

export function openPancakeSwapDeepLink(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
}
