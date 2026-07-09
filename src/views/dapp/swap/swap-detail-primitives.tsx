import type { ReactNode } from 'react'
import { MetricCard, metricCardChromeClass } from '~/shared/ui/metric-card'
import { MetricCardSkeleton } from '~/app/shell/components/dapp-skeleton'
import { cn } from '~/shared/lib/utils'

/** Swap overview — chrome from MetricCard SSOT; H5 hides hint line. */
export function SwapMetricCard({
  className,
  hint,
  label,
  value,
  valueClassName,
}: {
  className?: string
  hint?: ReactNode
  label: ReactNode
  value: ReactNode
  valueClassName?: string
}) {
  return (
    <MetricCard
      className={cn('max-dapp:min-w-0 max-dapp:[&_small]:hidden', className)}
      hint={hint}
      label={label}
      value={value}
      valueClassName={valueClassName}
    />
  )
}

export function SwapMetricCardSkeleton({ className }: { className?: string }) {
  return <MetricCardSkeleton className={cn(metricCardChromeClass, className)} />
}
