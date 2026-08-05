import { useState } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { useDappShellStore } from '~/stores/dapp-shell-store'

/**
 * 质押各详情区块的共享文案与状态
 *
 * 提供 i18n 文案、资产页 Tab 跳转、图表时间范围等，
 * 供概览 / 仓位 / 记录 / 机制 / 图表 / FAQ 区块复用。
 */
export function useStakingDetail() {
  const { messages: t } = useI18n()
  const selectTab = useDappShellStore((state) => state.selectTab)
  const [chartRange, setChartRange] = useState(t.staking.aside.chartRanges[3] ?? '全部')

  return {
    t,
    selectTab,
    chartRange,
    setChartRange,
    xValue: t.staking.aside.xValue,
    defaultRecordColumns: t.staking.aside.recordColumns,
    defaultRecordsEmpty: t.staking.aside.recordsEmpty.stake,
  }
}
