import { useState } from 'react'
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
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { submitMixedClaim, type MixedClaimTarget } from '~/views/dapp/assets/submit-assets'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readClaimPlans, readContributionSnapshot } from '~/web3/assets/assets-read'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
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
  const [releasePct, setReleasePctState] = useState(50)
  const [releaseDays, setReleaseDaysState] = useState<ReleaseDurationDays>(5)
  const [restakeDays, setRestakeDaysState] = useState<RestakeDurationDays>(540)
  const { restakePct } = claimSplitFromReleasePct(releasePct)

  const claim = useChainMutation({
    path: WRITE_PATH.ASSETS_CLAIM,
    mutation: () =>
      submitMixedClaim({
        target,
        releaseDays,
        restakeDays,
        restakePct,
        account,
        wallet,
        readClient,
      }),
    onSuccess: () => {
      toast.success(t.assets.claim.success)
      onOpenChange(false)
    },
  })

  const plansQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsClaimPlans,
    queryFn: () => readClaimPlans(),
    scope: 'public',
    freshness: 'api',
    enabled: open,
  })

  const contribQuery = useChainQuery({
    scope: 'public',
    queryKey: queryKeys.chain.assetsContributionForAmount(
      account?.address ?? '',
      String(target.amount),
    ),
    queryFn: () => readContributionSnapshot(account!.address as Address, target.amount),
    enabled: open && Boolean(account?.address),
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
    walletReady &&
    !claim.isLocked &&
    !claim.isPending &&
    contributionOk &&
    plansOk &&
    target.amount > 0n

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

  function setReleasePct(value: number) {
    claim.clearLock()
    setReleasePctState(value)
  }

  function setReleaseDays(value: ReleaseDurationDays) {
    claim.clearLock()
    setReleaseDaysState(value)
  }

  function setRestakeDays(value: RestakeDurationDays) {
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
    submitting: claim.isPending,
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
