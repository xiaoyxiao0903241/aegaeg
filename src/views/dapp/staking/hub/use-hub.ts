import type { UTCTimestamp } from 'lightweight-charts'
import { useState } from 'react'

import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { isStakePeriod } from '~/core/staking/staking-period'
import {
  baseDailyPctFromEpoch,
  epochRebasePctFrom1e18,
  lockedBonusBps,
  scenarioPeriodYieldPct,
  YIELD_EPOCHS_PER_DAY,
} from '~/core/staking/staking-yield'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useProtocolMarketStatsChart, useStakeAddressCount } from '~/hooks/use-api-data'
import { useAuth } from '~/hooks/use-auth'
import { useChainQuery } from '~/hooks/use-chain-query'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { ChartPoint } from '~/shared/components/chart'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatDecimal, formatPercentChange, toUsd } from '~/shared/presenters/format'
import { formatBonusPct, formatYieldPct } from '~/views/dapp/staking/shared'
import {
  burnBondDepositoryAddress,
  lpBondDepositoryAddress,
} from '~/web3/staking/staking-addresses'
import { formatBondDiscountLabel, readBondMarketMeta } from '~/web3/staking/staking-read'
import {
  useLatestSagxRebaseRateQuery,
  useStakingHubOverviewQuery,
} from '~/web3/staking/use-staking-queries'

/** 可运行周期：稿面固定天数；尚无链上跑道公式。 */
const HUB_RUNWAY_DAYS = 750

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

function formatAgxCompact(wei: bigint | undefined): string {
  const n = wei == null ? null : formatTokenAmountToNumber(wei, AGX_DECIMALS)
  return formatDecimal(n, { compact: true, digits: 2, suffix: ' AGX' })
}

/** 流通量：大数千分位、固定 2 位（缺数 `--`；粉尘 `<0.01`）。 */
function formatAgxGrouped(wei: bigint | undefined): string {
  return formatTokenAmount(wei, AGX_DECIMALS, { digits: 2, trimZeros: false, suffix: ' AGX' })
}

/**
 * 智库储备按 USD1 口径展示（1 USD1 ≈ 1 USD），同时显示 ≈$ 副标。
 * 链上 `totalReserves` 为 AGX 口径价值（9 decimals）→ × AGX/$ 得 USD1 展示量（USD1≈$1）。
 */
function formatTreasuryUsd1(
  reservesAgxWei: bigint | undefined,
  agxPriceUsd: number | null,
): { label: string; usdSub: string } {
  const usd1 = toUsd(
    reservesAgxWei == null ? null : formatTokenAmountToNumber(reservesAgxWei, AGX_DECIMALS),
    agxPriceUsd,
  )
  return {
    label: formatDecimal(usd1, { compact: true, digits: 2, suffix: ' USD1' }),
    usdSub: formatDecimal(usd1, { compact: true, digits: 2, prefix: '≈ $' }),
  }
}

export type HubPeriodTableRow = {
  id: string
  baseDaily: string
  bonus: string
  periodYield: string
}

/**
 * 质押 Hub 详情数据组装
 *
 * 聚合协议概览、周期收益率、图表序列等展示数据；
 * 数据未就绪时各标签为 `--`，真零仍印 `0`。
 *
 * @returns 右栏所需的全部展示字段与状态（概览 / 周期表 / 图表 / 文案）
 */
export function useStakingHubDetail() {
  const { messages: t } = useI18n()
  const { sessionReady } = useAuth()
  const [tableSeg, setTableSeg] = useState('stake')
  const [chartMetric, setChartMetric] = useState('tvl')
  const [chartRange, setChartRange] = useState(t.staking.aside.chartRanges[3] ?? '全部')
  const agxPriceUsd = useAgxPriceUsd()
  const overviewQuery = useStakingHubOverviewQuery()
  const rebaseQuery = useLatestSagxRebaseRateQuery()
  const stakersQuery = useStakeAddressCount(sessionReady)
  const bondKind = tableSeg === 'lpbond' ? 'lp' : tableSeg === 'burnbond' ? 'burn' : null
  const depositoryAddress =
    bondKind === 'burn' ? burnBondDepositoryAddress : lpBondDepositoryAddress
  const market180 = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depositoryAddress('180')),
    scope: 'public',
    freshness: 'quote',
    enabled: bondKind != null,
    queryFn: () => readBondMarketMeta(depositoryAddress('180')),
  })
  const market360 = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depositoryAddress('360')),
    scope: 'public',
    freshness: 'quote',
    enabled: bondKind != null,
    queryFn: () => readBondMarketMeta(depositoryAddress('360')),
  })
  const market540 = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depositoryAddress('540')),
    scope: 'public',
    freshness: 'quote',
    enabled: bondKind != null,
    queryFn: () => readBondMarketMeta(depositoryAddress('540')),
  })

  const agxPriceLabel = formatDecimal(agxPriceUsd, { digits: 2, prefix: '$' })

  const poolAgx =
    overviewQuery.data != null
      ? formatTokenAmountToNumber(overviewQuery.data.poolAgxBalance, AGX_DECIMALS)
      : null
  const circulating =
    overviewQuery.data != null
      ? formatTokenAmountToNumber(overviewQuery.data.circulatingSupply, AGX_DECIMALS)
      : null
  const tvlLabel = formatAgxCompact(overviewQuery.data?.poolAgxBalance)
  const tvlUsdSub = formatDecimal(toUsd(poolAgx, agxPriceUsd), {
    digits: 2,
    prefix: '≈ $',
    compact: true,
  })
  const circulatingLabel = formatAgxGrouped(overviewQuery.data?.circulatingSupply)
  const mcapLabel = formatDecimal(toUsd(circulating, agxPriceUsd), {
    digits: 2,
    prefix: '$',
    compact: true,
  })
  const treasuryDisplay = formatTreasuryUsd1(overviewQuery.data?.totalReserves, agxPriceUsd)
  const burnedLabel = formatAgxCompact(overviewQuery.data?.totalBurned)
  const epochPct = epochRebasePctFrom1e18(rebaseQuery.data?.rebaseRate1e18)
  const rebaseLabel = formatYieldPct(epochPct)
  const baseDaily = baseDailyPctFromEpoch(epochPct, YIELD_EPOCHS_PER_DAY)

  const stakersLabel = formatDecimal(stakersQuery.data?.stake_address_count, {
    digits: 0,
    fraction: 'natural',
  })

  const seriesChart = useProtocolMarketStatsChart(
    chartRange,
    t.staking.aside.chartRanges,
    chartMetric,
  )
  const chartLoading = seriesChart.isLoading && seriesChart.data == null
  const chartPoints: readonly ChartPoint[] = seriesChart.points.map((p) => ({
    time: p.time as UTCTimestamp,
    value: p.value,
    date: p.date,
  }))
  const chartValueLabel = formatDecimal(seriesChart.lastValue, {
    digits: 2,
    prefix: '$',
    compact: true,
  })
  const chartDeltaLabel = formatPercentChange(seriesChart.percentChange)

  const periodTableRows: Record<string, HubPeriodTableRow> = Object.fromEntries(
    t.staking.hub.periodTable.rows.map((row) => {
      const isBond = tableSeg === 'lpbond' || tableSeg === 'burnbond'
      if (tableSeg !== 'stake' && !isBond) {
        return [
          row.id,
          {
            id: row.id,
            baseDaily: formatYieldPct(null),
            bonus: formatBonusPct(null),
            periodYield: formatYieldPct(null),
          },
        ]
      }
      const period = isStakePeriod(row.id) ? row.id : null
      const bondDiscount =
        period === '180'
          ? market180.data?.discountRateBP
          : period === '360'
            ? market360.data?.discountRateBP
            : period === '540'
              ? market540.data?.discountRateBP
              : undefined
      const bonus =
        tableSeg === 'stake' && period != null
          ? formatBonusPct(lockedBonusBps(period))
          : formatBondDiscountLabel(bondDiscount)
      return [
        row.id,
        {
          id: row.id,
          baseDaily: formatYieldPct(baseDaily),
          bonus,
          periodYield: formatYieldPct(
            period == null
              ? null
              : scenarioPeriodYieldPct(
                  epochPct,
                  YIELD_EPOCHS_PER_DAY,
                  period,
                  tableSeg === 'stake' ? 'stake' : 'bond',
                  tableSeg === 'stake' ? undefined : (bondDiscount ?? null),
                ),
          ),
        },
      ]
    }),
  )

  return {
    t,
    tableSeg,
    setTableSeg,
    chartMetric,
    setChartMetric,
    chartRange,
    setChartRange,
    labels: {
      tvl: tvlLabel,
      tvlUsdSub,
      mcap: mcapLabel,
      circulating: circulatingLabel,
      treasury: treasuryDisplay.label,
      treasuryUsdSub: treasuryDisplay.usdSub,
      price: agxPriceLabel,
      burned: burnedLabel,
      rebase: rebaseLabel,
      runway: interpolate(t.staking.hub.runwayDays, { days: HUB_RUNWAY_DAYS }),
      stakers: stakersLabel,
    },
    periodTableRows,
    chartLoading,
    chartPoints,
    chartValueLabel,
    chartDeltaLabel,
    overview: t.staking.hub.overview,
    table: t.staking.hub.periodTable,
    chart: t.staking.hub.chart,
  }
}
