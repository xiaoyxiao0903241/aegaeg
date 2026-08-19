import type { UTCTimestamp } from 'lightweight-charts'
import { useState } from 'react'

import { protocolMarketStatsAggregateUnit } from '~/core/staking/protocol-market-stats-series'
import type { CalcProduct } from '~/core/staking/staking-yield'
import { useProtocolMarketStatsAggregateChart } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import type { ChartPoint } from '~/shared/components/chart'
import { formatCompact, formatPercentChange } from '~/shared/presenters/format'
/**
 * 质押各详情区块的共享文案与状态
 *
 * 提供 i18n 文案、图表时间范围与按产品拆开的汇总趋势，
 * 供概览 / 仓位 / 记录 / 机制 / 图表 / FAQ 区块复用。
 *
 * @param product 决定 `aggregate-series` 的 metric 与金额单位
 */
export function useStakingDetail(product: CalcProduct) {
  const { messages: t } = useI18n()
  const [chartRange, setChartRange] = useState(t.staking.aside.chartRanges[3] ?? '全部')
  const seriesChart = useProtocolMarketStatsAggregateChart(
    chartRange,
    t.staking.aside.chartRanges,
    product,
  )
  const chartLoading = seriesChart.isLoading && seriesChart.data == null
  const chartPoints: readonly ChartPoint[] = seriesChart.points.map((p) => ({
    time: p.time as UTCTimestamp,
    value: p.value,
  }))
  const unit = protocolMarketStatsAggregateUnit(seriesChart.metric)

  return {
    t,
    chartRange,
    setChartRange,
    chartLoading,
    chartPoints,
    chartValueLabel: formatCompact(seriesChart.lastValue ?? 0, {
      digits: 2,
      suffix: ` ${unit}`,
    }),
    chartDeltaLabel: formatPercentChange(seriesChart.percentChange),
    xValue: t.staking.aside.xValue,
    defaultRecordColumns: t.staking.aside.recordColumns,
    defaultRecordsEmpty: t.staking.aside.recordsEmpty.stake,
  }
}
