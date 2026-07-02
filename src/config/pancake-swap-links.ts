/** PancakeSwap deep links for USDT ↔ USD1 on BSC (Swap widget external open). */
export const PANCAKE_SWAP_DEEP_LINKS = {
  usdtToUsd1:
    'https://pancakeswap.finance/swap?chain=bsc&inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d',
  usd1ToUsdt:
    'https://pancakeswap.finance/swap?chain=bsc&inputCurrency=0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d&outputCurrency=0x55d398326f99059fF775485246999027B3197955',
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
