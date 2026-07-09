import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const metricGrid = tv({
  base: 'grid gap-3',
  variants: {
    columns: {
      2: 'grid-cols-2 max-dapp:min-w-0 max-dapp:grid-cols-2 max-dapp:gap-2.5 max-dapp:[&>article]:min-w-0',
      4: [
        'grid-cols-4',
        'max-tablet:grid-cols-[repeat(auto-fit,minmax(min(100%,9.5rem),1fr))]',
        'max-dapp:min-w-0 max-dapp:grid-cols-1',
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
