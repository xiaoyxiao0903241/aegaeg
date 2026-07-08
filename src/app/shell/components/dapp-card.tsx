import type { ReactNode } from 'react'
import { Card } from '~/shared/ui/card'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

export function DappSideCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Card
      as="section"
      surface="outlined"
      className={cn(revealClass(), 'flex flex-col gap-2', className)}
      data-reveal
    >
      {children}
    </Card>
  )
}

export function DappReferrerBoundCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Card
      as="section"
      surface="outlined"
      className={cn(revealClass(), 'flex flex-col gap-2.5 p-4', className)}
      data-reveal
    >
      {children}
    </Card>
  )
}

export function MetricCard({
  children,
  className,
  hint,
  hintClassName,
  label,
  value,
  valueClassName,
}: {
  children?: ReactNode
  className?: string
  hint?: ReactNode
  hintClassName?: string
  label: ReactNode
  value: ReactNode
  valueClassName?: string
}) {
  return (
    <Card
      as="article"
      surface="elevated"
      className={cn(revealClass(), 'flex flex-col items-start gap-1.5', className)}
      data-reveal
    >
      <Card.Label>{label}</Card.Label>
      <Card.Value className={valueClassName}>{value}</Card.Value>
      {hint ? (
        <Card.Description className={cn('mt-1.5', hintClassName)}>{hint}</Card.Description>
      ) : null}
      {children}
    </Card>
  )
}

export function RewardBalanceCard({
  action,
  badge,
  badgeClassName,
  className,
  headerLabelClassName,
  headerMetaClassName,
  hint,
  hintClassName,
  label,
  meta,
  value,
  valueClassName,
}: {
  action?: ReactNode
  badge?: ReactNode
  className?: string
  headerLabelClassName?: string
  headerMetaClassName?: string
  badgeClassName?: string
  hint?: ReactNode
  hintClassName?: string
  label: ReactNode
  meta?: ReactNode
  value: ReactNode
  valueClassName?: string
}) {
  return (
    <Card
      as="article"
      surface="outlined"
      className={cn(revealClass(), className)}
      data-reveal
    >
      <Card.Header className="flex-row items-center justify-between gap-3">
        <Card.Label as="p" className={cn('m-0', headerLabelClassName)}>
          {label}
        </Card.Label>
        {meta ? (
          <Card.Label as="span" className={headerMetaClassName}>
            {meta}
          </Card.Label>
        ) : (
          <Card.Label as="span" tone="success" className={cn('whitespace-nowrap', badgeClassName)}>
            {badge}
          </Card.Label>
        )}
      </Card.Header>
      <Card.Value className={cn('mt-2', valueClassName)}>{value}</Card.Value>
      {hint ? (
        <Card.Description as="small" className={cn('mt-1.5 whitespace-nowrap', hintClassName)}>
          {hint}
        </Card.Description>
      ) : null}
      {action}
    </Card>
  )
}
