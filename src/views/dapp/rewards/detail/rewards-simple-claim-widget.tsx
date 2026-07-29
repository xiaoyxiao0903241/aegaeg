import { useEffect, useEffectEvent } from 'react'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatUsd } from '~/shared/api/format-display'
import { useCommunityFundTotal, useTeamRewardTotal } from '~/hooks/use-api-data'
import { Text } from '~/shared/ui/text'
import { ExchangeWidgetBody } from '~/views/dapp/exchange/exchange-widget-composites'
import { RewardsSubpageHeader } from '~/views/dapp/rewards/rewards-subpage-header'
import { claimableAmountValue } from '~/views/dapp/rewards/rewards-display'
import {
  useCommunityFundClaim,
  useGenesisRewardClaim,
  useIncentiveClaim,
  useMarketFundClaim,
} from '~/views/dapp/rewards/use-claim-reward'
import {
  resolveTeamClaimError,
  resolveWalletTransactionError,
} from '~/web3/resolve-contract-error-message'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import type { RewardsView } from '~/shared/config/rewards-deep-link'

type SimpleView = Extract<RewardsView, 'referral' | 'participate' | 'grant' | 'genesis'>

function useSimpleClaim(view: SimpleView) {
  const community = useCommunityFundClaim()
  const incentive = useIncentiveClaim()
  const market = useMarketFundClaim()
  const genesis = useGenesisRewardClaim()
  if (view === 'referral') return community
  if (view === 'participate') return incentive
  if (view === 'grant') return market
  return genesis
}

export function RewardsSimpleClaimWidget({ view }: { view: SimpleView }) {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappShell()
  const card = t.rewards.cards[view]
  const claim = useSimpleClaim(view)
  const { data: teamTotal, isLoading: teamLoading } = useTeamRewardTotal(sessionReady)
  const { data: communityFundTotal, isLoading: communityLoading } =
    useCommunityFundTotal(sessionReady)

  // participate / grant: no balance API yet — amount comes from signature at claim time
  // (same honesty pattern as Dao Mixed `signedAmountHint`). Do not hardcode 0 and kill CTA.
  const amountKnown = view === 'genesis' || view === 'referral'
  const amountValue = amountKnown
    ? view === 'genesis'
      ? claimableAmountValue(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
      : Number(communityFundTotal?.unlocked_claimable ?? 0)
    : null
  const amountLabel = !sessionReady
    ? t.rewards.hub.signInForBalance
    : amountKnown
      ? formatUsd(Number.isFinite(amountValue ?? NaN) ? (amountValue ?? 0) : 0, 2)
      : t.rewards.detail.signedAmountHint
  const loading = (view === 'genesis' && teamLoading) || (view === 'referral' && communityLoading)
  const canAmount = sessionReady && (amountKnown ? (amountValue ?? 0) > 0 : true)

  const presentError = useEffectEvent((error: unknown) => {
    presentUserFacingError(
      error,
      (err) =>
        resolveWalletTransactionError(err, t.wallet.transactionErrors) ??
        resolveTeamClaimError(err, {
          ...t.rewards.claimErrors,
          walletNotConnected: t.errors.walletNotConnected,
        }) ??
        t.errors.chain.fallback,
      { id: `rewards-simple-claim:${view}` },
    )
    claim.clearError()
  })

  useEffect(() => {
    if (!claim.error) return
    presentError(claim.error)
  }, [claim.error])

  return (
    <>
      <RewardsSubpageHeader subtitle={card.body} title={card.title} />
      <ExchangeWidgetBody>
        <div className="rounded-2xl border border-border bg-card p-4">
          <Text as="p" tone="muted-foreground" variant="caption">
            {t.rewards.detail.claimable}
          </Text>
          <Text as="p" className="mt-2 font-semibold" variant="headline">
            {amountLabel}
          </Text>
          {!sessionReady ? (
            <Text as="p" className="mt-2" tone="muted-foreground" variant="caption">
              {t.rewards.hub.sessionHint}
            </Text>
          ) : amountKnown && (amountValue ?? 0) <= 0 ? (
            <Text as="p" className="mt-2" tone="muted-foreground" variant="caption">
              {t.rewards.detail.emptyClaimable}
            </Text>
          ) : null}
        </div>
        {walletReady ? (
          <DappActionButton
            disabled={!canAmount || loading || claim.isClaiming || !claim.canClaim}
            loading={claim.isClaiming}
            onClick={() =>
              void claim.claim().then((result) => {
                if (!result) return
                if (result.status === 'confirm_failed') {
                  toast.warning(t.rewards.claimErrors.confirmSyncFailed ?? t.rewards.claimSuccess)
                  return
                }
                toast.success(t.rewards.claimSuccess)
              })
            }
          >
            {t.rewards.claim}
          </DappActionButton>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </ExchangeWidgetBody>
    </>
  )
}
