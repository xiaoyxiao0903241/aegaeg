import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useI18n } from '../../i18n/use-i18n'
import { cn } from '~/lib/utils'
import {
  AegisResponsiveDialog,
  AegisSheetHandle,
} from '../../components/aegis-responsive-dialog'

const SLIPPAGE_PRESETS = [0.1, 0.5, 1, 3, 5] as const

const PRESET_BTN_CLASS = cn(
  'flex h-6 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full border border-[#e3e8ed]',
  'bg-card px-3 text-[13px] font-semibold leading-none text-[#111625]',
  'transition-[background-color,border-color,color] duration-180 ease-out',
)

function parseSlippageInput(value: string) {
  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed) || parsed < 0) return null
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
      overlayClassName="bg-[oklch(0%_0_0/35%)]"
      className={cn(
        'w-[min(calc(100%-32px),400px)] max-[820px]:w-full',
        'max-[820px]:rounded-t-[24px] max-[820px]:px-4 max-[820px]:pb-[max(20px,env(safe-area-inset-bottom))] max-[820px]:pt-3',
        'min-[821px]:rounded-[24px] min-[821px]:border-0 min-[821px]:bg-card min-[821px]:p-6',
        'min-[821px]:shadow-[0_30px_80px_oklch(15%_0.02_270/35%)]',
      )}
    >
      <AegisSheetHandle />
      <div className="flex items-center justify-between pb-5 min-[821px]:pb-5">
        <DialogPrimitive.Title className="m-0 text-[21px] font-semibold leading-[1.3] tracking-[-0.63px] text-foreground">
          {t.swap.slippage}
        </DialogPrimitive.Title>
        <DialogPrimitive.Close
          aria-label={t.common.close}
          className={cn(
            'grid size-[34px] shrink-0 cursor-pointer place-items-center rounded-[17px]',
            'border border-border bg-card text-foreground transition-[border-color,transform] duration-180 ease-out',
            'hover:-translate-y-px hover:border-primary focus-visible:border-primary focus-visible:outline-none',
          )}
          type="button"
        >
          <X aria-hidden className="size-3.5" strokeWidth={2} />
        </DialogPrimitive.Close>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <label className="sr-only" htmlFor="swap-slippage-input">
            {t.swap.slippage}
          </label>
          <div className="flex h-11 items-center justify-between rounded-[11px] border border-border bg-card px-3.5 text-base font-semibold leading-[1.3] tracking-[-0.32px] text-foreground">
            <input
              className="w-full min-w-0 border-0 bg-transparent p-0 text-inherit outline-none"
              id="swap-slippage-input"
              inputMode="decimal"
              onChange={(event) => setDraft(event.currentTarget.value)}
              value={draft}
            />
            <span className="shrink-0">%</span>
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
                  {preset}%
                </button>
              )
            })}
          </div>
        </div>

        <button
          className={cn(
            'flex h-[46px] w-full cursor-pointer items-center justify-center rounded-full',
            'bg-primary text-sm font-semibold leading-[1.3] tracking-[-0.28px] text-primary-foreground',
            'transition-[transform,box-shadow] duration-180 ease-out hover:-translate-y-px hover:shadow-primary-hover',
          )}
          onClick={handleConfirm}
          type="button"
        >
          {t.common.confirm}
        </button>
      </div>
    </AegisResponsiveDialog>
  )
}

export { SLIPPAGE_PRESETS }
