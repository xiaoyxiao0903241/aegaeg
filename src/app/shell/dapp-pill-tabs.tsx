import { Chip, type ChipProps } from '~/shared/components/chip'
import { cn } from '~/shared/lib/utils'

/**
 * 分立式 pill Tab 组。
 *
 * 选中项以主题色高亮，未选项白底描边。
 *
 * @param items 各 Tab 项，active 标记当前选中
 * @param onSelect 点击某个 Tab 时回调其下标
 */
export function DappPillTabs({
  activeTone = 'primary',
  ariaLabel,
  className,
  items,
  onSelect,
  size = 'md',
}: {
  /** 选中 pill 的文字/底色——奖励历史页使用 coral。 */
  activeTone?: 'primary' | 'coral'
  ariaLabel: string
  className?: string
  items: Array<{ active?: boolean; label: string }>
  onSelect?: (index: number) => void
  /** 尺寸档位；销毁记录等紧凑场景用 sm。 */
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
