import { useEffect } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/shared/lib/utils'
import {
  useCommunityFundTotal,
  useReferralTotal,
  useTeamRewardTotal,
} from '~/hooks/use-api-data'
import {
  formatCommunityFundLockedAmount,
  formatClaimableAmount,
} from '~/views/dapp/rewards/rewards-display'
import { formatUsd } from '~/shared/api/format-display'
import { RewardBalanceCardSkeleton } from '~/app/shell/dapp-skeleton'
import { useTeamRewardClaim } from '~/hooks/use-team-reward-claim'
import { useCommunityFundClaim } from '~/hooks/use-community-fund-claim'
import { toast } from 'sonner'
import {
  isUserRejectedWalletError,
  resolveTeamClaimError,
  resolveWalletTransactionError,
} from '~/views/dapp/web3/resolve-contract-error-message'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { RewardBalanceCard } from '~/app/shell/dapp-card'
import { DappInfoTooltip } from '~/app/shell/dapp-info-tooltip'
import { useDappShell } from '~/app/dapp-shell-context'
import {
  rewardsBalanceHeaderMeta,
  rewardsBalanceHint,
  rewardsClaimAction,
  rewardsReferralAmount,
  rewardsSideCard,
} from '~/views/dapp/rewards/rewards-widget-styles'

export function RewardsBalanceSection() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const { data: referralTotal, isLoading: referralLoading } = useReferralTotal(sessionReady)
  const { data: teamTotal, isLoading: teamLoading } = useTeamRewardTotal(sessionReady)
  const { data: communityFundTotal, isLoading: communityFundLoading } =
    useCommunityFundTotal(sessionReady)
  const teamClaim = useTeamRewardClaim()
  const communityFundClaim = useCommunityFundClaim()
  const isSuperCommunity = communityFundTotal?.is_presale_fund_node === true

  useEffect(() => {
    if (!teamClaim.error) return
    if (isUserRejectedWalletError(teamClaim.error)) return
    const message =
      resolveWalletTransactionError(teamClaim.error, t.wallet.transactionErrors) ??
      resolveTeamClaimError(teamClaim.error, {
        ...t.rewards.claimErrors,
        walletNotConnected: t.errors.walletNotConnected,
      }) ??
      t.errors.chain.fallback
    if (message) toast.error(message)
  }, [teamClaim.error, t.errors, t.rewards.claimErrors, t.wallet.transactionErrors])

  useEffect(() => {
    if (!communityFundClaim.error) return
    if (isUserRejectedWalletError(communityFundClaim.error)) return
    const message =
      resolveWalletTransactionError(communityFundClaim.error, t.wallet.transactionErrors) ??
      resolveTeamClaimError(communityFundClaim.error, {
        ...t.rewards.claimErrors,
        walletNotConnected: t.errors.walletNotConnected,
      }) ??
      t.errors.chain.fallback
    if (message) toast.error(message)
  }, [communityFundClaim.error, t.errors, t.rewards.claimErrors, t.wallet.transactionErrors])

  const referralValue = formatUsd(referralTotal?.claimed ?? referralTotal?.total ?? 0, 2)
  const teamClaimable = formatClaimableAmount(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
  const teamRewardMeta = (() => {
    if (teamTotal?.claimed == null) return undefined
    return t.rewards.claimed.replace('{amount}', formatUsd(teamTotal.claimed, 2))
  })()
  const communityFundClaimable = formatUsd(communityFundTotal?.unlocked_claimable ?? 0, 2)
  const communityFundLocked = formatCommunityFundLockedAmount(
    communityFundTotal?.total ?? '0',
    communityFundTotal?.claimed ?? '0',
    communityFundTotal?.unlocked_claimable ?? '0',
  )
  const communityFundLockedMeta = t.rewards.communityFundLocked.replace(
    '{amount}',
    communityFundLocked,
  )
  const communityFundLabel = (
    <span className="inline-flex items-center gap-1">
      {t.rewards.communityFund}
      <DappInfoTooltip content={t.rewards.communityFundTooltip} />
    </span>
  )
  const showReferralSkeleton = sessionReady && referralLoading && referralTotal == null
  const showTeamSkeleton = sessionReady && teamLoading && teamTotal == null
  const showCommunityFundSkeleton =
    sessionReady && isSuperCommunity && communityFundLoading && communityFundTotal == null
  const disconnectedReferralValue = formatUsd(0, 2)
  const disconnectedTeamValue = formatUsd(0, 2)
  const disconnectedTeamClaimedMeta = t.rewards.claimed.replace(
    '{amount}',
    disconnectedTeamValue,
  )

  return (
    <>
      {showReferralSkeleton ? (
        <RewardBalanceCardSkeleton />
      ) : (
        <RewardBalanceCard
          badge={t.rewards.autoPaidLabel}
          className={cn(
            rewardsSideCard(),
            'max-dapp:[&_small]:hidden',
          )}
          headerLabelClassName={rewardsBalanceHeaderMeta()}
          hint={t.rewards.autoPaid}
          hintClassName={rewardsBalanceHint()}
          label={t.rewards.referralRewards}
          value={sessionReady ? referralValue : disconnectedReferralValue}
          valueClassName={rewardsReferralAmount()}
        />
      )}

      {showTeamSkeleton ? (
        <RewardBalanceCardSkeleton />
      ) : sessionReady ? (
        <RewardBalanceCard
          action={
            <DappActionButton
              className={rewardsClaimAction()}
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
                  if (result.status === 'confirm_failed') {
                    toast.warning(
                      t.rewards.claimErrors.confirmSyncFailed ?? t.rewards.claimSuccess,
                    )
                    return
                  }
                  const claimedAmount = result.confirmResult?.order?.amount
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
          className={rewardsSideCard()}
          headerLabelClassName={rewardsBalanceHeaderMeta()}
          headerMetaClassName={rewardsBalanceHeaderMeta()}
          label={t.rewards.teamRewards}
          meta={teamRewardMeta}
          value={`${teamClaimable} ${t.common.claimable.toLowerCase()}`}
        />
      ) : (
        <RewardBalanceCard
          className={rewardsSideCard()}
          headerLabelClassName={rewardsBalanceHeaderMeta()}
          headerMetaClassName={rewardsBalanceHeaderMeta()}
          label={t.rewards.teamRewards}
          meta={disconnectedTeamClaimedMeta}
          value={disconnectedTeamValue}
        />
      )}

      {isSuperCommunity ? (
        showCommunityFundSkeleton ? (
          <RewardBalanceCardSkeleton />
        ) : sessionReady ? (
          <RewardBalanceCard
            action={
              <DappActionButton
                className={rewardsClaimAction()}
                disabled={
                  communityFundClaimable === '$0.00' ||
                  communityFundLoading ||
                  communityFundClaim.isClaiming ||
                  !communityFundClaim.canClaim
                }
                loading={communityFundClaim.isClaiming}
                onClick={() =>
                  void communityFundClaim.claim().then((result) => {
                    if (!result) return
                    if (result.status === 'confirm_failed') {
                      toast.warning(
                        t.rewards.claimErrors.confirmSyncFailed ?? t.rewards.claimSuccess,
                      )
                      return
                    }
                    const claimedAmount = result.confirmResult?.order?.amount
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
            className={rewardsSideCard()}
            headerLabelClassName={rewardsBalanceHeaderMeta()}
            headerMetaClassName={rewardsBalanceHeaderMeta()}
            label={communityFundLabel}
            meta={communityFundLockedMeta}
            value={`${communityFundClaimable} ${t.rewards.communityFundUnlockedSuffix}`}
          />
        ) : null
      ) : null}
    </>
  )
}
