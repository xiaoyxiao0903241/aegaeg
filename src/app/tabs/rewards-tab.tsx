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
import {
  shellContentPageClass,
  shellWidgetRootClass,
} from '~/app/shell-layout'
import { dappAssets } from '~/app/assets'
import { buildRewardTierRows, getTeamBonusRateLabel } from '~/lib/presale/tier-table'
import { DAPP_TABLE_PAGE_SIZE, paginateStaticRows } from '~/lib/table-pagination'
import type { DetailPanelControls } from '~/app/types'
import { DappActionButton } from '~/app/components/dapp-action-button'
import {
  DappSideCard,
  RewardBalanceCard,
  SideHint,
  SideLabel,
  SideTitle,
  SideValue,
} from '~/app/components/dapp-card'
import { DappCollapsibleSection } from '~/app/components/dapp-collapsible-section'
import { DappSection } from '~/app/components/dapp-section'
import { DappPillTabs } from '~/app/components/dapp-pill-tabs'
import { DappTablePagination } from '~/app/components/dapp-table-pagination'
import { DappTableEmptyMessage } from '~/app/components/dapp-table-empty-message'
import { DappTableEmptyState } from '~/app/components/dapp-table-empty-state'
import { DappPanelHeader } from '~/app/components/dapp-panel-header'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { FaqStack } from '~/app/components/faq-stack'
import { ProgressMeter } from '~/app/components/progress-meter'
import { ResponsiveTable } from '~/app/components/responsive-table'
import { useDappShell } from '~/app/dapp-shell-context'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
const REWARDS_WIDGET_CARD_CLASS = cn(
  'rounded-2xl px-4 py-3.5 max-[820px]:mt-0',
  '[&_span]:text-xs [&_span]:tracking-[-0.24px] max-[820px]:[&_span]:text-faint',
)

const REWARDS_PROGRESS_CARD_CLASS = cn(
  REWARDS_WIDGET_CARD_CLASS,
  'grid gap-1.5',
)

const FAQ_STACK_CLASS = cn(
  'justify-items-start [&_[data-faq-item]]:w-full [&_[data-faq-item]]:max-w-full',
  'max-[820px]:[&_[data-faq-item]]:rounded-[14px] max-[820px]:[&_[data-faq-item]]:border-0 max-[820px]:[&_[data-faq-item]]:px-4 max-[820px]:[&_[data-faq-item]]:shadow-faq',
  'max-[820px]:[&_[data-faq-trigger]]:py-3.5 max-[820px]:[&_[data-faq-trigger]]:text-[13px] max-[820px]:[&_[data-faq-trigger]]:font-normal max-[820px]:[&_[data-faq-trigger]]:text-faq-text',
  'max-[820px]:[&_[data-faq-answer]]:leading-normal',
  '[&_[data-faq-trigger]]:text-sm [&_[data-faq-trigger]]:font-normal [&_[data-faq-trigger]]:text-faq-text',
)

export function RewardsWidget({
  detailPanel,
}: {
  detailPanel: DetailPanelControls
}) {
  const { messages: t } = useI18n()
  const { connected } = useDappShell()
  const isMobileViewport = useMobileViewport()
  const {
    apiEnabled,
    displayRank,
    isRankLoading,
    loginError,
    performance,
    performanceLoading,
    personalVolumeUsd,
    rankHint,
    rankLabel,
  } = useShareholderRankLabels(t)
  const { data: referralTotal, isLoading: referralLoading } = useReferralTotal(apiEnabled)
  const { data: teamTotal, isLoading: teamLoading } = useTeamRewardTotal(apiEnabled)
  const teamClaim = useTeamRewardClaim()

  useEffect(() => {
    if (!teamClaim.error) return
    const message = toWalletUserFacingMessage(teamClaim.error)
    if (message) toast.error(message)
  }, [teamClaim.error])

  useEffect(() => {
    if (!connected || !loginError) return
    const message = toWalletUserFacingMessage(loginError)
    if (message) toast.error(message)
  }, [connected, loginError])

  const useProgressPlaceholders = !connected || !apiEnabled
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

  const showPerformanceSkeleton = connected && apiEnabled && performanceLoading && !performance
  const referralValue = formatUsd(referralTotal?.claimed ?? referralTotal?.total ?? 0, 2)
  const teamClaimable = formatClaimableAmount(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
  const teamRewardMeta = (() => {
    if (teamTotal?.claimed == null) return undefined
    const claimedTemplate = isMobileViewport ? t.rewards.claimedMobile : t.rewards.claimed
    const claimedLine = claimedTemplate.replace('{amount}', formatUsd(teamTotal.claimed, 2))
    if (isMobileViewport) return claimedLine
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
  const showReferralSkeleton = connected && apiEnabled && referralLoading && referralTotal == null
  const showTeamSkeleton = connected && apiEnabled && teamLoading && teamTotal == null
  const showTitleSkeleton = connected && isRankLoading
  const titleValue = !connected ? t.rewards.shareholder : rankLabel
  const titleHint = !connected ? t.rewards.shareholderHint : rankHint

  return (
    <div
      className={cn(
        shellWidgetRootClass,
        'max-[820px]:flex max-[820px]:flex-col max-[820px]:gap-3',
      )}
    >
      <DappPanelHeader
        detailCollapsed={detailPanel.collapsed}
        onTogglePanel={detailPanel.onToggle}
        subtitle={t.rewards.intro}
        title={t.rewards.title}
      />

      <DappSideCard className={REWARDS_WIDGET_CARD_CLASS}>
        <SideLabel tone="coral">{t.rewards.currentTitle}</SideLabel>
        {showTitleSkeleton ? (
          <CurrentTitleCardBodySkeleton />
        ) : (
          <>
            <SideTitle className="max-[820px]:text-[17px] max-[820px]:tracking-[-0.34px]">
              {titleValue}
            </SideTitle>
            <SideHint
              className="min-h-[2.25rem] line-clamp-2 text-xs tracking-[-0.24px] max-[820px]:max-w-none max-[820px]:leading-normal max-[820px]:text-faint"
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
          'mt-2 max-[820px]:mt-0',
          '[&_strong]:text-[22px] [&_strong]:tracking-[-0.66px]',
          'max-[820px]:[&_small]:hidden',
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
            className="!min-h-[42px] max-[820px]:!min-h-11 max-[820px]:!text-sm"
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
          'mt-3 max-[820px]:mt-0',
          'min-[821px]:[&_strong]:text-lg min-[821px]:[&_strong]:tracking-[-0.54px]',
          'max-[820px]:[&_strong]:text-[17px] max-[820px]:[&_strong]:tracking-[-0.51px]',
          '[&_button]:mt-3',
        )}
        label={t.rewards.teamRewards}
        meta={teamRewardMeta}
        value={`${teamClaimable} ${t.common.claimable.toLowerCase()}`}
      />
      )}
    </div>
  )
}

export function RewardsContent() {
  const { messages: t } = useI18n()
  const { connected } = useDappShell()
  const isMobileViewport = useMobileViewport()
  const { isAuthenticated, isLoggingIn } = useAuth()
  const { displayRank, heroBody, heroTitle, isRankLoading } = useShareholderRankLabels(t)
  const showHeroSkeleton = connected && isRankLoading
  const [historyTab, setHistoryTab] = useState<'referral' | 'team'>('referral')
  const [referralPage, setReferralPage] = useState(1)
  const [teamPage, setTeamPage] = useState(1)
  const [tierPage, setTierPage] = useState(1)
  const apiEnabled = connected && isAuthenticated
  const bonusRateLabel = getTeamBonusRateLabel(displayRank)
  const { data: rewardLogs, isLoading: rewardLogsLoading } = useRewardLogs(
    { page: referralPage, page_size: DAPP_TABLE_PAGE_SIZE },
    apiEnabled,
  )
  const { data: teamClaimLogs, isLoading: teamClaimLogsLoading } = useTeamRewardClaimLogs(
    { page: teamPage, page_size: DAPP_TABLE_PAGE_SIZE },
    apiEnabled,
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
  const showHistoryRequiresAuth = !apiEnabled && !isLoggingIn
  const historyRows = historyTab === 'referral' ? referralHistoryRows : teamHistoryRows
  const historyTotal = historyTab === 'referral'
    ? rewardLogs?.total ?? 0
    : teamClaimLogs?.total ?? 0
  const historyPage = historyTab === 'referral' ? referralPage : teamPage
  const onHistoryPageChange = historyTab === 'referral' ? setReferralPage : setTeamPage
  const historyLoading = historyTab === 'referral' ? rewardLogsLoading : teamClaimLogsLoading
  const showHistorySkeleton =
    isLoggingIn ||
    (apiEnabled && historyLoading && historyRows.length === 0)
  const showHistoryQueryEmpty = apiEnabled && !historyLoading && historyRows.length === 0

  const rewardTiers = buildRewardTierRows()
  const { rows: pagedTierRows, total: tierTotal } = paginateStaticRows(
    rewardTiers,
    tierPage,
    DAPP_TABLE_PAGE_SIZE,
  )
  const tierHighlightedRows = connected
    ? getPresaleRankHighlightedRowsForPage(displayRank, rewardTiers.length, tierPage, DAPP_TABLE_PAGE_SIZE)
    : getPresaleRankHighlightedRowsForPage(2, rewardTiers.length, tierPage, DAPP_TABLE_PAGE_SIZE)

  const tierHeaders = isMobileViewport
    ? [t.tables.title, t.community.shareholder, t.tables.bonusRate, t.tables.postLaunchRank]
    : [
        t.tables.title,
        t.community.shareholder,
        t.tables.totalVolume,
        t.tables.bonusRate,
        t.tables.postLaunchRank,
      ]

  const tierRows = pagedTierRows.map((row, rowIndex) => {
    const cells = isMobileViewport
      ? [row[0], row[1], row[3], row[4]]
      : [...row]
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
        positiveColumns={[isMobileViewport ? 2 : 3]}
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
          t.tables.rate,
          t.tables.status,
        ]
      : [
          t.tables.time,
          t.tables.amount,
          t.tables.source,
          t.tables.contribution,
          t.tables.rate,
          t.tables.status,
        ]

  return (
    <div className={shellContentPageClass}>
      <DappContentHeading id="rewards-title">{t.rewards.heroTitle}</DappContentHeading>

      <section
        className={cn(
          revealClass(),
          'relative mt-3.5 flex min-h-[145px] items-center justify-between gap-6 overflow-visible rounded-2xl bg-dark p-6 text-white shadow-card',
          'max-[820px]:hidden',
        )}
        data-reveal
      >
        <div className="relative z-[1] min-w-0 flex-1 pr-[148px]">
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
          'max-[820px]:flex max-[820px]:flex-col max-[820px]:gap-2',
        )}
      >
        <div className="relative z-[1]">
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
        <DappSection className="group-data-[tab=rewards]/shell:max-[820px]:mt-0" title={t.rewards.allTiers}>
          <div className={cn(revealClass(), 'mt-3')} data-reveal>
            {tierTable}
          </div>
        </DappSection>
      ) : (
        <DappCollapsibleSection title={t.rewards.allTiers}>{tierTable}</DappCollapsibleSection>
      )}

      <DappCollapsibleSection className="max-[820px]:hidden" title={t.rewards.history}>
        <div className={cn(revealClass(), 'mt-3.5')} data-reveal>
          <DappPillTabs
            ariaLabel={t.rewards.history}
            className="mb-2.5 flex items-center justify-start gap-2"
            items={[
              { active: historyTab === 'referral', label: t.rewards.referralHistory },
              { active: historyTab === 'team', label: t.rewards.teamHistory },
            ]}
            onSelect={(index) => setHistoryTab(index === 0 ? 'referral' : 'team')}
          />
          {showHistoryRequiresAuth ? (
            <DappTableEmptyState className="mt-0" />
          ) : showHistoryQueryEmpty ? (
            <DappTableEmptyMessage
              body={
                historyTab === 'referral'
                  ? t.rewards.referralHistoryEmptyBody
                  : t.rewards.teamHistoryEmptyBody
              }
              className="mt-0"
              title={
                historyTab === 'referral'
                  ? t.rewards.referralHistoryEmpty
                  : t.rewards.teamHistoryEmpty
              }
            />
          ) : (
            <>
              <ResponsiveTable
                className="[&_th]:text-faint"
                compact
                headers={historyHeaders}
                isLoading={showHistorySkeleton}
                loadingRowCount={4}
                plain
                positiveColumns={[1]}
                rows={historyRows}
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
        className="group-data-[tab=rewards]/shell:max-[820px]:mt-0"
        title={t.swap.faq}
      >
        <FaqStack
          className={FAQ_STACK_CLASS}
          defaultOpenFirst={false}
          items={[
            {
              answer: t.rewards.faqSettlementBody,
              question: t.rewards.faqSettlement,
            },
            {
              answer: t.rewards.faqReferralBody,
              question: t.rewards.faqReferral,
            },
            {
              answer: t.rewards.faqTeamClaimBody,
              question: t.rewards.faqTeamClaim,
            },
            {
              answer: t.rewards.faqRankBody,
              question: t.rewards.faqRank,
            },
          ]}
        />
      </DappCollapsibleSection>
    </div>
  )
}
