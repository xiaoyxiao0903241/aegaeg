import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { dappIconClass } from '~/app/dapp-icon-scale'
import { useI18n } from '~/i18n/use-i18n'
import { MAX_SLIPPAGE_PERCENT } from '~/core/swap/token-amount'
import { cn } from '~/shared/lib/utils'
import { Button } from '~/shared/ui/button'
import { Input } from '~/shared/ui/input'
import { Text, textVariants } from '~/shared/ui/text'
import {
  AegisResponsiveDialog,
  AegisSheetHandle,
  aegisDialogCloseClass,
} from '~/shared/ui/aegis-responsive-dialog'

const SLIPPAGE_PRESETS = [0.1, 0.5, 1, 3, 5] as const

const PRESET_BTN_CLASS = cn(
  'flex h-6 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full border border-border',
  'bg-card px-3 transition-[background-color,border-color,color] duration-180 ease-out',
)

function parseSlippageInput(value: string) {
  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed) || parsed < 0 || parsed > MAX_SLIPPAGE_PERCENT) return null
  return parsed
}

export function SwapSlippageModal({
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
  const [draft, setDraft] = useState(String(slippage))

  useEffect(() => {
    if (open) {
      setDraft(String(slippage))
    }
  }, [open, slippage])

  const draftValue = parseSlippageInput(draft)

  const handleConfirm = () => {
    const next = draftValue ?? slippage
    onConfirm(next)
    onOpenChange(false)
  }

  return (
    <AegisResponsiveDialog
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay-dim"
      className={cn(
        'border-0 bg-card',
        'w-full max-w-md max-dapp:w-full',
        'max-dapp:rounded-t-lg max-dapp:px-4 max-dapp:pb-[max(20px,env(safe-area-inset-bottom))] max-dapp:pt-3',
        'dapp:rounded-lg dapp:p-6',
        'dapp:shadow-modal-panel',
      )}
    >
      <AegisSheetHandle />
      <div className="flex items-center justify-between pb-5 dapp:pb-5">
        <DialogPrimitive.Title asChild>
          <Text as="h2" variant="panel" className="m-0">
            {t.swap.slippage}
          </Text>
        </DialogPrimitive.Title>
        <DialogPrimitive.Close
          aria-label={t.common.close}
          className={aegisDialogCloseClass}
          type="button"
        >
          <X aria-hidden className={dappIconClass.sm} strokeWidth={2} />
        </DialogPrimitive.Close>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Text as="label" className="sr-only" htmlFor="swap-slippage-input" variant="copy">
            {t.swap.slippage}
          </Text>
          <div className="flex h-11 items-center justify-between rounded-sm border border-border bg-card px-3.5">
            <Input
              variant="default"
              className={cn(
                'border-0 bg-transparent p-0 text-inherit',
                textVariants({ variant: 'headline' }),
              )}
              id="swap-slippage-input"
              inputMode="decimal"
              onChange={(event) => setDraft(event.currentTarget.value)}
              value={draft}
            />
            <Text as="span" variant="headline" className="shrink-0">
              %
            </Text>
          </div>

          <div className="flex gap-2">
            {SLIPPAGE_PRESETS.map((preset) => {
              const active = draftValue === preset
              return (
                <button
                  className={cn(
                    PRESET_BTN_CLASS,
                    active && 'border-primary bg-primary text-primary-foreground',
                  )}
                  key={preset}
                  onClick={() => setDraft(String(preset))}
                  type="button"
                >
                  <Text
                    as="span"
                    variant="headline"
                    tone={active ? 'inverse' : 'foreground'}
                  >
                    {preset}%
                  </Text>
                </button>
              )
            })}
          </div>
        </div>

        <Button onClick={handleConfirm} shape="pill" size="md" type="button" variant="primary">
          {t.common.confirm}
        </Button>
      </div>
    </AegisResponsiveDialog>
  )
}
