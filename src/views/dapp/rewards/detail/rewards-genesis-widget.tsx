import { useEffect, useEffectEvent } from 'react'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { ProgressMeter } from '~/app/shell/progress-meter'
import { useDappShell } from '~/app/use-dapp-shell'
import {
  useCommunityFundTotal,
  useQualifiedPartitions,
  useReferralTotal,
  useTeamOverview,
  useTeamRewardTotal,
} from '~/hooks/use-api-data'
import { formatPresaleRank, formatUsd, calcProgressPercent } from '~/shared/api/format-display'
import { buildNextTierProgress } from '~/core/presale/tier-progress'
import { getTeamBonusRateLabel } from '~/core/presale/tier-table'
import { Text } from '~/shared/ui/text'
import { dappDarkBanner } from '~/shared/ui/dapp-dark-banner'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import {
  claimableAmountValue,
  formatClaimableAmount,
  formatCommunityFundLockedAmount,
  REWARDS_DASH,
} from '~/views/dapp/rewards/rewards-display'
import { useShareholderRankLabels } from '~/views/dapp/rewards/use-shareholder-rank'
import { useCommunityFundClaim, useTeamRewardClaim } from '~/views/dapp/rewards/use-claim-reward'
import {
  resolveTeamClaimError,
  resolveWalletTransactionError,
} from '~/web3/resolve-contract-error-message'
import { presentUserFacingError } from '~/web3/present-user-facing-error'

export function RewardsGenesisClaimWidget() {
  const { messages: t } = useI18n()
  const setView = useRewardsViewStore((state) => state.setView)
  const g = t.rewards.genesisDetail
  const { walletReady, sessionReady } = useDappShell()
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
  const tierProgress = buildNextTierProgress(displayRank, personalVolumeUsd, teamVolumeUsd)
  const nextRankLabel = formatPresaleRank(tierProgress.nextRank)
  const teamRewardRateLabel = t.rewards.teamRewardRate.replace(
    '{rate}',
    getTeamBonusRateLabel(displayRank),
  )

  const personalProgressLabel = tierProgress.isMaxRank
    ? t.rewards.progressMaxPersonal
    : t.rewards.progressPersonalTo.replace('{rank}', nextRankLabel)
  const personalProgressValue = sessionReady
    ? `${formatUsd(tierProgress.personalCurrentUsd)} / ${formatUsd(tierProgress.personalTargetUsd)}`
    : REWARDS_DASH

  const qualifiedPartitionCount = qualifiedPartitions?.count ?? 0
  const showQualifiedPartitions = displayRank >= 3 && displayRank <= 9
  const teamProgressValue = !sessionReady
    ? REWARDS_DASH
    : showQualifiedPartitions
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
          : `${formatUsd(tierProgress.teamCurrentUsd)} / ${formatUsd(tierProgress.teamTargetUsd ?? 0)}`

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
    ? REWARDS_DASH
    : referralLoading && referralTotal == null
      ? '…'
      : formatUsd(referralTotal?.claimed ?? referralTotal?.total ?? 0, 2)

  const teamClaimableValue = claimableAmountValue(
    teamTotal?.total ?? '0',
    teamTotal?.claimed ?? '0',
  )
  const teamClaimable = !sessionReady
    ? REWARDS_DASH
    : teamLoading && teamTotal == null
      ? '…'
      : formatClaimableAmount(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
  const teamMeta = !sessionReady
    ? REWARDS_DASH
    : teamTotal?.claimed == null
      ? REWARDS_DASH
      : formatUsd(teamTotal.claimed, 2)

  const communityClaimableValue = Number(communityFundTotal?.unlocked_claimable ?? 0)
  const communityClaimable = !sessionReady
    ? REWARDS_DASH
    : communityFundLoading && communityFundTotal == null
      ? '…'
      : formatUsd(Number.isFinite(communityClaimableValue) ? communityClaimableValue : 0, 2)
  const communityLockedMeta = !sessionReady
    ? t.rewards.communityFundLocked.replace('{amount}', REWARDS_DASH)
    : t.rewards.communityFundLocked.replace(
        '{amount}',
        formatCommunityFundLockedAmount(
          communityFundTotal?.total ?? '0',
          communityFundTotal?.claimed ?? '0',
          communityFundTotal?.unlocked_claimable ?? '0',
        ),
      )

  const presentTeamClaimError = useEffectEvent((error: unknown) => {
    presentUserFacingError(
      error,
      (err) =>
        resolveWalletTransactionError(err, t.wallet.transactionErrors) ??
        resolveTeamClaimError(err, {
          ...t.rewards.claimErrors,
          walletNotConnected: t.errors.walletNotConnected,
        }) ??
        t.errors.chain.fallback,
      { id: 'rewards-genesis:team-claim' },
    )
    teamClaim.clearError()
  })

  const presentCommunityFundClaimError = useEffectEvent((error: unknown) => {
    presentUserFacingError(
      error,
      (err) =>
        resolveWalletTransactionError(err, t.wallet.transactionErrors) ??
        resolveTeamClaimError(err, {
          ...t.rewards.claimErrors,
          walletNotConnected: t.errors.walletNotConnected,
        }) ??
        t.errors.chain.fallback,
      { id: 'rewards-genesis:community-fund-claim' },
    )
    communityFundClaim.clearError()
  })

  useEffect(() => {
    if (!teamClaim.error) return
    presentTeamClaimError(teamClaim.error)
  }, [teamClaim.error])

  useEffect(() => {
    if (!communityFundClaim.error) return
    presentCommunityFundClaimError(communityFundClaim.error)
  }, [communityFundClaim.error])

  const banner = dappDarkBanner()

  return (
    <>
      <DappTabHeader
        backText={t.rewards.backToHub}
        onBack={() => setView('hub')}
        subtitle={g.pageSubtitle}
        title={g.pageTitle}
      />
      <DappWidgetStack>
        <div className={banner.root({ className: 'gap-3.5 p-4' })}>
          <div className="grid gap-1.5">
            <Text as="p" className="text-primary" variant="caption">
              {t.rewards.heroKicker}
            </Text>
            <div className="flex items-start justify-between gap-3">
              <Text as="p" className="font-semibold text-white" variant="detail">
                {rankBusy ? '…' : rankLabel || t.rewards.shareholderNoRankTitle}
              </Text>
              {hasRank && isSuperCommunity ? (
                <Text as="p" className="shrink-0 text-primary" variant="caption">
                  {t.rewards.superCommunityBadge}
                </Text>
              ) : null}
            </div>
            {hasRank ? (
              <Text as="p" className="text-white/60" variant="caption">
                {teamRewardRateLabel}
              </Text>
            ) : (
              <Text as="p" className="text-white/60" variant="caption">
                {sessionReady ? t.rewards.shareholderNoRankBody : t.rewards.hub.sessionHint}
              </Text>
            )}
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-between gap-2">
              <Text as="span" className="text-white/55" variant="caption">
                {personalProgressLabel}
              </Text>
              <Text as="span" className="text-white/80" variant="caption">
                {rankBusy ? '…' : personalProgressValue}
              </Text>
            </div>
            <ProgressMeter label={personalProgressLabel} value={personalProgressPercent} />
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-between gap-2">
              <Text as="span" className="text-white/55" variant="caption">
                {t.rewards.teamVolume}
              </Text>
              <Text as="span" className="text-white/80" variant="caption">
                {rankBusy ? '…' : teamProgressValue}
              </Text>
            </div>
            <ProgressMeter label={t.rewards.teamVolume} value={teamProgressPercent} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.rewards.referralRewards}
            </Text>
            <Text as="p" className="font-semibold text-primary" variant="caption">
              {t.rewards.autoPaidLabel}
            </Text>
          </div>
          <Text as="p" className="mt-2 font-semibold" variant="headline">
            {referralValue}
          </Text>
          <Text as="p" className="mt-2" tone="muted-foreground" variant="caption">
            {t.rewards.autoPaid}
          </Text>
        </div>

        <div className="rounded-2xl border border-border bg-card px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.rewards.teamRewards}
            </Text>
            <Text as="p" tone="muted-foreground" variant="caption">
              {teamMeta}
            </Text>
          </div>
          <Text as="p" className="mt-2 font-semibold" variant="headline">
            {teamClaimable}
          </Text>
          {walletReady ? (
            <DappActionButton
              className="mt-3"
              disabled={
                !sessionReady ||
                teamClaimableValue <= 0 ||
                teamLoading ||
                teamClaim.isClaiming ||
                !teamClaim.canClaim
              }
              loading={teamClaim.isClaiming}
              onClick={() =>
                void teamClaim.claim().then((result) => {
                  if (!result) return
                  if (result.status === 'confirm_failed') {
                    toast.warning(t.rewards.claimErrors.confirmSyncFailed ?? t.rewards.claimSuccess)
                    return
                  }
                  toast.success(t.rewards.claimSuccess)
                })
              }
            >
              {g.claimToWallet}
            </DappActionButton>
          ) : null}
        </div>

        <div className="rounded-2xl border border-border bg-card px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.rewards.communityFund}
            </Text>
            <Text as="p" tone="muted-foreground" variant="caption">
              {communityLockedMeta}
            </Text>
          </div>
          <Text as="p" className="mt-2 font-semibold" variant="headline">
            {isSuperCommunity || !sessionReady ? communityClaimable : REWARDS_DASH}
          </Text>
          {walletReady ? (
            <DappActionButton
              className="mt-3"
              disabled={
                !sessionReady ||
                !isSuperCommunity ||
                !(communityClaimableValue > 0) ||
                communityFundLoading ||
                communityFundClaim.isClaiming ||
                !communityFundClaim.canClaim
              }
              loading={communityFundClaim.isClaiming}
              onClick={() =>
                void communityFundClaim.claim().then((result) => {
                  if (!result) return
                  if (result.status === 'confirm_failed') {
                    toast.warning(t.rewards.claimErrors.confirmSyncFailed ?? t.rewards.claimSuccess)
                    return
                  }
                  toast.success(t.rewards.claimSuccess)
                })
              }
            >
              {g.claimToWallet}
            </DappActionButton>
          ) : null}
        </div>

        {!walletReady ? <DappWidgetConnectPromo /> : null}
      </DappWidgetStack>
    </>
  )
}
