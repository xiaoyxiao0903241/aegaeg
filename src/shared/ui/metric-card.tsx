import type { ReactNode } from 'react'
import { Card } from '~/shared/ui/card'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

/**
 * Composite：Figma `sc` 层 — 指标卡。
 *
 * 结构：label + value + hint。
 * 内部用 Card surface="elevated" + Card.Label/Value/Description。
 * 页级字阶差异（Swap vs Genesis value）用 valueClassName 抹平，不扩轴。
 */
export type MetricCardProps = {
  children?: ReactNode
  className?: string
  hint?: ReactNode
  hintClassName?: string
  label: ReactNode
  /** Default true; Swap rate `1 : 1.0010` matches 4175 proportional digits (tabular=false). */
  tabular?: boolean
  value: ReactNode
  valueClassName?: string
}

export function MetricCard({
  children,
  className,
  hint,
  hintClassName,
  label,
  tabular = true,
  value,
  valueClassName,
}: MetricCardProps) {
  return (
    <Card
      as="article"
      surface="elevated"
      className={cn(revealClass(), 'flex flex-col items-start gap-1.5', className)}
      data-reveal
    >
      <Card.Label className="text-xs font-medium" tone="muted-foreground">
        {label}
      </Card.Label>
      <Card.Value className={valueClassName} tabular={tabular}>
        {value}
      </Card.Value>
      {hint ? (
        <Card.Description className={cn('mt-1.5', hintClassName)}>{hint}</Card.Description>
      ) : null}
      {children}
    </Card>
  )
}
