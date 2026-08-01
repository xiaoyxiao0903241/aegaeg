import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscscanToken } from '~/shared/config/explorer'

/** Carousel / About 区块可跳转 BscScan 的代币；未部署则 null */
export const EXCHANGE_TOKEN_CONTRACTS: Record<string, `0x${string}` | null> = {
  agx: BSC_CONTRACTS.agx,
  gagx: BSC_CONTRACTS.gagx,
  usd1: BSC_CONTRACTS.usd1,
  x: BSC_CONTRACTS.xToken,
}

export function getExchangeTokenContractAddress(tokenKey: string): `0x${string}` | null {
  return EXCHANGE_TOKEN_CONTRACTS[tokenKey] ?? null
}

export function openTokenContractOnBscScan(tokenKey: string): void {
  const address = getExchangeTokenContractAddress(tokenKey)
  if (!address) return
  window.open(bscscanToken(address), '_blank', 'noopener,noreferrer')
}
