import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { useI18n } from '~/i18n/use-i18n'
import { DialogClose, ResponsiveDialog, SheetHandle } from '~/shared/components/dialog'
import { MainButton } from '~/shared/components/main-button'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * 赎回确认弹窗
 *
 * 提示本金将进入 PrincipalReleaseVault，默认按 30 天线性释放，不会即时到账；
 * 确认后发起赎回写交易。整体使用暗色卡片样式。
 *
 * @see docs/onchain-manual/contracts/principalreleasevault.md
 */
export function AssetsRedeemConfirm({
  amountLabel,
  busy,
  onConfirm,
  onOpenChange,
  open,
}: {
  open: boolean
  amountLabel: string
  busy: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  const { messages: t } = useI18n()

  return (
    <ResponsiveDialog
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay-dim"
      className={cn(
        'border-0 bg-foreground text-background',
        'w-full max-w-md max-dapp:w-full',
        'max-dapp:rounded-t-lg max-dapp:px-4 max-dapp:pt-3 max-dapp:pb-[max(1.25rem,env(safe-area-inset-bottom))]',
        'dapp:rounded-lg dapp:p-6',
        'dapp:shadow-modal-panel',
      )}
    >
      <SheetHandle />
      <div className="flex items-start justify-between gap-3 pb-4">
        <span className="inline-flex h-6 items-center rounded-full bg-background/15 px-3">
          <Text as="span" className="text-background" variant="support">
            {t.assets.redeem.badge}
          </Text>
        </span>
        {/* 暗底：白底圆 + 浅 X 会看不见；改半透明底 + 浅色描边/字 */}
        <DialogClose
          aria-label={t.common.close}
          className="border-background/30 bg-background/15 text-background hover:border-background/55 hover:bg-background/25"
        >
          <X aria-hidden className="size-4" strokeWidth={2} />
        </DialogClose>
      </div>

      <DialogPrimitive.Title asChild>
        <Text as="p" className="m-0 text-background/60" variant="support">
          {t.assets.redeem.releasedLabel}
        </Text>
      </DialogPrimitive.Title>
      <Text
        as="strong"
        className="mt-1 block text-2xl font-semibold text-background"
        variant="copy"
      >
        {amountLabel || '—'}
      </Text>

      <div className="mt-4 rounded-md bg-background/10 p-3">
        <Text as="p" className="m-0 text-background/80" variant="support">
          {t.assets.redeem.body}
        </Text>
      </div>

      {/* 白底 CTA：勿走 primary 的 coral hover；用 secondary 缩放 + 轻微压暗 */}
      <MainButton
        className="mt-5 w-full border-transparent bg-background text-foreground hover:border-transparent hover:bg-background/85 hover:shadow-none focus-visible:border-transparent focus-visible:shadow-none"
        density="modal"
        loading={busy}
        onClick={onConfirm}
        variant="secondary"
      >
        {t.assets.redeem.confirmCta.replace('{amount}', amountLabel || '—')}
      </MainButton>
    </ResponsiveDialog>
  )
}
