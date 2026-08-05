import { ChevronDown } from 'lucide-react'
import { tv } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'

/**
 * DApp 开合箭头 SSOT — FAQ / Section / 下拉 / 分页共用。
 * 行为一律：收起朝下 + foreground@40%；展开 rotate-180 + primary；280ms 同曲线。
 * 仅 `size` 可调。
 *
 * @see docs/foundation/component-usage.md
 */

const collapseChevron = tv({
  base: 'collapse-chevron shrink-0',
  variants: {
    size: {
      /** 10 — TokenChip / 报价筛选 / SelectMenu pill */
      sm: 'size-2.5',
      /** 12 — TokenPicker / Table.Pagination */
      md: 'size-(--app-icon-xs)',
      /** 18 — FAQ / Section.collapsible */
      lg: 'size-4.5',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

export type CollapseChevronSize = 'sm' | 'md' | 'lg'

export function CollapseChevron({
  className,
  open,
  size = 'lg',
}: {
  className?: string
  open: boolean
  size?: CollapseChevronSize
}) {
  return (
    <ChevronDown
      aria-hidden
      className={cn(collapseChevron({ size }), className)}
      data-open={open ? 'true' : 'false'}
      strokeWidth={1.5}
    />
  )
}
