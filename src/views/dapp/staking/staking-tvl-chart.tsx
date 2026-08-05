import { Chart, type ChartPoint } from '~/shared/components/chart'
import { Segment } from '~/shared/components/segment'
import { Text } from '~/shared/components/text'

/**
 * 质押 TVL / 市值历史图
 *
 * 范围切换与空态文案在本组件内；
 * 序列数据由调用方传入（数据源未接通时为空数组，展示空态）。
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
