import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { MetricCard } from '~/app/components/dapp-card'
import { MetricCardSkeleton } from '~/app/components/dapp-skeleton'
import { cn } from '~/lib/utils'

const genesisMetricCard = tv({
  base: cn(
    'group-data-[tab=genesis]/shell:max-dapp:min-h-0 group-data-[tab=genesis]/shell:max-dapp:rounded-md group-data-[tab=genesis]/shell:max-dapp:p-3.5 group-data-[tab=genesis]/shell:max-dapp:shadow-card',
    '[&_strong]:group-data-[tab=genesis]/shell:text-base [&_strong]:group-data-[tab=genesis]/shell:leading-[1.3] [&_strong]:group-data-[tab=genesis]/shell:max-dapp:text-sm [&_strong]:group-data-[tab=genesis]/shell:max-dapp:leading-[1.2]',
    '[&_small]:group-data-[tab=genesis]/shell:max-dapp:hidden',
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
