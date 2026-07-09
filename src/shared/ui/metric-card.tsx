import type { ReactNode } from 'react'
import { Card } from '~/shared/ui/card'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

/**
 * Composite：detail-column overview metric (`ovc`) — Swap / Genesis season stats.
 *
 * Chrome SSOT (all overview cards): `px-4 py-3.5` · elevated · gap-1.5.
 * Value default ≈ Figma ovc 18px; override only for true content-scale needs.
 *
 * Not for: Community multi-line `sc` → `CommunityStatCard`; Rewards dark banner → `RewardsHeroCard`.
 */
export type MetricCardProps = {
  children?: ReactNode
  className?: string
  hint?: ReactNode
  hintClassName?: string
  label: ReactNode
  value: ReactNode
  valueClassName?: string
}

/** Overview metric chrome — Figma `ovc` 16×14 pad / radius-md / elevated shadow. */
export const metricCardChromeClass = 'gap-1.5 rounded-md px-4 py-3.5'

const metricCardValueClass =
  'text-lg leading-[1.3] tracking-[-0.02em] max-dapp:text-sm max-dapp:leading-[1.2]'

export function MetricCard({
  children,
  className,
  hint,
  hintClassName,
  label,
  value,
  valueClassName,
}: MetricCardProps) {
  return (
    <Card
      as="article"
      surface="elevated"
      className={cn(revealClass(), 'flex flex-col items-start', metricCardChromeClass, className)}
      data-reveal
    >
      <Card.Label className="text-xs font-medium" tone="muted-foreground">
        {label}
      </Card.Label>
      <Card.Value className={cn(metricCardValueClass, valueClassName)}>
        {value}
      </Card.Value>
      {hint ? (
        <Card.Description className={cn('mt-1.5', hintClassName)}>{hint}</Card.Description>
      ) : null}
      {children}
    </Card>
  )
}
