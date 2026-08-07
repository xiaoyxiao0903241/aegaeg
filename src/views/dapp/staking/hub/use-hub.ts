import type { UTCTimestamp } from 'lightweight-charts'
import { useState } from 'react'

import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import {
  baseDailyPctFromEpoch,
  epochRebasePctFrom1e18,
  lockedBonusBps,
  periodYieldPct,
  stakePeriodDays,
} from '~/core/staking/staking-yield'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useProtocolMarketStatsChart, useStakeAddressCount } from '~/hooks/use-api-data'
import { useAuth } from '~/hooks/use-auth'
import { useI18n } from '~/i18n/use-i18n'
import type { ChartPoint } from '~/shared/components/chart'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import {
  formatCompact,
  formatNumber,
  formatPercentChange,
  formatUsd,
  formatUsdApprox,
} from '~/shared/presenters/format'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'

const YIELD_EMPTY = `${formatNumber(0, { digits: 2 })}%`
const BONUS_EMPTY = `${formatNumber(0, { digits: 0, trimZeros: true })}%`

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

function formatAgxCompact(wei: bigint | undefined): string {
  if (wei == null) return formatCompact(0, { digits: 2, suffix: ' AGX' })
  const n = formatTokenAmountToNumber(wei, AGX_DECIMALS)
  return formatCompact(n, { digits: 2, suffix: ' AGX' })
}

/** 流通量：大数千分位、固定 2 位（空态 `0.00 AGX`）。 */
function formatAgxGrouped(wei: bigint | undefined): string {
  if (wei == null) return formatNumber(0, { digits: 2, suffix: ' AGX' })
  const n = formatTokenAmountToNumber(wei, AGX_DECIMALS)
  return formatNumber(n, { digits: 2, suffix: ' AGX' })
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

function formatRebasePct(rate1e18: bigint | null | undefined): string {
  if (rate1e18 == null) return YIELD_EMPTY
  const pct = formatTokenAmountToNumber(rate1e18, 18)
  if (!Number.isFinite(pct)) return YIELD_EMPTY
  return `${formatNumber(pct, { digits: 2 })}%`
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
  const stakersQuery = useStakeAddressCount(sessionReady)

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
  const rebaseLabel = formatRebasePct(overviewQuery.data?.rebaseRate1e18)

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
  }))
  const chartValueLabel = formatUsd(seriesChart.lastValue)
  const chartDeltaLabel = formatPercentChange(seriesChart.percentChange)

  const epochPct = epochRebasePctFrom1e18(overviewQuery.data?.rebaseRate1e18)
  const baseDaily = baseDailyPctFromEpoch(epochPct, overviewQuery.data?.epochsPerDay)

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
      const bps = tableSeg === 'stake' ? lockedBonusBps(row.id) : 0
      return [
        row.id,
        {
          id: row.id,
          baseDaily: formatYieldPct(baseDaily),
          bonus: formatBonusPct(bps),
          periodYield: formatYieldPct(
            baseDaily == null ? null : periodYieldPct(baseDaily, stakePeriodDays(row.id)),
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
      // 暂无跑道公式 / 链上源，显示未知，不伪造「0 天」。
      runway: t.staking.hub.runwayUnknown,
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
