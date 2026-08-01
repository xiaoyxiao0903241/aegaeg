import { keepPreviousData } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useDappShell } from '~/app/use-dapp-shell'
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
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { type MixedClaimTarget, submitMixedClaim } from '~/views/dapp/assets/submit-assets'
import { readClaimPlans, readContributionSnapshot } from '~/web3/assets/assets-read'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export function useAssetsClaimModalView(args: {
  open: boolean
  onOpenChange: (open: boolean) => void
  owner: string
  target: MixedClaimTarget
}) {
  const { open, onOpenChange, owner, target } = args
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const [releasePct, setReleasePctState] = useState(50)
  const [releaseDays, setReleaseDaysState] = useState<ReleaseDurationDays>(5)
  const [restakeDays, setRestakeDaysState] = useState<RestakeDurationDays>(540)
  const { restakePct } = claimSplitFromReleasePct(releasePct)

  useEffect(() => {
    const current = account?.address
    if (!current || current.toLowerCase() !== owner.toLowerCase()) {
      onOpenChange(false)
    }
  }, [account?.address, owner, onOpenChange])

  const claim = useChainMutation({
    path: WRITE_PATH.ASSETS_CLAIM,
    mutation: (_vars, session) =>
      submitMixedClaim({
        session,
        owner,
        target,
        releaseDays,
        restakeDays,
        restakePct,
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
  const restakeOptions = RESTAKE_DURATION_DAYS.map((days) => ({
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
