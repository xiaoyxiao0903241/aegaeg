import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { MetricCard } from '~/shared/ui/metric-card'
import { MetricCardSkeleton } from '~/app/shell/dapp-skeleton'

export const genesisMetricGrid = tv({
  base: 'max-dapp:grid-cols-2 max-dapp:gap-3',
})

/** Genesis season metrics — same overview MetricCard chrome/value as Exchange. */
export function GenesisMetricCard({
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
      className={className}
      hint={hint}
      hintClassName={hint ? 'max-dapp:hidden' : undefined}
      label={label}
      value={value}
      valueClassName={valueClassName}
    />
  )
}

export function GenesisMetricCardSkeleton({ className }: { className?: string }) {
  return <MetricCardSkeleton className={className} />
}
