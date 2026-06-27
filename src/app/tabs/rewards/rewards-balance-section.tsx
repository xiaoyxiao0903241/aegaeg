import { useEffect } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { useReferralTotal, useTeamRewardTotal } from '~/hooks/use-api-data'
import { formatClaimableAmount, formatUsd } from '~/lib/api/format-display'
import { RewardBalanceCardSkeleton } from '~/app/components/dapp-skeleton'
import { useTeamRewardClaim } from '~/hooks/use-team-reward-claim'
import { toast } from 'sonner'
import { resolveTeamClaimError } from '~/lib/web3/resolve-contract-error-message'
import { DappActionButton } from '~/app/components/dapp-action-button'
import { RewardBalanceCard } from '~/app/components/dapp-card'
import { useDappShell } from '~/app/dapp-shell-context'

export function RewardsBalanceSection() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const { data: referralTotal, isLoading: referralLoading } = useReferralTotal(sessionReady)
  const { data: teamTotal, isLoading: teamLoading } = useTeamRewardTotal(sessionReady)
  const teamClaim = useTeamRewardClaim()

  useEffect(() => {
    if (!teamClaim.error) return
    const message = resolveTeamClaimError(teamClaim.error, t.rewards.claimErrors)
    if (message) toast.error(message)
  }, [teamClaim.error, t.rewards.claimErrors])

  const referralValue = formatUsd(referralTotal?.claimed ?? referralTotal?.total ?? 0, 2)
  const teamClaimable = formatClaimableAmount(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
  const teamRewardMeta = (() => {
    if (teamTotal?.claimed == null) return undefined
    return t.rewards.claimed.replace('{amount}', formatUsd(teamTotal.claimed, 2))
  })()
  const showReferralSkeleton = sessionReady && referralLoading && referralTotal == null
  const showTeamSkeleton = sessionReady && teamLoading && teamTotal == null
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
          valueClassName="text-lg font-semibold leading-[1.3] tracking-[-0.54px] max-dapp:text-[length:var(--dapp-type-amount-size)] max-dapp:leading-[1.2] max-dapp:tracking-[-0.66px]"
        />
      )}

      {showTeamSkeleton ? (
        <RewardBalanceCardSkeleton />
      ) : sessionReady ? (
        <RewardBalanceCard
          action={
            <DappActionButton
              className="!min-h-10 max-dapp:!min-h-11 max-dapp:!text-sm max-dapp:!leading-[1.2] max-dapp:!tracking-[-0.28px]"
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
            '[&_button]:mt-3',
          )}
          headerLabelClassName="max-dapp:text-faint"
          headerMetaClassName="max-dapp:text-faint"
          label={t.rewards.teamRewards}
          meta={teamRewardMeta}
          value={`${teamClaimable} ${t.common.claimable.toLowerCase()}`}
          valueClassName="text-lg font-semibold leading-[1.3] tracking-[-0.54px] max-dapp:text-[length:var(--dapp-type-body-lg-size)] max-dapp:leading-[1.2] max-dapp:tracking-[-0.51px]"
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
          valueClassName="text-lg font-semibold leading-[1.3] tracking-[-0.54px] max-dapp:text-[length:var(--dapp-type-body-lg-size)] max-dapp:leading-[1.2] max-dapp:tracking-[-0.51px]"
        />
      )}
    </>
  )
}
