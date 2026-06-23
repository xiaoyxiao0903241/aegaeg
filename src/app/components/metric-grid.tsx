import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

const METRIC_GRID_TWO =
  'grid grid-cols-2 gap-3 max-dapp:min-w-0 max-dapp:grid-cols-2 max-dapp:gap-2.5 max-dapp:[&>article]:min-w-0'

const METRIC_GRID_FOUR = cn(
  'grid grid-cols-4 gap-3',
  'max-[1100px]:grid-cols-[repeat(auto-fit,minmax(min(100%,9.5rem),1fr))]',
  'max-dapp:min-w-0 max-dapp:grid-cols-1',
  'group-data-[tab=genesis]/shell:max-dapp:grid-cols-2 group-data-[tab=genesis]/shell:max-dapp:gap-3',
)

export function MetricGrid({
  children,
  className,
  columns = 4,
}: {
  children: ReactNode
  className?: string
  columns?: 2 | 4
}) {
  return (
    <div className={cn(columns === 2 ? METRIC_GRID_TWO : METRIC_GRID_FOUR, className)}>
      {children}
    </div>
  )
}
