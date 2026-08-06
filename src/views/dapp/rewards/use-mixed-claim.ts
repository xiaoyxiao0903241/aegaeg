import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  claimSplitFromReleasePct,
  matchClaimPlanIndices,
  planLabel,
  RELEASE_DURATION_DAYS,
  type ReleaseDurationDays,
  RESTAKE_DURATION_DAYS,
  type RestakeDurationDays,
} from '~/core/assets/claim-plans'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { useAuth } from '~/hooks/use-auth'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { DaoRewardType } from '~/shared/api/types'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatApiAmount, type MixedClaimView, splitAmountByPct } from '~/views/dapp/rewards/shared'
import {
  REWARDS_BLOCKED,
  submitDaoMixedClaim,
  submitLuckyMixedClaim,
} from '~/views/dapp/rewards/submit-rewards'
import { readClaimPlans, readContributionSnapshot } from '~/web3/assets/assets-read'
import { readErrorText } from '~/web3/errors/error-text'
import { readLuckyClaimSnapshot } from '~/web3/rewards/rewards-read'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/**
 * 混合领取（幸运 / 共建）视图模型
 *
 * 管理释放 / 复投比例与时长、共建奖类型选择，
 * 汇总链上领取快照、释放计划与贡献校验，决定提交按钮可用性。
 */
export function useMixedClaim(view: MixedClaimView) {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappHost()
  const { token, invalidateSession } = useAuth()
  const account = useActiveAccount()
  const card = t.rewards.cards[view]
  const mixed = t.rewards.mixed
  const [releasePct, setReleasePct] = useState(50)
  const [releaseDays, setReleaseDays] = useState<ReleaseDurationDays>(60)
  const [restakeDays, setRestakeDays] = useState<RestakeDurationDays>(540)
  /** 共建奖每次提交只能选一个账本：等级奖励 或 超越奖励（一次订单一种类型） */
  const [cobuildRewardType, setCobuildRewardType] = useState<'RANK_REWARD' | 'SURPASS_REWARD'>(
    'RANK_REWARD',
  )
  /** 共建奖金额需领取签名后才可知；实时校验发现贡献不足时置位 */
  const [daoContributionBlocked, setDaoContributionBlocked] = useState(false)
  const { restakePct } = claimSplitFromReleasePct(releasePct)

  const luckyQuery = useChainQuery({
    queryKey: queryKeys.chain.rewardsLuckyClaim,
    queryFn: (address) => readLuckyClaimSnapshot(address as Address),
    enabled: Boolean(account?.address),
    placeholderData: keepPreviousData,
  })

  const amount =
    view === 'lucky'
      ? (luckyQuery.data?.rewardAmount ?? 0n)
      : 0n /* 共建奖：金额在提交签名时才可知 */

  const plansQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsClaimPlans,
    queryFn: () => readClaimPlans(),
    scope: 'public',
    freshness: 'api',
    placeholderData: keepPreviousData,
  })

  const contribQuery = useChainQuery({
    queryKey:
      amount > 0n
        ? queryKeys.chain.assetsContributionForAmount(amount.toString())
        : queryKeys.chain.assetsContribution,
    queryFn: (address) => readContributionSnapshot(address as Address, amount),
    freshness: 'balances',
    enabled: Boolean(account?.address) && (view !== 'lucky' || amount > 0n),
    placeholderData: keepPreviousData,
  })

  const { releaseIndex, restakeIndex } = matchClaimPlanIndices(
    plansQuery.data,
    releaseDays,
    restakeDays,
  )
  const luckyContributionOk =
    contribQuery.data != null &&
    contribQuery.data.contribution >= contribQuery.data.requiredContribution
  const isDaoMixed = view === 'cobuild'
  const daoRewardType: DaoRewardType = view === 'cobuild' ? cobuildRewardType : 'RANK_REWARD'
  const contributionOk = isDaoMixed ? !daoContributionBlocked : luckyContributionOk
  const plansOk = releaseIndex != null && restakeIndex != null
  const luckyOk =
    view !== 'lucky' ||
    (luckyQuery.data != null && luckyQuery.data.claimable && !luckyQuery.data.paused)

  const claim = useChainMutation({
    path: WRITE_PATH.REWARD_CLAIM,
    mutation: async (_vars, session) => {
      if (view === 'lucky') {
        await submitLuckyMixedClaim({
          session,
          releaseDays,
          restakeDays,
          restakePct,
        })
        return
      }
      await submitDaoMixedClaim({
        session,
        token: token ?? '',
        onUnauthorized: invalidateSession,
        rewardType: daoRewardType,
        releaseDays,
        restakeDays,
        restakePct,
      })
    },
    onSuccess: () => {
      toast.success(t.rewards.claimSuccess)
    },
    onError: (error) => {
      if (isDaoMixed && readErrorText(error) === REWARDS_BLOCKED.insufficientContribution) {
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
    (isDaoMixed || amount > 0n)

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
      ? formatApiAmount(null)
      : t.rewards.hub.signInForBalance
  const releaseAmount = amountKnown ? splitAmountByPct(amount, releasePct) : 0n
  const restakeAmount = amountKnown ? splitAmountByPct(amount, restakePct) : 0n
  const releaseAmountText = amountKnown
    ? formatTokenAmount(releaseAmount, AGX_DECIMALS)
    : formatApiAmount(null)
  const restakeAmountText = amountKnown
    ? formatTokenAmount(restakeAmount, AGX_DECIMALS)
    : formatApiAmount(null)
  const requiredText = contribQuery.data
    ? formatTokenAmount(contribQuery.data.requiredContribution, AGX_DECIMALS)
    : formatApiAmount(null)
  const haveText = contribQuery.data
    ? formatTokenAmount(contribQuery.data.contribution, AGX_DECIMALS)
    : formatApiAmount(null)
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
    showCobuildRewardType: view === 'cobuild',
    cobuildRewardType,
    setCobuildRewardType: (value: 'RANK_REWARD' | 'SURPASS_REWARD') => {
      setDaoContributionBlocked(false)
      setCobuildRewardType(value)
    },
    cobuildRewardTypeOptions: [
      { label: t.rewards.cobuild.recordsTabCobuild, value: 'RANK_REWARD' },
      { label: t.rewards.cobuild.recordsTabEqualize, value: 'SURPASS_REWARD' },
    ],
    onConfirm,
  }
}
