export function formatGasEstimate(gasEstimate: bigint): string {
  if (gasEstimate === 0n) return '—'
  return `~${gasEstimate.toLocaleString('en-US')}`
}
