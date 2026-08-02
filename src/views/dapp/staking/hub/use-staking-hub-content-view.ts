import { useState } from 'react'

import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import {
  baseDailyPctFromEpoch,
  epochRebasePctFrom1e18,
  lockedBonusBps,
  periodYieldPct,
  stakePeriodDays,
} from '~/core/staking/staking-yield-display'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useStakeAddressCount } from '~/hooks/use-api-data'
import { useAuth } from '~/hooks/use-auth'
import { useI18n } from '~/i18n/use-i18n'
import {
  formatApproxCompactUsd,
  formatCompactNumber,
  formatCompactUsd,
  formatGroupedNumber,
  formatSignedPercent,
} from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { TvAreaPoint } from '~/shared/ui/tv-area-chart'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'

const YIELD_EMPTY = `${formatGroupedNumber(0, { digits: 2 })}%`
const BONUS_EMPTY = `${formatGroupedNumber(0, { digits: 0, trimZeros: true })}%`

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

function formatAgxCompact(wei: bigint | undefined): string {
  if (wei == null) return formatCompactNumber(0, { digits: 2, suffix: ' AGX' })
  const n = formatTokenAmountToNumber(wei, AGX_DECIMALS)
  return formatCompactNumber(n, { digits: 2, suffix: ' AGX' })
}

/** 流通量：大数千分位、固定 2 位（空态 `0.00 AGX`）。 */
function formatAgxGrouped(wei: bigint | undefined): string {
  if (wei == null) return formatGroupedNumber(0, { digits: 2, suffix: ' AGX' })
  const n = formatTokenAmountToNumber(wei, AGX_DECIMALS)
  return formatGroupedNumber(n, { digits: 2, suffix: ' AGX' })
}

function formatRebasePct(rate1e18: bigint | null | undefined): string {
  if (rate1e18 == null) return YIELD_EMPTY
  const pct = formatTokenAmountToNumber(rate1e18, 18)
  if (!Number.isFinite(pct)) return YIELD_EMPTY
  return `${formatGroupedNumber(pct, { digits: 2 })}%`
}

function formatYieldPct(pct: number | null): string {
  if (pct == null || !Number.isFinite(pct)) return YIELD_EMPTY
  return `${formatGroupedNumber(pct, { digits: 2 })}%`
}

function formatBonusPct(bps: number): string {
  return `${formatGroupedNumber(bps / 100, { digits: 0, trimZeros: true })}%`
}

export type HubPeriodTableRow = {
  id: string
  baseDaily: string
  bonus: string
  periodYield: string
}

export function useStakingHubContentView() {
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
      ? formatGroupedNumber(agxPriceUsd, { digits: 2, prefix: '$' })
      : formatGroupedNumber(0, { digits: 2, prefix: '$' })

  const poolAgx =
    overviewQuery.data != null
      ? formatTokenAmountToNumber(overviewQuery.data.poolAgxBalance, AGX_DECIMALS)
      : null
  const circulating =
    overviewQuery.data != null
      ? formatTokenAmountToNumber(overviewQuery.data.circulatingSupply, AGX_DECIMALS)
      : null
  const treasury =
    overviewQuery.data != null
      ? formatTokenAmountToNumber(overviewQuery.data.totalReserves, AGX_DECIMALS)
      : null

  const tvlLabel = formatAgxCompact(overviewQuery.data?.poolAgxBalance)
  const tvlUsdSub = formatApproxCompactUsd(poolAgx ?? 0, agxPriceUsd)
  const circulatingLabel = formatAgxGrouped(overviewQuery.data?.circulatingSupply)
  const mcapLabel =
    circulating != null && agxPriceUsd != null
      ? formatCompactUsd(circulating * agxPriceUsd)
      : formatCompactUsd(null)
  const treasuryLabel = formatAgxCompact(overviewQuery.data?.totalReserves)
  const treasuryUsdSub = formatApproxCompactUsd(treasury ?? 0, agxPriceUsd)
  const burnedLabel = formatAgxCompact(overviewQuery.data?.totalBurned)
  const rebaseLabel = formatRebasePct(overviewQuery.data?.rebaseRate1e18)

  const stakersLabel = !sessionReady
    ? formatGroupedNumber(0, { digits: 0, trimZeros: true })
    : stakersQuery.isLoading && stakersQuery.data == null
      ? formatGroupedNumber(0, { digits: 0, trimZeros: true })
      : stakersQuery.data != null
        ? formatGroupedNumber(stakersQuery.data.stake_address_count, {
            digits: 0,
            trimZeros: true,
          })
        : formatGroupedNumber(0, { digits: 0, trimZeros: true })

  // No history indexer/API yet — empty series; header stays formatted `$0.00` / `+0.0%`.
  const chartPoints: readonly TvAreaPoint[] = []
  const chartValueLabel = formatCompactUsd(null)
  const chartDeltaLabel = formatSignedPercent(null)

  const epochPct = epochRebasePctFrom1e18(overviewQuery.data?.rebaseRate1e18)
  const baseDaily = baseDailyPctFromEpoch(epochPct)

  const periodTableRows: Record<string, HubPeriodTableRow> = Object.fromEntries(
    t.staking.hub.periodTable.rows.map((row) => {
      if (tableSeg !== 'stake') {
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
      const bps = lockedBonusBps(row.id)
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
      treasury: treasuryLabel,
      treasuryUsdSub,
      price: agxPriceLabel,
      burned: burnedLabel,
      rebase: rebaseLabel,
      // No runway formula / on-chain source yet — honest unknown (not fake "0 days").
      runway: t.staking.hub.runwayUnknown,
      stakers: stakersLabel,
    },
    periodTableRows,
    chartPoints,
    chartValueLabel,
    chartDeltaLabel,
    overview: t.staking.hub.overview,
    table: t.staking.hub.periodTable,
    chart: t.staking.hub.chart,
  }
}
