import { useAppShell } from '~/app/use-app-shell'
import { calcProgressPercent } from '~/core/math/calc-progress-percent'
import { nextTierProgress } from '~/core/presale/tier-progress'
import { getTeamBonusRateLabel } from '~/core/presale/tier-table'
import {
  useCommunityFundTotal,
  useQualifiedPartitions,
  useReferralTotal,
  useTeamOverview,
  useTeamRewardTotal,
} from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber, formatPresaleRank } from '~/shared/api/format-display'
import {
  claimableAmountValue,
  formatApiDecimalAmount,
  toastClaimResult,
} from '~/views/dapp/rewards/shared'
import { useCommunityFundClaim, useTeamRewardClaim } from '~/views/dapp/rewards/use-claim-reward'
import { useShareholderRankLabels } from '~/views/dapp/rewards/use-shareholder-rank-labels'

/**
 * 创世左栏面板视图模型
 *
 * 聚合股东等级、团队 / 社区基金汇总，计算个人与团队进度、
 * 直推奖励与各可领金额，并封装团队奖励与社区基金领取动作。
 *
 * @see docs/backend-api/api.md #team-reward/total
 */
export function useGenesisDock() {
  const { messages: t } = useI18n()
  const g = t.rewards.genesisDetail
  const { walletReady, sessionReady } = useAppShell()
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
  const tierProgress = nextTierProgress(displayRank, personalVolumeUsd, teamVolumeUsd)
  const nextRankLabel = formatPresaleRank(tierProgress.nextRank)
  const teamRewardRate = getTeamBonusRateLabel(displayRank)
  const teamRewardRatePrefix = t.rewards.teamRewardRate.replace('{rate}', '').trimEnd()
  const teamRewardRateLabel = t.rewards.teamRewardRate.replace('{rate}', teamRewardRate)

  const personalProgressLabel = tierProgress.isMaxRank
    ? t.rewards.progressMaxPersonal
    : t.rewards.progressPersonalTo.replace('{rank}', nextRankLabel)
  const personalProgressValue = sessionReady
    ? `${formatGroupedNumber(tierProgress.personalCurrentUsd, { prefix: '$' })} / ${formatGroupedNumber(tierProgress.personalTargetUsd, { prefix: '$' })}`
    : formatApiDecimalAmount(null)

  const qualifiedPartitionCount = qualifiedPartitions?.count ?? 0
  const showQualifiedPartitions = displayRank >= 3 && displayRank <= 9
  const teamProgressValue = !sessionReady
    ? formatApiDecimalAmount(null)
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
    ? formatApiDecimalAmount(null)
    : referralLoading && referralTotal == null
      ? '0.00'
      : formatGroupedNumber(referralTotal?.claimed ?? referralTotal?.total ?? 0, {
          digits: 2,
          prefix: '$',
        })

  const teamClaimableValue = claimableAmountValue(
    teamTotal?.total ?? '0',
    teamTotal?.claimed ?? '0',
  )
  const teamClaimable = !sessionReady
    ? formatApiDecimalAmount(null)
    : teamLoading && teamTotal == null
      ? '0.00'
      : formatGroupedNumber(teamClaimableValue, { digits: 2, prefix: '$' })
  const teamMeta = !sessionReady
    ? formatApiDecimalAmount(null)
    : teamTotal?.claimed == null
      ? formatApiDecimalAmount(null)
      : formatGroupedNumber(teamTotal.claimed, { digits: 2, prefix: '$' })

  const communityClaimableValue = Number(communityFundTotal?.unlocked_claimable ?? 0)
  const communityClaimable = !sessionReady
    ? formatApiDecimalAmount(null)
    : communityFundLoading && communityFundTotal == null
      ? '0.00'
      : formatGroupedNumber(
          Number.isFinite(communityClaimableValue) ? communityClaimableValue : 0,
          {
            digits: 2,
            prefix: '$',
          },
        )
  const communityLockedMeta = !sessionReady
    ? t.rewards.communityFundLocked.replace('{amount}', formatApiDecimalAmount(null))
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

  function onClaimTeamReward() {
    void teamClaim.claim().then((result) => {
      toastClaimResult(result, {
        claimSuccess: t.rewards.claimSuccess,
        confirmSyncFailed: t.rewards.claimErrors.confirmSyncFailed,
      })
    })
  }

  function onClaimCommunityFund() {
    void communityFundClaim.claim().then((result) => {
      toastClaimResult(result, {
        claimSuccess: t.rewards.claimSuccess,
        confirmSyncFailed: t.rewards.claimErrors.confirmSyncFailed,
      })
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
    teamRewardRatePrefix,
    teamRewardRate,
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
