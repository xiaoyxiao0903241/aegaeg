import { useEffect, useEffectEvent } from 'react'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { dappAssets } from '~/app/assets'
import { formatUsd } from '~/shared/api/format-display'
import { COMMUNITY_SOCIAL_LINKS } from '~/shared/config/community-links'
import { useTeamRewardTotal } from '~/hooks/use-api-data'
import { Text } from '~/shared/ui/text'
import { ChevronIcon } from '~/shared/ui/chevron-icon'
import { ExchangeWidgetBody } from '~/views/dapp/exchange/exchange-widget-composites'
import { RewardsSubpageHeader } from '~/views/dapp/rewards/rewards-subpage-header'
import { claimableAmountValue } from '~/views/dapp/rewards/rewards-display'
import { useGenesisRewardClaim, useMarketFundClaim } from '~/views/dapp/rewards/use-claim-reward'
import {
  resolveTeamClaimError,
  resolveWalletTransactionError,
} from '~/web3/resolve-contract-error-message'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import type { RewardsView } from '~/shared/config/rewards-deep-link'

type SimpleView = Extract<RewardsView, 'grant' | 'genesis'>

const DASH = '—'
const TOKEN_GAGX = 'gAGX'

function useSimpleClaim(view: SimpleView) {
  const market = useMarketFundClaim()
  const genesis = useGenesisRewardClaim()
  if (view === 'grant') return market
  return genesis
}

export function RewardsSimpleClaimWidget({ view }: { view: SimpleView }) {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappShell()
  const card = t.rewards.cards[view]
  const claim = useSimpleClaim(view)
  const { data: teamTotal, isLoading: teamLoading } = useTeamRewardTotal(sessionReady)
  const grant = t.rewards.grant

  // grant: no balance API yet — amount comes from signature at claim time
  // (same honesty pattern as Dao Mixed `signedAmountHint`). Do not hardcode 0 and kill CTA.
  const amountKnown = view === 'genesis'
  const amountValue = amountKnown
    ? claimableAmountValue(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
    : null
  const amountLabel = !sessionReady
    ? t.rewards.hub.signInForBalance
    : amountKnown
      ? formatUsd(Number.isFinite(amountValue ?? NaN) ? (amountValue ?? 0) : 0, 2)
      : t.rewards.detail.signedAmountHint
  const loading = view === 'genesis' && teamLoading
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

  const grantClaimableText = !sessionReady
    ? t.rewards.hub.signInForBalance
    : t.rewards.detail.signedAmountHint
  const grantCtaAmount = !sessionReady ? DASH : `${DASH} ${TOKEN_GAGX}`
  const grantCtaLabel = grant.ctaToWallet.replace('{amount}', grantCtaAmount)

  return (
    <>
      <RewardsSubpageHeader subtitle={card.body} title={card.title} />
      <ExchangeWidgetBody>
        {view === 'grant' ? (
          <>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="grid gap-1">
                  <Text as="p" tone="muted-foreground" variant="caption">
                    {grant.pendingLabel}
                  </Text>
                  <div className="flex items-center gap-2">
                    <DappIcon
                      alt=""
                      className="size-[18px] rounded-full"
                      loading="lazy"
                      size="token"
                      src={dappAssets.tokenGagx}
                    />
                    <Text as="p" className="font-semibold" variant="copy">
                      {TOKEN_GAGX}
                    </Text>
                  </div>
                </div>
                <div className="grid gap-1.5 text-right">
                  <Text as="p" tone="muted-foreground" variant="caption">
                    {grant.pendingHint}
                  </Text>
                  <Text as="p" className="font-semibold" variant="headline">
                    {DASH}
                  </Text>
                </div>
              </div>
              <div className="mt-2.5 grid gap-1">
                <a
                  className="inline-flex w-fit items-center gap-1 text-[13px] font-medium text-primary underline"
                  href={COMMUNITY_SOCIAL_LINKS.telegram}
                  rel="noreferrer"
                  target="_blank"
                >
                  {grant.contactSupport}
                  <ChevronIcon className="size-2.5 -rotate-90 opacity-80" direction="up" />
                </a>
                <Text as="p" tone="muted-foreground" variant="caption">
                  {grant.pendingBody}
                </Text>
              </div>
            </div>

            <div className="flex items-center justify-center py-1.5">
              <span className="inline-flex size-[34px] items-center justify-center rounded-[10px] border border-border bg-card shadow-sm">
                <ChevronIcon className="size-2.5 rotate-180 opacity-70" direction="up" />
              </span>
            </div>

            <div className="grid gap-2 rounded-2xl border border-primary/35 bg-primary/10 p-4">
              <div className="flex items-center justify-between gap-2">
                <Text as="span" variant="copy">
                  {t.rewards.detail.claimable}
                </Text>
                <Text as="span" tone="muted-foreground" variant="caption">
                  {grant.claimIntoWallet}
                </Text>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-card py-1.5 pr-3.5 pl-2">
                  <DappIcon
                    alt=""
                    className="size-6 rounded-2xl"
                    loading="lazy"
                    size="token"
                    src={dappAssets.tokenGagx}
                  />
                  <Text as="span" className="font-semibold" variant="detail">
                    {TOKEN_GAGX}
                  </Text>
                </span>
                <Text as="span" className="text-2xl font-semibold" variant="headline">
                  {grantClaimableText}
                </Text>
              </div>
            </div>
          </>
        ) : (
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
        )}
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
            {view === 'grant' ? grantCtaLabel : t.rewards.claim}
          </DappActionButton>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </ExchangeWidgetBody>
    </>
  )
}
