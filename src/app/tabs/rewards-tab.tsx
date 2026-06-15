import { useEffect, useState } from 'react'
import { useI18n } from '../../i18n/use-i18n'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'
import {
  useReferralTotal,
  useRewardLogs,
  useTeamRewardTotal,
} from '../../hooks/use-api-data'
import {
  formatClaimableAmount,
  formatPresaleRank,
  formatUsd,
  getPresaleRankHighlightedRows,
  isReferralRewardLog,
  isTeamRewardLog,
  mapRewardLogToRow,
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
import { useTeamRewardClaim } from '../../hooks/use-team-reward-claim'
import { useShareholderRankLabels } from '../../hooks/use-shareholder-rank'
import { toast } from 'sonner'
import { toWalletUserFacingMessage } from '../../lib/web3/resolve-contract-error-message'
import {
  shellContentHeadingClass,
  shellContentPageClass,
  shellModulePanelClass,
} from '../shell-layout'
import { dappAssets } from '../assets'
import { buildMobileRewardTierRows, buildRewardTierRows } from '../../lib/presale/tier-table'
import { rewardRows, teamRewardRows } from '../data'
import type { DetailPanelControls } from '../types'
import { DappActionButton } from '../components/dapp-action-button'
import {
  DappSideCard,
  RewardBalanceCard,
  SideHint,
  SideLabel,
  SideValue,
} from '../components/dapp-card'
import { DappPillTabs } from '../components/dapp-pill-tabs'
import { DappSection } from '../components/dapp-section'
import { DappWidgetHeader } from '../components/dapp-widget-header'
import { FaqStack } from '../components/faq-stack'
import { ProgressMeter } from '../components/progress-meter'
import { ResponsiveTable } from '../components/responsive-table'
import { useDappShell } from '../dapp-shell-context'

const TITLE_MINI_CARD_CLASS = cn(
  '[&_p]:text-[11px] [&_p]:font-semibold [&_p]:uppercase [&_p]:tracking-[0.88px] [&_p]:leading-[1.3] [&_p]:text-primary',
  '[&_strong]:mt-1.5 [&_strong]:block [&_strong]:text-[17px] [&_strong]:font-semibold [&_strong]:leading-[1.3] [&_strong]:tracking-normal',
  '[&_small]:mt-1.5 [&_small]:block [&_small]:min-h-[2.25rem] [&_small]:line-clamp-2 [&_small]:text-xs [&_small]:leading-[1.5] [&_small]:tracking-normal [&_small]:text-muted-foreground',
  'max-[820px]:py-[13px] max-[820px]:[&_small]:max-w-[31ch] max-[820px]:[&_small]:leading-[1.4] max-[820px]:[&_small]:text-faint',
)

const PROGRESS_CARD_CLASS = cn(
  'grid gap-1.5 max-[820px]:gap-1.5 max-[820px]:py-[13px] max-[820px]:[&_span]:text-faint',
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
  const { data: teamTotal, isLoading: teamLoading, refresh: refreshTeamTotal } = useTeamRewardTotal(apiEnabled)
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
    : tierProgress.teamLegRank != null || teamVolumeUsd <= 0
      ? null
      : tierProgress.teamProgressPercent

  const showPerformanceSkeleton = connected && apiEnabled && performanceLoading && !performance
  const referralValue = formatUsd(referralTotal?.claimed ?? referralTotal?.total ?? 0, 2)
  const teamClaimable = formatClaimableAmount(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
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
        showToggle={connected}
        title={t.rewards.title}
      />

      <DappSideCard className={TITLE_MINI_CARD_CLASS}>
        <SideLabel tone="coral">{t.rewards.currentTitle}</SideLabel>
        {showTitleSkeleton ? (
          <CurrentTitleCardBodySkeleton />
        ) : (
          <>
            <SideValue>{titleValue}</SideValue>
            <SideHint tone="body">{titleHint}</SideHint>
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
        {teamProgressPercent != null ? (
          <ProgressMeter
            label={teamProgressLabel}
            value={teamProgressPercent}
          />
        ) : null}
      </DappSideCard>
      )}

      {showReferralSkeleton ? (
        <RewardBalanceCardSkeleton />
      ) : (
      <RewardBalanceCard
        badge={t.rewards.autoPaidLabel}
        className={cn(
          'max-[820px]:pb-3 max-[820px]:[&_button]:mt-1.5 max-[820px]:[&_strong]:mt-1.5 max-[820px]:[&_strong]:text-[17px] max-[820px]:[&_strong]:leading-[1.1]',
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
            disabled={teamClaimable === '$0.00' || teamLoading || teamClaim.isClaiming || !teamClaim.canClaim}
            loading={teamClaim.isClaiming}
            onClick={() =>
              void teamClaim.claim().then((ok) => {
                if (!ok) return
                toast.success(t.rewards.claim)
                void refreshTeamTotal()
              })
            }
          >
            {t.rewards.claim}
          </DappActionButton>
        }
        className={cn(
          '[&_strong]:text-lg',
          'max-[820px]:pb-3 max-[820px]:[&_button]:mt-1.5 max-[820px]:[&_strong]:mt-1.5 max-[820px]:[&_strong]:text-[17px] max-[820px]:[&_strong]:leading-[1.1]',
        )}
        label={t.rewards.teamRewards}
        meta={
          teamTotal?.claimed != null
            ? t.rewards.claimed.replace('{amount}', formatUsd(teamTotal.claimed, 2))
            : undefined
        }
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
  const apiEnabled = connected && isAuthenticated
  const { data: rewardLogs, isLoading: rewardLogsLoading } = useRewardLogs(
    { page: 1, page_size: 20 },
    apiEnabled,
  )

  const referralHistoryRows =
    rewardLogs?.items.filter(isReferralRewardLog).map(mapRewardLogToRow) ?? []
  const teamHistoryRows =
    rewardLogs?.items.filter(isTeamRewardLog).map(mapRewardLogToRow) ?? []
  const useMockHistory = !connected
  const authPending = connected && (isLoggingIn || !isAuthenticated)
  const historyRows = useMockHistory
    ? historyTab === 'referral'
      ? rewardRows
      : teamRewardRows
    : historyTab === 'referral'
      ? referralHistoryRows
      : teamHistoryRows
  const showHistorySkeleton =
    !useMockHistory &&
    (authPending || (apiEnabled && rewardLogsLoading)) &&
    historyRows.length === 0

  const rewardTiers = buildRewardTierRows()
  const mobileRewardTiers = buildMobileRewardTierRows()
  const tierHighlightedRows = connected
    ? getPresaleRankHighlightedRows(displayRank, rewardTiers.length)
    : [1]
  const mobileTierHighlightedRows = connected
    ? getPresaleRankHighlightedRows(displayRank, mobileRewardTiers.length)
    : [1]

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

      <DappSection title={t.rewards.allTiers}>
        <ResponsiveTable
          className="max-[820px]:hidden"
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
          rows={rewardTiers.map((row) => [...row])}
        />
        <ResponsiveTable
          className="hidden max-[820px]:block"
          compact
          headers={[
            t.tables.title,
            t.tables.personalShort,
            t.tables.bonusShort,
            t.tables.rankShort,
          ]}
          highlightedRows={mobileTierHighlightedRows}
          plain
          positiveColumns={[2]}
          rows={mobileRewardTiers.map((row) => [...row])}
        />
      </DappSection>

      <DappSection
        className="max-[820px]:hidden"
        title={t.rewards.history}
      >
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
        </div>
      </DappSection>

      <DappSection
        className="max-[820px]:mt-[22px] max-[820px]:[&_h3]:text-[17px]"
        title={t.swap.faq}
      >
        <FaqStack
          className={cn(
            'justify-items-start [&_[data-faq-item]]:w-full [&_[data-faq-item]]:max-w-full',
            'max-[820px]:[&_[data-faq-item]]:rounded-[14px] max-[820px]:[&_[data-faq-item]]:border-0 max-[820px]:[&_[data-faq-item]]:px-4 max-[820px]:[&_[data-faq-item]]:shadow-faq',
            'max-[820px]:[&_[data-faq-trigger]]:py-3.5 max-[820px]:[&_[data-faq-trigger]]:text-[13px] max-[820px]:[&_[data-faq-trigger]]:font-normal max-[820px]:[&_[data-faq-trigger]]:text-faq-text',
            'max-[820px]:[&_p]:hidden',
            '[&_[data-faq-trigger]]:text-sm [&_[data-faq-trigger]]:font-normal [&_[data-faq-trigger]]:text-faq-text',
          )}
          defaultOpenFirst={false}
          items={[
            {
              answer: t.rewards.faqSettlementBody,
              question: t.rewards.faqSettlement,
            },
          ]}
        />
      </DappSection>
    </div>
  )
}
