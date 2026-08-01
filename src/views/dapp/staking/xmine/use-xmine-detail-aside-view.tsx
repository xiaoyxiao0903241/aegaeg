import type { ReactNode } from 'react'

import { useDappShell } from '~/app/use-dapp-shell'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useAssetsHoldingsDistribution, useX0MiningPositions } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapX0MiningPositionToOpsRow } from '~/shared/api/map-flow-log-rows'
import {
  formatAsideGagxLabel,
  formatAsideXLabel,
  parseApiAmount,
} from '~/views/dapp/staking/staking-aside-format'
import { StakingTokenMetricValue } from '~/views/dapp/staking/staking-token-metric-value'

const ZERO_PCT = `${formatGroupedNumber(0, { digits: 2 })}%`
const ZERO_USD = formatGroupedNumber(0, { digits: 2, prefix: '$' })

/**
 * Xmine aside — user stake from `/x0-mining/positions` + holdings-distribution.
 * Protocol TVL / X price / daily yield / next emission: no OpenAPI → honest 0.
 */
export function useXmineDetailAsideView() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const priceUsd = useAgxPriceUsd()
  const positionsQuery = useX0MiningPositions({}, sessionReady)
  const distQuery = useAssetsHoldingsDistribution(sessionReady)

  const overviewItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: t.staking.xmine.overviewMetrics[0]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(0, priceUsd)}
          icon="gagx"
          value={formatAsideGagxLabel(0)}
        />
      ),
    },
    {
      label: t.staking.xmine.overviewMetrics[1]?.label ?? '',
      value: ZERO_USD,
    },
    {
      label: t.staking.xmine.overviewMetrics[2]?.label ?? '',
      value: formatAsideXLabel(0),
    },
    {
      label: t.staking.xmine.overviewMetrics[3]?.label ?? '',
      value: ZERO_PCT,
    },
    {
      label: t.staking.xmine.overviewMetrics[4]?.label ?? '',
      value: formatAsideXLabel(0),
    },
  ]

  const held = parseApiAmount(
    distQuery.data?.stake_x_pool ?? positionsQuery.data?.total_stake_amount,
  )

  const positionItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: t.staking.xmine.positionMetrics[0]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(held, priceUsd)}
          icon="gagx"
          value={formatAsideGagxLabel(held)}
        />
      ),
    },
    {
      label: t.staking.xmine.positionMetrics[1]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(0, priceUsd)}
          icon="gagx"
          value={formatAsideGagxLabel(0)}
        />
      ),
    },
    {
      label: t.staking.xmine.positionMetrics[2]?.label ?? '',
      value: formatAsideXLabel(0),
    },
  ]

  const recordRows = positionsQuery.data?.items.map(mapX0MiningPositionToOpsRow) ?? []
  const recordsLoading = sessionReady && positionsQuery.isLoading && positionsQuery.data == null

  return {
    overviewItems,
    positionItems,
    recordRows,
    recordsLoading,
  }
}
