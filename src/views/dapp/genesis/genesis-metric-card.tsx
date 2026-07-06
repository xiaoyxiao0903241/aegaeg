import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { MetricCard } from '~/app/components/dapp-card'
import { MetricCardSkeleton } from '~/app/components/dapp-skeleton'
import { cn } from '~/lib/utils'

const genesisMetricCard = tv({
  variants: {
    tabular: {
      true: '[&_strong]:tabular-nums',
      false: '',
    },
  },
  defaultVariants: {
    tabular: false,
  },
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
      className={cn(genesisMetricCard({ tabular }), className)}
      hint={hint}
      label={label}
      value={value}
      valueClassName={valueClassName}
    />
  )
}

export function GenesisMetricCardSkeleton({ className }: { className?: string }) {
  return <MetricCardSkeleton className={cn('max-dapp:rounded-md', className)} />
}
