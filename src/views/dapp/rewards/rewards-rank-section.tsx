import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import {
  useCommunityFundTotal,
  useQualifiedPartitions,
  useTeamOverview,
} from '~/hooks/use-api-data'
import {
  calcProgressPercent,
  formatPresaleRank,
  formatUsd,
} from '~/lib/api/format-display'
import { buildNextTierProgress } from '~/lib/presale/tier-progress'
import {
  getCommitmentFloorPostLaunchLabel,
  getTeamBonusRateLabel,
  resolveCommitmentFloorBoostCopy,
} from '~/lib/presale/tier-table'
import {
  CurrentTitleCardBodySkeleton,
  ProgressCardSkeleton,
} from '~/app/components/dapp-skeleton'
import { useShareholderRankLabels } from '~/hooks/use-shareholder-rank'
import { SideHint, SideLabel, SideTitle } from '~/app/components/dapp-card'
import {
  dappKickerClass,
  dappRankTitleClass,
} from '~/app/dapp-type-scale'
import { ProgressMeter } from '~/app/components/progress-meter'
import { useDappShell } from '~/app/dapp-shell-context'
import { DappInfoTooltip } from '~/app/components/dapp-info-tooltip'
import { RankTitleWithSuperCommunity } from '~/app/components/rank-title-with-super-community'
import {
  RewardsProgressRow,
  rewardsRankMeta,
  RewardsSideCard,
} from '~/views/dapp/rewards/rewards-widget-primitives'

export function RewardsRankSection() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const {
    displayRank,
    isRankLoading,
    performance,
    performanceLoading,
    personalVolumeUsd,
    rankLabel,
    commitmentFloorRank,
  } = useShareholderRankLabels(t)
  const { data: teamOverview, isLoading: teamOverviewLoading } = useTeamOverview(sessionReady)
  const { data: qualifiedPartitions, isLoading: qualifiedPartitionsLoading } =
    useQualifiedPartitions(sessionReady)
  const { data: communityFundTotal } = useCommunityFundTotal(sessionReady)
  const isSuperCommunity = communityFundTotal?.is_presale_fund_node === true

  if (!sessionReady) return null

  const teamVolumeUsd = Number(teamOverview?.sales_team_market ?? 0)
  const tierProgress = buildNextTierProgress(displayRank, personalVolumeUsd, teamVolumeUsd)
  const nextRankLabel = formatPresaleRank(tierProgress.nextRank)
  const hasRank = displayRank > 0
  const showPostLaunchRank = commitmentFloorRank > 0
  const postLaunchRank = showPostLaunchRank
    ? getCommitmentFloorPostLaunchLabel(commitmentFloorRank)
    : ''
  const postLaunch30DayLabel = showPostLaunchRank
    ? resolveCommitmentFloorBoostCopy(commitmentFloorRank, {
        boostTemplate: t.rewards.postLaunch30DayRank,
        maxRankCopy: t.rewards.postLaunchMaxRank,
      }) ?? ''
    : ''
  const teamRewardRateLabel = t.rewards.teamRewardRate.replace(
    '{rate}',
    getTeamBonusRateLabel(displayRank),
  )
  const leftBottomLabel = hasRank ? teamRewardRateLabel : t.rewards.shareholderNoRankBody

  const personalProgressLabel = tierProgress.isMaxRank
    ? t.rewards.progressMaxPersonal
    : t.rewards.progressPersonalTo.replace('{rank}', nextRankLabel)

  const qualifiedPartitionCount = qualifiedPartitions?.count ?? 0
  const showQualifiedPartitions = displayRank >= 3 && displayRank <= 9
  const teamProgressLabel = t.rewards.teamVolume
  const personalProgressValue = `${formatUsd(tierProgress.personalCurrentUsd)} / ${formatUsd(tierProgress.personalTargetUsd)}`

  const teamProgressValue = showQualifiedPartitions
    ? t.rewards.teamQualifiedPartitionsLabel
        .replace('{rank}', formatPresaleRank(displayRank))
        .replace('{count}', String(qualifiedPartitionCount))
    : tierProgress.isMaxRank
      ? t.rewards.progressMaxTeam
      : tierProgress.teamLegRank != null
        ? `${formatUsd(tierProgress.teamCurrentUsd)} · ${t.rewards.teamLegRequirement.replace(
            '{rank}',
            formatPresaleRank(tierProgress.teamLegRank),
          )}`
        : teamVolumeUsd <= 0
          ? formatUsd(0)
          : `${formatUsd(tierProgress.teamCurrentUsd)} / ${formatUsd(tierProgress.teamTargetUsd ?? 0)}`

  const personalProgressPercent = tierProgress.personalProgressPercent
  const teamProgressPercent = showQualifiedPartitions
    ? calcProgressPercent(qualifiedPartitionCount, 2)
    : tierProgress.isMaxRank
      ? 100
      : tierProgress.teamProgressPercent ?? 0

  const showPerformanceSkeleton =
    (performanceLoading && !performance) ||
    (teamOverviewLoading && !teamOverview) ||
    (qualifiedPartitionsLoading && qualifiedPartitions == null)
  const showTitleSkeleton = isRankLoading

  return (
    <>
      <RewardsSideCard>
        {showTitleSkeleton ? (
          <CurrentTitleCardBodySkeleton />
        ) : (
          <div
            className={cn(
              'grid gap-x-3 gap-y-1.5',
              showPostLaunchRank ? 'grid-cols-2' : 'grid-cols-1',
            )}
          >
            <SideLabel
              className={cn(dappKickerClass, 'max-dapp:text-[length:var(--dapp-type-kicker-size)]')}
              tone="coral"
            >
              {t.rewards.currentTitle}
            </SideLabel>
            {showPostLaunchRank ? (
              <div className="flex items-center justify-end gap-1 self-start">
                <SideLabel
                  className={cn(
                    dappKickerClass,
                    'max-dapp:text-[length:var(--dapp-type-kicker-size)]',
                  )}
                  tone="coral"
                >
                  {t.rewards.postLaunchRankTitle}
                </SideLabel>
                <DappInfoTooltip
                  align="end"
                  content={t.rewards.postLaunchRankTooltip}
                  position="bottom"
                />
              </div>
            ) : null}

            <SideTitle className={cn(dappRankTitleClass, 'max-dapp:leading-[1.2]')}>
              <RankTitleWithSuperCommunity
                isSuperCommunity={hasRank && isSuperCommunity}
                superCommunityLabel={t.rewards.superCommunityBadge}
                title={rankLabel}
              />
            </SideTitle>
            {showPostLaunchRank ? (
              <SideTitle className={cn(dappRankTitleClass, 'text-right max-dapp:leading-[1.2]')}>
                {postLaunchRank}
              </SideTitle>
            ) : null}

            <SideHint className={rewardsRankMeta()} tone="body">
              {leftBottomLabel}
            </SideHint>
            {postLaunch30DayLabel ? (
              <SideHint className={rewardsRankMeta({ align: 'right' })} tone="body">
                {postLaunch30DayLabel}
              </SideHint>
            ) : null}
          </div>
        )}
      </RewardsSideCard>

      {showPerformanceSkeleton ? (
        <RewardsSideCard layout="grid">
          <ProgressCardSkeleton />
        </RewardsSideCard>
      ) : (
        <RewardsSideCard layout="grid">
          <RewardsProgressRow label={personalProgressLabel} value={personalProgressValue} />
          <ProgressMeter label={personalProgressLabel} value={personalProgressPercent} />
          <span aria-hidden="true" className="block h-1" />
          <RewardsProgressRow label={teamProgressLabel} value={teamProgressValue} />
          <ProgressMeter label={teamProgressLabel} value={teamProgressPercent} />
        </RewardsSideCard>
      )}
    </>
  )
}
