import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import {
  useCommunityFundTotal,
  useQualifiedPartitions,
  useReferralTotal,
  useTeamOverview,
  useTeamRewardTotal,
} from '~/hooks/use-api-data'
import { formatGroupedNumber, formatPresaleRank } from '~/shared/api/format-display'
import { calcProgressPercent } from '~/core/math/calc-progress-percent'
import { buildNextTierProgress } from '~/core/presale/tier-progress'
import { getTeamBonusRateLabel } from '~/core/presale/tier-table'
import { claimableAmountValue, REWARDS_DASH } from '~/views/dapp/rewards/rewards-display'
import { useShareholderRankLabels } from '~/views/dapp/rewards/use-shareholder-rank'
import { useCommunityFundClaim, useTeamRewardClaim } from '~/views/dapp/rewards/use-claim-reward'
import {
  resolveTeamClaimError,
  resolveWalletTransactionError,
} from '~/web3/resolve-contract-error-message'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'

export function useRewardsGenesisView() {
  const { messages: t } = useI18n()
  const g = t.rewards.genesisDetail
  const { walletReady, sessionReady } = useDappShell()
  const {
    displayRank,
    isRankLoading,
    personalVolumeUsd,
    rankLabel,
    performance,
    performanceLoading,
  } = useShareholderRankLabels(t)
  const { data: teamOverview, isLoading: teamOverviewLoading } = useTeamOverview(sessionReady)
  const { data: qualifiedPartitions, isLoading: partitionsLoading } =
    useQualifiedPartitions(sessionReady)
  const { data: referralTotal, isLoading: referralLoading } = useReferralTotal(sessionReady)
  const { data: teamTotal, isLoading: teamLoading } = useTeamRewardTotal(sessionReady)
  const { data: communityFundTotal, isLoading: communityFundLoading } =
    useCommunityFundTotal(sessionReady)
  const teamClaim = useTeamRewardClaim()
  const communityFundClaim = useCommunityFundClaim()

  const isSuperCommunity = communityFundTotal?.is_presale_fund_node === true
  const hasRank = displayRank > 0
  const teamVolumeUsd = Number(teamOverview?.sales_team_market ?? 0)
  const tierProgress = buildNextTierProgress(displayRank, personalVolumeUsd, teamVolumeUsd)
  const nextRankLabel = formatPresaleRank(tierProgress.nextRank)
  const teamRewardRateLabel = t.rewards.teamRewardRate.replace(
    '{rate}',
    getTeamBonusRateLabel(displayRank),
  )

  const personalProgressLabel = tierProgress.isMaxRank
    ? t.rewards.progressMaxPersonal
    : t.rewards.progressPersonalTo.replace('{rank}', nextRankLabel)
  const personalProgressValue = sessionReady
    ? `${formatGroupedNumber(tierProgress.personalCurrentUsd, { prefix: '$' })} / ${formatGroupedNumber(tierProgress.personalTargetUsd, { prefix: '$' })}`
    : REWARDS_DASH

  const qualifiedPartitionCount = qualifiedPartitions?.count ?? 0
  const showQualifiedPartitions = displayRank >= 3 && displayRank <= 9
  const teamProgressValue = !sessionReady
    ? REWARDS_DASH
    : showQualifiedPartitions
      ? t.rewards.teamQualifiedPartitionsLabel
          .replace('{rank}', formatPresaleRank(displayRank))
          .replace('{count}', String(qualifiedPartitionCount))
      : tierProgress.isMaxRank
        ? t.rewards.progressMaxTeam
        : tierProgress.teamLegRank != null
          ? `${formatGroupedNumber(tierProgress.teamCurrentUsd, { prefix: '$' })} · ${t.rewards.teamLegRequirement.replace(
              '{rank}',
              formatPresaleRank(tierProgress.teamLegRank),
            )}`
          : `${formatGroupedNumber(tierProgress.teamCurrentUsd, { prefix: '$' })} / ${formatGroupedNumber(tierProgress.teamTargetUsd ?? 0, { prefix: '$' })}`

  const personalProgressPercent = sessionReady ? tierProgress.personalProgressPercent : 0
  const teamProgressPercent = !sessionReady
    ? 0
    : showQualifiedPartitions
      ? calcProgressPercent(qualifiedPartitionCount, 2)
      : tierProgress.isMaxRank
        ? 100
        : (tierProgress.teamProgressPercent ?? 0)

  const rankBusy =
    sessionReady &&
    ((isRankLoading && !rankLabel) ||
      (performanceLoading && !performance) ||
      (teamOverviewLoading && !teamOverview) ||
      (partitionsLoading && qualifiedPartitions == null))

  const referralValue = !sessionReady
    ? REWARDS_DASH
    : referralLoading && referralTotal == null
      ? '…'
      : formatGroupedNumber(referralTotal?.claimed ?? referralTotal?.total ?? 0, {
          digits: 2,
          prefix: '$',
        })

  const teamClaimableValue = claimableAmountValue(
    teamTotal?.total ?? '0',
    teamTotal?.claimed ?? '0',
  )
  const teamClaimable = !sessionReady
    ? REWARDS_DASH
    : teamLoading && teamTotal == null
      ? '…'
      : formatGroupedNumber(teamClaimableValue, { digits: 2, prefix: '$' })
  const teamMeta = !sessionReady
    ? REWARDS_DASH
    : teamTotal?.claimed == null
      ? REWARDS_DASH
      : formatGroupedNumber(teamTotal.claimed, { digits: 2, prefix: '$' })

  const communityClaimableValue = Number(communityFundTotal?.unlocked_claimable ?? 0)
  const communityClaimable = !sessionReady
    ? REWARDS_DASH
    : communityFundLoading && communityFundTotal == null
      ? '…'
      : formatGroupedNumber(
          Number.isFinite(communityClaimableValue) ? communityClaimableValue : 0,
          {
            digits: 2,
            prefix: '$',
          },
        )
  const communityLockedMeta = !sessionReady
    ? t.rewards.communityFundLocked.replace('{amount}', REWARDS_DASH)
    : t.rewards.communityFundLocked.replace(
        '{amount}',
        formatGroupedNumber(
          Math.max(
            0,
            Number(communityFundTotal?.total ?? '0') -
              Number(communityFundTotal?.claimed ?? '0') -
              Number(communityFundTotal?.unlocked_claimable ?? '0'),
          ),
          { digits: 2, prefix: '$' },
        ),
      )

  function resolveClaimMessage(error: unknown) {
    return (
      resolveWalletTransactionError(error, t.wallet.transactionErrors) ??
      resolveTeamClaimError(error, {
        ...t.rewards.claimErrors,
        walletNotConnected: t.errors.walletNotConnected,
      }) ??
      t.errors.chain.fallback
    )
  }

  usePresentUserFacingError(teamClaim.error, resolveClaimMessage, {
    id: 'rewards-genesis:team-claim',
    onPresented: teamClaim.clearError,
  })
  usePresentUserFacingError(communityFundClaim.error, resolveClaimMessage, {
    id: 'rewards-genesis:community-fund-claim',
    onPresented: communityFundClaim.clearError,
  })

  function onClaimTeamReward() {
    void teamClaim.claim().then((result) => {
      if (!result) return
      if (result.status === 'confirm_failed') {
        toast.warning(t.rewards.claimErrors.confirmSyncFailed ?? t.rewards.claimSuccess)
        return
      }
      toast.success(t.rewards.claimSuccess)
    })
  }

  function onClaimCommunityFund() {
    void communityFundClaim.claim().then((result) => {
      if (!result) return
      if (result.status === 'confirm_failed') {
        toast.warning(t.rewards.claimErrors.confirmSyncFailed ?? t.rewards.claimSuccess)
        return
      }
      toast.success(t.rewards.claimSuccess)
    })
  }

  return {
    g,
    walletReady,
    sessionReady,
    hasRank,
    isSuperCommunity,
    rankBusy,
    rankLabel,
    teamRewardRateLabel,
    personalProgressLabel,
    personalProgressValue,
    personalProgressPercent,
    teamProgressValue,
    teamProgressPercent,
    referralValue,
    teamClaimable,
    teamMeta,
    teamClaimableValue,
    teamLoading,
    teamClaimIsClaiming: teamClaim.isClaiming,
    teamClaimCanClaim: teamClaim.canClaim,
    onClaimTeamReward,
    communityClaimable,
    communityLockedMeta,
    communityClaimableValue,
    communityFundLoading,
    communityFundClaimIsClaiming: communityFundClaim.isClaiming,
    communityFundClaimCanClaim: communityFundClaim.canClaim,
    onClaimCommunityFund,
  }
}
