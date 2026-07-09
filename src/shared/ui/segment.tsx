import { Chip } from '~/shared/ui/chip'
import { cn } from '~/shared/lib/utils'

/** Percent / segment control group. */
export type SegmentOption = {
  label: string
  value: string
}

export type SegmentProps = {
  className?: string
  disabled?: boolean
  onChange: (value: string) => void
  options: SegmentOption[]
  value: string
}

export function Segment({
  className,
  disabled = false,
  onChange,
  options,
  value,
}: SegmentProps) {
  return (
    <div className={cn('grid grid-cols-4 gap-1.5', className)} role="group" aria-label="Segment">
      {options.map((option) => {
        const active = option.value === value
        return (
          <Chip
            key={option.value}
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            shape="rounded"
            size="md"
            type="button"
            variant={active ? 'solid' : 'outlined'}
            tone="default"
          >
            {option.label}
          </Chip>
        )
      })}
    </div>
  )
}

/**
 * Composite：Swap 专用百分比按钮（25/50/75/100）。
 */
export type PercentButtonRowProps = {
  className?: string
  disabled?: boolean
  onSelect: (percent: number) => void
  values?: number[]
}

export function PercentButtonRow({
  className,
  disabled = false,
  onSelect,
  values = [25, 50, 75, 100],
}: PercentButtonRowProps) {
  return (
    <Segment
      className={className}
      disabled={disabled}
      onChange={(value) => onSelect(Number(value))}
      options={values.map((v) => ({ label: `${v}%`, value: String(v) }))}
      value=""
    />
  )
}
