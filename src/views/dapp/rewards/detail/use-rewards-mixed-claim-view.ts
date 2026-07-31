import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
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
import { queryKeys } from '~/shared/api/query/query-keys'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import {
  REWARDS_GATE_ERROR,
  submitDaoMixedClaim,
  submitLuckyMixedClaim,
} from '~/views/dapp/rewards/submit-rewards'
import {
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

export function useRewardsMixedClaimView(view: MixedClaimView) {
  const { messages: t } = useI18n()
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
    view === 'lucky' ? (luckyQuery.data?.rewardAmount ?? 0n) : 0n /* Dao: signature at submit */

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
    enabled: walletReady && Boolean(account?.address) && (view === 'cobuild' || amount > 0n),
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
  const canConfirm =
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
    if (!account || !wallet) return
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

  return {
    t,
    mixed,
    card,
    walletReady,
    amount,
    amountKnown,
    amountText,
    releasePct,
    setReleasePct,
    restakePct,
    releaseDays,
    setReleaseDays,
    restakeDays,
    setRestakeDays,
    releaseOptions,
    restakeOptions,
    releaseAmountText,
    restakeAmountText,
    requiredText,
    haveText,
    showContributionShort,
    canConfirm,
    submitting,
    luckyPaused: view === 'lucky' && Boolean(luckyQuery.data?.paused),
    luckyNotClaimable:
      view === 'lucky' &&
      Boolean(luckyQuery.data) &&
      !luckyQuery.data?.claimable &&
      !luckyQuery.data?.paused,
    onConfirm: () => void onConfirm(),
  }
}
