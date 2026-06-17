import { BSC_CONTRACTS } from '~/config/contracts'

/** Carousel / About 区块可跳转 BscScan 的代币；未部署则 null */
export const SWAP_TOKEN_CONTRACTS: Record<string, `0x${string}` | null> = {
  usd1: BSC_CONTRACTS.usd1,
  agx: null,
  gagx: null,
  x: BSC_CONTRACTS.xxToken,
}

export function getSwapTokenContractAddress(tokenKey: string): `0x${string}` | null {
  return SWAP_TOKEN_CONTRACTS[tokenKey] ?? null
}

export function openTokenContractOnBscScan(tokenKey: string): void {
  const address = getSwapTokenContractAddress(tokenKey)
  if (!address) return
  window.open(`https://bscscan.com/address/${address}`, '_blank', 'noopener,noreferrer')
}
