import type { UTCTimestamp } from 'lightweight-charts'
import { useState } from 'react'

import { useProtocolMarketStatsChart } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import type { ChartPoint } from '~/shared/components/chart'
import { formatPercentChange, formatUsd } from '~/shared/presenters/format'
import { useDappHostStore } from '~/stores/dapp-host-store'

/**
 * 质押各详情区块的共享文案与状态
 *
 * 提供 i18n 文案、资产页 Tab 跳转、图表时间范围与 TVL 序列等，
 * 供概览 / 仓位 / 记录 / 机制 / 图表 / FAQ 区块复用。
 */
export function useStakingDetail() {
  const { messages: t } = useI18n()
  const selectTab = useDappHostStore((state) => state.selectTab)
  const [chartRange, setChartRange] = useState(t.staking.aside.chartRanges[3] ?? '全部')
  const seriesChart = useProtocolMarketStatsChart(chartRange, t.staking.aside.chartRanges, 'tvl')
  const chartLoading = seriesChart.isLoading && seriesChart.data == null
  const chartPoints: readonly ChartPoint[] = seriesChart.points.map((p) => ({
    time: p.time as UTCTimestamp,
    value: p.value,
  }))

  return {
    t,
    selectTab,
    chartRange,
    setChartRange,
    chartLoading,
    chartPoints,
    chartValueLabel: formatUsd(seriesChart.lastValue),
    chartDeltaLabel: formatPercentChange(seriesChart.percentChange),
    xValue: t.staking.aside.xValue,
    defaultRecordColumns: t.staking.aside.recordColumns,
    defaultRecordsEmpty: t.staking.aside.recordsEmpty.stake,
  }
}
