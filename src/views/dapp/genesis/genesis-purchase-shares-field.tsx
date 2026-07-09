import type { RefObject } from 'react'
import { FieldActionChip } from '~/shared/ui/chip'
import { Input } from '~/shared/ui/input'
import { Text } from '~/shared/ui/text'

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
  return (
    <label className="mt-1.5 grid gap-2 text-xs leading-[1.5]">
      <Text as="span" variant="copy" tone="muted-foreground" className="text-xs leading-[1.5] tracking-[-0.02em]">
        {label}
      </Text>
      <div className="flex gap-2">
        <div className="relative flex min-w-0 flex-1">
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
        <FieldActionChip disabled={disabled} onClick={onMax}>
          {maxLabel}
        </FieldActionChip>
      </div>
    </label>
  )
}
