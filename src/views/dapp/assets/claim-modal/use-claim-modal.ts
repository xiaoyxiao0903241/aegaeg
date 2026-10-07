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
import {
  capTokenAmountInput,
  formatTokenAmount,
  parseTokenAmount,
  PERSONAL_TOKEN_DIGITS,
  sanitizeTokenAmountInput,
} from '~/core/exchange/token-amount'
import { isDecisionFresh } from '~/core/query/decision-freshness'
import { previewDaoClaimContribution } from '~/core/rewards/claim-contribution'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { interpolate } from '~/i18n/interpolate'
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

function formatClaimAmount(amount: bigint, suffix?: string): string {
  return formatTokenAmount(amount, GAGX_DECIMALS, {
    digits: PERSONAL_TOKEN_DIGITS,
    trimZeros: false,
    dust: false,
    round: false,
    suffix,
  })
}

/**
 * 领奖弹窗：数量、释放比例、周期。
 *
 * 数量默认跟上当前可领；改过之后按输入计算。点「最大」回到全部可领。
 * 释放计划默认 60 天。所需贡献等于这次要领的数量。
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
  // null：跟着当前可领。字符串：用户改过的草稿。
  const [pinnedDraft, setPinnedDraft] = useState<string | null>(null)
  const { restakePct } = claimSplitFromReleasePct(releasePct)

  useEffect(() => {
    const current = account?.address
    if (!current || current.toLowerCase() !== capturedAddress.toLowerCase()) {
      onOpenChange(false)
    }
  }, [account?.address, capturedAddress, onOpenChange])

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
        : target.source === 'early'
          ? ({ source: 'early' } as const)
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
          : rewardRead.source === 'early'
            ? 'early'
            : `bond:${rewardRead.depository}:${rewardRead.bondIndex}`,
    ),
    queryFn: (address) => readMixedRewardAvailable(rewardRead, address as Address),
    enabled: open && Boolean(account?.address),
  })
  const availableFresh = isDecisionFresh(availableQuery.isPlaceholderData, availableQuery.data)
  const claimable = availableFresh ? availableQuery.data! : target.amount
  const amountDraft = pinnedDraft ?? formatClaimAmount(claimable)
  // 没改数字时按当前可领的全部上链，避免只领四位小数、零头留在链上。
  const requested = pinnedDraft == null ? claimable : parseTokenAmount(pinnedDraft, GAGX_DECIMALS)

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
  const contributionPreview = previewDaoClaimContribution({
    claimAmountWei: requested > ZERO_BI ? requested : null,
    availableWei: isDecisionFresh(contribQuery.isPlaceholderData, contribQuery.data)
      ? contribQuery.data!.contribution
      : null,
  })
  const contributionOk = contributionPreview?.ok === true
  const contributionShort = contributionPreview != null && !contributionPreview.ok
  const plansOk =
    isDecisionFresh(plansQuery.isPlaceholderData, plansQuery.data) &&
    releaseIndex != null &&
    restakeIndex != null
  const canConfirm =
    availableFresh &&
    requested <= claimable &&
    evaluateAssetsClaimConfirmGate({
      walletReady,
      writeReady,
      isPending: false,
      contributionOk,
      plansOk,
      claimable: requested,
      decimals: GAGX_DECIMALS,
    })

  const claim = useChainMutation({
    path: WRITE_PATH.ASSETS_CLAIM,
    mutation: (amount: bigint, session) =>
      submitMixedClaim({
        session,
        capturedAddress,
        target,
        releaseDays,
        restakeDays,
        restakePct,
        amount,
      }),
    onSuccess: () => {
      toast.success(restakePct === 100 ? t.assets.claim.restakeSuccess : t.assets.claim.success)
      onOpenChange(false)
    },
  })
  const canConfirmNow = canConfirm && !claim.isPending

  const releaseAmount = (requested * BigInt(releasePct)) / HUNDRED_BI
  const restakeAmount = requested - releaseAmount
  const releaseAmountText = formatClaimAmount(releaseAmount, ' gAGX')
  const restakeAmountText = formatClaimAmount(restakeAmount, ' gAGX')
  let ctaAmountLine: string | null = null
  if (releaseAmount === ZERO_BI) {
    ctaAmountLine = restakeAmountText
  } else if (restakeAmount === ZERO_BI) {
    ctaAmountLine = releaseAmountText
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

  function onAmountChange(raw: string) {
    const capped = capTokenAmountInput(raw, claimable, GAGX_DECIMALS, PERSONAL_TOKEN_DIGITS)
    const typed = parseTokenAmount(
      sanitizeTokenAmountInput(raw, PERSONAL_TOKEN_DIGITS),
      GAGX_DECIMALS,
    )
    if (!capped) {
      setPinnedDraft('')
      return
    }
    // 输入已经顶到上限时，改回「全部可领」，零头一并领走。
    if (claimable > ZERO_BI && typed >= claimable) {
      setPinnedDraft(null)
      return
    }
    setPinnedDraft(capped)
  }

  function fillMax() {
    setPinnedDraft(null)
  }

  function handleConfirm() {
    if (!canConfirmNow) return
    void claim.mutate(requested)
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

  const requiredContributionLabel = formatContributionPoints(requested, AGX_DECIMALS)
  const maxAvailableLabel = interpolate(t.assets.claim.maxAvailable, {
    amount: formatClaimAmount(claimable, ' gAGX'),
  })

  return {
    t,
    releasePct,
    setReleasePct: setReleasePctState,
    releaseDays,
    setReleaseDays: setReleaseDaysState,
    restakeDays,
    setRestakeDays: setRestakeDaysState,
    submitting: claim.isPending,
    requiredContributionLabel,
    maxAvailableLabel,
    amountDraft,
    onAmountChange,
    fillMax,
    releaseOptions,
    restakeOptions,
    contributionShort,
    plansOk,
    plansQuery,
    canConfirm: canConfirmNow,
    releaseAmountText,
    restakeAmountText,
    ctaAmountLine,
    ctaLabel,
    handleConfirm,
    goBurn,
  }
}
