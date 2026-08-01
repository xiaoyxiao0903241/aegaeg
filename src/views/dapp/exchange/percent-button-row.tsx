import { cn } from '~/shared/lib/utils'
import { Chip } from '~/shared/ui/chip'

export type PercentButtonRowProps = {
  'aria-label': string
  className?: string
  disabled?: boolean
  onSelect: (percent: number) => void
  values?: number[]
}

/**
 * Exchange sell-amount % chips (25/50/75/100) — page-bag chrome, not Segment contract.
 */
export function PercentButtonRow({
  'aria-label': ariaLabel,
  className,
  disabled = false,
  onSelect,
  values = [25, 50, 75, 100],
}: PercentButtonRowProps) {
  return (
    <div className={cn('grid grid-cols-4 gap-2', className)} role="group" aria-label={ariaLabel}>
      {values.map((percent) => (
        <Chip
          key={percent}
          className="h-6 min-h-6 py-0 text-xs font-semibold"
          disabled={disabled}
          onClick={() => onSelect(percent)}
          shape="pill"
          size="md"
          type="button"
          variant="outlined"
          tone="default"
        >
          {percent}%
        </Chip>
      ))}
    </div>
  )
}
