import { appEnv } from '~/shared/config/env'

const pancakeSwapBase = appEnv.pancakeSwapBaseUrl.replace(/\/$/, '')

function pancakeSwapUrl(inputCurrency: string, outputCurrency: string): string {
  const params = new URLSearchParams({
    chain: 'bsc',
    inputCurrency,
    outputCurrency,
  })
  return `${pancakeSwapBase}?${params.toString()}`
}

/** PancakeSwap 深链接，用于 BSC 上交易（参数为合约地址而非符号）。 */
export function pancakeSwapDeepLink(sellAddress: `0x${string}`, buyAddress: `0x${string}`): string {
  return pancakeSwapUrl(sellAddress, buyAddress)
}

/** 在新窗口打开 PancakeSwap 深链接。 */
export function openPancakeSwapDeepLink(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
}
