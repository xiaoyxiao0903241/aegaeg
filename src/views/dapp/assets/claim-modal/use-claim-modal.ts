import { keepPreviousData } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  claimContribRequiredOrZero,
  evaluateAssetsClaimConfirmGate,
  evaluateAssetsClaimWritePhase,
} from '~/core/assets/claim-output'
import {
  claimDurationDaysLists,
  claimSplitFromReleasePct,
  matchClaimPlanIndices,
  planLabel,
} from '~/core/assets/claim-plans'
import { HUNDRED_BI, ZERO_BI } from '~/core/constants'
import { formatAssetsActionAmount, formatTokenAmount } from '~/core/exchange/token-amount'
import { isDecisionFresh } from '~/core/query/decision-freshness'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { parseLeadingMetricNumber } from '~/shared/components/count-value'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { type MixedClaimTarget, submitMixedClaim } from '~/views/dapp/assets/submit-assets'
import { openExchangeView } from '~/views/dapp/shared/navigation'
import { readClaimPlans, readContributionSnapshot } from '~/web3/assets/assets-read'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

/**
 * 领奖弹窗的状态编排：释放比例、释放 / 复投周期选择、
 * 贡献值与计划可用性校验，以及提交成功后的关闭处理。
 * 计划选择用本地 `useState`（随 modal remount / key 复位）。
 * RewardQueue 默认计划 plan3=60 天费率最低，故默认选中 60。
 */
export function useAssetsClaimModal(args: {
  open: boolean
  onOpenChange: (open: boolean) => void
  capturedAddress: string
  target: MixedClaimTarget
  /** 顶部领取数量文案；滑块到一端时复用其单位。 */
  amountLabel: string
}) {
  const { open, onOpenChange, capturedAddress, target, amountLabel } = args
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

  const contribQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsContributionForAmount(String(target.amount)),
    queryFn: (address) => readContributionSnapshot(address as Address, target.amount),
    enabled: open && Boolean(account?.address),
    placeholderData: keepPreviousData,
  })

  const { releaseIndex, restakeIndex } = matchClaimPlanIndices(
    plansQuery.data,
    releaseDays,
    restakeDays,
  )
  const contributionOk =
    isDecisionFresh(contribQuery.isPlaceholderData, contribQuery.data) &&
    contribQuery.data!.contribution >= contribQuery.data!.requiredContribution
  const plansOk =
    isDecisionFresh(plansQuery.isPlaceholderData, plansQuery.data) &&
    releaseIndex != null &&
    restakeIndex != null
  const canConfirm = evaluateAssetsClaimConfirmGate({
    walletReady,
    writeReady,
    isLocked: claim.isLocked,
    isPending: claim.isPending,
    contributionOk,
    plansOk,
    claimable: target.amount,
    decimals: GAGX_DECIMALS,
  })
  const writePhase = evaluateAssetsClaimWritePhase({
    walletReady,
    writeReady,
    isSubmitting: claim.isPending,
    contributionOk,
    plansOk,
    claimable: target.amount,
    decimals: GAGX_DECIMALS,
  })

  const releaseAmount = (target.amount * BigInt(releasePct)) / HUNDRED_BI
  const restakeAmount = target.amount - releaseAmount
  const releaseAmountText = formatTokenAmount(releaseAmount, GAGX_DECIMALS, 4)
  const restakeAmountText = formatTokenAmount(restakeAmount, GAGX_DECIMALS, 4)
  const claimUnit = parseLeadingMetricNumber(amountLabel)?.suffix.trim() ?? ''
  const withClaimUnit = (text: string) => (claimUnit ? `${text} ${claimUnit}` : text)
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

  function setReleasePct(value: number) {
    claim.clearLock()
    setReleasePctState(value)
  }

  function setReleaseDays(value: number) {
    claim.clearLock()
    setReleaseDaysState(value)
  }

  function setRestakeDays(value: number) {
    claim.clearLock()
    setRestakeDaysState(value)
  }

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

  const requiredContributionLabel = formatAssetsActionAmount(
    claimContribRequiredOrZero(contribQuery.data?.requiredContribution),
    GAGX_DECIMALS,
  )

  return {
    t,
    releasePct,
    setReleasePct,
    releaseDays,
    setReleaseDays,
    restakeDays,
    setRestakeDays,
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
    writePhase,
    releaseAmountText,
    restakeAmountText,
    ctaAmountLine,
    ctaLabel,
    handleConfirm,
    goBurn,
  }
}
