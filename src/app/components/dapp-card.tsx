import type { ReactNode } from 'react'
import { Button } from '~/components/button'
import { Card } from '~/components/card'
import { Text } from '~/components/text'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

const metricCardResponsive = cn(
  'group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:rounded-[14px] group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:p-3.5',
  'group-data-[tab=genesis]/shell:max-[820px]:min-h-0 group-data-[tab=genesis]/shell:max-[820px]:rounded-[14px] group-data-[tab=genesis]/shell:max-[820px]:p-3.5 group-data-[tab=genesis]/shell:max-[820px]:shadow-card',
)

const metricValueResponsive = cn(
  'group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:text-[13px] group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:leading-[1.2]',
  'group-data-[tab=genesis]/shell:text-base group-data-[tab=genesis]/shell:leading-[1.3] group-data-[tab=genesis]/shell:max-[820px]:text-[15px] group-data-[tab=genesis]/shell:max-[820px]:leading-[1.2]',
)

const metricHintHiddenResponsive = cn(
  'group-data-[tab=swap]/shell:group-data-[connected=false]/shell:py-3.5 group-data-[tab=swap]/shell:group-data-[connected=false]/shell:max-[820px]:hidden',
  'group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:hidden',
  'group-data-[tab=genesis]/shell:max-[820px]:hidden',
)

const communityStatCardResponsive = cn(
  'group-data-[tab=community]/shell:max-[820px]:min-h-[70px] group-data-[tab=community]/shell:max-[820px]:rounded-xl group-data-[tab=community]/shell:max-[820px]:p-3.5',
  'group-data-[tab=community]/shell:max-[820px]:items-center group-data-[tab=community]/shell:max-[820px]:text-center',
  'group-data-[tab=community]/shell:max-[820px]:[&:not(.is-dark)>span]:text-xs group-data-[tab=community]/shell:max-[820px]:[&:not(.is-dark)>span]:leading-[1.35] group-data-[tab=community]/shell:max-[820px]:[&:not(.is-dark)>span]:text-faint',
  'group-data-[tab=community]/shell:max-[820px]:[&.is-dark>span]:text-xs group-data-[tab=community]/shell:max-[820px]:[&.is-dark>span]:leading-[1.35] group-data-[tab=community]/shell:max-[820px]:[&.is-dark>span]:text-on-dark',
  'group-data-[tab=community]/shell:max-[820px]:[&>strong]:mt-[3px] group-data-[tab=community]/shell:max-[820px]:[&>strong]:text-2xl group-data-[tab=community]/shell:max-[820px]:[&>strong]:leading-[1.05]',
  'group-data-[tab=community]/shell:max-[820px]:[&>b]:hidden group-data-[tab=community]/shell:max-[820px]:[&>small]:hidden',
  'group-data-[tab=community]/shell:max-[820px]:[&.is-dark>small]:hidden',
  'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:min-h-[90px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:items-start group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:rounded-[14px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:border-0 group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:p-[13px_12px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:text-left group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:shadow-card',
)

const communityStatLabelResponsive =
  'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:text-[11px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:leading-normal'

const communityStatValueResponsive = cn(
  'group-data-[tab=community]/shell:max-[820px]:mt-[3px] group-data-[tab=community]/shell:max-[820px]:text-2xl group-data-[tab=community]/shell:max-[820px]:leading-[1.05]',
  'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:mt-1 group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:text-2xl',
)

const communityStatVolumeResponsive = cn(
  'group-data-[tab=community]/shell:max-[820px]:hidden',
  'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:block group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:mt-1 group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:text-[11px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:leading-[1.2]',
)

const communityStatHintResponsive = cn(
  'group-data-[tab=community]/shell:max-[820px]:hidden',
  'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:block group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:mt-1 group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:text-[11px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:leading-[1.2]',
  'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:[&.is-dark]:text-on-dark',
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
      className={cn(revealClass(), 'mt-3.5 flex flex-col gap-2', className)}
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
        className={cn('m-0 uppercase tracking-[0.88px] text-[11px]', className)}
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
    <Text as="strong" size="md" weight="semibold" className={cn('block text-[17px]', className)}>
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
      className={cn(revealClass(), 'mt-2 flex flex-col gap-2.5 p-4', className)}
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
        'mt-3.5 flex flex-col items-start gap-[7px]',
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
          className={cn('mt-[7px] block', metricHintHiddenResponsive)}
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
        'community-stat flex flex-col items-start gap-1 rounded-[18px] p-[18px]',
        !dark && 'shadow-[0_8px_24px_rgba(18,26,51,0.06)]',
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
          'relative z-[1] tracking-[-0.24px]',
          communityStatLabelResponsive,
          dark &&
            'text-on-dark group-data-[tab=community]/shell:min-[821px]:text-[13px] group-data-[tab=community]/shell:min-[821px]:tracking-[-0.26px]',
          !dark && 'group-data-[tab=community]/shell:max-[820px]:text-faint',
        )}
      >
        {label}
      </Text>
      <Text
        as="strong"
        size="2xl"
        weight="semibold"
        className={cn('relative z-[1]', communityStatValueResponsive)}
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
            'relative z-[1] tracking-[-0.28px]',
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
          className={cn('relative z-[1] tracking-[-0.12px]', communityStatHintResponsive)}
        >
          {today}
        </Text>
      ) : null}
      {children}
      {image ? (
        <img
          alt=""
          className="pointer-events-none absolute -bottom-6 -right-2.5 z-[1] h-auto w-[clamp(88px,8vw,110px)]"
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
        'max-[820px]:rounded-[14px] max-[820px]:p-4 group-data-[tab=community]/shell:max-[820px]:gap-1.5 group-data-[tab=community]/shell:max-[820px]:py-3',
        className,
      )}
      data-reveal
    >
      <Text
        as="span"
        size="xs"
        weight="semibold"
        tone="coral"
        className="m-0 uppercase tracking-[0.88px] text-[11px]"
      >
        {label}
      </Text>
      <Text
        as="h3"
        size="lg"
        weight="semibold"
        className="text-base tracking-[-0.48px] max-[820px]:text-sm group-data-[tab=community]/shell:max-[820px]:leading-[1.2]"
      >
        {title}
      </Text>
      <Text
        as="p"
        size="sm"
        tone="body"
        className="m-0 max-w-[38ch] tracking-[-0.26px] max-[820px]:hidden"
      >
        {body}
      </Text>
      <Button variant="link" className="mt-2 tracking-[-0.26px]" onClick={onAction} type="button">
        {action}
      </Button>
    </Card>
  )
}

export function RewardBalanceCard({
  action,
  badge,
  className,
  hint,
  label,
  meta,
  value,
}: {
  action?: ReactNode
  badge?: ReactNode
  className?: string
  hint?: ReactNode
  label: ReactNode
  meta?: ReactNode
  value: ReactNode
}) {
  return (
    <Card
      as="article"
      surface="outlined"
      className={cn(revealClass(), 'mt-3.5', className)}
      data-reveal
    >
      <div className="flex items-center justify-between gap-3">
        <Text as="p" size="xs" tone="body" className="m-0">
          {label}
        </Text>
        {meta ? (
          <Text as="span" size="xs" tone="muted">
            {meta}
          </Text>
        ) : (
          <Text as="em" size="xs" weight="bold" tone="success" className="not-italic whitespace-nowrap">
            {badge}
          </Text>
        )}
      </div>
      <Text as="strong" className="mt-2 block text-[22px] font-bold leading-[1.32]">
        {value}
      </Text>
      {hint ? (
        <Text
          as="small"
          size="xs"
          tone="muted"
          className="mt-1.5 block max-w-full whitespace-nowrap tracking-[-0.24px] group-data-[tab=rewards]/shell:max-[820px]:hidden"
        >
          {hint}
        </Text>
      ) : null}
      {action}
    </Card>
  )
}
