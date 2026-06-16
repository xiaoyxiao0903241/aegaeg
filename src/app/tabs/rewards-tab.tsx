import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../../i18n/use-i18n'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'
import {
  useReferralTotal,
  useRewardLogs,
  useTeamRewardClaimLogs,
  useTeamRewardTotal,
} from '../../hooks/use-api-data'
import {
  formatClaimableAmount,
  formatPresaleRank,
  formatUsd,
  getPresaleRankHighlightedRowsForPage,
  mapRewardLogToRow,
  mapTeamRewardClaimLogToRow,
  resolveRewardTypeI18nKey,
} from '../../lib/api/format-display'
import { REWARDS_PROGRESS_PLACEHOLDERS } from '../../config/rewards-progress'
import { buildNextTierProgress } from '../../lib/presale/tier-progress'
import {
  CurrentTitleCardBodySkeleton,
  ProgressCardSkeleton,
  RewardBalanceCardSkeleton,
  RewardsHeroBodySkeleton,
} from '../components/dapp-skeleton'
import { useAuth } from '../../providers/auth-provider'
import { useShareholderRankLabels } from '../../hooks/use-shareholder-rank'
import { useTeamRewardClaim } from '../../hooks/use-team-reward-claim'
import { toast } from 'sonner'
import { toWalletUserFacingMessage } from '../../lib/web3/resolve-contract-error-message'
import {
  shellContentHeadingClass,
  shellContentPageClass,
  shellModulePanelClass,
} from '../shell-layout'
import { dappAssets } from '../assets'
import { buildRewardTierRows, getTeamBonusRateLabel } from '../../lib/presale/tier-table'
import { DAPP_TABLE_PAGE_SIZE, paginateStaticRows } from '../../lib/table-pagination'
import type { DetailPanelControls } from '../types'
import { DappActionButton } from '../components/dapp-action-button'
import {
  DappSideCard,
  RewardBalanceCard,
  SideHint,
  SideLabel,
  SideTitle,
  SideValue,
} from '../components/dapp-card'
import { DappCollapsibleSection } from '../components/dapp-collapsible-section'
import { DappPillTabs } from '../components/dapp-pill-tabs'
import { DappTablePagination } from '../components/dapp-table-pagination'
import { DappTableEmptyMessage } from '../components/dapp-table-empty-message'
import { DappTableEmptyState } from '../components/dapp-table-empty-state'
import { DappWidgetHeader } from '../components/dapp-widget-header'
import { FaqStack } from '../components/faq-stack'
import { ProgressMeter } from '../components/progress-meter'
import { ResponsiveTable } from '../components/responsive-table'
import { useDappShell } from '../dapp-shell-context'
import { dappGap, dappSpacing } from '../../components/primitive-styles'

const PROGRESS_CARD_CLASS = cn(dappSpacing.stackBetweenCards, 'grid', dappGap.sm, 'max-[820px]:py-[13px] max-[820px]:[&_span]:text-faint')

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
  const showReferralSkeleton = connected && apiEnabled && referralLoading && referralTotal == null
  const showTeamSkeleton = connected && apiEnabled && teamLoading && teamTotal == null
  const showTitleSkeleton = connected && isRankLoading
  const titleValue = !connected ? t.rewards.shareholder : rankLabel
  const titleHint = !connected ? t.rewards.shareholderHint : rankHint

  return (
    <div className={shellModulePanelClass}>
      <DappWidgetHeader
        className="max-[820px]:mt-3 max-[820px]:[&_p]:mt-3"
        detailCollapsed={detailPanel.collapsed}
        intro={t.rewards.intro}
        onTogglePanel={detailPanel.onToggle}
        showToggle
        title={t.rewards.title}
      />

      <DappSideCard className="max-[820px]:py-[13px]">
        <SideLabel tone="coral">{t.rewards.currentTitle}</SideLabel>
        {showTitleSkeleton ? (
          <CurrentTitleCardBodySkeleton />
        ) : (
          <>
            <SideTitle>{titleValue}</SideTitle>
            <SideHint
              className="min-h-[2.25rem] line-clamp-2 max-[820px]:max-w-[31ch] max-[820px]:leading-[1.4] max-[820px]:text-faint"
              tone="body"
            >
              {titleHint}
            </SideHint>
          </>
        )}
      </DappSideCard>

      {showPerformanceSkeleton ? (
        <DappSideCard className={PROGRESS_CARD_CLASS}>
          <ProgressCardSkeleton />
        </DappSideCard>
      ) : (
      <DappSideCard className={PROGRESS_CARD_CLASS}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-normal leading-[1.5] text-muted-foreground">
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
          <span className="text-xs font-normal leading-[1.5] text-muted-foreground">
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
          'mt-2 max-[820px]:pb-3 max-[820px]:[&_button]:mt-1.5 max-[820px]:[&_strong]:mt-1.5 max-[820px]:[&_strong]:text-[17px] max-[820px]:[&_strong]:leading-[1.1]',
          '[&_strong_span]:text-xs [&_strong_span]:font-semibold [&_strong_span]:text-faint',
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
            className="!min-h-[42px]"
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
          'mt-3 [&_strong]:text-lg',
          '[&_button]:mt-3',
          'max-[820px]:pb-3 max-[820px]:[&_button]:mt-3 max-[820px]:[&_strong]:mt-1.5 max-[820px]:[&_strong]:text-[17px] max-[820px]:[&_strong]:leading-[1.1]',
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
      <h2
        className={cn(shellContentHeadingClass, 'max-[820px]:mt-0.5')}
        id="rewards-title"
      >
        {t.rewards.heroTitle}
      </h2>

      <section
        className={cn(
          revealClass(),
          'relative mt-3.5 flex min-h-[145px] items-center justify-between gap-6 overflow-visible rounded-md bg-dark p-6 text-white shadow-card',
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
              <h3 className="my-2 text-[21px] font-bold text-white">{heroTitle}</h3>
              <p className="m-0 text-[13px] leading-[1.55] text-on-dark">
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
          'relative mt-3.5 hidden min-h-[127px] items-center justify-between gap-6 overflow-visible rounded-md bg-dark p-[18px] text-white shadow-card',
          'max-[820px]:flex',
        )}
      >
        <div className="relative z-[1]">
          <span className="text-[11px] font-bold uppercase tracking-[1.4px] text-coral-bright">
            {t.rewards.heroKicker}
          </span>
          {showHeroSkeleton ? (
            <div className="my-2">
              <RewardsHeroBodySkeleton compact />
            </div>
          ) : (
            <>
              <h3 className="my-2 text-lg font-bold text-white max-[820px]:text-lg">
                {heroTitle}
              </h3>
              <p className="m-0 text-[13px] leading-[1.55] text-on-dark">
                {heroBody}
              </p>
            </>
          )}
        </div>
      </section>

      <DappCollapsibleSection title={t.rewards.allTiers}>
        <ResponsiveTable
          compact
          headers={[
            t.tables.title,
            t.tables.personalShort,
            t.tables.totalVolume,
            t.tables.bonusShort,
            t.tables.postLaunchShort,
          ]}
          highlightedRows={tierHighlightedRows}
          plain
          positiveColumns={[3]}
          rows={pagedTierRows.map((row) => [...row])}
        />
        <DappTablePagination onPageChange={setTierPage} page={tierPage} total={tierTotal} />
      </DappCollapsibleSection>

      <DappCollapsibleSection title={t.rewards.history}>
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
            <DappTableEmptyState className="mt-0" variant="history" />
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
        className="max-[820px]:mt-[22px] max-[820px]:[&_h3]:text-[17px]"
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
