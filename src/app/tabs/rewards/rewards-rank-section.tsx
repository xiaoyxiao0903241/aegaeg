import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import {
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
  CurrentTitleCardBodySkeleton,
  ProgressCardSkeleton,
} from '~/app/components/dapp-skeleton'
import { useShareholderRankLabels } from '~/hooks/use-shareholder-rank'
import { DappSideCard, SideHint, SideLabel, SideTitle } from '~/app/components/dapp-card'
import { ProgressMeter } from '~/app/components/progress-meter'
import { useDappShell } from '~/app/dapp-shell-context'

export function RewardsRankSection() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const {
    displayRank,
    isRankLoading,
    performance,
    performanceLoading,
    personalVolumeUsd,
    rankHint,
    rankLabel,
  } = useShareholderRankLabels(t)
  const { data: teamOverview, isLoading: teamOverviewLoading } = useTeamOverview(sessionReady)
  const { data: qualifiedPartitions, isLoading: qualifiedPartitionsLoading } =
    useQualifiedPartitions(sessionReady)

  if (!sessionReady) return null

  const teamVolumeUsd = Number(teamOverview?.sales_team_market ?? 0)
  const tierProgress = buildNextTierProgress(displayRank, personalVolumeUsd, teamVolumeUsd)
  const nextRankLabel = formatPresaleRank(tierProgress.nextRank)

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
        <SideLabel
          className="text-[11px] leading-[1.2] tracking-[0.88px] max-dapp:text-[11px]"
          tone="coral"
        >
          {t.rewards.currentTitle}
        </SideLabel>
        {showTitleSkeleton ? (
          <CurrentTitleCardBodySkeleton />
        ) : (
          <>
            <SideTitle className="text-[17px] leading-[1.3] tracking-[-0.34px] max-dapp:text-[17px] max-dapp:leading-[1.2]">
              {rankLabel}
            </SideTitle>
            <SideHint
              className="text-xs leading-normal tracking-[-0.24px] max-dapp:text-faint"
              tone="body"
            >
              {rankHint}
            </SideHint>
          </>
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
