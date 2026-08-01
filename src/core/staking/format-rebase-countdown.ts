/** BSC FAQ / manual: ~3s per block for stake epoch countdown display. */
const BSC_BLOCK_SECONDS = 3

/**
 * Format blocks remaining until `epochEndBlock` as `HH 小时 MM 分钟 SS 秒`.
 * Past / unknown → zero countdown (honest empty, not demo clock).
 */
export function formatRebaseCountdown(
  epochEndBlock: bigint | undefined,
  currentBlock: bigint | undefined,
): string {
  if (epochEndBlock == null || currentBlock == null) {
    return '00 小时 00 分钟 00 秒'
  }
  const remainingBlocks = epochEndBlock > currentBlock ? Number(epochEndBlock - currentBlock) : 0
  if (!Number.isFinite(remainingBlocks) || remainingBlocks <= 0) {
    return '00 小时 00 分钟 00 秒'
  }
  const totalSec = Math.floor(remainingBlocks * BSC_BLOCK_SECONDS)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(hours)} 小时 ${pad(minutes)} 分钟 ${pad(seconds)} 秒`
}
