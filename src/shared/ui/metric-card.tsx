import type { ReactNode } from 'react'
import { Card } from '~/shared/ui/card'

/**
 * Composite：Figma `sc` 层 — 指标卡。
 *
 * 结构：label + value + hint。
 * 内部用 Card surface="elevated" + Card.Label/Value/Description。
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
    <Card as="article" surface="elevated" className={className}>
      <Card.Label>{label}</Card.Label>
      <Card.Value className={valueClassName}>{value}</Card.Value>
      {hint ? <Card.Description className={hintClassName}>{hint}</Card.Description> : null}
      {children}
    </Card>
  )
}
