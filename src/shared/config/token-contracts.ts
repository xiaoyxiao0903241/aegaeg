import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscscanAddress, bscscanToken } from '~/shared/config/explorer'

/** Carousel / About 区块可跳转 BscScan 的合约；未部署则 null。 */
export const EXCHANGE_TOKEN_CONTRACTS: Record<string, `0x${string}` | null> = {
  agx: BSC_CONTRACTS.agx,
  gagx: BSC_CONTRACTS.gagx,
  usd1: BSC_CONTRACTS.usd1,
  x: BSC_CONTRACTS.xToken,
  contribution: BSC_CONTRACTS.agxContributionSwap,
  turbine: BSC_CONTRACTS.turbine,
}

/** 非 ERC20 合约走地址页，其余已配置 key 走代币页。 */
const BSCSCAN_ADDRESS_PAGE_KEYS = new Set(['contribution', 'turbine'])

/** 按展示 key 取代币 / 合约地址；未配置的 key 返回 null。 */
export function getExchangeTokenContractAddress(tokenKey: string): `0x${string}` | null {
  return EXCHANGE_TOKEN_CONTRACTS[tokenKey] ?? null
}

/** 打开 About 卡对应合约的 BscScan 页面；未配置的 key 不执行。 */
export function openTokenContractOnBscScan(tokenKey: string): void {
  const address = getExchangeTokenContractAddress(tokenKey)
  if (!address) return
  const href = BSCSCAN_ADDRESS_PAGE_KEYS.has(tokenKey)
    ? bscscanAddress(address)
    : bscscanToken(address)
  window.open(href, '_blank', 'noopener,noreferrer')
}
