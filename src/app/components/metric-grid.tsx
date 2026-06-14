import type { ReactNode } from 'react'
import { dappLayout } from '../../components/primitive-styles'
import { cn } from '~/lib/utils'

export function MetricGrid({
  children,
  className,
  columns,
}: {
  children: ReactNode
  className?: string
  columns: 2 | 4
}) {
  return (
    <div
      className={cn(
        columns === 2 ? dappLayout.metricGridTwo : dappLayout.metricGridFour,
        className,
      )}
    >
      {children}
    </div>
  )
}
