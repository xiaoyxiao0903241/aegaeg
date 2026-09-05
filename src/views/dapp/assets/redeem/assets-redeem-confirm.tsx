import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { usePrincipalReleaseDurationDays } from '~/hooks/use-principal-release-duration-days'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { CountValue } from '~/shared/components/count-value'
import { DialogClose, ResponsiveDialog, SheetHandle } from '~/shared/components/dialog'
import { iconVariants } from '~/shared/components/icon'
import { InlineAlert } from '~/shared/components/inline-alert'
import { MainButton } from '~/shared/components/main-button'
import { Text } from '~/shared/components/text'
import { LIVE_DATA_PLACEHOLDER } from '~/shared/presenters/format'

/**
 * 赎回确认弹窗
 *
 * 浅色壳 + 珊瑚说明条；提示本金经分流器线性释放，不会即时到账。
 * 周期天数来自链上生效时长；未就绪时默认 30。
 *
 * @see 手册 §13 分流器本金释放
 */
export function AssetsRedeemConfirm({
  amountLabel,
  busy,
  confirmCta,
  onConfirm,
  onOpenChange,
  open,
}: {
  open: boolean
  amountLabel: string
  busy: boolean
  /** 默认「赎回」；调用方可覆盖 CTA（标题仍固定「赎回质押」）。 */
  confirmCta?: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  const { messages: t } = useI18n()
  const durationQuery = usePrincipalReleaseDurationDays()
  const body = interpolate(t.assets.redeem.body, { days: durationQuery.data ?? 30 })
  const hasAmount = Boolean(
    amountLabel && amountLabel !== '—' && amountLabel !== LIVE_DATA_PLACEHOLDER,
  )
  const displayAmount = hasAmount ? amountLabel : LIVE_DATA_PLACEHOLDER

  return (
    <ResponsiveDialog
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay-dim"
    >
      <SheetHandle />
      <div className="flex h-10 items-center justify-between gap-3">
        <DialogPrimitive.Title asChild>
          <Text as="h2" className="m-0 font-semibold" variant="copy">
            {t.assets.redeem.title}
          </Text>
        </DialogPrimitive.Title>
        <DialogClose aria-label={t.common.close}>
          <X aria-hidden className={iconVariants({ size: 'sm' })} strokeWidth={2} />
        </DialogClose>
      </div>

      <div className="grid gap-1 py-1">
        <Text as="p" className="m-0" tone="muted-foreground" variant="detail">
          {t.assets.redeem.releasedLabel}
        </Text>
        <Text as="strong" className="text-xl font-semibold" variant="copy">
          <CountValue text={displayAmount} />
        </Text>
      </div>

      <InlineAlert density="comfortable" tone="notice">
        {body}
      </InlineAlert>

      <MainButton
        className="mt-1 w-full"
        density="modal"
        disabled={!hasAmount}
        loading={busy}
        onClick={onConfirm}
        variant="primary"
      >
        {confirmCta ?? t.assets.redeem.confirmCta}
      </MainButton>
    </ResponsiveDialog>
  )
}
