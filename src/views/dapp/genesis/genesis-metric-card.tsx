import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { MetricCard } from '~/app/components/dapp-card'
import { MetricCardSkeleton } from '~/app/components/dapp-skeleton'
import { cn } from '~/lib/utils'

export const genesisMetricGrid = tv({
  base: 'max-dapp:grid-cols-2 max-dapp:gap-3',
})

const genesisMetricCard = tv({
  base: cn(
    'max-dapp:min-h-0 max-dapp:rounded-md max-dapp:p-3.5 max-dapp:shadow-card',
    '[&_strong]:text-base [&_strong]:leading-[1.3] [&_strong]:max-dapp:text-sm [&_strong]:max-dapp:leading-[1.2]',
    '[&_small]:max-dapp:hidden',
  ),
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
