import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

/**
 * DApp 右栏指标网格壳 — 只钉列数；「上三下二」等组行由 call site 负责。
 * H5（`max-dapp`）：2/4 列均收成每行两卡。
 */
const metricGrid = tv({
  base: 'grid gap-3 max-dapp:min-w-0 max-dapp:gap-2.5 max-dapp:[&>*]:min-w-0',
  variants: {
    columns: {
      2: 'grid-cols-2',
      4: [
        'grid-cols-4',
        'max-tablet:grid-cols-[repeat(auto-fit,minmax(min(100%,9.5rem),1fr))]',
        'max-dapp:grid-cols-2',
      ],
    },
  },
  defaultVariants: {
    columns: 4,
  },
})

export function MetricGrid({
  children,
  className,
  columns = 4,
}: {
  children: ReactNode
  className?: string
  columns?: 2 | 4
}) {
  return <div className={metricGrid({ columns, class: className })}>{children}</div>
}
