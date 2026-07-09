import type { RefObject } from 'react'
import { buttonDisabledClass } from '~/shared/ui/button'
import { Chip } from '~/shared/ui/chip'
import { Input } from '~/shared/ui/input'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

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
    // 4175 H5 LABEL: text-xs (13 via mobile bump) / leading 1.5.
    <label className="mt-1.5 grid gap-2 text-xs leading-[1.5] tracking-normal">
      <Text as="span" variant="copy" tone="muted-foreground" className="text-xs leading-[1.5] tracking-normal">
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
        {/* Figma `4150:3234` — soft coral Chip; box model matches h-11 / r-11 */}
        <Chip
          className={cn(
            'h-11 min-w-16 shrink-0 rounded-[0.6875rem] px-[0.9375rem] text-xs font-semibold',
            buttonDisabledClass,
            'disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
          )}
          disabled={disabled}
          onClick={onMax}
          shape="rounded"
          size="md"
          tone="coral"
          type="button"
          variant="soft"
        >
          {maxLabel}
        </Chip>
      </div>
    </label>
  )
}
