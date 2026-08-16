import { ChevronDown } from 'lucide-react'
import { tv } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'

/**
 * DApp 开合箭头
 *
 * FAQ / 区块 / 下拉 / 分页共用：收起朝下，展开时旋转并变色。
 * 仅 `size` 可调。
 *
 * @see docs/foundation/component-usage.md
 */

const collapseChevron = tv({
  base: 'collapse-chevron shrink-0',
  variants: {
    size: {
      /** sm — TokenChip / 报价筛选 / SelectMenu pill */
      sm: 'size-2.5',
      /** md — TokenPicker / Table.Pagination */
      md: 'size-(--app-icon-xs)',
      /** lg — FAQ / Section.collapsible */
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
