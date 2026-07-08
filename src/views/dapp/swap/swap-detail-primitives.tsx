import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { MetricCard } from '~/app/shell/components/dapp-card'
import { MetricCardSkeleton } from '~/app/shell/components/dapp-skeleton'
import { cn } from '~/shared/lib/utils'

/** Swap detail overview — 4175 flash/trade MetricCard strong/small 响应式字阶 */
const swapMetricCard = tv({
  base: cn(
    'gap-1.5 rounded-md px-4 py-3.5 shadow-card',
    'max-dapp:min-w-0 max-dapp:p-3.5',
    'max-dapp:[&_small]:hidden',
  ),
})

const swapMetricValueClass = cn(
  'text-lg leading-[1.3] tracking-[-0.54px]',
  'max-dapp:text-xs max-dapp:leading-[1.2] max-dapp:tracking-[-0.24px]',
)

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
      valueClassName={cn(swapMetricValueClass, valueClassName)}
    />
  )
}

export function SwapMetricCardSkeleton({ className }: { className?: string }) {
  return (
    <MetricCardSkeleton className={cn(swapMetricCard(), className)} />
  )
}
