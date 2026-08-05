/** BSC 出块约 3 秒/块（FAQ 口径），用于质押周期倒计时展示。 */
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

/**
 * 剩余区块数 → 墙钟秒数。
 *
 * 未知区块或已过期（当前块 ≥ 结束块）返回 0，避免倒计时显示负值。
 *
 * @param epochEndBlock 当前 epoch 结束区块号；未知时 undefined
 * @param currentBlock 当前区块号；未知时 undefined
 * @returns 剩余墙钟秒数；任一块未知或已过期返回 0
 */
export function remainingSecFromBlocks(
  epochEndBlock: bigint | undefined,
  currentBlock: bigint | undefined,
): number {
  if (epochEndBlock == null || currentBlock == null) return 0
  const remainingBlocks = epochEndBlock > currentBlock ? Number(epochEndBlock - currentBlock) : 0
  if (!Number.isFinite(remainingBlocks) || remainingBlocks <= 0) return 0
  return Math.floor(remainingBlocks * BSC_BLOCK_SECONDS)
}

/**
 * 剩余秒 → 零垫 HH / MM / SS 三段，供倒计时分段滚动展示。
 *
 * @param totalSec 剩余秒数
 * @returns 三段零垫字符串；非有限或 ≤ 0 时返回全零
 */
export function formatRebaseCountdownParts(totalSec: number): RebaseCountdownParts {
  const safe = Math.max(0, Math.floor(totalSec))
  if (!Number.isFinite(safe) || safe <= 0) return ZERO_PARTS
  return {
    hours: pad2(Math.floor(safe / 3600)),
    minutes: pad2(Math.floor((safe % 3600) / 60)),
    seconds: pad2(safe % 60),
  }
}
