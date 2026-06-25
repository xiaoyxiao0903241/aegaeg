import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'
import {
  useQualifiedPartitions,
  useReferralTotal,
  useRewardLogs,
  useTeamOverview,
  useTeamRewardClaimLogs,
  useTeamRewardTotal,
} from '~/hooks/use-api-data'
import {
  calcProgressPercent,
  formatClaimableAmount,
  formatPresaleRank,
  formatUsd,
  getPresaleRankHighlightedRows,
  mapRewardLogToRow,
  mapTeamRewardClaimLogToRow,
  resolveRewardTypeI18nKey,
} from '~/lib/api/format-display'
import { buildNextTierProgress } from '~/lib/presale/tier-progress'
import {
  CurrentTitleCardBodySkeleton,
  ProgressCardSkeleton,
  RewardBalanceCardSkeleton,
  RewardsHeroBodySkeleton,
} from '~/app/components/dapp-skeleton'
import { useAuth } from '~/providers/auth-provider'
import { useShareholderRankLabels } from '~/hooks/use-shareholder-rank'
import { useTeamRewardClaim } from '~/hooks/use-team-reward-claim'
import { toast } from 'sonner'
import { resolveTeamClaimError, toWalletUserFacingMessage } from '~/lib/web3/resolve-contract-error-message'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { dappAssets } from '~/app/assets'
import { buildRewardTierRows, getTeamRequirementLegRank } from '~/lib/presale/tier-table'
import {
  dappTableViewState,
  tablePageQuery,
} from '~/lib/table-pagination'
import { DappActionButton } from '~/app/components/dapp-action-button'
import { DappTableAuthPrompt } from '~/app/components/dapp-table-auth-prompt'
import { DappWidgetConnectPromo } from '~/app/components/dapp-widget-connect-footer'
import {
  DappSideCard,
  RewardBalanceCard,
  SideHint,
  SideLabel,
  SideTitle,
} from '~/app/components/dapp-card'
import { DappCollapsibleSection } from '~/app/components/dapp-collapsible-section'
import { DappSection } from '~/app/components/dapp-section'
import { DappPillTabs } from '~/app/components/dapp-pill-tabs'
import { DappTablePagination } from '~/app/components/dapp-table-pagination'
import { DappTableEmptyMessage } from '~/app/components/dapp-table-empty-message'
import { DappWidgetFrame } from '~/app/components/dapp-widget-frame'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { FaqList } from '~/components/faq-list'
import { ProgressMeter } from '~/app/components/progress-meter'
import { ResponsiveTable } from '~/app/components/responsive-table'
import { useDappShell } from '~/app/dapp-shell-context'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
const REWARDS_WIDGET_CARD_CLASS = cn(
  'rounded-2xl px-4 py-3.5',
  '[&_span]:text-xs [&_span]:tracking-[-0.24px] max-dapp:[&_span]:text-faint',
)

const REWARDS_PROGRESS_CARD_CLASS = cn(
  REWARDS_WIDGET_CARD_CLASS,
  'grid gap-1.5',
)

function formatTierTotalVolumeCell(
  rankLabel: string,
  totalVolumeValue: string,
  tierDualLegRequirement: string,
): string {
  const rank = Number.parseInt(rankLabel.replace(/^S/i, ''), 10)
  const legRank = getTeamRequirementLegRank(rank)
  if (legRank == null) return totalVolumeValue
  return tierDualLegRequirement.replace('{rank}', formatPresaleRank(legRank))
}


export function RewardsWidget() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const {
    displayRank,
    isRankLoading,
    loginError,
    performance,
    performanceLoading,
    personalVolumeUsd,
    rankHint,
    rankLabel,
  } = useShareholderRankLabels(t)
  const { data: referralTotal, isLoading: referralLoading } = useReferralTotal(sessionReady)
  const { data: teamTotal, isLoading: teamLoading } = useTeamRewardTotal(sessionReady)
  const { data: teamOverview, isLoading: teamOverviewLoading } = useTeamOverview(sessionReady)
  const { data: qualifiedPartitions, isLoading: qualifiedPartitionsLoading } =
    useQualifiedPartitions(sessionReady)
  const teamClaim = useTeamRewardClaim()

  useEffect(() => {
    if (!teamClaim.error) return
    const message = resolveTeamClaimError(teamClaim.error, t.rewards.claimErrors)
    if (message) toast.error(message)
  }, [teamClaim.error, t.rewards.claimErrors])

  useEffect(() => {
    if (!sessionReady || !loginError) return
    const message = toWalletUserFacingMessage(loginError)
    if (message) toast.error(message)
  }, [sessionReady, loginError])

  const teamVolumeUsd = Number(teamOverview?.sales_team_market ?? 0)
  const tierProgress = buildNextTierProgress(displayRank, personalVolumeUsd, teamVolumeUsd)
  const nextRankLabel = formatPresaleRank(tierProgress.nextRank)

  const personalProgressLabel = tierProgress.isMaxRank
    ? t.rewards.progressMaxPersonal
    : t.rewards.progressPersonalTo.replace('{rank}', nextRankLabel)

  // For S3-S9, show qualified-partitions progress in the team volume row.
  const qualifiedPartitionCount = qualifiedPartitions?.count ?? 0
  const showQualifiedPartitions = displayRank >= 3 && displayRank <= 9

  const teamProgressLabel = t.rewards.teamVolume

  const personalProgressValue = `${formatUsd(tierProgress.personalCurrentUsd)} / ${formatUsd(tierProgress.personalTargetUsd)}`

  const teamProgressValue = showQualifiedPartitions
    ? t.rewards.teamQualifiedPartitionsLabel
        .replace('{rank}', formatPresaleRank(displayRank))
        .replace('{count}', String(Math.min(qualifiedPartitionCount, 2)))
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
    sessionReady &&
    ((performanceLoading && !performance) ||
      (teamOverviewLoading && !teamOverview) ||
      (qualifiedPartitionsLoading && qualifiedPartitions == null))
  const referralValue = formatUsd(referralTotal?.claimed ?? referralTotal?.total ?? 0, 2)
  const teamClaimable = formatClaimableAmount(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
  const teamRewardMeta = (() => {
    if (teamTotal?.claimed == null) return undefined
    const claimedLine = t.rewards.claimed.replace('{amount}', formatUsd(teamTotal.claimed, 2))
    const breakdown = teamTotal.items
      ?.map((item) => {
        const pending = formatClaimableAmount(item.total, item.claimed)
        const typeKey = resolveRewardTypeI18nKey(item.source_type)
        const typeLabel = t.rewards.rewardType[typeKey]
        return `${typeLabel} ${pending}`
      })
      .filter(Boolean)
      .join(' · ')
    return breakdown ? `${claimedLine} · ${breakdown}` : claimedLine
  })()
  const showReferralSkeleton = sessionReady && referralLoading && referralTotal == null
  const showTeamSkeleton = sessionReady && teamLoading && teamTotal == null
  const showTitleSkeleton = sessionReady && isRankLoading
  const disconnectedReferralValue = formatUsd(0, 2)
  const disconnectedTeamValue = formatUsd(0, 2)
  const disconnectedTeamClaimedMeta = t.rewards.claimed.replace(
    '{amount}',
    disconnectedTeamValue,
  )

  return (
    <DappWidgetFrame subtitle={t.rewards.intro} title={t.rewards.title}>
      {sessionReady ? (
        <>
          <DappSideCard className={REWARDS_WIDGET_CARD_CLASS}>
            <SideLabel tone="coral">{t.rewards.currentTitle}</SideLabel>
            {showTitleSkeleton ? (
              <CurrentTitleCardBodySkeleton />
            ) : (
              <>
                <SideTitle className="max-dapp:text-base max-dapp:tracking-[-0.34px]">
                  {rankLabel}
                </SideTitle>
                <SideHint
                  className="text-xs leading-normal tracking-[-0.24px] max-dapp:max-w-none max-dapp:text-faint"
                  tone="body"
                >
                  {rankHint}
                </SideHint>
              </>
            )}
          </DappSideCard>

          {showPerformanceSkeleton ? (
            <DappSideCard className={REWARDS_PROGRESS_CARD_CLASS}>
              <ProgressCardSkeleton />
            </DappSideCard>
          ) : (
            <DappSideCard className={REWARDS_PROGRESS_CARD_CLASS}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-normal leading-[1.5] text-ink-strong">
                  {personalProgressLabel}
                </span>
                <strong className="mt-0 text-right text-xs font-bold leading-[1.4] text-foreground">
                  {personalProgressValue}
                </strong>
              </div>
              <ProgressMeter
                label={personalProgressLabel}
                value={personalProgressPercent}
              />
              <span aria-hidden="true" className="block h-1" />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-normal leading-[1.5] text-ink-strong">
                  {teamProgressLabel}
                </span>
                <strong className="mt-0 text-right text-xs font-bold leading-[1.4] text-foreground">
                  {teamProgressValue}
                </strong>
              </div>
              <ProgressMeter
                label={teamProgressLabel}
                value={teamProgressPercent}
              />
            </DappSideCard>
          )}
        </>
      ) : null}

      {showReferralSkeleton ? (
        <RewardBalanceCardSkeleton />
      ) : (
      <RewardBalanceCard
        badge={t.rewards.autoPaidLabel}
        className={cn(
          REWARDS_WIDGET_CARD_CLASS,
          '[&_strong]:text-xl [&_strong]:tracking-[-0.66px]',
          'max-dapp:[&_small]:hidden',
        )}
        hint={t.rewards.autoPaid}
        label={t.rewards.referralRewards}
        value={sessionReady ? referralValue : disconnectedReferralValue}
      />
      )}

      {showTeamSkeleton ? (
        <RewardBalanceCardSkeleton />
      ) : sessionReady ? (
      <RewardBalanceCard
        action={
          <DappActionButton
            className="!min-h-10 max-dapp:!min-h-11 max-dapp:!text-sm"
            disabled={
              teamClaimable === '$0.00' ||
              teamLoading ||
              teamClaim.isClaiming ||
              !teamClaim.canClaim
            }
            loading={teamClaim.isClaiming}
            onClick={() =>
              void teamClaim.claim().then((result) => {
                if (!result) return
                const claimedAmount = result.order?.amount
                const message =
                  claimedAmount && Number.isFinite(Number(claimedAmount))
                    ? `${t.rewards.claimSuccess} · +${formatUsd(claimedAmount, 2)}`
                    : t.rewards.claimSuccess
                toast.success(message)
              })
            }
          >
            {t.rewards.claim}
          </DappActionButton>
        }
        className={cn(
          REWARDS_WIDGET_CARD_CLASS,
          'dapp:[&_strong]:text-lg dapp:[&_strong]:tracking-[-0.54px]',
          'max-dapp:[&_strong]:text-base max-dapp:[&_strong]:tracking-[-0.51px]',
          '[&_button]:mt-3',
        )}
        label={t.rewards.teamRewards}
        meta={teamRewardMeta}
        value={`${teamClaimable} ${t.common.claimable.toLowerCase()}`}
      />
      ) : (
      <RewardBalanceCard
        className={cn(
          REWARDS_WIDGET_CARD_CLASS,
          'dapp:[&_strong]:text-lg dapp:[&_strong]:tracking-[-0.54px]',
          'max-dapp:[&_strong]:text-base max-dapp:[&_strong]:tracking-[-0.51px]',
        )}
        label={t.rewards.teamRewards}
        meta={disconnectedTeamClaimedMeta}
        value={disconnectedTeamValue}
      />
      )}

      {!sessionReady ? <DappWidgetConnectPromo /> : null}
    </DappWidgetFrame>
  )
}

export function RewardsContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const isMobileViewport = useMobileViewport()
  const { isLoggingIn } = useAuth()
  const { displayRank, heroBody, heroTitle, isRankLoading } = useShareholderRankLabels(t)
  const showHeroSkeleton = sessionReady && isRankLoading
  const [historyTab, setHistoryTab] = useState<'referral' | 'team'>('referral')
  const [referralPage, setReferralPage] = useState(1)
  const [teamPage, setTeamPage] = useState(1)
  const historyTableScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    historyTableScrollRef.current?.scrollTo({ left: 0, behavior: 'instant' })
  }, [historyTab])

  const {
    data: rewardLogs,
    isLoading: rewardLogsLoading,
    refresh: refreshReferralLogs,
  } = useRewardLogs(tablePageQuery(referralPage), sessionReady)
  const {
    data: teamClaimLogs,
    isLoading: teamClaimLogsLoading,
    refresh: refreshTeamLogs,
  } = useTeamRewardClaimLogs(tablePageQuery(teamPage), sessionReady)
  const rewardLogLabels = useMemo(
    () => ({
      rewardType: t.rewards.rewardType,
      logStatus: t.rewards.logStatus,
    }),
    [t.rewards.logStatus, t.rewards.rewardType],
  )
  const teamHistoryLabels = useMemo(
    () => ({
      logStatus: t.rewards.logStatus,
    }),
    [t.rewards.logStatus],
  )

  const referralHistoryRows =
    rewardLogs?.items.map((item) => mapRewardLogToRow(item, rewardLogLabels)) ?? []
  const teamHistoryRows =
    teamClaimLogs?.items.map((item) => mapTeamRewardClaimLogToRow(item, teamHistoryLabels)) ?? []
  const historyRows = historyTab === 'referral' ? referralHistoryRows : teamHistoryRows
  const historyTotal = historyTab === 'referral'
    ? rewardLogs?.total ?? 0
    : teamClaimLogs?.total ?? 0
  const historyPage = historyTab === 'referral' ? referralPage : teamPage
  const onHistoryPageChange = historyTab === 'referral' ? setReferralPage : setTeamPage
  const historyLoading = historyTab === 'referral' ? rewardLogsLoading : teamClaimLogsLoading
  const historyTable = dappTableViewState({
    sessionReady,
    isLoading: historyLoading,
    isLoggingIn,
    rowCount: historyRows.length,
  })
  const historyShowSkeleton = isLoggingIn || historyTable.showSkeleton

  const rewardTiers = buildRewardTierRows()
  const tierTotal = rewardTiers.length
  const tierHighlightedRows = getPresaleRankHighlightedRows(displayRank, tierTotal)

  const tierHeaders = [
    t.tables.title,
    t.community.shareholder,
    t.tables.totalVolume,
    t.tables.rewardRate,
    t.tables.postLaunchRank,
  ]

  const mapTierRows = (
    sourceRows: ReturnType<typeof buildRewardTierRows>,
    highlightedRows: number[],
  ) =>
    sourceRows.map((row, rowIndex) => {
      const totalVolumeCell = formatTierTotalVolumeCell(
        row[0],
        row[2],
        t.rewards.tierDualLegRequirement,
      )
      const cells = [row[0], row[1], totalVolumeCell, row[3], row[4]]
      if (highlightedRows.includes(rowIndex)) {
        cells[0] = `${cells[0]} · ${t.rewards.currentTierSuffix}`
      }
      return cells
    })

  const tierTable = (
    <ResponsiveTable
      compact
      headers={tierHeaders}
      highlightedRows={tierHighlightedRows}
      plain
      rows={mapTierRows(rewardTiers, tierHighlightedRows)}
    />
  )

  const historyHeaders =
    historyTab === 'referral'
      ? [
          t.tables.time,
          t.tables.amount,
          t.tables.from,
          t.tables.contribution,
          t.tables.status,
        ]
      : [
          t.tables.claimTime,
          t.tables.amount,
          t.tables.genesisRank,
          t.tables.status,
        ]

  const historyTableRows = historyRows.map((row) => row)

  const historyColWidths =
    historyTab === 'referral'
      ? ['132px', '104px', '140px', '120px', '104px']
      : ['160px', '120px', '160px', '160px']

  return (
    <DappDetailPage>
      <DappContentHeading id="rewards-title">{t.rewards.heroTitle}</DappContentHeading>

      <section
          className={cn(
            revealClass(),
            'relative flex min-h-36 items-center justify-between gap-6 overflow-visible rounded-2xl bg-dark p-6 text-white shadow-card',
            'max-dapp:hidden',
          )}
        data-reveal
      >
        <div className="relative z-1 min-w-0 flex-1 pr-36">
          <span className="text-xs font-bold uppercase tracking-[0.88px] text-coral-bright">
            {t.rewards.heroKicker}
          </span>
          {showHeroSkeleton ? (
            <div className="my-2">
              <RewardsHeroBodySkeleton />
            </div>
          ) : (
            <>
              <h3 className="my-2 text-xl font-bold leading-[1.3] tracking-[-0.63px] text-white">
                {heroTitle}
              </h3>
              <p className="m-0 text-xs leading-normal tracking-[-0.26px] text-on-dark">
                {heroBody}
              </p>
            </>
          )}
        </div>
        <img
          alt=""
          className="pointer-events-none absolute right-3 top-[-43px] z-0 h-48 w-32 max-w-32 -scale-x-100 object-contain"
          height="156"
          loading="lazy"
          src={dappAssets.rewardsCharacter}
          width="104"
        />
      </section>

      <section
        className={cn(
          'relative hidden min-h-32 overflow-visible rounded-2xl bg-dark p-4.5 text-white shadow-card',
          'max-dapp:flex max-dapp:flex-col max-dapp:gap-2',
        )}
      >
        <div className="relative z-1">
          <span className="text-xs font-bold uppercase tracking-[0.88px] text-coral-bright">
            {t.rewards.heroKicker}
          </span>
          {showHeroSkeleton ? (
            <div className="my-2">
              <RewardsHeroBodySkeleton compact />
            </div>
          ) : (
            <>
              <h3 className="my-2 text-lg font-bold leading-[1.2] tracking-[-0.54px] text-white">
                {heroTitle}
              </h3>
              <p className="m-0 text-xs leading-normal tracking-[-0.26px] text-on-dark">
                {heroBody}
              </p>
            </>
          )}
        </div>
      </section>

      {isMobileViewport ? (
        <DappSection className="group-data-[tab=rewards]/shell:max-dapp:mt-0" title={t.rewards.allTiers}>
          <div className={revealClass()} data-reveal>
            {tierTable}
          </div>
        </DappSection>
      ) : (
        <DappCollapsibleSection bodyClassName="overflow-visible" title={t.rewards.allTiers}>
          {tierTable}
        </DappCollapsibleSection>
      )}

      <DappCollapsibleSection title={t.rewards.history}>
        <div className={cn(revealClass(), 'max-dapp:mt-0')} data-reveal>
          <DappPillTabs
            ariaLabel={t.rewards.history}
            className="mb-2.5 flex items-center justify-start gap-2"
            items={[
              { active: historyTab === 'referral', label: t.rewards.referralRewards },
              { active: historyTab === 'team', label: t.rewards.teamRewards },
            ]}
            onSelect={(index) => {
              const next = index === 0 ? 'referral' : 'team'
              setHistoryTab(next)
              // Re-fetch the selected tab's records on every tab click.
              void (next === 'referral' ? refreshReferralLogs() : refreshTeamLogs())
            }}
          />
          {historyTable.requiresAuth ? (
            <DappTableAuthPrompt
              body={t.dapp.connect.recordsBodyRewards}
            />
          ) : historyTable.queryEmpty ? (
            <DappTableEmptyMessage
              body={
                historyTab === 'referral'
                  ? t.rewards.referralHistoryEmpty.body
                  : t.rewards.teamHistoryEmpty.body
              }
              title={
                historyTab === 'referral'
                  ? t.rewards.referralHistoryEmpty.title
                  : t.rewards.teamHistoryEmpty.title
              }
            />
          ) : (
            <>
              <ResponsiveTable
                ref={historyTableScrollRef}
                className="[&_th]:text-faint"
                colWidths={historyColWidths}
                compact
                headers={historyHeaders}
                isLoading={historyShowSkeleton}
                loadingRowCount={4}
                plain
                positiveColumns={[1]}
                rows={historyTableRows}
              />
              <DappTablePagination
                onPageChange={onHistoryPageChange}
                page={historyPage}
                total={historyTotal}
              />
            </>
          )}
        </div>
      </DappCollapsibleSection>

      <DappCollapsibleSection
        bodyClassName="overflow-visible"
        className="group-data-[tab=rewards]/shell:max-dapp:mt-0"
        title={t.rewards.faq.title}
      >
        <FaqList
          defaultOpenFirst={false}
          items={t.rewards.faq.items}
          variant="dapp"
        />
      </DappCollapsibleSection>
    </DappDetailPage>
  )
}
