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

export function SideLabel({
  children,
  className,
  tone = 'body',
}: {
  children: ReactNode
  className?: string
  tone?: 'body' | 'coral' | 'muted'
}) {
  if (tone === 'coral') {
    return (
      <Text
        as="p"
        size="xs"
        weight="semibold"
        tone="coral"
        className={cn('m-0 uppercase tracking-[0.88px] text-xs', className)}
      >
        {children}
      </Text>
    )
  }

  return (
    <Text
      as="p"
      size="xs"
      tone={tone === 'muted' ? 'muted' : 'body'}
      className={cn('m-0', className)}
    >
      {children}
    </Text>
  )
}

export function SideValue({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Text as="strong" size="sm" weight="semibold" className={cn('block', className)}>
      {children}
    </Text>
  )
}

export function SideHint({
  children,
  className,
  tone = 'muted',
}: {
  children: ReactNode
  className?: string
  tone?: 'body' | 'muted'
}) {
  return (
    <Text as="small" size="xs" tone={tone === 'body' ? 'body' : 'muted'} className={cn('block', className)}>
      {children}
    </Text>
  )
}

export function SideTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Text as="strong" size="md" weight="semibold" className={cn('block text-base', className)}>
      {children}
    </Text>
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
      <Text size="xs" weight="medium" tone="body" className="tracking-[-0.24px]">
        {label}
      </Text>
      <Text
        as="strong"
        size="lg"
        weight="semibold"
        className={cn('leading-[1.2] tracking-[-0.36px]', valueClassName)}
      >
        {value}
      </Text>
      {hint ? (
        <Text
          as="small"
          size="xs"
          tone="muted"
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
          size="xs"
          tone="body"
          className={cn('m-0 tracking-[-0.24px]', headerLabelClassName)}
        >
          {label}
        </Text>
        {meta ? (
          <Text
            as="span"
            size="xs"
            tone="body"
            className={cn('tracking-[-0.24px]', headerMetaClassName)}
          >
            {meta}
          </Text>
        ) : (
          <Text
            as="span"
            size="xs"
            weight="medium"
            tone="success"
            className={cn('whitespace-nowrap tracking-[-0.24px]', badgeClassName)}
          >
            {badge}
          </Text>
        )}
      </div>
      <Text
        as="strong"
        weight="semibold"
        className={cn(
          'mt-2 block text-lg font-semibold leading-[1.3] tracking-[-0.54px] max-dapp:leading-[1.2] max-dapp:tracking-[-0.51px]',
          valueClassName,
        )}
      >
        {value}
      </Text>
      {hint ? (
        <Text
          as="small"
          size="xs"
          tone="muted"
          className={cn('mt-1.5 block max-w-full whitespace-nowrap tracking-[-0.24px]', hintClassName)}
        >
          {hint}
        </Text>
      ) : null}
      {action}
    </Card>
  )
}
