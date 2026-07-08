import type { RefObject } from 'react'
import { tv } from 'tailwind-variants'
import { buttonDisabledClass } from '~/shared/ui/button'
import { Input } from '~/shared/ui/input'
import { cn } from '~/shared/lib/utils'

const genesisSharesField = tv({
  slots: {
    row: 'flex gap-2',
    inputWrap: 'relative flex min-w-0 flex-1',
    maxButton: cn(
      'min-w-16 shrink-0 rounded-sm border border-border bg-accent px-3.5 py-2.5 text-xs font-bold whitespace-nowrap text-primary',
      buttonDisabledClass,
      'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
    ),
  },
})

export function GenesisPurchaseSharesField({
  disabled,
  inputRef,
  label,
  max,
  maxLabel,
  min,
  onBlur,
  onChange,
  onMax,
  shareUnit,
  value,
}: {
  disabled: boolean
  inputRef: RefObject<HTMLInputElement | null>
  label: string
  max: number
  maxLabel: string
  min: number
  onBlur: () => void
  onChange: (value: string) => void
  onMax: () => void
  shareUnit: string
  value: string
}) {
  const styles = genesisSharesField()

  return (
    <label className="mt-1.5 grid gap-2 text-xs leading-[1.5] text-muted-foreground">
      <span>{label}</span>
      <div className={styles.row()}>
        <div className={styles.inputWrap()}>
          <Input
            ref={inputRef}
            variant="numeric"
            className="pr-10 text-base font-bold"
            disabled={disabled}
            max={max}
            min={min}
            onBlur={onBlur}
            onChange={(event) => onChange(event.currentTarget.value)}
            placeholder="0"
            type="number"
            value={value}
          />
          <span aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted-foreground">
            {shareUnit}
          </span>
        </div>
        <button
          className={styles.maxButton()}
          disabled={disabled}
          onClick={onMax}
          type="button"
        >
          {maxLabel}
        </button>
      </div>
    </label>
  )
}
