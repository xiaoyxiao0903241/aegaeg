import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

const METRIC_GRID_TWO =
  'mt-3.5 grid grid-cols-2 gap-3 max-[820px]:min-w-0 max-[820px]:grid-cols-1'

const METRIC_GRID_FOUR = cn(
  'mt-3.5 grid grid-cols-4 gap-3',
  'max-[1100px]:grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))]',
  'max-[820px]:min-w-0 max-[820px]:grid-cols-1',
  'group-data-[tab=genesis]/shell:max-[820px]:mt-3 group-data-[tab=genesis]/shell:max-[820px]:grid-cols-2 group-data-[tab=genesis]/shell:max-[820px]:gap-3',
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
