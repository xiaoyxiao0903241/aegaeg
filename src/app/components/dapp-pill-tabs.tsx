import { dappButtonClass, dappLayout } from '../../components/primitive-styles'
import { cn } from '~/lib/utils'

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
    <div className={cn(dappLayout.pillTabs, className)} role="tablist" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <button
          aria-selected={Boolean(item.active)}
          className={dappButtonClass('pill', item.active ? 'active' : 'subtle')}
          key={item.label}
          onClick={() => onSelect?.(index)}
          role="tab"
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
