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

/** PancakeSwap deep links for Trade on BSC (addresses, not symbols). */
export function resolvePancakeSwapDeepLink(
  sellAddress: `0x${string}`,
  buyAddress: `0x${string}`,
): string {
  return buildPancakeSwapUrl(sellAddress, buyAddress)
}

export function openPancakeSwapDeepLink(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
}
