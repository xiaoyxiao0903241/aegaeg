const BSCSCAN_BASE = 'https://bscscan.com'

export function bscscanAddress(address: string): string {
  return `${BSCSCAN_BASE}/address/${address}`
}

export function bscscanToken(address: string): string {
  return `${BSCSCAN_BASE}/token/${address}`
}

export function bscscanTx(hash: string): string {
  return `${BSCSCAN_BASE}/tx/${hash}`
}
