import { Chip, type ChipProps } from '~/shared/components/chip'
import { cn } from '~/shared/lib/utils'

/**
 * Figma `htab` 分立 pill 组（样本 Grant `4719:2447` · Staking hub `4371:233`）。
 * 选中：soft + coral/primary；未选：outlined 白底描边 + text-foreground/40（≠ muted-foreground 70%）。
 */
export function DappPillTabs({
  activeTone = 'primary',
  ariaLabel,
  className,
  items,
  onSelect,
  size = 'md',
}: {
  /** Active pill text/bg tone — Rewards history uses `coral` (Figma accent/coral ≈ coral-emphasis). */
  activeTone?: 'primary' | 'coral'
  ariaLabel: string
  className?: string
  items: Array<{ active?: boolean; label: string }>
  onSelect?: (index: number) => void
  /** Figma tokTabs/htab ≈ h-7；销毁记录 tt ≈ sm。 */
  size?: NonNullable<ChipProps['size']>
}) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', className)}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item, index) => {
        const active = Boolean(item.active)
        return (
          <Chip
            aria-selected={active}
            className={cn(
              'h-7 min-w-0 px-2.5 text-(length:--type-copy-size) leading-none font-semibold',
              active && activeTone === 'coral' && 'text-coral-emphasis',
              active && activeTone === 'primary' && 'text-primary',
              !active &&
                'border-border bg-card text-foreground/40 hover:border-border hover:text-foreground/40',
            )}
            key={item.label}
            onClick={() => onSelect?.(index)}
            role="tab"
            shape="pill"
            size={size}
            type="button"
            variant={active ? 'soft' : 'outlined'}
            tone={active ? activeTone : 'default'}
          >
            {item.label}
          </Chip>
        )
      })}
    </div>
  )
}
