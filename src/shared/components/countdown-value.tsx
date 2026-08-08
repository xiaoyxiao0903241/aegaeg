import { Fragment, type ReactNode } from 'react'

import { CountValue } from '~/shared/components/count-value'
import { BSC_BLOCK_SECONDS } from '~/shared/lib/constants'
import { cn } from '~/shared/lib/utils'

export type CountdownPartId = 'days' | 'hours' | 'minutes' | 'seconds'

export type CountdownPart = {
  id: CountdownPartId
  text: string
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function safeSec(totalSec: number): number {
  const n = Math.floor(totalSec)
  if (!Number.isFinite(n) || n <= 0) return 0
  return n
}

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
  return Math.floor(remainingBlocks * secondsPerBlock)
}

/**
 * 剩余秒 → 倒计时各段文案。
 *
 * @param totalSec 剩余墙钟秒
 * @param units 格式阶梯（大→小）；含 `days` 时「时」为日内，否则为总小时
 * @param trim 是否从最大非 0 单位起裁掉左侧高位 0
 */
export function formatCountdownParts(
  totalSec: number,
  units: readonly CountdownPartId[] = ['hours', 'minutes', 'seconds'],
  trim = true,
): CountdownPart[] {
  const sec = safeSec(totalSec)
  const hasDays = units.includes('days')
  const days = Math.floor(sec / 86_400)
  const hours = hasDays ? Math.floor((sec % 86_400) / 3600) : Math.floor(sec / 3600)
  const minutes = Math.floor((sec % 3600) / 60)
  const seconds = sec % 60

  const byId: Record<CountdownPartId, { value: number; text: string }> = {
    days: { value: days, text: String(days) },
    hours: { value: hours, text: pad2(hours) },
    minutes: { value: minutes, text: pad2(minutes) },
    seconds: { value: seconds, text: pad2(seconds) },
  }

  const ordered = units.map((id) => ({ id, ...byId[id] }))

  if (!trim) {
    return ordered.map(({ id, text }) => ({ id, text }))
  }

  let start = ordered.findIndex((part) => part.value > 0)
  if (start < 0) start = ordered.length - 1
  return ordered.slice(start).map(({ id, text }) => ({ id, text }))
}

/**
 * 分段倒计时：每段数字走 `CountValue` reel。
 *
 * - `units`：格式阶梯（大→小）
 * - `trim`：是否裁掉左侧高位 0
 * - `separators`：按 `units` 从左到右，段与段之间的分隔（已 i18n；含「天」这类单位文案）
 * - `labels`：各段数字后、分隔前的附加文案（如 rebase 的 时/分/秒）
 */
export function CountdownValue({
  totalSec,
  units = ['hours', 'minutes', 'seconds'],
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
