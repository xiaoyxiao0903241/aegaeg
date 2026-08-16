import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscscanToken } from '~/shared/config/explorer'

/** Carousel / About 区块可跳转 BscScan 的代币；未部署则 null */
export const EXCHANGE_TOKEN_CONTRACTS: Record<string, `0x${string}` | null> = {
  agx: BSC_CONTRACTS.agx,
  gagx: BSC_CONTRACTS.gagx,
  usd1: BSC_CONTRACTS.usd1,
  x: BSC_CONTRACTS.xToken,
}

/** 按展示 key 取代币合约地址；未配置的 key 返回 null。 */
export function getExchangeTokenContractAddress(tokenKey: string): `0x${string}` | null {
  return EXCHANGE_TOKEN_CONTRACTS[tokenKey] ?? null
}

/** 打开代币的 BscScan 页面；未配置的 key 不执行。 */
export function openTokenContractOnBscScan(tokenKey: string): void {
  const address = getExchangeTokenContractAddress(tokenKey)
  if (!address) return
  window.open(bscscanToken(address), '_blank', 'noopener,noreferrer')
}
