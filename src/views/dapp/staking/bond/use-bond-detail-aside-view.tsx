import type { ReactNode } from 'react'

import { useDappShell } from '~/app/use-dapp-shell'
import { formatRebaseCountdown } from '~/core/staking/format-rebase-countdown'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import {
  useAssetsHoldingsDistribution,
  useAssetsRewardSummary,
  useBondFlowBurnPurchases,
  useBondFlowLpPurchases,
} from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapBondPurchaseToAsideRow } from '~/shared/api/map-flow-log-rows'
import type { BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import {
  formatAsideAgxLabel,
  formatAsideGagxLabel,
  formatAsideRebasePct,
  parseApiAmount,
} from '~/views/dapp/staking/staking-aside-format'
import { StakingTokenMetricValue } from '~/views/dapp/staking/staking-token-metric-value'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'

const ZERO_PCT = `${formatGroupedNumber(0, { digits: 2 })}%`

/**
 * Bond detail aside — protocol rebase from StakingPool; user bond AGX from
 * assets holdings-distribution; purchase rows from bond-flow purchases.
 * Protocol bond TVL / premium: no OpenAPI field → honest 0.
 */
export function useBondDetailAsideView(kind: BondKind) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond
  const priceUsd = useAgxPriceUsd()
  const overviewQuery = useStakingHubOverviewQuery()
  const distQuery = useAssetsHoldingsDistribution(sessionReady)
  const rewardQuery = useAssetsRewardSummary(sessionReady)
  const lpPurchases = useBondFlowLpPurchases({}, sessionReady && kind === 'lp')
  const burnPurchases = useBondFlowBurnPurchases({}, sessionReady && kind === 'burn')
  const purchasesQuery = kind === 'lp' ? lpPurchases : burnPurchases

  const countdown = formatRebaseCountdown(
    overviewQuery.data?.epochEndBlock,
    overviewQuery.data?.currentBlock,
  )
  const rebaseLabel = formatAsideRebasePct(overviewQuery.data?.rebaseRate1e18)

  const overviewItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: copy.overviewMetrics[0]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(0, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(0)}
        />
      ),
    },
    {
      label: copy.overviewMetrics[1]?.label ?? '',
      value: ZERO_PCT,
    },
    {
      label: copy.overviewMetrics[2]?.label ?? '',
      value: countdown,
    },
    {
      label: copy.overviewMetrics[3]?.label ?? '',
      value: rebaseLabel,
    },
  ]

  const held = parseApiAmount(kind === 'lp' ? distQuery.data?.bond_lp : distQuery.data?.bond_burn)
  // No bond-specific released/pending split in OpenAPI — pending = held, released = 0.
  const released = 0
  const pending = held
  const claimableGagx = parseApiAmount(rewardQuery.data?.claimable_gagx)

  const positionItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: copy.positionMetrics[0]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(held, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(held)}
        />
      ),
    },
    {
      label: copy.positionMetrics[1]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(released, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(released)}
        />
      ),
    },
    {
      label: copy.positionMetrics[2]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(pending, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(pending)}
        />
      ),
    },
    {
      label: copy.positionMetrics[3]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(claimableGagx, priceUsd)}
          icon="gagx"
          value={formatAsideGagxLabel(claimableGagx)}
        />
      ),
    },
  ]

  const recordRows = purchasesQuery.data?.items.map(mapBondPurchaseToAsideRow) ?? []
  const recordsLoading = sessionReady && purchasesQuery.isLoading && purchasesQuery.data == null

  return {
    copy,
    overviewItems,
    positionItems,
    recordRows,
    recordsLoading,
  }
}
