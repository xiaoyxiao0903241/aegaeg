import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'
import {
  useReferralTotal,
  useRewardLogs,
  useTeamRewardClaimLogs,
  useTeamRewardTotal,
} from '~/hooks/use-api-data'
import {
  formatClaimableAmount,
  formatPresaleRank,
  formatUsd,
  getPresaleRankHighlightedRowsForPage,
  mapRewardLogToRow,
  mapTeamRewardClaimLogToRow,
  resolveRewardTypeI18nKey,
} from '~/lib/api/format-display'
import { REWARDS_PROGRESS_PLACEHOLDERS } from '~/config/rewards-progress'
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
import { toWalletUserFacingMessage } from '~/lib/web3/resolve-contract-error-message'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { dappAssets } from '~/app/assets'
import { buildRewardTierRows, getTeamBonusRateLabel } from '~/lib/presale/tier-table'
import { DAPP_TABLE_PAGE_SIZE, dappTableViewState, paginateStaticRows, tablePageQuery } from '~/lib/table-pagination'
import { DappActionButton } from '~/app/components/dapp-action-button'
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
import { DappTableEmptyState } from '~/app/components/dapp-table-empty-state'
import { DappWidgetFrame } from '~/app/components/dapp-widget-frame'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { FaqList } from '~/components/faq-list'
import { ProgressMeter } from '~/app/components/progress-meter'
import { ResponsiveTable } from '~/app/components/responsive-table'
import { useDappShell } from '~/app/dapp-shell-context'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
const REWARDS_WIDGET_CARD_CLASS = cn(
  'rounded-2xl px-4 py-3.5 max-dapp:mt-0',
  '[&_span]:text-xs [&_span]:tracking-[-0.24px] max-dapp:[&_span]:text-faint',
)

const REWARDS_PROGRESS_CARD_CLASS = cn(
  REWARDS_WIDGET_CARD_CLASS,
  'grid gap-1.5',
)


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
  const teamClaim = useTeamRewardClaim()

  useEffect(() => {
    if (!teamClaim.error) return
    const message = toWalletUserFacingMessage(teamClaim.error)
    if (message) toast.error(message)
  }, [teamClaim.error])

  useEffect(() => {
    if (!sessionReady || !loginError) return
    const message = toWalletUserFacingMessage(loginError)
    if (message) toast.error(message)
  }, [sessionReady, loginError])

  const useProgressPlaceholders = !sessionReady
  const teamVolumeUsd = Number(performance?.sales_team_market ?? 0)
  const tierProgress = buildNextTierProgress(displayRank, personalVolumeUsd, teamVolumeUsd)
  const nextRankLabel = formatPresaleRank(
    useProgressPlaceholders ? REWARDS_PROGRESS_PLACEHOLDERS.nextRank : tierProgress.nextRank,
  )

  const personalProgressLabel = useProgressPlaceholders
    ? t.rewards.progressPersonalTo.replace('{rank}', nextRankLabel)
    : tierProgress.isMaxRank
      ? t.rewards.progressMaxPersonal
      : t.rewards.progressPersonalTo.replace('{rank}', nextRankLabel)

  const teamProgressLabel = useProgressPlaceholders
    ? t.rewards.teamVolume
    : tierProgress.isMaxRank
      ? t.rewards.progressMaxTeam
      : t.rewards.teamVolume

  const personalProgressValue = useProgressPlaceholders
    ? `${formatUsd(REWARDS_PROGRESS_PLACEHOLDERS.personalCurrentUsd)} / ${formatUsd(REWARDS_PROGRESS_PLACEHOLDERS.personalTargetUsd)}`
    : `${formatUsd(tierProgress.personalCurrentUsd)} / ${formatUsd(tierProgress.personalTargetUsd)}`

  const teamProgressValue = useProgressPlaceholders
    ? `${formatUsd(REWARDS_PROGRESS_PLACEHOLDERS.teamCurrentUsd)} / ${formatUsd(REWARDS_PROGRESS_PLACEHOLDERS.teamTargetUsd)}`
    : tierProgress.teamLegRank != null
      ? `${formatUsd(tierProgress.teamCurrentUsd)} · ${t.rewards.teamLegRequirement.replace(
          '{rank}',
          formatPresaleRank(tierProgress.teamLegRank),
        )}`
      : teamVolumeUsd <= 0
        ? formatUsd(0)
        : `${formatUsd(tierProgress.teamCurrentUsd)} / ${formatUsd(tierProgress.teamTargetUsd ?? 0)}`

  const personalProgressPercent = useProgressPlaceholders
    ? REWARDS_PROGRESS_PLACEHOLDERS.personalProgressPercent
    : tierProgress.personalProgressPercent

  const teamProgressPercent = useProgressPlaceholders
    ? REWARDS_PROGRESS_PLACEHOLDERS.teamProgressPercent
    : tierProgress.isMaxRank
      ? 100
      : tierProgress.teamProgressPercent ?? 0

  const showPerformanceSkeleton = sessionReady && performanceLoading && !performance
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
  const titleValue = !sessionReady ? t.rewards.shareholder : rankLabel
  const titleHint = !sessionReady ? t.rewards.shareholderHint : rankHint

  return (
    <DappWidgetFrame
      className="max-dapp:flex max-dapp:flex-col max-dapp:gap-3"
      subtitle={t.rewards.intro}
      title={t.rewards.title}
    >
      <DappSideCard className={REWARDS_WIDGET_CARD_CLASS}>
        <SideLabel tone="coral">{t.rewards.currentTitle}</SideLabel>
        {showTitleSkeleton ? (
          <CurrentTitleCardBodySkeleton />
        ) : (
          <>
            <SideTitle className="max-dapp:text-[17px] max-dapp:tracking-[-0.34px]">
              {titleValue}
            </SideTitle>
            <SideHint
              className="min-h-[2.25rem] line-clamp-2 text-xs tracking-[-0.24px] max-dapp:max-w-none max-dapp:leading-normal max-dapp:text-faint"
              tone="body"
            >
              {titleHint}
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

      {showReferralSkeleton ? (
        <RewardBalanceCardSkeleton />
      ) : (
      <RewardBalanceCard
        badge={t.rewards.autoPaidLabel}
        className={cn(
          REWARDS_WIDGET_CARD_CLASS,
          'mt-2 max-dapp:mt-0',
          '[&_strong]:text-[22px] [&_strong]:tracking-[-0.66px]',
          'max-dapp:[&_small]:hidden',
        )}
        hint={t.rewards.autoPaid}
        label={t.rewards.referralRewards}
        value={referralValue}
      />
      )}

      {showTeamSkeleton ? (
        <RewardBalanceCardSkeleton />
      ) : (
      <RewardBalanceCard
        action={
          <DappActionButton
            className="!min-h-[42px] max-dapp:!min-h-11 max-dapp:!text-sm"
            disabled={teamClaimable === '$0.00' || teamLoading || teamClaim.isClaiming || !teamClaim.canClaim}
            loading={teamClaim.isClaiming}
            onClick={() =>
              void teamClaim.claim().then((ok) => {
                if (!ok) return
                toast.success(t.rewards.claim)
              })
            }
          >
            {t.rewards.claim}
          </DappActionButton>
        }
        className={cn(
          REWARDS_WIDGET_CARD_CLASS,
          'mt-3 max-dapp:mt-0',
          'dapp:[&_strong]:text-lg dapp:[&_strong]:tracking-[-0.54px]',
          'max-dapp:[&_strong]:text-[17px] max-dapp:[&_strong]:tracking-[-0.51px]',
          '[&_button]:mt-3',
        )}
        label={t.rewards.teamRewards}
        meta={teamRewardMeta}
        value={`${teamClaimable} ${t.common.claimable.toLowerCase()}`}
      />
      )}
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
  const [tierPage, setTierPage] = useState(1)
  const bonusRateLabel = getTeamBonusRateLabel(displayRank)
  const { data: rewardLogs, isLoading: rewardLogsLoading } = useRewardLogs(
    tablePageQuery(referralPage),
    sessionReady,
  )
  const { data: teamClaimLogs, isLoading: teamClaimLogsLoading } = useTeamRewardClaimLogs(
    tablePageQuery(teamPage),
    sessionReady,
  )
  const rewardLogLabels = useMemo(
    () => ({
      rewardType: t.rewards.rewardType,
      logStatus: t.rewards.logStatus,
    }),
    [t.rewards.logStatus, t.rewards.rewardType],
  )
  const teamHistoryLabels = useMemo(
    () => ({
      bonusRateLabel,
      claimableLabel: t.common.claimable,
      claimedLabel: t.rewards.logStatus.claimed,
      logStatus: t.rewards.logStatus,
      sourceLabel: t.rewards.teamHistorySource,
    }),
    [bonusRateLabel, t.common.claimable, t.rewards.logStatus, t.rewards.teamHistorySource],
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
  const { rows: pagedTierRows, total: tierTotal } = paginateStaticRows(
    rewardTiers,
    tierPage,
    DAPP_TABLE_PAGE_SIZE,
  )
  const tierHighlightedRows = sessionReady
    ? getPresaleRankHighlightedRowsForPage(displayRank, rewardTiers.length, tierPage, DAPP_TABLE_PAGE_SIZE)
    : getPresaleRankHighlightedRowsForPage(2, rewardTiers.length, tierPage, DAPP_TABLE_PAGE_SIZE)

  const tierHeaders = isMobileViewport
    ? [t.tables.title, t.community.shareholder, t.tables.postLaunchRank]
    : [
        t.tables.title,
        t.community.shareholder,
        t.tables.totalVolume,
        t.tables.postLaunchRank,
      ]

  const tierRows = pagedTierRows.map((row, rowIndex) => {
    const cells = isMobileViewport
      ? [row[0], row[1], row[4]]
      : [row[0], row[1], row[2], row[4]]
    if (tierHighlightedRows.includes(rowIndex)) {
      cells[0] = `${cells[0]} · ${t.rewards.currentTierSuffix}`
    }
    return cells
  })

  const tierTable = (
    <>
      <ResponsiveTable
        compact
        headers={tierHeaders}
        highlightedRows={tierHighlightedRows}
        plain
        rows={tierRows}
      />
      <DappTablePagination onPageChange={setTierPage} page={tierPage} total={tierTotal} />
    </>
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
          t.tables.time,
          t.tables.amount,
          t.tables.source,
          t.tables.contribution,
          t.tables.status,
        ]

  const historyTableRows = historyRows.map((row) => [row[0], row[1], row[2], row[3], row[5]])

  return (
    <DappDetailPage>
      <DappContentHeading id="rewards-title">{t.rewards.heroTitle}</DappContentHeading>

      <section
        className={cn(
          revealClass(),
          'relative mt-3.5 flex min-h-[145px] items-center justify-between gap-6 overflow-visible rounded-2xl bg-dark p-6 text-white shadow-card',
          'max-dapp:hidden',
        )}
        data-reveal
      >
        <div className="relative z-1 min-w-0 flex-1 pr-[148px]">
          <span className="text-[11px] font-bold uppercase tracking-[0.88px] text-coral-bright">
            {t.rewards.heroKicker}
          </span>
          {showHeroSkeleton ? (
            <div className="my-2">
              <RewardsHeroBodySkeleton />
            </div>
          ) : (
            <>
              <h3 className="my-2 text-[21px] font-bold leading-[1.3] tracking-[-0.63px] text-white">
                {heroTitle}
              </h3>
              <p className="m-0 text-[13px] leading-normal tracking-[-0.26px] text-on-dark">
                {heroBody}
              </p>
            </>
          )}
        </div>
        <img
          alt=""
          className="pointer-events-none absolute right-3 top-[-43px] z-0 h-[188px] w-[133px] max-w-[133px] -scale-x-100 object-contain"
          height="156"
          loading="lazy"
          src={dappAssets.rewardsCharacter}
          width="104"
        />
      </section>

      <section
        className={cn(
          'relative mt-3.5 hidden min-h-[127px] overflow-visible rounded-2xl bg-dark p-[18px] text-white shadow-card',
          'max-dapp:flex max-dapp:flex-col max-dapp:gap-2',
        )}
      >
        <div className="relative z-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.88px] text-coral-bright">
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
              <p className="m-0 text-[13px] leading-normal tracking-[-0.26px] text-on-dark">
                {heroBody}
              </p>
            </>
          )}
        </div>
      </section>

      {isMobileViewport ? (
        <DappSection className="group-data-[tab=rewards]/shell:max-dapp:mt-0" title={t.rewards.allTiers}>
          <div className={cn(revealClass(), 'mt-3')} data-reveal>
            {tierTable}
          </div>
        </DappSection>
      ) : (
        <DappCollapsibleSection title={t.rewards.allTiers}>{tierTable}</DappCollapsibleSection>
      )}

      <DappCollapsibleSection title={t.rewards.history}>
        <div className={cn(revealClass(), 'mt-3.5')} data-reveal>
          <DappPillTabs
            ariaLabel={t.rewards.history}
            className="mb-2.5 flex items-center justify-start gap-2"
            items={[
              { active: historyTab === 'referral', label: t.rewards.referralRewards },
              { active: historyTab === 'team', label: t.rewards.teamRewards },
            ]}
            onSelect={(index) => setHistoryTab(index === 0 ? 'referral' : 'team')}
          />
          {historyTable.requiresAuth ? (
            <DappTableEmptyState className="mt-0" />
          ) : historyTable.queryEmpty ? (
            <DappTableEmptyMessage
              body={
                historyTab === 'referral'
                  ? t.rewards.referralHistoryEmpty.body
                  : t.rewards.teamHistoryEmpty.body
              }
              className="mt-0"
              title={
                historyTab === 'referral'
                  ? t.rewards.referralHistoryEmpty.title
                  : t.rewards.teamHistoryEmpty.title
              }
            />
          ) : (
            <>
              <ResponsiveTable
                className="[&_th]:text-faint"
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
