import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { dappIconClass } from '~/app/dapp-icon-scale'
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
  getBoostedPostLaunchRankLabel,
  getPostLaunchRankLabel,
  getTeamBonusRateLabel,
} from '~/lib/presale/tier-table'
import {
  CurrentTitleCardBodySkeleton,
  ProgressCardSkeleton,
} from '~/app/components/dapp-skeleton'
import { useShareholderRankLabels } from '~/hooks/use-shareholder-rank'
import { DappSideCard, SideHint, SideLabel, SideTitle } from '~/app/components/dapp-card'
import {
  dappKickerClass,
  dappRankTitleClass,
} from '~/app/dapp-type-scale'
import { ProgressMeter } from '~/app/components/progress-meter'
import { useDappShell } from '~/app/dapp-shell-context'
import { AnchoredTooltip } from '~/components/anchored-tooltip'
import { RankTitleWithSuperCommunity } from '~/app/components/rank-title-with-super-community'

const rankMetaClass =
  'text-xs font-normal leading-normal tracking-[-0.24px] text-ink-strong max-dapp:text-faint'

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
  const postLaunchRank = getPostLaunchRankLabel(displayRank)
  const boostedPostLaunchRank = getBoostedPostLaunchRankLabel(displayRank)
  const teamRewardRateLabel = t.rewards.teamRewardRate.replace(
    '{rate}',
    getTeamBonusRateLabel(displayRank),
  )
  const postLaunch30DayLabel = t.rewards.postLaunch30DayRank.replace(
    '{rank}',
    boostedPostLaunchRank,
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
      <DappSideCard
        className={cn(
          'gap-1.5 rounded-md px-4 py-3.5',
          '[&_span]:text-xs [&_span]:tracking-[-0.24px]',
        )}
      >
        {showTitleSkeleton ? (
          <CurrentTitleCardBodySkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <SideLabel
              className={cn(dappKickerClass, 'max-dapp:text-[length:var(--dapp-type-kicker-size)]')}
              tone="coral"
            >
              {t.rewards.currentTitle}
            </SideLabel>
            {hasRank ? (
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
                <AnchoredTooltip
                  className="max-w-72"
                  content={t.rewards.postLaunchRankTooltip}
                  position="bottom"
                >
                  <button
                    aria-label={t.rewards.postLaunchRankTooltip}
                    className={cn(
                      'inline-flex shrink-0 items-center justify-center self-center rounded-full border border-current text-xs font-bold leading-none opacity-60',
                      dappIconClass.xs,
                    )}
                    type="button"
                  >
                    i
                  </button>
                </AnchoredTooltip>
              </div>
            ) : (
              <span aria-hidden="true" />
            )}

            <SideTitle className={cn(dappRankTitleClass, 'max-dapp:leading-[1.2]')}>
              <RankTitleWithSuperCommunity
                isSuperCommunity={hasRank && isSuperCommunity}
                superCommunityLabel={t.rewards.superCommunityBadge}
                title={rankLabel}
              />
            </SideTitle>
            {hasRank ? (
              <SideTitle className={cn(dappRankTitleClass, 'text-right max-dapp:leading-[1.2]')}>
                {postLaunchRank}
              </SideTitle>
            ) : (
              <span aria-hidden="true" />
            )}

            <SideHint className={rankMetaClass} tone="body">
              {leftBottomLabel}
            </SideHint>
            {hasRank ? (
              <SideHint className={cn(rankMetaClass, 'text-right')} tone="body">
                {postLaunch30DayLabel}
              </SideHint>
            ) : (
              <span aria-hidden="true" />
            )}
          </div>
        )}
      </DappSideCard>

      {showPerformanceSkeleton ? (
        <DappSideCard
          className={cn(
            'grid gap-1.5 rounded-md px-4 py-3.5',
            '[&_span]:text-xs [&_span]:tracking-[-0.24px]',
          )}
        >
          <ProgressCardSkeleton />
        </DappSideCard>
      ) : (
        <DappSideCard
          className={cn(
            'grid gap-1.5 rounded-md px-4 py-3.5',
            '[&_span]:text-xs [&_span]:tracking-[-0.24px]',
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-normal leading-[1.5] tracking-[-0.24px] text-ink-strong max-dapp:text-faint">
              {personalProgressLabel}
            </span>
            <strong className="text-right text-xs font-semibold leading-[1.3] tracking-[-0.24px] text-foreground max-dapp:leading-[1.2]">
              {personalProgressValue}
            </strong>
          </div>
          <ProgressMeter label={personalProgressLabel} value={personalProgressPercent} />
          <span aria-hidden="true" className="block h-1" />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-normal leading-[1.5] tracking-[-0.24px] text-ink-strong max-dapp:text-faint">
              {teamProgressLabel}
            </span>
            <strong className="text-right text-xs font-semibold leading-[1.3] tracking-[-0.24px] text-foreground max-dapp:leading-[1.2]">
              {teamProgressValue}
            </strong>
          </div>
          <ProgressMeter label={teamProgressLabel} value={teamProgressPercent} />
        </DappSideCard>
      )}
    </>
  )
}
