import { useState } from 'react'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappIcon } from '~/app/shell/dapp-icon'
import { useDappShell } from '~/app/use-dapp-shell'
import { useAuth } from '~/hooks/use-auth'
import {
  RELEASE_DURATION_DAYS,
  RESTAKE_DURATION_DAYS,
  matchPlanIndexByDurationDays,
  type ReleaseDurationDays,
  type RestakeDurationDays,
} from '~/core/assets/claim-plans'
import { claimSplitFromReleasePct } from '~/core/assets/claim-plans'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { ClaimSplitSlider } from '~/shared/ui/claim-split-slider'
import { Text } from '~/shared/ui/text'
import { openExchangeView } from '~/shared/config/open-exchange-view'
import { queryKeys } from '~/shared/api/query/query-keys'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { dappAssets } from '~/app/assets'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { RewardsPlanPicker } from '~/views/dapp/rewards/detail/rewards-plan-picker'
import {
  REWARDS_GATE_ERROR,
  submitDaoMixedClaim,
  submitLuckyMixedClaim,
} from '~/views/dapp/rewards/submit-rewards'
import {
  isMixedWriteDeferred,
  planLabel,
  REWARDS_DASH,
  splitAmountByPct,
  type MixedClaimView,
} from '~/views/dapp/rewards/rewards-display'
import { readLuckyClaimSnapshot } from '~/web3/rewards/rewards-read'
import { readClaimPlans, readContributionSnapshot } from '~/web3/assets/assets-read'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import type { Address } from '~/shared/config/contracts'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export function RewardsMixedClaimWidget({ view }: { view: MixedClaimView }) {
  const { messages: t } = useI18n()
  const setView = useRewardsViewStore((state) => state.setView)
  const { walletReady, sessionReady } = useDappShell()
  const { token, invalidateSession } = useAuth()
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const readClient = useChainReadClient()
  const card = t.rewards.cards[view]
  const mixed = t.rewards.mixed
  const [releasePct, setReleasePct] = useState(50)
  const [releaseDays, setReleaseDays] = useState<ReleaseDurationDays>(60)
  const [restakeDays, setRestakeDays] = useState<RestakeDurationDays>(540)
  const [submitting, setSubmitting] = useState(false)
  /** Dao amount unknown until signature; set when live gate reports insufficient contribution. */
  const [daoContributionBlocked, setDaoContributionBlocked] = useState(false)
  const { restakePct } = claimSplitFromReleasePct(releasePct)
  const locked = isUnknownReceiptLocked(WRITE_PATH.REWARD_CLAIM)

  const luckyQuery = useQuery({
    queryKey: queryKeys.chain.rewardsLuckyClaim(account?.address ?? ''),
    queryFn: () => readLuckyClaimSnapshot(readClient, account!.address as Address),
    enabled: view === 'lucky' && walletReady && Boolean(account?.address),
  })

  const amount =
    view === 'lucky'
      ? (luckyQuery.data?.rewardAmount ?? 0n)
      : 0n /* Dao: signature at submit · referral/participate: no Mixed read yet */

  const plansQuery = useQuery({
    queryKey: queryKeys.chain.assetsClaimPlans,
    queryFn: () => readClaimPlans(readClient),
  })

  const contribQuery = useQuery({
    queryKey:
      amount > 0n
        ? queryKeys.chain.assetsContributionForAmount(account?.address ?? '', amount.toString())
        : queryKeys.chain.assetsContribution(account?.address ?? ''),
    queryFn: () => readContributionSnapshot(account!.address as Address, amount, readClient),
    enabled:
      walletReady &&
      Boolean(account?.address) &&
      (view === 'cobuild' || isMixedWriteDeferred(view) || amount > 0n),
  })

  const releaseIndex = plansQuery.data
    ? matchPlanIndexByDurationDays(plansQuery.data.releasePlans, releaseDays)
    : null
  const restakeIndex = plansQuery.data
    ? matchPlanIndexByDurationDays(plansQuery.data.restakePlans, restakeDays)
    : null
  const luckyContributionOk =
    contribQuery.data != null &&
    contribQuery.data.contribution >= contribQuery.data.requiredContribution
  const contributionOk = view === 'cobuild' ? !daoContributionBlocked : luckyContributionOk
  const plansOk = releaseIndex != null && restakeIndex != null
  const luckyOk =
    view !== 'lucky' ||
    (luckyQuery.data != null && luckyQuery.data.claimable && !luckyQuery.data.paused)
  /** Referral / participate Mixed write not in handbook — UI chrome only; fail-closed CTA. */
  const canConfirm =
    !isMixedWriteDeferred(view) &&
    walletReady &&
    sessionReady &&
    !locked &&
    !submitting &&
    plansOk &&
    luckyOk &&
    contributionOk &&
    (view === 'cobuild' || amount > 0n)

  const releaseOptions = RELEASE_DURATION_DAYS.map((days) => ({
    label: planLabel(
      days,
      plansQuery.data?.releasePlans,
      mixed.daysTax,
      mixed.releaseDays,
      mixed.taxRate,
    ),
    value: String(days),
  }))
  const restakeOptions = RESTAKE_DURATION_DAYS.map((days) => ({
    label: planLabel(
      days,
      plansQuery.data?.restakePlans,
      mixed.daysTax,
      mixed.restakeDays,
      mixed.taxRate,
    ),
    value: String(days),
  }))

  const amountKnown = view === 'lucky' && luckyQuery.data != null
  const amountText = amountKnown
    ? formatTokenAmount(amount, AGX_DECIMALS)
    : isMixedWriteDeferred(view)
      ? REWARDS_DASH
      : sessionReady
        ? t.rewards.hub.balancePlaceholder
        : t.rewards.hub.signInForBalance
  const releaseAmount = amountKnown ? splitAmountByPct(amount, releasePct) : 0n
  const restakeAmount = amountKnown ? splitAmountByPct(amount, restakePct) : 0n
  const releaseAmountText = amountKnown
    ? formatTokenAmount(releaseAmount, AGX_DECIMALS)
    : REWARDS_DASH
  const restakeAmountText = amountKnown
    ? formatTokenAmount(restakeAmount, AGX_DECIMALS)
    : REWARDS_DASH
  const requiredText = contribQuery.data
    ? formatTokenAmount(contribQuery.data.requiredContribution, AGX_DECIMALS)
    : REWARDS_DASH
  const haveText = contribQuery.data
    ? formatTokenAmount(contribQuery.data.contribution, AGX_DECIMALS)
    : REWARDS_DASH
  const showContributionShort =
    !contributionOk &&
    (view === 'lucky' ? amount > 0n && contribQuery.data != null : daoContributionBlocked)

  async function onConfirm() {
    if (!account || !wallet || isMixedWriteDeferred(view)) return
    setDaoContributionBlocked(false)
    setSubmitting(true)
    try {
      const result =
        view === 'lucky'
          ? await submitLuckyMixedClaim({
              releaseDays,
              restakeDays,
              restakePct,
              account,
              wallet,
              readClient,
            })
          : await submitDaoMixedClaim({
              token: token ?? '',
              onUnauthorized: invalidateSession,
              releaseDays,
              restakeDays,
              restakePct,
              account,
              wallet,
              readClient,
            })
      if (!result.ok) {
        if (result.error === REWARDS_GATE_ERROR.insufficientContribution) {
          if (view === 'cobuild') setDaoContributionBlocked(true)
          presentUserFacingError(result.error, () => mixed.insufficientContribution, {
            id: `rewards-mixed:${view}`,
          })
          return
        }
        if (result.error === REWARDS_GATE_ERROR.luckyPaused) {
          presentUserFacingError(result.error, () => mixed.luckyPaused, {
            id: `rewards-mixed:${view}`,
          })
          return
        }
        presentUserFacingError(
          result.error,
          (err) =>
            resolveWalletTransactionError(err, t.wallet.transactionErrors) ??
            readErrorText(err) ??
            t.errors.chain.fallback,
          { id: `rewards-mixed:${view}` },
        )
        return
      }
      toast.success(t.rewards.claimSuccess)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <DappTabHeader
        backText={t.rewards.backToHub}
        onBack={() => setView('hub')}
        subtitle={card.body}
        title={card.title}
      />
      <DappWidgetStack>
        <Card surface="outlined" className="rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="grid gap-1">
              <Text as="p" tone="muted-foreground" variant="caption">
                {t.rewards.detail.claimable}
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
                  {amountKnown ? `${amountText} ${mixed.tokenGagx}` : amountText}
                </Text>
              </div>
            </div>
            <div className="grid gap-1.5 text-right">
              <Text as="p" tone="muted-foreground" variant="caption">
                {mixed.requiredContributionLabel}
              </Text>
              <Text as="p" className="font-semibold" variant="copy">
                {view === 'lucky' && amount > 0n ? requiredText : REWARDS_DASH}
              </Text>
            </div>
          </div>
          {view === 'lucky' && luckyQuery.data?.paused ? (
            <Text as="p" className="mt-2 text-destructive" variant="caption">
              {mixed.luckyPaused}
            </Text>
          ) : null}
          {view === 'lucky' &&
          luckyQuery.data &&
          !luckyQuery.data.claimable &&
          !luckyQuery.data.paused ? (
            <Text as="p" className="mt-2" tone="muted-foreground" variant="caption">
              {mixed.luckyNotClaimable}
            </Text>
          ) : null}
          {view === 'referral' ? (
            <Text as="p" className="mt-2" tone="muted-foreground" variant="caption">
              {mixed.referralWritePending}
            </Text>
          ) : null}
          {view === 'participate' ? (
            <Text as="p" className="mt-2" tone="muted-foreground" variant="caption">
              {mixed.participateWritePending}
            </Text>
          ) : null}
        </Card>

        {showContributionShort ? (
          <div className="rounded-2xl bg-primary/10 px-4 py-3">
            <Text as="p" className="leading-[18px]" variant="caption">
              <span className="text-foreground">
                {mixed.insufficientContributionDetail
                  .replace('{need}', requiredText)
                  .replace('{have}', haveText)}
              </span>{' '}
              <Button
                className="inline underline"
                onClick={() => openExchangeView('burn')}
                size="sm"
                type="button"
                variant="link"
              >
                {mixed.goBurnInline}
              </Button>
              <span className="text-foreground">{mixed.getContributionSuffix}</span>
            </Text>
          </div>
        ) : null}

        <Card surface="outlined" className="rounded-2xl p-4">
          <ClaimSplitSlider
            aria-label={mixed.splitAria}
            className="max-w-none"
            onChange={setReleasePct}
            value={releasePct}
          />
          <div className="mt-1 flex justify-between gap-2">
            <Text as="span" className="font-semibold text-primary" variant="detail">
              {mixed.releasePct.replace('{pct}', String(releasePct))}
            </Text>
            <Text
              as="span"
              className="font-semibold text-[var(--app-claim-restake)]"
              variant="detail"
            >
              {mixed.restakePct.replace('{pct}', String(restakePct))}
            </Text>
          </div>
        </Card>

        <div className="grid gap-3 rounded-2xl border border-primary/35 bg-primary/10 p-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="span" className="text-primary" variant="copy">
              {t.rewards.claim}
            </Text>
            <Text as="span" tone="muted-foreground" variant="caption">
              {mixed.releaseInto}
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
                {mixed.tokenGagx}
              </Text>
            </span>
            <Text as="span" className="text-2xl font-semibold" variant="headline">
              {releaseAmountText}
            </Text>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Text as="span" tone="muted-foreground" variant="caption">
              {mixed.releasePeriod}
            </Text>
            <RewardsPlanPicker
              ariaLabel={mixed.releaseAria}
              onSelect={(value) => setReleaseDays(Number(value) as ReleaseDurationDays)}
              options={releaseOptions}
              value={String(releaseDays)}
            />
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--app-claim-restake)_35%,transparent)] bg-[color-mix(in_oklab,var(--app-claim-restake)_8%,white)] p-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="span" className="text-[var(--app-claim-restake)]" variant="copy">
              {mixed.restakeLabel}
            </Text>
            <Text as="span" tone="muted-foreground" variant="caption">
              {mixed.restakeInto}
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
                {mixed.tokenGagx}
              </Text>
            </span>
            <Text as="span" className="text-2xl font-semibold" variant="headline">
              {restakeAmountText}
            </Text>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Text as="span" tone="muted-foreground" variant="caption">
              {mixed.restakePeriod}
            </Text>
            <RewardsPlanPicker
              ariaLabel={mixed.restakeAria}
              onSelect={(value) => setRestakeDays(Number(value) as RestakeDurationDays)}
              options={restakeOptions}
              value={String(restakeDays)}
            />
          </div>
        </div>

        {walletReady ? (
          <DappActionButton
            disabled={!canConfirm}
            loading={submitting}
            onClick={() => void onConfirm()}
          >
            <span className="flex flex-col items-start gap-0.5 leading-tight">
              <span>
                {mixed.ctaReleaseLine.replace(
                  '{amount}',
                  `${releaseAmountText} ${mixed.tokenGagx}`,
                )}
              </span>
              <span>
                {mixed.ctaRestakeLine.replace(
                  '{amount}',
                  `${restakeAmountText} ${mixed.tokenGagx}`,
                )}
              </span>
            </span>
          </DappActionButton>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </DappWidgetStack>
    </>
  )
}
