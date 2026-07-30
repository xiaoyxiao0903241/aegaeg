import { useEffect, useEffectEvent } from 'react'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { dappAssets } from '~/app/assets'
import { COMMUNITY_SOCIAL_LINKS } from '~/shared/config/community-links'
import { formatUsd } from '~/shared/api/format-display'
import { useCommunityFundTotal } from '~/hooks/use-api-data'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { ChevronIcon } from '~/shared/ui/chevron-icon'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import {
  useCommunityFundClaim,
  useIncentiveClaim,
  useMarketFundClaim,
} from '~/views/dapp/rewards/use-claim-reward'
import {
  resolveTeamClaimError,
  resolveWalletTransactionError,
} from '~/web3/resolve-contract-error-message'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { REWARDS_DASH, REWARDS_LOADING } from '~/views/dapp/rewards/rewards-display'

const TOKEN_GAGX = 'gAGX'

type SimpleClaimView = 'grant' | 'participate' | 'referral'

export function RewardsSimpleClaimWidget({ view }: { view: SimpleClaimView }) {
  const { messages: t } = useI18n()
  const setView = useRewardsViewStore((state) => state.setView)
  const { walletReady, sessionReady } = useDappShell()
  const card = t.rewards.cards[view]
  const marketClaim = useMarketFundClaim()
  const incentiveClaim = useIncentiveClaim()
  const communityClaim = useCommunityFundClaim()
  const claim =
    view === 'grant' ? marketClaim : view === 'participate' ? incentiveClaim : communityClaim
  const grant = t.rewards.grant
  const participate = t.rewards.participateClaim
  const referral = t.rewards.referralClaim
  const copy = view === 'grant' ? grant : view === 'participate' ? participate : referral
  const { data: communityFundTotal, isLoading: communityLoading } =
    useCommunityFundTotal(sessionReady)

  const referralAmountRaw = communityFundTotal?.unlocked_claimable
  const referralAmount = referralAmountRaw != null ? Number(referralAmountRaw) : Number.NaN
  const referralAmountKnown = view === 'referral'
  const referralAmountOk =
    !referralAmountKnown || (Number.isFinite(referralAmount) && referralAmount > 0)
  /** Same CommunityFund as genesis 发展基金 (pre-leaf dual entry); amount gate only — node gate is backend/sign. */

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

  const claimableText = !sessionReady
    ? t.rewards.hub.signInForBalance
    : view === 'referral'
      ? communityLoading && referralAmountRaw == null
        ? REWARDS_LOADING
        : formatUsd(Number.isFinite(referralAmount) ? referralAmount : 0, 2)
      : t.rewards.detail.signedAmountHint
  const ctaAmount = !sessionReady
    ? REWARDS_DASH
    : view === 'referral'
      ? communityLoading && referralAmountRaw == null
        ? REWARDS_LOADING
        : formatUsd(Number.isFinite(referralAmount) ? referralAmount : 0, 2)
      : `${REWARDS_DASH} ${TOKEN_GAGX}`
  const ctaLabel = copy.ctaToWallet.replace('{amount}', ctaAmount)
  const showTokenChip = view !== 'referral'
  const canSubmit =
    sessionReady &&
    referralAmountOk &&
    !(view === 'referral' && communityLoading) &&
    !claim.isClaiming &&
    claim.canClaim

  return (
    <>
      <DappTabHeader
        backText={t.rewards.backToHub}
        onBack={() => setView('hub')}
        subtitle={card.body}
        title={card.title}
      />
      <DappWidgetStack>
        {view === 'grant' ? (
          <>
            <Card surface="outlined" className="rounded-2xl p-4">
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
                    {REWARDS_DASH}
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
                  <Text as="span" className="text-[13px] font-medium text-primary" variant="detail">
                    {grant.contactSupport}
                  </Text>
                  <ChevronIcon className="size-2.5 -rotate-90 opacity-80" direction="up" />
                </a>
                <Text as="p" tone="muted-foreground" variant="caption">
                  {grant.pendingBody}
                </Text>
              </div>
            </Card>

            <div className="flex items-center justify-center py-1.5">
              <span className="inline-flex size-[34px] items-center justify-center rounded-[10px] border border-border bg-card shadow-sm">
                <ChevronIcon className="size-2.5 rotate-180 opacity-70" direction="up" />
              </span>
            </div>
          </>
        ) : null}

        <div className="grid gap-2 rounded-2xl border border-primary/35 bg-primary/10 p-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="span" variant="copy">
              {t.rewards.detail.claimable}
            </Text>
            <Text as="span" tone="muted-foreground" variant="caption">
              {copy.claimIntoWallet}
            </Text>
          </div>
          <div className="flex items-center justify-between gap-2">
            {showTokenChip ? (
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
            ) : (
              <Text as="span" className="font-semibold" variant="detail">
                USD
              </Text>
            )}
            <Text as="span" className="text-2xl font-semibold" variant="headline">
              {claimableText}
            </Text>
          </div>
          {view === 'participate' ? (
            <Text as="p" tone="muted-foreground" variant="caption">
              {participate.simpleHint}
            </Text>
          ) : null}
          {view === 'referral' ? (
            <Text as="p" tone="muted-foreground" variant="caption">
              {referral.simpleHint}
            </Text>
          ) : null}
          {view === 'referral' && sessionReady && !referralAmountOk ? (
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.rewards.detail.emptyClaimable}
            </Text>
          ) : null}
        </div>

        {walletReady ? (
          <DappActionButton
            disabled={!canSubmit}
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
            {ctaLabel}
          </DappActionButton>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </DappWidgetStack>
    </>
  )
}
