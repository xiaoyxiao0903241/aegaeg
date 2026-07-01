import { useEffect } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { dappIconClass } from '~/app/dapp-icon-scale'
import {
  useCommunityFundTotal,
  useReferralTotal,
  useTeamRewardTotal,
} from '~/hooks/use-api-data'
import {
  formatCommunityFundLockedAmount,
  formatClaimableAmount,
  formatUsd,
} from '~/lib/api/format-display'
import { RewardBalanceCardSkeleton } from '~/app/components/dapp-skeleton'
import { useTeamRewardClaim } from '~/hooks/use-team-reward-claim'
import { useCommunityFundClaim } from '~/hooks/use-community-fund-claim'
import { toast } from 'sonner'
import { resolveTeamClaimError } from '~/lib/web3/resolve-contract-error-message'
import { DappActionButton } from '~/app/components/dapp-action-button'
import { RewardBalanceCard } from '~/app/components/dapp-card'
import { dappReferralAmountClass } from '~/app/dapp-type-scale'
import { useDappShell } from '~/app/dapp-shell-context'
import { AnchoredTooltip } from '~/components/anchored-tooltip'

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
    const message = resolveTeamClaimError(teamClaim.error, t.rewards.claimErrors)
    if (message) toast.error(message)
  }, [teamClaim.error, t.rewards.claimErrors])

  useEffect(() => {
    if (!communityFundClaim.error) return
    const message = resolveTeamClaimError(communityFundClaim.error, t.rewards.claimErrors)
    if (message) toast.error(message)
  }, [communityFundClaim.error, t.rewards.claimErrors])

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
      <AnchoredTooltip content={t.rewards.communityFundTooltip}>
        <button
          aria-label={t.rewards.communityFundTooltip}
          className={cn(
            'inline-flex shrink-0 items-center justify-center self-center rounded-full border border-current text-xs font-bold leading-none opacity-60',
            dappIconClass.xs,
          )}
          type="button"
        >
          i
        </button>
      </AnchoredTooltip>
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
          badgeClassName="max-dapp:font-semibold max-dapp:leading-[1.2]"
          className={cn(
            'gap-1.5 rounded-md px-4 py-3.5',
            '[&_span]:text-xs [&_span]:tracking-[-0.24px]',
            'max-dapp:[&_small]:hidden',
          )}
          headerLabelClassName="max-dapp:text-faint"
          hint={t.rewards.autoPaid}
          label={t.rewards.referralRewards}
          value={sessionReady ? referralValue : disconnectedReferralValue}
          valueClassName={dappReferralAmountClass}
        />
      )}

      {showTeamSkeleton ? (
        <RewardBalanceCardSkeleton />
      ) : sessionReady ? (
        <RewardBalanceCard
          action={
            <DappActionButton
              className="mt-3 !min-h-10 max-dapp:!min-h-11 max-dapp:!text-sm max-dapp:!leading-[1.2] max-dapp:!tracking-[-0.28px]"
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
            'gap-1.5 rounded-md px-4 py-3.5',
            '[&_span]:text-xs [&_span]:tracking-[-0.24px]',
          )}
          headerLabelClassName="max-dapp:text-faint"
          headerMetaClassName="max-dapp:text-faint"
          label={t.rewards.teamRewards}
          meta={teamRewardMeta}
          value={`${teamClaimable} ${t.common.claimable.toLowerCase()}`}
        />
      ) : (
        <RewardBalanceCard
          className={cn(
            'gap-1.5 rounded-md px-4 py-3.5',
            '[&_span]:text-xs [&_span]:tracking-[-0.24px]',
          )}
          headerLabelClassName="max-dapp:text-faint"
          headerMetaClassName="max-dapp:text-faint"
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
                className="mt-3 !min-h-10 max-dapp:!min-h-11 max-dapp:!text-sm max-dapp:!leading-[1.2] max-dapp:!tracking-[-0.28px]"
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
              'gap-1.5 rounded-md px-4 py-3.5',
              '[&_span]:text-xs [&_span]:tracking-[-0.24px]',
            )}
            headerLabelClassName="max-dapp:text-faint"
            headerMetaClassName="max-dapp:text-faint"
            label={communityFundLabel}
            meta={communityFundLockedMeta}
            value={`${communityFundClaimable} ${t.rewards.communityFundUnlockedSuffix}`}
          />
        ) : null
      ) : null}
    </>
  )
}
