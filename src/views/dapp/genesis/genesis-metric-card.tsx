import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { MetricCard } from '~/app/shell/components/dapp-card'
import { MetricCardSkeleton } from '~/app/shell/components/dapp-skeleton'
import { cn } from '~/shared/lib/utils'

export const genesisMetricGrid = tv({
  base: 'max-dapp:grid-cols-2 max-dapp:gap-3',
})

const genesisMetricCard = tv({
  base: 'max-dapp:min-h-0 max-dapp:rounded-md max-dapp:p-3.5 max-dapp:shadow-card',
})

export function GenesisMetricCard({
  className,
  hint,
  label,
  tabular = false,
  value,
  valueClassName,
}: {
  className?: string
  hint?: ReactNode
  label: ReactNode
  tabular?: boolean
  value: ReactNode
  valueClassName?: string
}) {
  return (
    <MetricCard
      className={cn(genesisMetricCard(), className)}
      hint={hint}
      hintClassName={hint ? 'max-dapp:hidden' : undefined}
      label={label}
      value={value}
      valueClassName={cn(tabular && 'tabular-nums', valueClassName)}
    />
  )
}

export function GenesisMetricCardSkeleton({ className }: { className?: string }) {
  return <MetricCardSkeleton className={cn('max-dapp:rounded-md', className)} />
}
