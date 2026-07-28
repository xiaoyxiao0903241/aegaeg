import { Chip } from '~/shared/ui/chip'
import { cn } from '~/shared/lib/utils'

export function DappPillTabs({
  activeTone = 'primary',
  ariaLabel,
  className,
  items,
  onSelect,
}: {
  /** Active pill text/bg tone — Rewards history uses `coral` (Figma #c85c3f). */
  activeTone?: 'primary' | 'coral'
  ariaLabel: string
  className?: string
  items: Array<{ active?: boolean; label: string }>
  onSelect?: (index: number) => void
}) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', className)}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item, index) => (
        <Chip
          aria-selected={Boolean(item.active)}
          key={item.label}
          onClick={() => onSelect?.(index)}
          role="tab"
          shape="pill"
          size="lg"
          type="button"
          variant={item.active ? 'soft' : 'outlined'}
          tone={item.active ? activeTone : 'default'}
        >
          {item.label}
        </Chip>
      ))}
    </div>
  )
}
