import { useState } from 'react'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { useAuth } from '~/hooks/use-auth'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
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
import { readErrorText } from '~/web3/errors/error-text'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
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
  /** Dao amount unknown until signature; set when live gate reports insufficient contribution. */
  const [daoContributionBlocked, setDaoContributionBlocked] = useState(false)
  const { restakePct } = claimSplitFromReleasePct(releasePct)

  const luckyQuery = useChainQuery({
    queryKey: queryKeys.chain.rewardsLuckyClaim,
    queryFn: (address) => readLuckyClaimSnapshot(address as Address),
    enabled: view === 'lucky',
  })

  const amount =
    view === 'lucky' ? (luckyQuery.data?.rewardAmount ?? 0n) : 0n /* Dao: signature at submit */

  const plansQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsClaimPlans,
    queryFn: () => readClaimPlans(),
    scope: 'public',
    freshness: 'api',
  })

  const contribQuery = useChainQuery(
    amount > 0n
      ? {
          scope: 'public' as const,
          queryKey: queryKeys.chain.assetsContributionForAmount(
            account?.address ?? '',
            amount.toString(),
          ),
          queryFn: () => readContributionSnapshot(account!.address as Address, amount),
          freshness: 'balances' as const,
          enabled: Boolean(account?.address) && (view === 'cobuild' || amount > 0n),
        }
      : {
          queryKey: queryKeys.chain.assetsContribution,
          queryFn: (address: string) => readContributionSnapshot(address as Address, amount),
          freshness: 'balances' as const,
          enabled: view === 'cobuild' || amount > 0n,
        },
  )

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

  const claim = useChainMutation({
    path: WRITE_PATH.REWARD_CLAIM,
    mutation: async () => {
      if (!account || !wallet) throw WALLET_GATE_ERROR.NOT_CONNECTED
      if (view === 'lucky') {
        await submitLuckyMixedClaim({
          releaseDays,
          restakeDays,
          restakePct,
          account,
          wallet,
          readClient,
        })
        return
      }
      await submitDaoMixedClaim({
        token: token ?? '',
        onUnauthorized: invalidateSession,
        releaseDays,
        restakeDays,
        restakePct,
        account,
        wallet,
        readClient,
      })
    },
    onSuccess: () => {
      toast.success(t.rewards.claimSuccess)
    },
    onError: (error) => {
      if (
        view === 'cobuild' &&
        readErrorText(error) === REWARDS_GATE_ERROR.insufficientContribution
      ) {
        setDaoContributionBlocked(true)
      }
    },
  })

  const canConfirm =
    walletReady &&
    sessionReady &&
    !claim.isLocked &&
    !claim.isPending &&
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

  function onConfirm() {
    setDaoContributionBlocked(false)
    void claim.mutate()
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
    submitting: claim.isPending,
    luckyPaused: view === 'lucky' && Boolean(luckyQuery.data?.paused),
    luckyNotClaimable:
      view === 'lucky' &&
      Boolean(luckyQuery.data) &&
      !luckyQuery.data?.claimable &&
      !luckyQuery.data?.paused,
    onConfirm,
  }
}
