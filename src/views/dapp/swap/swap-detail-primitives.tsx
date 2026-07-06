import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { MetricCard } from '~/app/shell/components/dapp-card'
import { MetricCardSkeleton } from '~/app/shell/components/dapp-skeleton'
import { useDappShell } from '~/app/dapp-shell-context'
import { cn } from '~/shared/lib/utils'

/** Swap detail overview metric card — Figma `sc`; tab-owned, not shell group-data. */
const swapMetricCard = tv({
  base: cn(
    'gap-1.5 rounded-md px-4 py-3.5 shadow-card',
    '[&_small]:text-xs [&_small]:leading-[1.5] [&_small]:tracking-[-0.24px]',
    '[&_strong]:text-lg [&_strong]:font-semibold [&_strong]:leading-[1.3] [&_strong]:tracking-[-0.54px]',
    'max-dapp:min-w-0 max-dapp:p-3.5',
    'max-dapp:[&_small]:hidden',
    'max-dapp:[&_strong]:text-xs max-dapp:[&_strong]:leading-[1.2] max-dapp:[&_strong]:tracking-[-0.24px]',
  ),
  variants: {
    sessionReady: {
      true: '[&_small]:hidden',
      false: '',
    },
  },
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
  const { sessionReady } = useDappShell()

  return (
    <MetricCard
      className={cn(swapMetricCard({ sessionReady }), className)}
      hint={hint}
      label={label}
      value={value}
      valueClassName={valueClassName}
    />
  )
}

export function SwapMetricCardSkeleton({ className }: { className?: string }) {
  return (
    <MetricCardSkeleton className={cn(swapMetricCard({ sessionReady: false }), className)} />
  )
}
