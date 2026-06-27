import type { ReactNode } from 'react'
import { Card } from '~/components/card'
import { Text } from '~/components/text'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

const metricCardResponsive = cn(
  'group-data-[tab=swap]/shell:group-data-[session-ready=true]/shell:max-dapp:rounded-md group-data-[tab=swap]/shell:group-data-[session-ready=true]/shell:max-dapp:p-3.5',
  'group-data-[tab=genesis]/shell:max-dapp:min-h-0 group-data-[tab=genesis]/shell:max-dapp:rounded-md group-data-[tab=genesis]/shell:max-dapp:p-3.5 group-data-[tab=genesis]/shell:max-dapp:shadow-card',
)

const metricValueResponsive = cn(
  'group-data-[tab=swap]/shell:group-data-[session-ready=true]/shell:max-dapp:text-xs group-data-[tab=swap]/shell:group-data-[session-ready=true]/shell:max-dapp:leading-[1.2]',
  'group-data-[tab=genesis]/shell:text-base group-data-[tab=genesis]/shell:leading-[1.3] group-data-[tab=genesis]/shell:max-dapp:text-sm group-data-[tab=genesis]/shell:max-dapp:leading-[1.2]',
)

const metricHintHiddenResponsive = cn(
  'group-data-[tab=swap]/shell:group-data-[session-ready=false]/shell:py-3.5 group-data-[tab=swap]/shell:group-data-[session-ready=false]/shell:max-dapp:hidden',
  'group-data-[tab=swap]/shell:group-data-[session-ready=true]/shell:max-dapp:hidden',
  'group-data-[tab=genesis]/shell:max-dapp:hidden',
)

export const communityStatCardH5Layout = cn(
  'group-data-[tab=community]/shell:max-dapp:min-h-18 group-data-[tab=community]/shell:max-dapp:rounded-xl group-data-[tab=community]/shell:max-dapp:p-3.5',
  'group-data-[tab=community]/shell:max-dapp:items-center group-data-[tab=community]/shell:max-dapp:text-center',
)

const communityStatCardResponsive = cn(
  communityStatCardH5Layout,
  'group-data-[tab=community]/shell:max-dapp:[&:not(.is-dark)>span]:text-xs group-data-[tab=community]/shell:max-dapp:[&:not(.is-dark)>span]:leading-[1.35] group-data-[tab=community]/shell:max-dapp:[&:not(.is-dark)>span]:text-faint',
  'group-data-[tab=community]/shell:max-dapp:[&.is-dark>span]:text-xs group-data-[tab=community]/shell:max-dapp:[&.is-dark>span]:leading-[1.35] group-data-[tab=community]/shell:max-dapp:[&.is-dark>span]:text-on-dark',
  'group-data-[tab=community]/shell:max-dapp:[&>strong]:mt-0.5 group-data-[tab=community]/shell:max-dapp:[&>strong]:text-2xl group-data-[tab=community]/shell:max-dapp:[&>strong]:leading-[1.05]',
  'group-data-[tab=community]/shell:max-dapp:[&>b]:hidden group-data-[tab=community]/shell:max-dapp:[&>small]:hidden',
  'group-data-[tab=community]/shell:max-dapp:[&.is-dark>small]:hidden',
  'group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:min-h-22 group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:items-start group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:rounded-md group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:border-0 group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:p-[var(--dapp-community-stat-padding)] group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:text-left group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:shadow-card',
)

const communityStatLabelResponsive =
  'group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:w-full group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:text-xs group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:leading-normal'

const communityStatValueResponsive = cn(
  'group-data-[tab=community]/shell:max-dapp:mt-0.5 group-data-[tab=community]/shell:max-dapp:text-2xl group-data-[tab=community]/shell:max-dapp:leading-[1.05]',
  'group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:w-full group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:mt-1 group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:text-2xl',
)

const communityStatVolumeResponsive = cn(
  'group-data-[tab=community]/shell:max-dapp:hidden',
  'group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:block group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:w-full group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:mt-1 group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:text-xs group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:leading-[1.2]',
)

const communityStatHintResponsive = cn(
  'group-data-[tab=community]/shell:max-dapp:hidden',
  'group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:block group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:w-full group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:mt-1 group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:text-xs group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:leading-[1.2]',
  'group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:[&.is-dark]:text-on-dark',
)

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
  label,
  value,
  valueClassName,
}: {
  children?: ReactNode
  className?: string
  hint?: ReactNode
  label: ReactNode
  value: ReactNode
  valueClassName?: string
}) {
  return (
    <Card
      as="article"
      surface="elevated"
      className={cn(
        revealClass(),
        'flex flex-col items-start gap-1.5',
        metricCardResponsive,
        className,
      )}
      data-reveal
    >
      <Text size="xs" weight="medium" tone="body" className="tracking-[-0.24px]">
        {label}
      </Text>
      <Text
        as="strong"
        size="lg"
        weight="semibold"
        className={cn('leading-[1.2] tracking-[-0.36px]', metricValueResponsive, valueClassName)}
      >
        {value}
      </Text>
      {hint ? (
        <Text
          as="small"
          size="xs"
          tone="muted"
          className={cn('mt-1.5 block', metricHintHiddenResponsive)}
        >
          {hint}
        </Text>
      ) : null}
      {children}
    </Card>
  )
}

export function CommunityStatCard({
  children,
  className,
  dark = false,
  image,
  label,
  today,
  value,
  volume,
}: {
  children?: ReactNode
  className?: string
  dark?: boolean
  image?: string
  label: ReactNode
  today?: ReactNode
  value: ReactNode
  volume?: ReactNode
}) {
  return (
    <Card
      as="article"
      surface={dark ? undefined : 'elevated'}
      tone={dark ? 'dark' : undefined}
      className={cn(
        revealClass(),
        'community-stat flex flex-col items-start gap-1 rounded-md p-4.5',
        !dark && 'shadow-[0_0.5rem_1.5rem_rgba(18,26,51,0.06)]',
        dark && 'is-dark',
        image && 'relative overflow-visible',
        communityStatCardResponsive,
        className,
      )}
      data-reveal
    >
      <Text
        as="span"
        size="xs"
        tone={dark ? 'onDark' : 'body'}
        className={cn(
          'relative z-1 tracking-[-0.24px]',
          communityStatLabelResponsive,
          dark &&
            'text-on-dark group-data-[tab=community]/shell:dapp:text-xs group-data-[tab=community]/shell:dapp:tracking-[-0.26px]',
          !dark && 'group-data-[tab=community]/shell:max-dapp:text-faint',
        )}
      >
        {label}
      </Text>
      <Text
        as="strong"
        size="2xl"
        weight="semibold"
        className={cn(
          'relative z-1',
          dark ? 'text-white' : 'text-ink-strong',
          communityStatValueResponsive,
        )}
      >
        {value}
      </Text>
      {volume ? (
        <Text
          as="b"
          size="sm"
          weight="semibold"
          tone="coral"
          className={cn(
            'relative z-1 tracking-[-0.28px]',
            dark && 'text-coral-bright',
            communityStatVolumeResponsive,
          )}
        >
          {volume}
        </Text>
      ) : null}
      {today ? (
        <Text
          as="small"
          size="xs"
          tone={dark ? 'onDark' : 'muted'}
          className={cn('relative z-1 tracking-[-0.12px]', communityStatHintResponsive)}
        >
          {today}
        </Text>
      ) : null}
      {children}
      {image ? (
        <img
          alt=""
          className="pointer-events-none absolute -bottom-6 -right-2.5 z-1 h-auto w-24 max-w-28 min-w-22"
          height="156"
          loading="lazy"
          src={image}
          width="104"
        />
      ) : null}
    </Card>
  )
}

export function ProgramCard({
  action,
  body,
  className,
  label,
  onAction,
  title,
}: {
  action: string
  body: ReactNode
  className?: string
  label: string
  onAction: () => void
  title: ReactNode
}) {
  return (
    <Card
      as="article"
      surface="elevated"
      className={cn(
        revealClass(),
        'flex flex-col gap-2 p-5',
        'max-dapp:rounded-md max-dapp:p-4 group-data-[tab=community]/shell:max-dapp:gap-1.5 group-data-[tab=community]/shell:max-dapp:py-3',
        className,
      )}
      data-reveal
    >
      <Text
        as="span"
        size="xs"
        weight="semibold"
        tone="coral"
        className="m-0 uppercase tracking-[0.88px] text-xs leading-[1.3]"
      >
        {label}
      </Text>
      <Text
        as="h3"
        size="md"
        weight="semibold"
        className="m-0 leading-[1.3] tracking-[-0.48px] max-dapp:text-sm max-dapp:leading-[1.2]"
      >
        {title}
      </Text>
      <Text
        as="p"
        size="sm"
        tone="body"
        className="m-0 max-w-[38ch] leading-[1.5] tracking-[-0.26px]"
      >
        {body}
      </Text>
      <button
        className="m-0 cursor-pointer border-0 bg-transparent p-0 text-left text-sm font-semibold leading-[1.3] tracking-[-0.26px] text-primary max-dapp:text-xs"
        onClick={onAction}
        type="button"
      >
        {action}
      </button>
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
          'mt-2 block text-lg leading-[1.3] tracking-[-0.54px]',
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
          className="mt-1.5 block max-w-full whitespace-nowrap tracking-[-0.24px] group-data-[tab=rewards]/shell:max-dapp:hidden"
        >
          {hint}
        </Text>
      ) : null}
      {action}
    </Card>
  )
}
