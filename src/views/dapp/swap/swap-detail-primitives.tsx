import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { MetricCard } from '~/app/shell/components/dapp-card'
import { MetricCardSkeleton } from '~/app/shell/components/dapp-skeleton'
import { cn } from '~/shared/lib/utils'

/** Swap detail overview metric card — Figma `sc`; tab-owned, not shell group-data. */
const swapMetricCard = tv({
  base: cn(
    'gap-1.5 rounded-md px-4 py-3.5 shadow-card',
    'max-dapp:min-w-0 max-dapp:p-3.5',
  ),
})

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
      className={cn(swapMetricCard(), className)}
      hint={hint}
      label={label}
      value={value}
      valueClassName={valueClassName}
    />
  )
}

export function SwapMetricCardSkeleton({ className }: { className?: string }) {
  return (
    <MetricCardSkeleton className={cn(swapMetricCard(), className)} />
  )
}
