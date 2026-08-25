import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  claimDurationDaysLists,
  claimSplitFromReleasePct,
  matchClaimPlanIndices,
  planLabel,
} from '~/core/assets/claim-plans'
import { ZERO_BI } from '~/core/constants'
import {
  formatApiContributionPoints,
  formatContributionPoints,
} from '~/core/exchange/format-contribution-points'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { isDecisionFresh } from '~/core/query/decision-freshness'
import { evaluateRewardsMixedClaimConfirmGate } from '~/core/rewards/mixed-claim-gate'
import { useDaoRewardTypeTotals } from '~/hooks/use-api-data'
import { useAuth } from '~/hooks/use-auth'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { DaoRewardType } from '~/shared/api/types'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatNumber } from '~/shared/presenters/format'
import { hasTypeTotalClaimable, typeTotalAmount } from '~/views/dapp/rewards/hub/claimable'
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
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { WRITE_PATH } from '~/web3/wallet/write-path'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/**
 * 混合领取（幸运 / 共建 / 推荐 / 参与）视图模型
 *
 * 管理释放 / 复投比例与时长、共建奖类型选择，
 * 幸运读 LuckyPool；推荐/参与/共建待领读类型汇总，领取先签名再上链。
 * 计划与 `daoContributionBlocked` 用本地 `useState`（随 dock remount 复位，不跨奖种共享）。
 */
export function useMixedClaim(view: MixedClaimView) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappHost()
  const { data: typeTotals } = useDaoRewardTypeTotals(
    sessionReady && (view === 'cobuild' || view === 'referral' || view === 'participate'),
  )
  const { walletReady, writeReady } = useWriteReadiness()
  const { token, invalidateSession } = useAuth()
  const account = useActiveAccount()
  const card = t.rewards.cards[view]
  const mixed = t.rewards.mixed
  const [releasePct, setReleasePctState] = useState(50)
  const [releaseDays, setReleaseDaysState] = useState(60)
  const [restakeDays, setRestakeDaysState] = useState(540)
  const [cobuildRewardType, setCobuildRewardTypeState] = useState<'RANK_REWARD' | 'SURPASS_REWARD'>(
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
      ? (luckyQuery.data?.totalUnclaimedAmount ?? ZERO_BI)
      : ZERO_BI /* 共建奖：金额在提交签名时才可知 */

  const plansQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsClaimPlans,
    queryFn: () => readClaimPlans(),
    scope: 'public',
    freshness: 'api',
    placeholderData: keepPreviousData,
  })

  const contribQuery = useChainQuery({
    queryKey:
      amount > ZERO_BI
        ? queryKeys.chain.assetsContributionForAmount(amount.toString())
        : queryKeys.chain.assetsContribution,
    queryFn: (address) => readContributionSnapshot(address as Address, amount),
    freshness: 'balances',
    enabled: Boolean(account?.address) && (view !== 'lucky' || amount > ZERO_BI),
    placeholderData: keepPreviousData,
  })

  const { releaseIndex, restakeIndex } = matchClaimPlanIndices(
    plansQuery.data,
    releaseDays,
    restakeDays,
  )
  const luckyContributionOk =
    isDecisionFresh(contribQuery.isPlaceholderData, contribQuery.data) &&
    contribQuery.data!.contribution >= contribQuery.data!.requiredContribution
  const isDaoMixed = view === 'cobuild' || view === 'referral' || view === 'participate'
  const daoRewardType: DaoRewardType =
    view === 'referral'
      ? 'REFERRAL_REWARD'
      : view === 'participate'
        ? 'PARTICIPATION_REWARD'
        : view === 'cobuild'
          ? cobuildRewardType
          : 'RANK_REWARD'
  const preview = isDaoMixed ? typeTotalAmount(typeTotals, daoRewardType) : null
  const hasClaimablePreview = hasTypeTotalClaimable(preview)
  const contributionOk = isDaoMixed ? !daoContributionBlocked : luckyContributionOk
  const plansOk =
    isDecisionFresh(plansQuery.isPlaceholderData, plansQuery.data) &&
    releaseIndex != null &&
    restakeIndex != null
  const luckyOk =
    view !== 'lucky' ||
    (isDecisionFresh(luckyQuery.isPlaceholderData, luckyQuery.data) &&
      luckyQuery.data!.claimable &&
      !luckyQuery.data!.paused)

  const claim = useChainMutation({
    path: view === 'lucky' ? WRITE_PATH.REWARD_LUCKY_MIXED : WRITE_PATH.REWARD_DAO_MIXED,
    mutation: async (_vars, session) => {
      if (view === 'lucky') {
        const rounds = luckyQuery.data?.unclaimedRounds ?? []
        if (!luckyQuery.data?.claimable || rounds.length === 0) {
          throw REWARDS_BLOCKED.luckyNotClaimable
        }
        await submitLuckyMixedClaim({
          session,
          roundIds: rounds.map((r) => r.roundId),
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
      toast.success(restakePct === 100 ? t.rewards.restakeSuccess : t.rewards.claimSuccess)
    },
    onError: (error) => {
      if (isDaoMixed && readErrorText(error) === REWARDS_BLOCKED.insufficientContribution) {
        setDaoContributionBlocked(true)
      }
    },
  })

  function setReleasePct(value: number) {
    setDaoContributionBlocked(false)
    setReleasePctState(value)
  }

  function setReleaseDays(value: number) {
    setDaoContributionBlocked(false)
    setReleaseDaysState(value)
  }

  function setRestakeDays(value: number) {
    setDaoContributionBlocked(false)
    setRestakeDaysState(value)
  }

  function setCobuildRewardType(value: 'RANK_REWARD' | 'SURPASS_REWARD') {
    setDaoContributionBlocked(false)
    setCobuildRewardTypeState(value)
  }

  const canConfirm = evaluateRewardsMixedClaimConfirmGate({
    walletReady,
    writeReady,
    sessionReady,
    isPending: claim.isPending,
    contributionOk,
    plansOk,
    luckyOk,
    claimable: amount,
    allowUnknownAmount: isDaoMixed && hasClaimablePreview,
  })

  const { releaseDays: releaseDaysList, restakeDays: restakeDaysList } = claimDurationDaysLists(
    plansQuery.data,
  )

  const releaseOptions = releaseDaysList.map((days) => ({
    label: planLabel(
      days,
      plansQuery.data?.releasePlans,
      mixed.daysTax,
      mixed.releaseDays,
      mixed.taxRate,
    ),
    value: String(days),
  }))
  const restakeOptions = restakeDaysList.map((days) => ({
    label: planLabel(
      days,
      plansQuery.data?.restakePlans,
      mixed.daysTax,
      mixed.restakeDays,
      mixed.taxRate,
    ),
    value: String(days),
  }))

  const amountKnown = view === 'lucky' ? luckyQuery.data != null : sessionReady
  const awaitingDaoSignature = isDaoMixed && sessionReady
  const previewOrZero = preview ?? 0
  const amountText =
    view === 'lucky'
      ? amountKnown
        ? formatTokenAmount(amount, AGX_DECIMALS)
        : formatApiAmount(null)
      : sessionReady
        ? formatNumber(previewOrZero, { digits: 4 })
        : t.rewards.hub.signInForBalance
  const releaseAmount =
    view === 'lucky' && amountKnown ? splitAmountByPct(amount, releasePct) : ZERO_BI
  const restakeAmount =
    view === 'lucky' && amountKnown ? splitAmountByPct(amount, restakePct) : ZERO_BI
  const releaseAmountText =
    view === 'lucky'
      ? amountKnown
        ? formatTokenAmount(releaseAmount, AGX_DECIMALS)
        : formatApiAmount(null)
      : sessionReady
        ? formatNumber((previewOrZero * releasePct) / 100, { digits: 4 })
        : formatApiAmount(null)
  const restakeAmountText =
    view === 'lucky'
      ? amountKnown
        ? formatTokenAmount(restakeAmount, AGX_DECIMALS)
        : formatApiAmount(null)
      : sessionReady
        ? formatNumber((previewOrZero * restakePct) / 100, { digits: 4 })
        : formatApiAmount(null)
  const requiredText = contribQuery.data
    ? formatContributionPoints(contribQuery.data.requiredContribution, AGX_DECIMALS)
    : formatApiContributionPoints(null)
  const haveText = contribQuery.data
    ? formatContributionPoints(contribQuery.data.contribution, AGX_DECIMALS)
    : formatApiContributionPoints(null)
  const showContributionShort =
    !contributionOk &&
    (view === 'lucky' ? amount > ZERO_BI && contribQuery.data != null : daoContributionBlocked)

  function onConfirm() {
    if (!canConfirm) return
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
    showSignedAmountHint: awaitingDaoSignature,
    hasClaimablePreview,
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
    setCobuildRewardType,
    cobuildRewardTypeOptions: [
      { label: t.rewards.cobuild.recordsTabCobuild, value: 'RANK_REWARD' },
      { label: t.rewards.cobuild.recordsTabEqualize, value: 'SURPASS_REWARD' },
    ],
    onConfirm,
  }
}
