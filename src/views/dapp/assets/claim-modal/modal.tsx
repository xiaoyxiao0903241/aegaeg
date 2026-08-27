import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'

import { interpolate } from '~/i18n/interpolate'
import { Button } from '~/shared/components/button'
import { claimSplitCtaStyle, ClaimSplitSlider } from '~/shared/components/claim-split-slider'
import { CountValue } from '~/shared/components/count-value'
import { DialogClose, ResponsiveDialog, SheetHandle } from '~/shared/components/dialog'
import { iconVariants } from '~/shared/components/icon'
import { InlineAlert } from '~/shared/components/inline-alert'
import { MainButton } from '~/shared/components/main-button'
import { Reveal } from '~/shared/components/reveal'
import { SelectMenu } from '~/shared/components/select-menu'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { useAssetsClaimModal } from '~/views/dapp/assets/claim-modal/use-claim-modal'
import type { MixedClaimTarget } from '~/views/dapp/assets/submit-assets'

/**
 * Mixed 领奖弹窗
 *
 * 内容自顶向下：可领数量与贡献提示、分流滑条、复投 / 领取周期下拉（含税率）、确认 CTA。
 * 贡献值不足或释放 / 复投计划未就绪时展示拦截说明并禁写。
 * 本次需扣除按领取额 1:1。
 *
 * @see docs/onchain-manual/contracts/rewardqueue.md
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
  const { t, amountLabel } = vm
  const splitCtaActive = vm.canConfirm && !vm.submitting

  return (
    <ResponsiveDialog
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay-dim"
    >
      <SheetHandle />
      <div className="flex items-start justify-between gap-3 pb-4">
        <div className="grid min-w-0 gap-1">
          <DialogPrimitive.Title asChild>
            <Text as="h2" className="m-0 font-semibold" variant="copy">
              {t.assets.claim.amount}
            </Text>
          </DialogPrimitive.Title>
          <Text as="strong" className="text-xl font-semibold" variant="copy">
            <CountValue text={amountLabel} />
          </Text>
          {vm.requiredContributionLabel ? (
            <Text as="span" tone="muted-foreground" variant="detail">
              {interpolate(t.assets.claim.contribNeed, {
                amount: vm.requiredContributionLabel,
              })}
            </Text>
          ) : null}
          {positionLabel ? (
            <Text as="span" className="sr-only" variant="detail">
              {positionLabel}
            </Text>
          ) : null}
        </div>
        <DialogClose aria-label={t.common.close}>
          <X aria-hidden className={iconVariants({ size: 'sm' })} strokeWidth={2} />
        </DialogClose>
      </div>

      <div className="grid gap-4">
        <ClaimSplitSlider
          aria-label={t.assets.claim.splitAria}
          onChange={vm.setReleasePct}
          value={vm.releasePct}
        />
        <div className="flex justify-between gap-2">
          <Text as="span" className="font-semibold text-primary" variant="detail">
            {interpolate(t.assets.claim.restakeShare, { pct: vm.restakePct })}
          </Text>
          <Text as="span" className="font-semibold text-claim" variant="detail">
            {interpolate(t.assets.claim.releaseShare, {
              pct: vm.releasePct,
              amount: amountLabel,
            })}
          </Text>
        </div>

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

        <InlineAlert open={!vm.contributionOk && Boolean(vm.contribQuery.data)} role="status">
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
            'min-h-13 w-full py-2',
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
