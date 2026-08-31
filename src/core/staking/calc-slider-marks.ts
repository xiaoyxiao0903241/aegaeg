import { type StakePeriod } from '~/core/staking/staking-period'
import { CALC_MAX_DAYS, calcLockDays } from '~/core/staking/staking-yield'

/** 滑杆左端天数；第 1 天起算。 */
export const CALC_SLIDER_MIN_DAY = 1

/** 拖到刻度附近时吸附的天数窗口。 */
export const CALC_SLIDER_SNAP_DAYS = 8

/** 轨下说明距两端不足该内宽百分比则不写字，只留竖线。 */
export const CALC_SLIDER_CAPTION_EDGE_PCT = 12

/** 刻度落入手柄中线附近该内宽百分比则整段不画。 */
export const CALC_SLIDER_CAPTION_THUMB_PCT = 8

/** 轨上中间数字距两端太近则隐藏，避免叠在端点上。 */
export const CALC_SLIDER_TICK_EDGE_DAYS = 20

/** thumb 盖住轨上数字的天数半径（约半个手柄宽）。 */
export const CALC_SLIDER_THUMB_COVER_DAYS = 16

export type CalcSliderMarks = {
  minDay: number
  maxDay: number
  /** 到期日刻度；活期或到期日等于 max 时为 null */
  maturityDay: number | null
  /** 正收益日；未出现或落在端点上为 null */
  breakEvenDay: number | null
}

/**
 * 计算器天数滑杆刻度：轴永远是 1 … max（默认 540），180 约在 1/3。
 *
 * 活期没有到期刻度。正收益日只作标注，不改起点。
 *
 * @param args.period 测算周期
 * @param args.breakEvenDay 收益总额首次 ≥ 0 的天数；未出现为 null
 * @param args.maxDays 滑杆最大天数
 */
export function calcSliderMarks(args: {
  period: StakePeriod
  breakEvenDay: number | null
  maxDays?: number
}): CalcSliderMarks {
  const minDay = CALC_SLIDER_MIN_DAY
  const maxDay = args.maxDays ?? CALC_MAX_DAYS
  const lockDays = calcLockDays(args.period)
  const maturityDay = lockDays != null && lockDays > minDay && lockDays < maxDay ? lockDays : null
  const raw = args.breakEvenDay
  const breakEvenDay = raw != null && raw > minDay && raw < maxDay ? raw : null
  return { minDay, maxDay, maturityDay, breakEvenDay }
}

/**
 * 天数在内宽轴上的百分比。1 → 0%，540 → 100%，180 约 1/3。
 *
 * 这是手柄中线的行程，不含两端半个手柄宽的 padding。
 *
 * @param day 目标天
 * @param maxDay 轴右端
 * @param minDay 轴左端
 */
export function calcSliderPct(day: number, maxDay: number, minDay = CALC_SLIDER_MIN_DAY): number {
  const span = maxDay - minDay
  if (!(span > 0)) return 0
  return ((day - minDay) / span) * 100
}

/**
 * 把内宽上的点击比例换成天数；padding 里的点击钳到端点。
 *
 * @param ratio 相对内宽左缘；落到两端 padding 时钳到 0 或 1
 * @param maxDay 轴右端
 * @param minDay 轴左端
 */
export function calcSliderDayFromRatio(
  ratio: number,
  maxDay: number,
  minDay = CALC_SLIDER_MIN_DAY,
): number {
  const span = maxDay - minDay
  if (!(span > 0)) return minDay
  const t = Math.min(1, Math.max(0, ratio))
  return Math.round(t * span + minDay)
}

/**
 * 轨下刻度显隐：贴边只留竖线；落在手柄下则整段不画。
 *
 * @param day 刻度日
 * @param maxDay 轴右端
 * @param thumbDay 当前手柄天数
 * @param minDay 轴左端
 */
export function calcSliderCaptionVis(
  day: number,
  maxDay: number,
  thumbDay: number,
  minDay = CALC_SLIDER_MIN_DAY,
): { tick: boolean; label: boolean } {
  const markPct = calcSliderPct(day, maxDay, minDay)
  const thumbPct = calcSliderPct(thumbDay, maxDay, minDay)
  if (Math.abs(markPct - thumbPct) <= CALC_SLIDER_CAPTION_THUMB_PCT) {
    return { tick: false, label: false }
  }
  const label =
    markPct >= CALC_SLIDER_CAPTION_EDGE_PCT && markPct <= 100 - CALC_SLIDER_CAPTION_EDGE_PCT
  return { tick: true, label }
}

/**
 * 拖动时吸附到期日或正收益日。已经在 1 / max 上不再吸走，否则贴边刻度会挡住端点。
 *
 * @param day 当前天数
 * @param marks 刻度
 */
export function snapCalcSliderDay(day: number, marks: CalcSliderMarks): number {
  if (day === marks.minDay || day === marks.maxDay) return day
  const targets = [marks.maturityDay, marks.breakEvenDay].filter(
    (item): item is number => item != null,
  )
  let best: number | null = null
  let bestDist = CALC_SLIDER_SNAP_DAYS
  for (const target of targets) {
    const dist = Math.abs(day - target)
    if (dist <= bestDist) {
      best = target
      bestDist = dist
    }
  }
  return best ?? day
}

/**
 * 轨上是否画出该日数字（端点用左右标签；被 thumb 挡住则藏）。
 *
 * @param day 刻度日
 * @param maxDay 轴右端
 * @param thumbDay 当前手柄天数
 * @param minDay 轴左端
 */
export function showCalcSliderTrackDay(
  day: number,
  maxDay: number,
  thumbDay: number,
  minDay = CALC_SLIDER_MIN_DAY,
): boolean {
  if (!(day > minDay) || !(day < maxDay)) return false
  if (day <= minDay + CALC_SLIDER_TICK_EDGE_DAYS || day >= maxDay - CALC_SLIDER_TICK_EDGE_DAYS) {
    return false
  }
  return Math.abs(thumbDay - day) > CALC_SLIDER_THUMB_COVER_DAYS
}
