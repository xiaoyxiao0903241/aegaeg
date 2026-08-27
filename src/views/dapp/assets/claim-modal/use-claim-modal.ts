import { keepPreviousData } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { evaluateAssetsClaimConfirmGate } from '~/core/assets/claim-output'
import {
  claimDurationDaysLists,
  claimSplitFromReleasePct,
  matchClaimPlanIndices,
  planLabel,
} from '~/core/assets/claim-plans'
import { HUNDRED_BI, ZERO_BI } from '~/core/constants'
import { formatContributionPoints } from '~/core/exchange/format-contribution-points'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { isDecisionFresh } from '~/core/query/decision-freshness'
import { previewDaoClaimContribution } from '~/core/rewards/claim-contribution'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { type MixedClaimTarget, submitMixedClaim } from '~/views/dapp/assets/submit-assets'
import { openExchangeView } from '~/views/dapp/shared/navigation'
import {
  readClaimPlans,
  readContributionSnapshot,
  readMixedRewardAvailable,
} from '~/web3/assets/assets-read'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { WRITE_PATH } from '~/web3/wallet/write-path'

const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals
const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/**
 * 领奖弹窗的状态编排：释放比例、释放 / 复投周期选择、
 * 贡献值与计划可用性校验，以及提交成功后的关闭处理。
 * 计划选择用本地 `useState`（随 modal remount / key 复位）。
 * RewardQueue 默认计划 plan3=60 天费率最低，故默认选中 60。
 * 展示与确认门闸跟提交时同一笔链上可领，不用打开弹窗时冻住的数。
 * 所需贡献按领取额 1:1，不读 quoteRequiredContribution。
 */
export function useAssetsClaimModal(args: {
  open: boolean
  onOpenChange: (open: boolean) => void
  capturedAddress: string
  target: MixedClaimTarget
}) {
  const { open, onOpenChange, capturedAddress, target } = args
  const { messages: t } = useI18n()
  const { walletReady, writeReady } = useWriteReadiness()
  const account = useActiveAccount()
  const [releasePct, setReleasePctState] = useState(50)
  const [releaseDays, setReleaseDaysState] = useState(60)
  const [restakeDays, setRestakeDaysState] = useState(540)
  const { restakePct } = claimSplitFromReleasePct(releasePct)

  useEffect(() => {
    const current = account?.address
    if (!current || current.toLowerCase() !== capturedAddress.toLowerCase()) {
      onOpenChange(false)
    }
  }, [account?.address, capturedAddress, onOpenChange])

  const claim = useChainMutation({
    path: WRITE_PATH.ASSETS_CLAIM,
    mutation: (_vars, session) =>
      submitMixedClaim({
        session,
        capturedAddress,
        target,
        releaseDays,
        restakeDays,
        restakePct,
      }),
    onSuccess: () => {
      toast.success(restakePct === 100 ? t.assets.claim.restakeSuccess : t.assets.claim.success)
      onOpenChange(false)
    },
  })

  const plansQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsClaimPlans,
    queryFn: () => readClaimPlans(),
    scope: 'public',
    freshness: 'api',
    enabled: open,
    placeholderData: keepPreviousData,
  })

  const rewardRead =
    target.source === 'locked'
      ? {
          source: 'locked' as const,
          pool: target.pool,
          stakeIndex: target.stakeIndex,
          extra: target.entries[0]?.extra === true,
        }
      : target.source === 'liquid'
        ? ({ source: 'liquid' } as const)
        : ({
            source: 'bond',
            depository: target.depository,
            bondIndex: target.bondIndex,
          } as const)
  const availableQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsMixedRewardAvailable(
      rewardRead.source === 'locked'
        ? `locked:${rewardRead.pool}:${rewardRead.stakeIndex}:${String(rewardRead.extra)}`
        : rewardRead.source === 'liquid'
          ? 'liquid'
          : `bond:${rewardRead.depository}:${rewardRead.bondIndex}`,
    ),
    queryFn: (address) => readMixedRewardAvailable(rewardRead, address as Address),
    enabled: open && Boolean(account?.address),
  })
  const availableFresh = isDecisionFresh(availableQuery.isPlaceholderData, availableQuery.data)
  const claimable = availableFresh ? availableQuery.data! : target.amount

  const contribQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsContributionForAmount(String(claimable)),
    queryFn: (address) => readContributionSnapshot(address as Address, claimable, false),
    enabled: open && availableFresh && Boolean(account?.address),
  })

  const { releaseIndex, restakeIndex } = matchClaimPlanIndices(
    plansQuery.data,
    releaseDays,
    restakeDays,
  )
  const contributionOk =
    previewDaoClaimContribution({
      claimAmountWei: claimable > ZERO_BI ? claimable : null,
      availableWei: isDecisionFresh(contribQuery.isPlaceholderData, contribQuery.data)
        ? contribQuery.data!.contribution
        : null,
    })?.ok === true
  const plansOk =
    isDecisionFresh(plansQuery.isPlaceholderData, plansQuery.data) &&
    releaseIndex != null &&
    restakeIndex != null
  const canConfirm =
    availableFresh &&
    evaluateAssetsClaimConfirmGate({
      walletReady,
      writeReady,
      isPending: claim.isPending,
      contributionOk,
      plansOk,
      claimable,
      decimals: GAGX_DECIMALS,
    })

  const releaseAmount = (claimable * BigInt(releasePct)) / HUNDRED_BI
  const restakeAmount = claimable - releaseAmount
  const releaseAmountText = formatTokenAmount(releaseAmount, GAGX_DECIMALS, 4)
  const restakeAmountText = formatTokenAmount(restakeAmount, GAGX_DECIMALS, 4)
  const amountLabel = `${formatTokenAmount(claimable, GAGX_DECIMALS, 4)} gAGX`
  const withClaimUnit = (text: string) => `${text} gAGX`
  let ctaAmountLine: string | null = null
  if (releaseAmount === ZERO_BI) {
    ctaAmountLine = withClaimUnit(restakeAmountText)
  } else if (restakeAmount === ZERO_BI) {
    ctaAmountLine = withClaimUnit(releaseAmountText)
  }

  const { releaseDays: releaseDaysList, restakeDays: restakeDaysList } = claimDurationDaysLists(
    plansQuery.data,
  )

  const releaseOptions = releaseDaysList.map((days) => ({
    label: planLabel(
      days,
      plansQuery.data?.releasePlans,
      t.assets.claim.restakeDaysTax,
      t.assets.claim.releaseDays,
      t.assets.claim.taxRate,
    ),
    value: String(days),
  }))
  const restakeOptions = restakeDaysList.map((days) => ({
    label: planLabel(
      days,
      plansQuery.data?.restakePlans,
      t.assets.claim.restakeDaysTax,
      t.assets.claim.restakeDays,
      t.assets.claim.taxRate,
    ),
    value: String(days),
  }))

  function handleConfirm() {
    if (!canConfirm) return
    void claim.mutate()
  }

  function goBurn() {
    onOpenChange(false)
    openExchangeView('burn')
  }

  const ctaLabel =
    releasePct === 100
      ? t.assets.claim.ctaRelease
      : restakePct === 100
        ? t.assets.claim.ctaRestake
        : t.assets.claim.ctaMixed

  const requiredContributionLabel = formatContributionPoints(claimable, AGX_DECIMALS)

  return {
    t,
    releasePct,
    setReleasePct: setReleasePctState,
    releaseDays,
    setReleaseDays: setReleaseDaysState,
    restakeDays,
    setRestakeDays: setRestakeDaysState,
    restakePct,
    submitting: claim.isPending,
    contribQuery,
    requiredContributionLabel,
    releaseOptions,
    restakeOptions,
    contributionOk,
    plansOk,
    plansQuery,
    canConfirm,
    amountLabel,
    releaseAmountText,
    restakeAmountText,
    ctaAmountLine,
    ctaLabel,
    handleConfirm,
    goBurn,
  }
}
