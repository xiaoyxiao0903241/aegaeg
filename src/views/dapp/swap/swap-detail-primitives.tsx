import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { MetricCard } from '~/shared/ui/metric-card'
import { MetricCardSkeleton } from '~/app/shell/components/dapp-skeleton'

const swapMetricCard = tv({
  base: 'max-dapp:min-w-0 max-dapp:[&_small]:hidden',
})

/** Swap overview metric; H5 hides hint line. */
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
      className={swapMetricCard({ class: className })}
      hint={hint}
      label={label}
      value={value}
      valueClassName={valueClassName}
    />
  )
}

export function SwapMetricCardSkeleton({ className }: { className?: string }) {
  return <MetricCardSkeleton className={className} />
}
