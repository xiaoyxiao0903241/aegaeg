import type { Time, UTCTimestamp } from 'lightweight-charts'

import {
  buildCalcYieldCurvePoints,
  CALC_MAX_DAYS,
  calcLocalInterest,
} from '~/core/staking/staking-yield-display'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { Chart, type ChartPoint } from '~/shared/components/chart'
import { Text } from '~/shared/components/text'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'

const PLACEHOLDER = '0.00'

function formatUsdOrDash(value: number) {
  if (!Number.isFinite(value)) return PLACEHOLDER
  return formatGroupedNumber(value, { digits: 2, prefix: '$' })
}

function pickDayAxisLabels(maxDays: number, dayTemplate: string, count = 5): readonly string[] {
  if (maxDays <= 0) return []
  if (count <= 1) return [dayTemplate.replace('{day}', '1')]
  const labels: string[] = []
  for (let i = 0; i < count; i += 1) {
    const day = Math.round(1 + (i / (count - 1)) * (maxDays - 1))
    labels.push(dayTemplate.replace('{day}', String(day)))
  }
  return labels
}

/** Staking 测算累计收益曲线 — Figma ccard `4463:273`；曲线 = 本地公式 day 1..720。 */
export function StakingCurveChart() {
  const { messages: t } = useI18n()
  const aside = t.staking.calc.aside
  const result = useCalcEstimateStore((state) => state.result)

  const curveEndEstimate = result
    ? (() => {
        const est = calcLocalInterest({
          product: result.product,
          period: result.period,
          principal: result.principal,
          days: CALC_MAX_DAYS,
          epochRebasePct: result.epochRebasePct,
        })
        return est.interest * result.price
      })()
    : null

  const curvePoints: readonly ChartPoint[] = result
    ? buildCalcYieldCurvePoints({
        product: result.product,
        period: result.period,
        principal: result.principal,
        price: result.price,
        epochRebasePct: result.epochRebasePct,
        maxDays: CALC_MAX_DAYS,
      }).map((p) => ({
        time: p.day as UTCTimestamp,
        value: p.interestUsd,
      }))
    : []

  const axisLabels = pickDayAxisLabels(CALC_MAX_DAYS, aside.tags.day, 5)

  return (
    <Chart surface="elevated">
      <Chart.Header className="flex-col items-start justify-start gap-3">
        <Text as="p" className="m-0 text-foreground/40" variant="copy">
          {aside.curveHint}
        </Text>
        {curveEndEstimate != null ? (
          <Text as="strong" className="font-semibold" variant="section">
            {formatUsdOrDash(curveEndEstimate)}
          </Text>
        ) : null}
      </Chart.Header>
      {curvePoints.length > 0 ? (
        <Chart.Plot
          axisLabels={axisLabels}
          formatTipDate={(time: Time) => {
            if (typeof time !== 'number') return null
            return aside.tags.day.replace('{day}', String(time))
          }}
          points={curvePoints}
        />
      ) : (
        <div className="flex items-center justify-center rounded-lg py-6">
          <Text as="span" className="text-foreground/40" variant="copy">
            {PLACEHOLDER}
          </Text>
        </div>
      )}
    </Chart>
  )
}
