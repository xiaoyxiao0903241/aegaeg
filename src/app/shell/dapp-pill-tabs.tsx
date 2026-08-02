import { cn } from '~/shared/lib/utils'
import { Chip, type ChipProps } from '~/shared/ui/chip'

export function DappPillTabs({
  activeTone = 'primary',
  ariaLabel,
  className,
  items,
  onSelect,
  size = 'lg',
}: {
  /** Active pill text/bg tone — Rewards history uses `coral` (Figma #c85c3f). */
  activeTone?: 'primary' | 'coral'
  ariaLabel: string
  className?: string
  items: Array<{ active?: boolean; label: string }>
  onSelect?: (index: number) => void
  /** Figma tokTabs/htab ≈ lg(30)；销毁记录 tt ≈ md(24)。 */
  size?: NonNullable<ChipProps['size']>
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
          size={size}
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
