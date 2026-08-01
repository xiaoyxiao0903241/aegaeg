import { useState } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { useDappShellStore } from '~/stores/dapp-shell-store'

export function useStakingDetailAsideView() {
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
