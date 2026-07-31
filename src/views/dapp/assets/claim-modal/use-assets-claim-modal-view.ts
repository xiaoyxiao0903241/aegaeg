import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import {
  RELEASE_DURATION_DAYS,
  RESTAKE_DURATION_DAYS,
  matchPlanIndexByDurationDays,
  claimSplitFromReleasePct,
  type ReleaseDurationDays,
  type RestakeDurationDays,
} from '~/core/assets/claim-plans'
import { openExchangeView } from '~/shared/config/open-exchange-view'
import { queryKeys } from '~/shared/api/query/query-keys'
import {
  ASSETS_GATE_ERROR,
  submitMixedClaim,
  type MixedClaimTarget,
} from '~/views/dapp/assets/submit-assets'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readClaimPlans, readContributionSnapshot } from '~/web3/assets/assets-read'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import type { Address } from '~/shared/config/contracts'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'

const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export function useAssetsClaimModalView(args: {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: MixedClaimTarget
}) {
  const { open, onOpenChange, target } = args
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const readClient = useChainReadClient()
  const [releasePct, setReleasePct] = useState(50)
  const [releaseDays, setReleaseDays] = useState<ReleaseDurationDays>(5)
  const [restakeDays, setRestakeDays] = useState<RestakeDurationDays>(540)
  const [submitting, setSubmitting] = useState(false)
  const { restakePct } = claimSplitFromReleasePct(releasePct)
  const locked = isUnknownReceiptLocked(WRITE_PATH.ASSETS_CLAIM)

  const plansQuery = useQuery({
    queryKey: queryKeys.chain.assetsClaimPlans,
    queryFn: () => readClaimPlans(readClient),
    enabled: open,
  })

  const contribQuery = useQuery({
    queryKey: [
      ...queryKeys.chain.assetsContribution(account?.address ?? ''),
      String(target.amount),
    ],
    queryFn: () => readContributionSnapshot(account!.address as Address, target.amount, readClient),
    enabled: open && walletReady && Boolean(account?.address),
  })

  const releaseIndex = plansQuery.data
    ? matchPlanIndexByDurationDays(plansQuery.data.releasePlans, releaseDays)
    : null
  const restakeIndex = plansQuery.data
    ? matchPlanIndexByDurationDays(plansQuery.data.restakePlans, restakeDays)
    : null
  const contributionOk =
    contribQuery.data != null &&
    contribQuery.data.contribution >= contribQuery.data.requiredContribution
  const plansOk = releaseIndex != null && restakeIndex != null
  const canConfirm =
    walletReady && !locked && !submitting && contributionOk && plansOk && target.amount > 0n

  const releaseOptions = RELEASE_DURATION_DAYS.map((days) => ({
    label: t.assets.claim.releaseDays.replace('{days}', String(days)),
    value: String(days),
  }))
  const restakeOptions = RESTAKE_DURATION_DAYS.map((days) => {
    const plan = plansQuery.data?.restakePlans.find(
      (p) => p.exists !== false && Number(p.durationSeconds / 86_400n) === days,
    )
    const tax =
      plan?.taxBps != null
        ? t.assets.claim.taxRate.replace('{rate}', String(Number(plan.taxBps) / 100))
        : ''
    return {
      label: tax
        ? t.assets.claim.restakeDaysTax.replace('{days}', String(days)).replace('{tax}', tax)
        : t.assets.claim.restakeDays.replace('{days}', String(days)),
      value: String(days),
    }
  })

  function resolveMessage(error: unknown) {
    const raw = readErrorText(error)
    if (raw === ASSETS_GATE_ERROR.insufficientContribution)
      return t.assets.gates.insufficientContribution
    if (
      raw === ASSETS_GATE_ERROR.releasePlanUnresolved ||
      raw === ASSETS_GATE_ERROR.restakePlanUnresolved
    )
      return t.assets.gates.planUnresolved
    if (raw === ASSETS_GATE_ERROR.unavailable) return t.assets.gates.unavailable
    return (
      resolveWalletTransactionError(error, t.wallet.transactionErrors) ?? t.errors.chain.fallback
    )
  }

  async function handleConfirm() {
    if (!canConfirm) return
    setSubmitting(true)
    try {
      const result = await submitMixedClaim({
        target,
        releaseDays,
        restakeDays,
        restakePct,
        account,
        wallet,
        readClient,
      })
      if (result.ok) {
        toast.success(t.assets.claim.success)
        onOpenChange(false)
        return
      }
      if (result.error != null) presentUserFacingError(result.error, resolveMessage)
    } finally {
      setSubmitting(false)
    }
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

  const requiredContributionLabel = contribQuery.data
    ? formatTokenAmount(contribQuery.data.requiredContribution, GAGX_DECIMALS, 4)
    : null

  return {
    t,
    releasePct,
    setReleasePct,
    releaseDays,
    setReleaseDays,
    restakeDays,
    setRestakeDays,
    restakePct,
    submitting,
    contribQuery,
    requiredContributionLabel,
    releaseOptions,
    restakeOptions,
    contributionOk,
    plansOk,
    plansQuery,
    canConfirm,
    ctaLabel,
    handleConfirm,
    goBurn,
  }
}
