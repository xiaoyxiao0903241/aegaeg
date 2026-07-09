import type { RefObject } from 'react'
import { tv } from 'tailwind-variants'
import { buttonDisabledClass } from '~/shared/ui/button'
import { Input } from '~/shared/ui/input'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

const genesisSharesField = tv({
  slots: {
    row: 'flex gap-2',
    inputWrap: 'relative flex min-w-0 flex-1',
    // Figma `4150:3234` mx — coral-soft fill, primary(coral) label, h-44, r-11, no border
    maxButton: cn(
      'h-11 min-w-16 shrink-0 rounded-[0.6875rem] border-0 bg-accent px-[0.9375rem] text-xs font-semibold whitespace-nowrap text-[#c85c3f]',
      buttonDisabledClass,
      'disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
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
    // 4175 H5 LABEL: text-xs (13 via mobile bump) / leading 1.5.
    <label className="mt-1.5 grid gap-2 text-xs leading-[1.5] tracking-normal">
      <Text as="span" variant="copy" tone="muted-foreground" className="text-xs leading-[1.5] tracking-normal">
        {label}
      </Text>
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
