import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

/**
 * 右栏指标瓦网格 — 只钉列数 + gap SSOT（PC `gap-3` · H5 `gap-2.5`）。
 * 同行等高：grid 默认 `items-stretch`（勿 `auto-rows-fr` / 子项 `h-full` / Card `min-h`）。
 * H5（`max-dapp`）：3/4 列收成每行两卡；`stackOnDapp` 时收成单列（涡轮三卡）。
 * `className` 只加外边距（`mt-*` / `mb-*`）；**禁**再盖 `gap-*` / 列数。
 */
const overviewGrid = tv({
  base: ['grid items-stretch gap-3', 'max-dapp:min-w-0 max-dapp:gap-2.5 max-dapp:[&>*]:min-w-0'],
  variants: {
    columns: {
      2: 'grid-cols-2',
      3: 'grid-cols-3 max-dapp:grid-cols-2',
      4: [
        'grid-cols-4',
        'max-tablet:grid-cols-[repeat(auto-fit,minmax(min(100%,9.5rem),1fr))]',
        'max-dapp:grid-cols-2',
      ],
    },
    stackOnDapp: {
      true: 'max-dapp:!grid-cols-1',
      false: '',
    },
  },
  defaultVariants: {
    columns: 4,
    stackOnDapp: false,
  },
})

export function OverviewGrid({
  children,
  className,
  columns = 4,
  stackOnDapp = false,
}: {
  children: ReactNode
  className?: string
  columns?: 2 | 3 | 4
  /** H5 强制单列（覆盖 3/4 列默认的两卡收拢） */
  stackOnDapp?: boolean
}) {
  return <div className={overviewGrid({ columns, stackOnDapp, class: className })}>{children}</div>
}
