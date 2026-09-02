import { type StakePeriod } from '~/core/staking/staking-period'
import { CALC_MAX_DAYS, calcLockDays, type CalcYieldCurvePoint } from '~/core/staking/staking-yield'

export type CalcChartGuideKind = 'selected' | 'period' | 'horizon'

export type CalcChartGuide = {
  kind: CalcChartGuideKind
  day: number
  profitUsd: number
  /** 周期日 / 540 天用空心圆；选中日由 Chart.Plot `mark` 画实心点 */
  marker: 'hollow' | 'none'
  horizontal: boolean
  vertical: boolean
  /** 点上的「第 N 天」；与选中日重合时不画，避免叠两枚 pill */
  showPill: boolean
}

function profitOnDay(points: readonly CalcYieldCurvePoint[], day: number): number | null {
  const hit = points.find((point) => point.day === day)
  return hit == null ? null : hit.profitUsd
}

/**
 * 测算曲线参考点：用户选中日、当前周期、540 天。
 *
 * 不画正收益日。活期 / 挖矿没有锁定期，不画周期竖线和周期空心圆。
 * 周期正好是 540 时，周期与终点合并成一个点（竖线 + 空心圆）。
 * 选中日与周期 / 540 重合时，价签挂在那一个参考点上，避免双份。
 *
 * @param args.points 逐日收益点（day 1…max）
 * @param args.period 当前测算周期
 * @param args.selectedDay 滑杆 / 表单选中日
 * @param args.maxDays 曲线右端，默认 540
 */
export function buildCalcChartGuides(args: {
  points: readonly CalcYieldCurvePoint[]
  period: StakePeriod
  selectedDay: number
  maxDays?: number
}): CalcChartGuide[] {
  const maxDays = args.maxDays ?? CALC_MAX_DAYS
  const lockDays = calcLockDays(args.period)
  const guides: CalcChartGuide[] = []
  const selectedOnLock = lockDays != null && args.selectedDay === lockDays
  const selectedOnHorizon = args.selectedDay === maxDays

  if (!selectedOnLock && !selectedOnHorizon) {
    const profitUsd = profitOnDay(args.points, args.selectedDay)
    if (profitUsd != null) {
      guides.push({
        kind: 'selected',
        day: args.selectedDay,
        profitUsd,
        marker: 'none',
        horizontal: true,
        vertical: false,
        showPill: false,
      })
    }
  }

  if (lockDays != null) {
    const profitUsd = profitOnDay(args.points, lockDays)
    if (profitUsd != null) {
      guides.push({
        kind: lockDays === maxDays ? 'horizon' : 'period',
        day: lockDays,
        profitUsd,
        marker: selectedOnLock ? 'none' : 'hollow',
        horizontal: true,
        vertical: true,
        showPill: !selectedOnLock,
      })
    }
  }

  if (lockDays !== maxDays) {
    const profitUsd = profitOnDay(args.points, maxDays)
    if (profitUsd != null) {
      guides.push({
        kind: 'horizon',
        day: maxDays,
        profitUsd,
        marker: selectedOnHorizon ? 'none' : 'hollow',
        horizontal: true,
        vertical: false,
        showPill: false,
      })
    }
  }

  return guides
}
