import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { usePresaleAgxPriceQuery } from '~/web3/presale/use-presale-queries'

const PLACEHOLDER = '—'
const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

export function useStakingHubContentView() {
  const { messages: t } = useI18n()
  const [tableSeg, setTableSeg] = useState('stake')
  const [chartMetric, setChartMetric] = useState('tvl')
  const [chartRange, setChartRange] = useState(t.staking.aside.chartRanges[3] ?? '全部')
  const agxPriceQuery = usePresaleAgxPriceQuery()

  const agxPriceLabel =
    agxPriceQuery.data != null
      ? formatGroupedNumber(formatTokenAmountToNumber(agxPriceQuery.data, USD1_DECIMALS), {
          digits: 2,
          prefix: '$',
        })
      : agxPriceQuery.isPending
        ? '…'
        : PLACEHOLDER

  return {
    t,
    tableSeg,
    setTableSeg,
    chartMetric,
    setChartMetric,
    chartRange,
    setChartRange,
    agxPriceLabel,
    overview: t.staking.hub.overview,
    table: t.staking.hub.periodTable,
    chart: t.staking.hub.chart,
    placeholder: PLACEHOLDER,
  }
}
