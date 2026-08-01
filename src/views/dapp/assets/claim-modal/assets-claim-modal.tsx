import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { DappActionButton } from '~/app/shell/dapp-action-button'
import type { ReleaseDurationDays, RestakeDurationDays } from '~/core/assets/claim-plans'
import { cn } from '~/shared/lib/utils'
import {
  AegisDialogClose,
  AegisResponsiveDialog,
  AegisSheetHandle,
} from '~/shared/ui/aegis-responsive-dialog'
import { Button } from '~/shared/ui/button'
import { ClaimSplitSlider } from '~/shared/ui/claim-split-slider'
import { dappIcon } from '~/shared/ui/dapp-icon-scale'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { useAssetsClaimModalView } from '~/views/dapp/assets/claim-modal/use-assets-claim-modal-view'
import type { MixedClaimTarget } from '~/views/dapp/assets/submit-assets'

export function AssetsClaimModal({
  amountLabel,
  onOpenChange,
  open,
  owner,
  positionLabel,
  target,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 打开 claim 时的钱包；写前须与 session 一致。 */
  owner: string | null
  target: MixedClaimTarget | null
  positionLabel: string
  amountLabel: string
}) {
  if (!open || !target || !owner) return null
  return (
    <AssetsClaimModalOpen
      amountLabel={amountLabel}
      key={`${owner}-${target.source}-${amountLabel}`}
      onOpenChange={onOpenChange}
      open={open}
      owner={owner}
      positionLabel={positionLabel}
      target={target}
    />
  )
}

function AssetsClaimModalOpen({
  amountLabel,
  onOpenChange,
  open,
  owner,
  positionLabel,
  target,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  owner: string
  target: MixedClaimTarget
  positionLabel: string
  amountLabel: string
}) {
  const vm = useAssetsClaimModalView({ open, onOpenChange, owner, target })
  const { t } = vm

  return (
    <AegisResponsiveDialog
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay-dim"
      className={cn(
        'border-0 bg-card',
        'w-full max-w-md max-dapp:w-full',
        'max-dapp:rounded-t-lg max-dapp:px-4 max-dapp:pt-3 max-dapp:pb-[max(1.25rem,env(safe-area-inset-bottom))]',
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
          {vm.requiredContributionLabel ? (
            <Text as="span" tone="muted-foreground" variant="detail">
              {t.assets.claim.contribNeed.replace('{amount}', vm.requiredContributionLabel)}
            </Text>
          ) : null}
        </div>

        <ClaimSplitSlider
          aria-label={t.assets.claim.splitAria}
          onChange={vm.setReleasePct}
          value={vm.releasePct}
        />
        <div className="flex justify-between gap-2">
          <Text as="span" variant="detail">
            {t.assets.claim.releaseShare
              .replace('{pct}', String(vm.releasePct))
              .replace('{amount}', amountLabel)}
          </Text>
          <Text as="span" variant="detail">
            {t.assets.claim.restakeShare.replace('{pct}', String(vm.restakePct))}
          </Text>
        </div>

        <div className="grid gap-2">
          <Text as="span" className="font-medium" variant="copy">
            {t.assets.claim.releasePeriod}
          </Text>
          <Segment
            aria-label={t.assets.claim.releasePeriodAria}
            onChange={(value) => vm.setReleaseDays(Number(value) as ReleaseDurationDays)}
            options={vm.releaseOptions}
            tone="coral"
            value={String(vm.releaseDays)}
          />
        </div>

        <div className="grid gap-2">
          <Text as="span" className="font-medium" variant="copy">
            {t.assets.claim.restakePeriod}
          </Text>
          <Segment
            aria-label={t.assets.claim.restakePeriodAria}
            onChange={(value) => vm.setRestakeDays(Number(value) as RestakeDurationDays)}
            options={vm.restakeOptions}
            tone="ink"
            value={String(vm.restakeDays)}
          />
        </div>

        {!vm.contributionOk && vm.contribQuery.data ? (
          <div className="grid gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3">
            <Text as="p" className="text-destructive" variant="copy">
              {t.assets.claim.contribShort}
            </Text>
            <Button onClick={vm.goBurn} type="button" variant="secondary">
              {t.assets.claim.goBurn}
            </Button>
          </div>
        ) : null}

        {!vm.plansOk && vm.plansQuery.isSuccess ? (
          <Text as="p" className="text-destructive" variant="copy">
            {t.assets.blocked.planUnresolved}
          </Text>
        ) : null}

        <DappActionButton
          density="external"
          disabled={!vm.canConfirm}
          loading={vm.submitting}
          onClick={() => void vm.handleConfirm()}
        >
          {vm.ctaLabel}
        </DappActionButton>
      </div>
    </AegisResponsiveDialog>
  )
}
