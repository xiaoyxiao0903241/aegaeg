import type { ReactNode } from 'react'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
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
      <Text as="p" variant="label" tone="primary" weight="medium" className="tracking-[-0.24px]">
        {label}
      </Text>
      <Text
        as="strong"
        variant="lead"
        className={cn('leading-[1.2] tracking-[-0.36px]', valueClassName)}
      >
        {value}
      </Text>
      {hint ? (
        <Text
          as="small"
          variant="hint"
          tone="secondary"
          className={cn('mt-1.5 block', hintClassName)}
        >
          {hint}
        </Text>
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
      <div className="flex items-center justify-between gap-3">
        <Text
          as="p"
          variant="label"
          tone="primary"
          className={cn('m-0 tracking-[-0.24px]', headerLabelClassName)}
        >
          {label}
        </Text>
        {meta ? (
          <Text
            as="span"
            variant="label"
            tone="primary"
            className={cn('tracking-[-0.24px]', headerMetaClassName)}
          >
            {meta}
          </Text>
        ) : (
          <Text
            as="span"
            variant="label"
            tone="success"
            weight="medium"
            className={cn('whitespace-nowrap tracking-[-0.24px]', badgeClassName)}
          >
            {badge}
          </Text>
        )}
      </div>
      <Text
        as="strong"
        variant="value-lg"
        className={cn('mt-2 block', valueClassName)}
      >
        {value}
      </Text>
      {hint ? (
        <Text
          as="small"
          variant="hint"
          tone="secondary"
          className={cn('mt-1.5 block max-w-full whitespace-nowrap tracking-[-0.24px]', hintClassName)}
        >
          {hint}
        </Text>
      ) : null}
      {action}
    </Card>
  )
}
