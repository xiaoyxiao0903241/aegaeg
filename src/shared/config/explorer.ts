import { appEnv } from '~/shared/config/env'

const BSCSCAN_BASE = appEnv.bscscanBase.replace(/\/$/, '')

/** BscScan 地址页链接。 */
export function bscscanAddress(address: string): string {
  return `${BSCSCAN_BASE}/address/${address}`
}

/** BscScan 代币页链接。 */
export function bscscanToken(address: string): string {
  return `${BSCSCAN_BASE}/token/${address}`
}

/** BscScan 交易详情链接。 */
export function bscscanTx(hash: string): string {
  return `${BSCSCAN_BASE}/tx/${hash}`
}
