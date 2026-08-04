import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { MetricCard } from '~/shared/components/metric-card'

/**
 * Flash/Trade/Burn 概览 ovc（Figma `4477:492`）：p16 · gap6 · label12/≈15 · value16/20 → 合成 h73。
 * 禁任意 `*[Npx]`；H5 藏 hint。
 */
const exchangeMetricCard = tv({
  base: [
    'max-dapp:min-w-0 max-dapp:[&_small]:hidden',
    'gap-1.5 p-4',
    // Card.Label = support 12；压 leading 1.5→1.25 合成稿框 h15
    '[&>span]:leading-[1.25] [&>span]:font-medium',
  ],
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
      valueClassName={valueClassName ?? 'text-base leading-5'}
    />
  )
}
