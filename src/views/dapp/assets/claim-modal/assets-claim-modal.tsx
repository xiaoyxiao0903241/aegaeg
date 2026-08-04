import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useRef } from 'react'

import { DappActionButton } from '~/app/shell/dapp-action-button'
import type { ReleaseDurationDays, RestakeDurationDays } from '~/core/assets/claim-plans'
import {
  AegisDialogClose,
  AegisResponsiveDialog,
  AegisSheetHandle,
} from '~/shared/components/aegis-responsive-dialog'
import { Button } from '~/shared/components/button'
import { ClaimSplitSlider } from '~/shared/components/claim-split-slider'
import { dappIcon } from '~/shared/components/dapp-icon-scale'
import { SelectMenu } from '~/shared/components/select-menu'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { useAssetsClaimModalView } from '~/views/dapp/assets/claim-modal/use-assets-claim-modal-view'
import type { MixedClaimTarget } from '~/views/dapp/assets/submit-assets'

/**
 * Mixed 领奖弹窗 — 手册 §9：贡献值门闸 + releasePlanIndex（RewardQueue 5/20/40/60）+ restakePlanIndex。
 * 稿 `4812:209`：数量 / 贡献提示 / 分流滑条 / 释放·复投下拉（含税率）/ CTA。
 */
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
  // 关闭时 call site 会清空 target/owner；缓存上一帧以免 Portal 被立刻拆掉、关掉关闭动画
  const heldRef = useRef<{
    owner: string
    target: MixedClaimTarget
    positionLabel: string
    amountLabel: string
  } | null>(null)
  if (open && target && owner) {
    heldRef.current = { owner, target, positionLabel, amountLabel }
  }
  const held = heldRef.current
  if (!held) return null

  return (
    <AssetsClaimModalOpen
      amountLabel={held.amountLabel}
      key={`${held.owner}-${held.target.source}-${held.amountLabel}`}
      onOpenChange={onOpenChange}
      open={open}
      owner={held.owner}
      positionLabel={held.positionLabel}
      target={held.target}
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
  // 始终 backgroundImage：两端同色渐变≈纯色，避免 Image↔Color 切换闪烁
  const ctaBackgroundImage =
    vm.releasePct >= 100
      ? 'linear-gradient(to right, var(--primary), var(--primary))'
      : vm.releasePct <= 0
        ? 'linear-gradient(to right, var(--claim-restake), var(--claim-restake))'
        : `linear-gradient(to right, var(--primary) 0%, color-mix(in oklab, var(--primary) 45%, var(--claim-restake) 55%) ${vm.releasePct}%, var(--claim-restake) 100%)`

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
      <div className="flex items-start justify-between gap-3 pb-4">
        <div className="grid min-w-0 gap-1">
          <DialogPrimitive.Title asChild>
            <Text as="h2" variant="support" className="m-0 text-foreground/60">
              {t.assets.claim.amount}
            </Text>
          </DialogPrimitive.Title>
          <Text as="strong" className="text-xl font-semibold" variant="copy">
            {amountLabel}
          </Text>
          {vm.requiredContributionLabel ? (
            <Text as="span" tone="muted-foreground" variant="detail">
              {t.assets.claim.contribNeed.replace('{amount}', vm.requiredContributionLabel)}
            </Text>
          ) : null}
          {positionLabel ? (
            <Text as="span" className="sr-only" variant="detail">
              {positionLabel}
            </Text>
          ) : null}
        </div>
        <AegisDialogClose aria-label={t.common.close}>
          <X aria-hidden className={dappIcon({ size: 'sm' })} strokeWidth={2} />
        </AegisDialogClose>
      </div>

      <div className="grid gap-4">
        <ClaimSplitSlider
          aria-label={t.assets.claim.splitAria}
          onChange={vm.setReleasePct}
          value={vm.releasePct}
        />
        <div className="flex justify-between gap-2">
          <Text as="span" className="font-semibold text-primary" variant="detail">
            {t.assets.claim.releaseShare
              .replace('{pct}', String(vm.releasePct))
              .replace('{amount}', amountLabel)}
          </Text>
          <Text as="span" className="font-semibold text-(--app-claim-restake)" variant="detail">
            {t.assets.claim.restakeShare.replace('{pct}', String(vm.restakePct))}
          </Text>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Text as="span" className="font-medium" variant="copy">
              {t.assets.claim.releasePeriod}
            </Text>
            <SelectMenu
              align="start"
              ariaLabel={t.assets.claim.releasePeriodAria}
              className="w-full"
              onSelect={(value) => vm.setReleaseDays(Number(value) as ReleaseDurationDays)}
              options={vm.releaseOptions}
              value={String(vm.releaseDays)}
              variant="field"
            />
          </div>
          <div className="grid gap-2">
            <Text as="span" className="font-medium" variant="copy">
              {t.assets.claim.restakePeriod}
            </Text>
            <SelectMenu
              align="start"
              ariaLabel={t.assets.claim.restakePeriodAria}
              className="w-full"
              onSelect={(value) => vm.setRestakeDays(Number(value) as RestakeDurationDays)}
              options={vm.restakeOptions}
              value={String(vm.restakeDays)}
              variant="field"
            />
          </div>
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
          className={cn(
            'min-h-13 w-full border-0 bg-transparent py-2 text-primary-foreground shadow-none',
            'hover:bg-transparent hover:shadow-none focus-visible:shadow-none',
            // Button 默认 transition background-color；本 CTA 只改 image，关掉色过渡以免端点闪
            'transition-[border-color,box-shadow,transform,opacity,color]',
          )}
          density="external"
          disabled={!vm.canConfirm}
          loading={vm.submitting}
          onClick={() => void vm.handleConfirm()}
          style={{ backgroundImage: ctaBackgroundImage }}
        >
          <span className="flex flex-col items-center gap-0.5 leading-tight">
            <span>{vm.ctaLabel}</span>
            <span className="text-xs font-medium tabular-nums opacity-90">
              {vm.releaseAmountText} & {vm.restakeAmountText}
            </span>
          </span>
        </DappActionButton>
      </div>
    </AegisResponsiveDialog>
  )
}
