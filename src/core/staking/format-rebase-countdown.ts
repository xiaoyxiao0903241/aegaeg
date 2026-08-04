/** BSC FAQ / manual: ~3s per block for stake epoch countdown display. */
export const BSC_BLOCK_SECONDS = 3

export type RebaseCountdownParts = {
  hours: string
  minutes: string
  seconds: string
}

const ZERO_PARTS: RebaseCountdownParts = { hours: '00', minutes: '00', seconds: '00' }

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

/** Blocks remaining → wall-clock seconds（3s/block）；未知 / 已过 → 0。 */
export function remainingSecFromBlocks(
  epochEndBlock: bigint | undefined,
  currentBlock: bigint | undefined,
): number {
  if (epochEndBlock == null || currentBlock == null) return 0
  const remainingBlocks = epochEndBlock > currentBlock ? Number(epochEndBlock - currentBlock) : 0
  if (!Number.isFinite(remainingBlocks) || remainingBlocks <= 0) return 0
  return Math.floor(remainingBlocks * BSC_BLOCK_SECONDS)
}

/** 剩余秒 → 零垫 HH / MM / SS 段（供 DigitReel 分段滚动）。 */
export function formatRebaseCountdownParts(totalSec: number): RebaseCountdownParts {
  const safe = Math.max(0, Math.floor(totalSec))
  if (!Number.isFinite(safe) || safe <= 0) return ZERO_PARTS
  return {
    hours: pad2(Math.floor(safe / 3600)),
    minutes: pad2(Math.floor((safe % 3600) / 60)),
    seconds: pad2(safe % 60),
  }
}

/**
 * Format blocks remaining until `epochEndBlock` as `HH 小时 MM 分钟 SS 秒`.
 * Past / unknown → zero countdown (honest empty, not demo clock).
 */
export function formatRebaseCountdown(
  epochEndBlock: bigint | undefined,
  currentBlock: bigint | undefined,
): string {
  const parts = formatRebaseCountdownParts(remainingSecFromBlocks(epochEndBlock, currentBlock))
  return `${parts.hours} 小时 ${parts.minutes} 分钟 ${parts.seconds} 秒`
}
