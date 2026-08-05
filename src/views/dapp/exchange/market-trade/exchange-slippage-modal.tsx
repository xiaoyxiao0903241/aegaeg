import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'

import { MAX_SLIPPAGE_PERCENT } from '~/core/exchange/token-amount'
import { useI18n } from '~/i18n/use-i18n'
import { Button } from '~/shared/components/button'
import { Chip } from '~/shared/components/chip'
import { DialogClose, ResponsiveDialog, SheetHandle } from '~/shared/components/dialog'
import { iconVariants } from '~/shared/components/icon'
import { Input } from '~/shared/components/input'
import { Text, textVariants } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

const SLIPPAGE_PRESETS = [0.1, 0.5, 1, 3, 5] as const

function parseSlippageInput(value: string) {
  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed) || parsed < 0 || parsed > MAX_SLIPPAGE_PERCENT) return null
  return parsed
}

/**
 * 滑点设置弹窗
 *
 * 支持预设档位与手动输入，输入无效时回退到当前值；
 * 打开时按当前滑点重置草稿。
 */
export function ExchangeSlippageModal({
  onConfirm,
  onOpenChange,
  open,
  slippage,
}: {
  open: boolean
  slippage: number
  onOpenChange: (open: boolean) => void
  onConfirm: (value: number) => void
}) {
  const { messages: t } = useI18n()
  // 打开时重建组件，使草稿值从当前滑点重置，免去 effect
  return open ? (
    <ExchangeSlippageModalOpen
      key={slippage}
      onConfirm={onConfirm}
      onOpenChange={onOpenChange}
      open={open}
      slippage={slippage}
      t={t}
    />
  ) : null
}

function ExchangeSlippageModalOpen({
  onConfirm,
  onOpenChange,
  open,
  slippage,
  t,
}: {
  open: boolean
  slippage: number
  onOpenChange: (open: boolean) => void
  onConfirm: (value: number) => void
  t: ReturnType<typeof useI18n>['messages']
}) {
  const [draft, setDraft] = useState(String(slippage))

  const draftValue = parseSlippageInput(draft)

  const handleConfirm = () => {
    const next = draftValue ?? slippage
    onConfirm(next)
    onOpenChange(false)
  }

  return (
    <ResponsiveDialog
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
      <SheetHandle />
      <div className="flex items-center justify-between pb-5 dapp:pb-5">
        <DialogPrimitive.Title asChild>
          <Text as="h2" variant="panel" className="m-0">
            {t.exchange.slippage}
          </Text>
        </DialogPrimitive.Title>
        <DialogClose aria-label={t.common.close}>
          <X aria-hidden className={iconVariants({ size: 'sm' })} strokeWidth={2} />
        </DialogClose>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Text as="label" className="sr-only" htmlFor="exchange-slippage-input" variant="copy">
            {t.exchange.slippage}
          </Text>
          <div className="flex h-11 items-center justify-between rounded-sm border border-border bg-card px-3.5">
            <Input
              variant="default"
              className={cn(
                'border-0 bg-transparent p-0 text-inherit',
                textVariants({ variant: 'headline' }),
              )}
              id="exchange-slippage-input"
              inputMode="decimal"
              onChange={(event) => setDraft(event.currentTarget.value)}
              value={draft}
            />
            <Text as="span" variant="headline" className="shrink-0">
              %
            </Text>
          </div>

          <div className="flex gap-2" role="group" aria-label={t.exchange.slippage}>
            {SLIPPAGE_PRESETS.map((preset) => {
              const active = draftValue === preset
              return (
                <Chip
                  aria-pressed={active}
                  className="h-6 min-w-0 flex-1 px-3"
                  key={preset}
                  onClick={() => setDraft(String(preset))}
                  shape="pill"
                  size="md"
                  tone={active ? 'primary' : 'default'}
                  type="button"
                  variant={active ? 'solid' : 'outlined'}
                >
                  {preset}%
                </Chip>
              )
            })}
          </div>
        </div>

        <Button
          className="min-h-11.5"
          onClick={handleConfirm}
          shape="pill"
          size="md"
          type="button"
          variant="primary"
        >
          {t.common.confirm}
        </Button>
      </div>
    </ResponsiveDialog>
  )
}
