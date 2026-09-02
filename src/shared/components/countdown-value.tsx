import { Fragment, type ReactNode, useEffect, useState } from 'react'

import { type CountdownPartId, formatCountdownParts } from '~/core/format-countdown'
import { CountValue } from '~/shared/components/count-value'
import { BSC_BLOCK_SECONDS } from '~/shared/lib/constants'
import { cn } from '~/shared/lib/utils'
import { useWallClockSec, useWallClockStore } from '~/stores/wall-clock-store'

/** 链读与墙钟偏差超过此值才重锚定（避免 refetch 抖动）。 */
const RESYNC_DRIFT_SEC = 3

/**
 * 剩余区块数 → 墙钟秒数。
 *
 * 未知区块或已过期（当前块 ≥ 结束块）返回 0，避免倒计时显示负值。
 *
 * @param epochEndBlock 当前 epoch 结束区块号；未知时 undefined
 * @param currentBlock 当前区块号；未知时 undefined
 * @param secondsPerBlock 每块秒数；缺省用 BSC_BLOCK_SECONDS
 * @returns 剩余墙钟秒数；任一块未知或已过期返回 0
 */
export function remainingSecFromBlocks(
  epochEndBlock: bigint | undefined,
  currentBlock: bigint | undefined,
  secondsPerBlock: number = BSC_BLOCK_SECONDS,
): number {
  if (epochEndBlock == null || currentBlock == null) return 0
  if (!(secondsPerBlock > 0) || !Number.isFinite(secondsPerBlock)) return 0
  const remainingBlocks = epochEndBlock > currentBlock ? Number(epochEndBlock - currentBlock) : 0
  if (!Number.isFinite(remainingBlocks) || remainingBlocks <= 0) return 0
  const sec = Math.floor(remainingBlocks * secondsPerBlock)
  // 亚秒剩余块 floor 成 0 会看起来已到期
  return sec > 0 ? sec : 1
}

/**
 * 剩余 epoch 数 → 墙钟秒数。
 *
 * 当前 epoch 用剩余块估秒，后面每个整 epoch 用 length × 秒/块。
 * 缺块高或（跨 epoch 时）缺 length 返回 null，避免假装已到期。
 *
 * @param remainingEpochs 距到期还要跨过的 epoch 数（expiry − number）
 * @param epochEndBlock 当前 epoch 结束区块
 * @param currentBlock 当前区块
 * @param epochLengthBlocks 单 epoch 区块数；只剩 1 个 epoch 时可不传
 * @param secondsPerBlock 每块秒数；缺省用 BSC_BLOCK_SECONDS
 * @returns 估算剩余秒；入参不足返回 null；已到期返回 0
 */
export function remainingSecFromEpochs(
  remainingEpochs: bigint | number | null | undefined,
  epochEndBlock: bigint | undefined,
  currentBlock: bigint | undefined,
  epochLengthBlocks: bigint | undefined,
  secondsPerBlock: number = BSC_BLOCK_SECONDS,
): number | null {
  if (remainingEpochs == null) return null
  const epochs = typeof remainingEpochs === 'bigint' ? Number(remainingEpochs) : remainingEpochs
  if (!Number.isFinite(epochs)) return null
  if (epochs <= 0) return 0
  if (!(secondsPerBlock > 0) || !Number.isFinite(secondsPerBlock)) return null
  if (epochEndBlock == null || currentBlock == null) return null

  const thisEpochSec = remainingSecFromBlocks(epochEndBlock, currentBlock, secondsPerBlock)
  if (epochs === 1) return thisEpochSec

  if (epochLengthBlocks == null) return null
  const length = Number(epochLengthBlocks)
  if (!(length > 0) || !Number.isFinite(length)) return null
  const laterSec = (epochs - 1) * length * secondsPerBlock
  if (!Number.isFinite(laterSec) || laterSec < 0) return null
  return thisEpochSec + Math.floor(laterSec)
}

/**
 * 把链上估出的剩余秒锚定到墙钟，每秒滴答；链读变化超过漂移才重锚定。
 *
 * @param chainRemainingSec 链上块/epoch 估出的剩余秒
 * @param enabled 是否订阅墙钟；false 时不滴答、返回 0
 */
export function useAnchoredRemainingSec(chainRemainingSec: number, enabled = true): number {
  const nowSec = useWallClockSec(enabled)
  const [endAtSec, setEndAtSec] = useState(() => nowSec + chainRemainingSec)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      const now = useWallClockStore.getState().nowSec
      setEndAtSec((prev) => {
        const wallRemaining = Math.max(0, prev - now)
        if (Math.abs(wallRemaining - chainRemainingSec) <= RESYNC_DRIFT_SEC) return prev
        return now + chainRemainingSec
      })
    })
    return () => {
      cancelled = true
    }
  }, [chainRemainingSec, enabled])

  if (!enabled) return 0
  return Math.max(0, endAtSec - nowSec)
}

/**
 * 分段倒计时：每段数字走 `CountValue` reel。
 *
 * - `units`：格式阶梯（大→小）
 * - `trim`：是否裁掉左侧高位 0
 * - `separators`：按 `units` 从左到右，段与段之间的分隔（已 i18n；含「天」这类单位文案）
 * - `labels`：各段数字后、分隔前的附加文案（如 rebase 的 时/分）
 */
export function CountdownValue({
  totalSec,
  units = ['hours', 'minutes'],
  trim = true,
  separators,
  labels,
  animate = true,
  className,
}: {
  totalSec: number
  units?: readonly CountdownPartId[]
  trim?: boolean
  /** 与 `units` 同序的段间分隔，长度应为 `units.length - 1` */
  separators?: readonly ReactNode[]
  labels?: Partial<Record<CountdownPartId, ReactNode>>
  animate?: boolean
  className?: string
}) {
  const parts = formatCountdownParts(totalSec, units, trim)

  return (
    <span className={cn('inline-flex flex-wrap items-baseline tabular-nums', className)}>
      {parts.map((part, index) => {
        const prev = index > 0 ? parts[index - 1] : null
        const gapAt = prev != null ? units.indexOf(prev.id) : -1
        const sep = gapAt >= 0 ? separators?.[gapAt] : null

        return (
          <Fragment key={part.id}>
            {sep != null && sep !== '' ? <span aria-hidden>{sep}</span> : null}
            <CountValue animate={animate} text={part.text} />
            {labels?.[part.id] != null ? <span>{labels[part.id]}</span> : null}
          </Fragment>
        )
      })}
    </span>
  )
}
