import type { UTCTimestamp } from 'lightweight-charts'
import { useState } from 'react'

import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { isStakePeriod } from '~/core/staking/staking-period'
import {
  baseDailyPctFromEpoch,
  epochRebasePctFrom1e18,
  lockedBonusBps,
  scenarioPeriodYieldPct,
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
import {
  formatCompact,
  formatNumber,
  formatPercentChange,
  formatUsd,
  formatUsdApprox,
} from '~/shared/presenters/format'
import {
  burnBondDepositoryAddress,
  lpBondDepositoryAddress,
} from '~/web3/staking/staking-addresses'
import { formatBondDiscountLabel, readBondMarketMeta } from '~/web3/staking/staking-read'
import {
  useLatestSagxRebaseRateQuery,
  useStakingHubOverviewQuery,
} from '~/web3/staking/use-staking-queries'

const YIELD_EMPTY = `${formatNumber(0, { digits: 2 })}%`
const BONUS_EMPTY = `${formatNumber(0, { digits: 0, trimZeros: true })}%`
/** 可运行周期：稿面固定天数；尚无链上跑道公式。 */
const HUB_RUNWAY_DAYS = 750

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

function formatAgxCompact(wei: bigint | undefined): string {
  if (wei == null) return formatCompact(0, { digits: 2, suffix: ' AGX' })
  const n = formatTokenAmountToNumber(wei, AGX_DECIMALS)
  return formatCompact(n, { digits: 2, suffix: ' AGX' })
}

/** 流通量：大数千分位、固定 2 位（空态 `0.00 AGX`；粉尘 `<0.01`）。 */
function formatAgxGrouped(wei: bigint | undefined): string {
  if (wei == null) return formatNumber(0, { digits: 2, suffix: ' AGX' })
  return `${formatTokenAmount(wei, AGX_DECIMALS, { digits: 2, trimZeros: false })} AGX`
}

/**
 * 智库储备按 USD1 口径展示（1 USD1 ≈ 1 USD），同时显示 ≈$ 副标。
 * 链上 `totalReserves` 为 AGX 口径价值（9 decimals）→ × AGX/$ 得 USD1 展示量（USD1≈$1）。
 */
function formatTreasuryUsd1(
  reservesAgxWei: bigint | undefined,
  agxPriceUsd: number | null,
): { label: string; usdSub: string } {
  const empty = {
    label: formatCompact(0, { digits: 2, suffix: ' USD1' }),
    usdSub: formatNumber(0, { digits: 2, prefix: '≈ $' }),
  }
  if (reservesAgxWei == null || agxPriceUsd == null || !(agxPriceUsd > 0)) return empty
  const agx = formatTokenAmountToNumber(reservesAgxWei, AGX_DECIMALS)
  if (!Number.isFinite(agx)) return empty
  const usd1 = agx * agxPriceUsd
  return {
    label: formatCompact(usd1, { digits: 2, suffix: ' USD1' }),
    usdSub:
      Math.abs(usd1) >= 1_000
        ? formatCompact(usd1, { digits: 2, prefix: '≈ $' })
        : formatNumber(usd1, { digits: 2, prefix: '≈ $' }),
  }
}

function formatYieldPct(pct: number | null): string {
  if (pct == null || !Number.isFinite(pct)) return YIELD_EMPTY
  return `${formatNumber(pct, { digits: 2 })}%`
}

function formatBonusPct(bps: number): string {
  return `${formatNumber(bps / 100, { digits: 0, trimZeros: true })}%`
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
 * 数据未就绪或未连接钱包时各标签回落为 0 或占位文案。
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

  const agxPriceLabel =
    agxPriceUsd != null
      ? formatNumber(agxPriceUsd, { digits: 2, prefix: '$' })
      : formatNumber(0, { digits: 2, prefix: '$' })

  const poolAgx =
    overviewQuery.data != null
      ? formatTokenAmountToNumber(overviewQuery.data.poolAgxBalance, AGX_DECIMALS)
      : null
  const circulating =
    overviewQuery.data != null
      ? formatTokenAmountToNumber(overviewQuery.data.circulatingSupply, AGX_DECIMALS)
      : null
  const tvlLabel = formatAgxCompact(overviewQuery.data?.poolAgxBalance)
  const tvlUsdSub = formatUsdApprox(poolAgx ?? 0, agxPriceUsd, { compact: true })
  const circulatingLabel = formatAgxGrouped(overviewQuery.data?.circulatingSupply)
  const mcapLabel =
    circulating != null && agxPriceUsd != null
      ? formatUsd(circulating * agxPriceUsd)
      : formatUsd(null)
  const treasuryDisplay = formatTreasuryUsd1(overviewQuery.data?.totalReserves, agxPriceUsd)
  const burnedLabel = formatAgxCompact(overviewQuery.data?.totalBurned)
  const epochPct = epochRebasePctFrom1e18(rebaseQuery.data)
  const rebaseLabel = formatYieldPct(epochPct)
  const baseDaily = baseDailyPctFromEpoch(epochPct, overviewQuery.data?.epochsPerDay)

  const stakersLabel = !sessionReady
    ? formatNumber(0, { digits: 0, trimZeros: true })
    : stakersQuery.isLoading && stakersQuery.data == null
      ? formatNumber(0, { digits: 0, trimZeros: true })
      : stakersQuery.data != null
        ? formatNumber(stakersQuery.data.stake_address_count, {
            digits: 0,
            trimZeros: true,
          })
        : formatNumber(0, { digits: 0, trimZeros: true })

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
  const chartValueLabel = formatUsd(seriesChart.lastValue)
  const chartDeltaLabel = formatPercentChange(seriesChart.percentChange)

  const periodTableRows: Record<string, HubPeriodTableRow> = Object.fromEntries(
    t.staking.hub.periodTable.rows.map((row) => {
      const isBond = tableSeg === 'lpbond' || tableSeg === 'burnbond'
      if (tableSeg !== 'stake' && !isBond) {
        return [
          row.id,
          {
            id: row.id,
            baseDaily: YIELD_EMPTY,
            bonus: BONUS_EMPTY,
            periodYield: YIELD_EMPTY,
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
          : bondDiscount != null
            ? formatBondDiscountLabel(bondDiscount)
            : BONUS_EMPTY
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
                  overviewQuery.data?.epochsPerDay,
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
