import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'
import {
  useCommunityFundTotal,
  useQualifiedPartitions,
  useTeamOverview,
} from '~/hooks/use-api-data'
import {
  calcProgressPercent,
  formatPresaleRank,
  formatUsd,
} from '~/shared/api/format-display'
import { buildNextTierProgress } from '~/core/presale/tier-progress'
import {
  getCommitmentFloorPostLaunchLabel,
  getTeamBonusRateLabel,
  resolveCommitmentFloorBoostCopy,
} from '~/core/presale/tier-table'
import {
  CurrentTitleCardBodySkeleton,
  ProgressCardSkeleton,
} from '~/app/shell/components/dapp-skeleton'
import { useShareholderRankLabels } from '~/hooks/use-shareholder-rank'
import { ProgressMeter } from '~/app/shell/components/progress-meter'
import { useDappShell } from '~/app/dapp-shell-context'
import { DappInfoTooltip } from '~/app/shell/components/dapp-info-tooltip'
import { RankTitleWithSuperCommunity } from '~/app/shell/components/rank-title-with-super-community'
import { DappSideCard } from '~/app/shell/components/dapp-card'
import {
  RewardsProgressRow,
  rewardsSideCard,
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
      <DappSideCard className={rewardsSideCard()}>
        {showTitleSkeleton ? (
          <CurrentTitleCardBodySkeleton />
        ) : (
          <div
            className={cn(
              'grid gap-x-3 gap-y-1.5',
              showPostLaunchRank ? 'grid-cols-2' : 'grid-cols-1',
            )}
          >
            <Text
              as="p"
              variant="eyebrow"
              tone="primary"
              className="m-0 max-dapp:text-[length:var(--type-eyebrow-size)]"
            >
              {t.rewards.currentTitle}
            </Text>
            {showPostLaunchRank ? (
              <div className="flex items-center justify-end gap-1 self-start">
                <Text
                  as="p"
                  variant="eyebrow"
                  tone="primary"
                  className="m-0 max-dapp:text-[length:var(--type-eyebrow-size)]"
                >
                  {t.rewards.postLaunchRankTitle}
                </Text>
                <DappInfoTooltip
                  align="end"
                  content={t.rewards.postLaunchRankTooltip}
                  position="bottom"
                />
              </div>
            ) : null}

            <RankTitleWithSuperCommunity
              as="strong"
              className="block max-dapp:leading-[1.2]"
              isSuperCommunity={hasRank && isSuperCommunity}
              superCommunityLabel={t.rewards.superCommunityBadge}
              title={rankLabel}
            />
            {showPostLaunchRank ? (
              <Text
                as="strong"
                variant="brand"
                tone="foreground"
                className="block text-right leading-[1.3] tracking-[-0.34px] max-dapp:leading-[1.2]"
              >
                {postLaunchRank}
              </Text>
            ) : null}

            {/* 4175 rankMeta: text-xs / leading-normal / tracking -0.24 */}
            <Text
              as="small"
              variant="copy"
              tone="muted-foreground"
              className="block text-xs leading-normal"
            >
              {leftBottomLabel}
            </Text>
            {postLaunch30DayLabel ? (
              <Text
                as="small"
                variant="copy"
                tone="muted-foreground"
                className="block text-right text-xs leading-normal"
              >
                {postLaunch30DayLabel}
              </Text>
            ) : null}
          </div>
        )}
      </DappSideCard>

      {showPerformanceSkeleton ? (
        <DappSideCard className={rewardsSideCard({ layout: 'grid' })}>
          <ProgressCardSkeleton />
        </DappSideCard>
      ) : (
        <DappSideCard className={rewardsSideCard({ layout: 'grid' })}>
          <RewardsProgressRow label={personalProgressLabel} value={personalProgressValue} />
          <ProgressMeter label={personalProgressLabel} value={personalProgressPercent} />
          <span aria-hidden="true" className="block h-1" />
          <RewardsProgressRow label={teamProgressLabel} value={teamProgressValue} />
          <ProgressMeter label={teamProgressLabel} value={teamProgressPercent} />
        </DappSideCard>
      )}
    </>
  )
}
