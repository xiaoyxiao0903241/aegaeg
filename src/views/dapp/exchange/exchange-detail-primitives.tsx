import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { MetricCard } from '~/shared/ui/metric-card'

const exchangeMetricCard = tv({
  base: 'max-dapp:min-w-0 max-dapp:[&_small]:hidden',
})

/** Exchange overview metric; H5 hides hint line. */
export function ExchangeMetricCard({
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
      className={exchangeMetricCard({ class: className })}
      hint={hint}
      label={label}
      value={value}
      valueClassName={valueClassName}
    />
  )
}
