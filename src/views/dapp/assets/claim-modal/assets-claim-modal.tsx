import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { dappIcon } from '~/shared/ui/dapp-icon-scale'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { useDappShell } from '~/app/use-dapp-shell'
import {
  RELEASE_DURATION_DAYS,
  RESTAKE_DURATION_DAYS,
  matchPlanIndexByDurationDays,
  type ReleaseDurationDays,
  type RestakeDurationDays,
} from '~/core/assets/claim-plans'
import { claimSplitFromReleasePct, ClaimSplitSlider } from '~/shared/ui/claim-split-slider'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { Button } from '~/shared/ui/button'
import { cn } from '~/shared/lib/utils'
import {
  AegisDialogClose,
  AegisResponsiveDialog,
  AegisSheetHandle,
} from '~/shared/ui/aegis-responsive-dialog'
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

export function AssetsClaimModal({
  amountLabel,
  onOpenChange,
  open,
  positionLabel,
  target,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: MixedClaimTarget | null
  positionLabel: string
  amountLabel: string
}) {
  if (!open || !target) return null
  return (
    <AssetsClaimModalOpen
      amountLabel={amountLabel}
      key={`${target.source}-${amountLabel}`}
      onOpenChange={onOpenChange}
      open={open}
      positionLabel={positionLabel}
      target={target}
    />
  )
}

function AssetsClaimModalOpen({
  amountLabel,
  onOpenChange,
  open,
  positionLabel,
  target,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: MixedClaimTarget
  positionLabel: string
  amountLabel: string
}) {
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

  const ctaLabel =
    releasePct === 100
      ? t.assets.claim.ctaRelease
      : restakePct === 100
        ? t.assets.claim.ctaRestake
        : t.assets.claim.ctaMixed

  return (
    <AegisResponsiveDialog
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay-dim"
      className={cn(
        'border-0 bg-card',
        'w-full max-w-md max-dapp:w-full',
        'max-dapp:rounded-t-lg max-dapp:px-4 max-dapp:pt-3 max-dapp:pb-[max(20px,env(safe-area-inset-bottom))]',
        'dapp:rounded-lg dapp:p-6',
        'dapp:shadow-modal-panel',
      )}
    >
      <AegisSheetHandle />
      <div className="flex items-center justify-between pb-4">
        <DialogPrimitive.Title asChild>
          <Text as="h2" variant="panel" className="m-0">
            {t.assets.claim.title}
          </Text>
        </DialogPrimitive.Title>
        <AegisDialogClose aria-label={t.common.close}>
          <X aria-hidden className={dappIcon({ size: 'sm' })} strokeWidth={2} />
        </AegisDialogClose>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-1">
          <Text as="span" tone="muted-foreground" variant="detail">
            {positionLabel}
          </Text>
          <Text as="strong" variant="copy">
            {t.assets.claim.amount}: {amountLabel}
          </Text>
          {contribQuery.data ? (
            <Text as="span" tone="muted-foreground" variant="detail">
              {t.assets.claim.contribNeed.replace(
                '{amount}',
                formatTokenAmount(contribQuery.data.requiredContribution, GAGX_DECIMALS, 4),
              )}
            </Text>
          ) : null}
        </div>

        <ClaimSplitSlider
          aria-label={t.assets.claim.splitAria}
          onChange={setReleasePct}
          value={releasePct}
        />
        <div className="flex justify-between gap-2">
          <Text as="span" variant="detail">
            {t.assets.claim.releaseShare
              .replace('{pct}', String(releasePct))
              .replace('{amount}', amountLabel)}
          </Text>
          <Text as="span" variant="detail">
            {t.assets.claim.restakeShare.replace('{pct}', String(restakePct))}
          </Text>
        </div>

        <div className="grid gap-2">
          <Text as="span" className="font-medium" variant="copy">
            {t.assets.claim.releasePeriod}
          </Text>
          <Segment
            aria-label={t.assets.claim.releasePeriodAria}
            onChange={(value) => setReleaseDays(Number(value) as ReleaseDurationDays)}
            options={releaseOptions}
            tone="coral"
            value={String(releaseDays)}
          />
        </div>

        <div className="grid gap-2">
          <Text as="span" className="font-medium" variant="copy">
            {t.assets.claim.restakePeriod}
          </Text>
          <Segment
            aria-label={t.assets.claim.restakePeriodAria}
            onChange={(value) => setRestakeDays(Number(value) as RestakeDurationDays)}
            options={restakeOptions}
            tone="ink"
            value={String(restakeDays)}
          />
        </div>

        {!contributionOk && contribQuery.data ? (
          <div className="grid gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3">
            <Text as="p" className="text-destructive" variant="copy">
              {t.assets.claim.contribShort}
            </Text>
            <Button
              onClick={() => {
                onOpenChange(false)
                openExchangeView('burn')
              }}
              type="button"
              variant="secondary"
            >
              {t.assets.claim.goBurn}
            </Button>
          </div>
        ) : null}

        {!plansOk && plansQuery.isSuccess ? (
          <Text as="p" className="text-destructive" variant="copy">
            {t.assets.gates.planUnresolved}
          </Text>
        ) : null}

        <DappActionButton
          density="external"
          disabled={!canConfirm}
          loading={submitting}
          onClick={() => void handleConfirm()}
        >
          {ctaLabel}
        </DappActionButton>
      </div>
    </AegisResponsiveDialog>
  )
}
