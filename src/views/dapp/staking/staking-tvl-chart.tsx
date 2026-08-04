import { Chart, type ChartPoint } from '~/shared/components/chart'
import { Segment } from '~/shared/components/segment'
import { Text } from '~/shared/components/text'

/**
 * Staking TVL/MCap 历史图 — Figma chart-card `4585:510`。
 * Range / 空态文案在本件；序列由 call site 传入（索引源未通时为空）。
 */
export function StakingTvlChart({
  chartRange,
  deltaLabel,
  emptyLabel,
  points,
  rangeAriaLabel,
  rangeLabels,
  setChartRange,
  surface = 'elevated',
  valueLabel,
}: {
  chartRange: string
  deltaLabel: string
  emptyLabel: string
  points?: readonly ChartPoint[]
  rangeAriaLabel: string
  rangeLabels: readonly string[]
  setChartRange: (value: string) => void
  surface?: 'elevated' | 'outlined'
  valueLabel: string
}) {
  const hasSeries = points != null && points.length > 0

  return (
    <Chart surface={surface}>
      <Chart.Header>
        <div className="flex items-center gap-2">
          {/* Figma chart-card `4585:575` h3=20 → text-xl；delta caption 13 → copy */}
          <Text as="strong" className="text-xl/none font-semibold" variant="copy">
            {valueLabel}
          </Text>
          <Text as="span" className="text-success" variant="copy">
            {deltaLabel}
          </Text>
        </div>
        <Segment
          aria-label={rangeAriaLabel}
          onChange={setChartRange}
          options={rangeLabels.map((label) => ({ label, value: label }))}
          size="sm"
          tone="ink"
          value={chartRange}
        />
      </Chart.Header>
      {hasSeries ? <Chart.Plot points={points} /> : <Chart.Empty title={emptyLabel} />}
    </Chart>
  )
}
