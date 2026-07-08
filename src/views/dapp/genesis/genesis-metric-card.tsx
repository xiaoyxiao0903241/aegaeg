import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { MetricCard } from '~/shared/ui/metric-card'
import { DappSkeleton } from '~/app/shell/components/dapp-skeleton'
import { cn } from '~/shared/lib/utils'

export const genesisMetricGrid = tv({
  base: 'max-dapp:grid-cols-2 max-dapp:gap-3',
})

const genesisMetricCard = tv({
  base: 'max-dapp:min-h-0 max-dapp:rounded-md max-dapp:p-3.5 max-dapp:shadow-card',
})

/** 4175 genesis MetricCard：desktop text-base / H5 text-sm */
const genesisMetricValueClass = cn(
  '!text-base !leading-[1.3] tracking-[-0.36px]',
  'max-dapp:!text-sm max-dapp:!leading-[1.2]',
)

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
      valueClassName={cn(genesisMetricValueClass, tabular && 'tabular-nums', valueClassName)}
    />
  )
}

export function GenesisMetricCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      as="article"
      surface="elevated"
      className={cn('flex flex-col gap-1.5 px-4 py-3.5', className)}
    >
      <DappSkeleton className="h-3 w-18 max-w-[55%]" />
      <DappSkeleton className="mt-2 h-5 w-24 max-w-[70%]" />
    </Card>
  )
}
