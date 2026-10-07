import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'

import { interpolate } from '~/i18n/interpolate'
import { Button } from '~/shared/components/button'
import { AmountMaxChip } from '~/shared/components/chip'
import { claimSplitCtaStyle, ClaimSplitSlider } from '~/shared/components/claim-split-slider'
import { CountValue } from '~/shared/components/count-value'
import { DialogClose, ResponsiveDialog, SheetHandle } from '~/shared/components/dialog'
import { iconVariants } from '~/shared/components/icon'
import { InlineAlert } from '~/shared/components/inline-alert'
import { Input } from '~/shared/components/input'
import { MainButton } from '~/shared/components/main-button'
import { Reveal } from '~/shared/components/reveal'
import { SelectMenu } from '~/shared/components/select-menu'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { useAssetsClaimModal } from '~/views/dapp/assets/claim-modal/use-claim-modal'
import type { MixedClaimTarget } from '~/views/dapp/assets/submit-assets'

/**
 * 领取收益 / 领取加成弹窗。
 *
 * 先填本次数量，再拖分配、选复投和释放周期。
 * 贡献点不够这次数量，或周期还没准备好时，不能确认。
 */
export function AssetsClaimModal({
  onOpenChange,
  open,
  capturedAddress,
  positionLabel,
  target,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 打开 claim 时的钱包；写前须与 session 一致。 */
  capturedAddress: string | null
  target: MixedClaimTarget | null
  positionLabel: string
}) {
  // 关闭时调用方会清空 target / capturedAddress；缓存上一帧，避免弹窗被立刻卸载导致关闭动画中断。
  // 用 render 期 setState 对齐 props（不用 render 写 ref），语义与原先 heldRef 相同。
  const [held, setHeld] = useState<{
    capturedAddress: string
    target: MixedClaimTarget
    positionLabel: string
  } | null>(null)
  if (open && target && capturedAddress) {
    const next = { capturedAddress, target, positionLabel }
    if (
      held?.capturedAddress !== next.capturedAddress ||
      held?.target !== next.target ||
      held?.positionLabel !== next.positionLabel
    ) {
      setHeld(next)
    }
  }
  if (!held) return null

  const targetKey =
    held.target.source === 'liquid'
      ? 'liquid'
      : held.target.source === 'early'
        ? 'early'
        : held.target.source === 'locked'
          ? `locked:${held.target.pool}:${held.target.stakeIndex}:${String(held.target.entries[0]?.extra === true)}`
          : `bond:${held.target.depository}:${held.target.bondIndex}`

  return (
    <AssetsClaimModalOpen
      key={`${held.capturedAddress}-${targetKey}`}
      onOpenChange={onOpenChange}
      open={open}
      capturedAddress={held.capturedAddress}
      positionLabel={held.positionLabel}
      target={held.target}
    />
  )
}

function AssetsClaimModalOpen({
  onOpenChange,
  open,
  capturedAddress,
  positionLabel,
  target,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  capturedAddress: string
  target: MixedClaimTarget
  positionLabel: string
}) {
  const vm = useAssetsClaimModal({
    open,
    onOpenChange,
    capturedAddress,
    target,
  })
  const { t } = vm
  const splitCtaActive = vm.canConfirm && !vm.submitting
  const title =
    target.source === 'locked' && target.entries.some((entry) => entry.extra)
      ? t.assets.claim.boostAmount
      : t.assets.claim.amount

  return (
    <ResponsiveDialog
      className="dapp:max-w-115 dapp:px-7 dapp:py-6"
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay-dim"
    >
      <SheetHandle />
      <div className="flex items-center justify-between gap-4 pb-2">
        <DialogPrimitive.Title asChild>
          <Text as="h2" className="m-0" tone="muted-foreground" variant="copy">
            {title}
          </Text>
        </DialogPrimitive.Title>
        <DialogClose aria-label={t.common.close}>
          <X aria-hidden className={iconVariants({ size: 'sm' })} strokeWidth={2} />
        </DialogClose>
      </div>
      {positionLabel ? (
        <Text as="span" className="sr-only" variant="detail">
          {positionLabel}
        </Text>
      ) : null}

      <div className="grid min-w-0 gap-4">
        <div className="grid gap-2">
          <div className="flex items-center gap-2.5 rounded-sm border border-border bg-card py-1.5 pr-2 pl-3.5 focus-within:border-coral">
            <Input
              aria-label={title}
              className="text-left text-[1.75rem] leading-none"
              disabled={vm.submitting}
              inputMode="decimal"
              onChange={(event) => vm.onAmountChange(event.target.value)}
              placeholder="0.0000"
              value={vm.amountDraft}
              variant="amount"
            />
            <Text
              as="span"
              className="shrink-0 font-semibold"
              tone="muted-foreground"
              variant="detail"
            >
              gAGX
            </Text>
            <AmountMaxChip disabled={vm.submitting} onClick={vm.fillMax}>
              {t.common.max}
            </AmountMaxChip>
          </div>
          <div className="flex items-start justify-between gap-3">
            <Text
              as="span"
              className={cn('min-w-0', vm.contributionShort && 'text-destructive')}
              tone={vm.contributionShort ? undefined : 'muted-foreground'}
              variant="detail"
            >
              {interpolate(t.assets.claim.contribNeed, {
                amount: vm.requiredContributionLabel,
              })}
            </Text>
            <Text
              as="span"
              className="shrink-0 text-right tabular-nums"
              tone="muted-foreground"
              variant="detail"
            >
              <CountValue text={vm.maxAvailableLabel} />
            </Text>
          </div>
        </div>

        <ClaimSplitSlider
          aria-label={t.assets.claim.splitAria}
          hint={t.common.splitDragHint}
          onChange={vm.setReleasePct}
          releaseLabel={t.assets.claim.ctaRelease}
          restakeLabel={t.assets.claim.ctaRestake}
          value={vm.releasePct}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Text as="span" className="font-medium" variant="copy">
              {t.assets.claim.restakePeriod}
            </Text>
            <SelectMenu
              align="start"
              ariaLabel={t.assets.claim.restakePeriodAria}
              className="w-full"
              onSelect={(value) => vm.setRestakeDays(Number(value))}
              options={vm.restakeOptions}
              value={String(vm.restakeDays)}
              variant="field"
            />
          </div>
          <div className="grid gap-2">
            <Text as="span" className="font-medium" variant="copy">
              {t.assets.claim.releasePeriod}
            </Text>
            <SelectMenu
              align="start"
              ariaLabel={t.assets.claim.releasePeriodAria}
              className="w-full"
              onSelect={(value) => vm.setReleaseDays(Number(value))}
              options={vm.releaseOptions}
              value={String(vm.releaseDays)}
              variant="field"
            />
          </div>
        </div>

        <InlineAlert open={vm.contributionShort} role="status">
          {t.assets.claim.contribShort}{' '}
          <Button
            className="inline h-auto w-auto! p-0 align-baseline text-[length:inherit] leading-[inherit] font-semibold text-primary underline"
            onClick={vm.goBurn}
            shape="rounded"
            size="sm"
            type="button"
            variant="link"
          >
            {t.assets.claim.goBurn}
          </Button>
        </InlineAlert>

        <Reveal open={!vm.plansOk && vm.plansQuery.isSuccess}>
          <Text as="p" className="text-destructive" variant="copy">
            {t.assets.blocked.planUnresolved}
          </Text>
        </Reveal>

        <MainButton
          className={cn(
            'min-h-16.5 w-full rounded-2xl py-2',
            splitCtaActive && [
              'border-0 bg-transparent text-primary-foreground shadow-none',
              'hover:bg-transparent hover:shadow-none focus-visible:shadow-none',
              // Button 默认 transition background-color；本 CTA 只改 image，关掉色过渡以免端点闪
              'transition-[border-color,box-shadow,transform,opacity,color]',
            ],
          )}
          density="external"
          disabled={!vm.canConfirm}
          loading={vm.submitting}
          onClick={() => void vm.handleConfirm()}
          style={claimSplitCtaStyle(vm.releasePct, splitCtaActive)}
        >
          <span className="flex flex-col items-center gap-0.5 leading-tight">
            <span>{vm.ctaLabel}</span>
            <span className="inline-flex items-baseline gap-1 text-xs font-medium tabular-nums opacity-90">
              {vm.ctaAmountLine ? (
                <CountValue text={vm.ctaAmountLine} />
              ) : (
                <>
                  <CountValue text={vm.restakeAmountText} />
                  <span>&</span>
                  <CountValue text={vm.releaseAmountText} />
                </>
              )}
            </span>
          </span>
        </MainButton>
      </div>
    </ResponsiveDialog>
  )
}
