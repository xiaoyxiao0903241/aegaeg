import type { ReactNode } from 'react'

import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatRebaseCountdown } from '~/core/staking/format-rebase-countdown'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import {
  useAssetsHoldingsDistribution,
  useAssetsHoldingsSummary,
  useAssetsRewardSummary,
  useStakeFlowPositions,
} from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd } from '~/shared/api/format-display'
import { mapStakePositionToAsideRow } from '~/shared/api/map-flow-log-rows'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import {
  formatAsideAgxLabel,
  formatAsideGagxLabel,
  formatAsideRebasePct,
  parseApiAmount,
} from '~/views/dapp/staking/staking-aside-format'
import { StakingTokenMetricValue } from '~/views/dapp/staking/staking-token-metric-value'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/**
 * Stake detail aside — protocol overview from StakingPool/sAGX;
 * user positions from assets + stake-flow APIs (OpenAPI).
 */
export function useStakeDetailAsideView() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const priceUsd = useAgxPriceUsd()
  const overviewQuery = useStakingHubOverviewQuery()
  const positionsQuery = useStakeFlowPositions({}, sessionReady)
  const holdingsQuery = useAssetsHoldingsSummary(sessionReady)
  const rewardQuery = useAssetsRewardSummary(sessionReady)
  const distQuery = useAssetsHoldingsDistribution(sessionReady)

  const poolAgx =
    overviewQuery.data != null
      ? formatTokenAmountToNumber(overviewQuery.data.poolAgxBalance, AGX_DECIMALS)
      : 0
  const epochNumber = overviewQuery.data?.epochNumber ?? 0n
  const rebaseLabel = formatAsideRebasePct(overviewQuery.data?.rebaseRate1e18)
  const countdown = formatRebaseCountdown(
    overviewQuery.data?.epochEndBlock,
    overviewQuery.data?.currentBlock,
  )

  const overviewItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: t.staking.stake.overviewMetrics[0]?.label ?? '总质押量',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(poolAgx, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(poolAgx)}
        />
      ),
    },
    {
      label: t.staking.stake.overviewMetrics[1]?.label ?? '当前 Epoch',
      value: `#${epochNumber.toString()}`,
    },
    {
      label: t.staking.stake.overviewMetrics[2]?.label ?? '下一次 Rebase 发放',
      value: countdown,
    },
    {
      label: t.staking.stake.overviewMetrics[3]?.label ?? '当前 Rebase 收益率',
      value: rebaseLabel,
    },
  ]

  const stakeHeld = parseApiAmount(
    distQuery.data?.stake_total_agx ?? positionsQuery.data?.total_stake_amount,
  )
  const stakeReleased = parseApiAmount(holdingsQuery.data?.stake_redeemed_agx)
  const stakePending = Math.max(0, stakeHeld - stakeReleased)
  const claimableGagx = parseApiAmount(rewardQuery.data?.claimable_gagx)
  // No OpenAPI / chain view for rebase-bonus accrual yet.
  const bonusGagx = 0

  const metrics = t.staking.aside.positionMetrics
  const positionItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: metrics[0]?.label ?? '我的持仓',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(stakeHeld, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(stakeHeld)}
        />
      ),
    },
    {
      label: metrics[1]?.label ?? '已释放',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(stakeReleased, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(stakeReleased)}
        />
      ),
    },
    {
      label: metrics[2]?.label ?? '待释放',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(stakePending, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(stakePending)}
        />
      ),
    },
    {
      label: metrics[3]?.label ?? '当前Rebase 收益',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(claimableGagx, priceUsd)}
          icon="gagx"
          value={formatAsideGagxLabel(claimableGagx)}
        />
      ),
    },
    {
      label: metrics[4]?.label ?? '当前Rebase 加成',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(bonusGagx, priceUsd)}
          icon="gagx"
          value={formatAsideGagxLabel(bonusGagx)}
        />
      ),
    },
  ]

  const recordRows = positionsQuery.data?.items.map(mapStakePositionToAsideRow) ?? []
  const recordsLoading = sessionReady && positionsQuery.isLoading && positionsQuery.data == null

  return {
    overviewItems,
    positionItems,
    recordRows,
    recordsLoading,
  }
}
