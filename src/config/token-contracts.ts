import { bscscanToken } from '~/config/explorer'
import { BSC_CONTRACTS } from '~/config/contracts'

/** Carousel「USD1 · 核心结算资产」— 官方 BscScan 代币页（非链上 swap 合约地址） */
export const USD1_CAROUSEL_TOKEN = '0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d' as const

/** Carousel / About 区块可跳转 BscScan 的代币；未部署则 null */
export const SWAP_TOKEN_CONTRACTS: Record<string, `0x${string}` | null> = {
  usd1: USD1_CAROUSEL_TOKEN,
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
  window.open(bscscanToken(address), '_blank', 'noopener,noreferrer')
}
