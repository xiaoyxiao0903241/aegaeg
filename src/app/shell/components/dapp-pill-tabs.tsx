import { Chip } from '~/shared/ui/chip'
import { cn } from '~/shared/lib/utils'

export function DappPillTabs({
  ariaLabel,
  className,
  items,
  onSelect,
}: {
  ariaLabel: string
  className?: string
  items: Array<{ active?: boolean; label: string }>
  onSelect?: (index: number) => void
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)} role="tablist" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <Chip
          aria-selected={Boolean(item.active)}
          key={item.label}
          onClick={() => onSelect?.(index)}
          role="tab"
          shape="pill"
          size="md"
          type="button"
          variant={item.active ? 'solid' : 'outlined'}
          tone="default"
        >
          {item.label}
        </Chip>
      ))}
    </div>
  )
}
