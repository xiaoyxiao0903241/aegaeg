import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

export const communityStatGrid = tv({
  base: cn(
    'grid grid-cols-4 gap-3.5',
    'max-tablet:grid-cols-[repeat(auto-fit,minmax(min(100%,9.5rem),1fr))]',
    'max-dapp:min-w-0 max-dapp:grid-cols-2 max-dapp:gap-2.5',
  ),
})

export const communityStatCardH5Layout = tv({
  base: cn(
    'group-data-[tab=community]/shell:max-dapp:min-h-18 group-data-[tab=community]/shell:max-dapp:rounded-xl group-data-[tab=community]/shell:max-dapp:p-3.5',
    'group-data-[tab=community]/shell:max-dapp:items-center group-data-[tab=community]/shell:max-dapp:text-center',
  ),
})

const communityStatCard = tv({
  slots: {
    root: cn(
      revealClass(),
      'community-stat flex flex-col items-start gap-1 rounded-md p-4.5',
      communityStatCardH5Layout(),
      'group-data-[tab=community]/shell:max-dapp:[&:not(.is-dark)>span]:text-xs group-data-[tab=community]/shell:max-dapp:[&:not(.is-dark)>span]:leading-[1.35] group-data-[tab=community]/shell:max-dapp:[&:not(.is-dark)>span]:text-faint',
      'group-data-[tab=community]/shell:max-dapp:[&.is-dark>span]:text-xs group-data-[tab=community]/shell:max-dapp:[&.is-dark>span]:leading-[1.35] group-data-[tab=community]/shell:max-dapp:[&.is-dark>span]:text-on-dark',
      'group-data-[tab=community]/shell:max-dapp:[&>strong]:mt-0.5 group-data-[tab=community]/shell:max-dapp:[&>strong]:text-2xl group-data-[tab=community]/shell:max-dapp:[&>strong]:leading-[1.05]',
      'group-data-[tab=community]/shell:max-dapp:[&>b]:hidden group-data-[tab=community]/shell:max-dapp:[&>small]:hidden',
      'group-data-[tab=community]/shell:max-dapp:[&.is-dark>small]:hidden',
      'group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:min-h-22 group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:items-start group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:rounded-md group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:border-0 group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:p-[var(--dapp-community-stat-padding)] group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:text-left group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:shadow-card',
    ),
    label: cn(
      'relative z-1 tracking-[-0.24px]',
      'group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:w-full group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:text-xs group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:leading-normal',
    ),
    value: cn(
      'relative z-1',
      'group-data-[tab=community]/shell:max-dapp:mt-0.5 group-data-[tab=community]/shell:max-dapp:text-2xl group-data-[tab=community]/shell:max-dapp:leading-[1.05]',
      'group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:w-full group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:mt-1 group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:text-2xl',
    ),
    volume: cn(
      'relative z-1 tracking-[-0.28px]',
      'group-data-[tab=community]/shell:max-dapp:hidden',
      'group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:block group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:w-full group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:mt-1 group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:text-xs group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:leading-[1.2]',
    ),
    hint: cn(
      'relative z-1 tracking-[-0.12px]',
      'group-data-[tab=community]/shell:max-dapp:hidden',
      'group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:block group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:w-full group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:mt-1 group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:text-xs group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:leading-[1.2]',
      'group-data-[tab=community]/shell:group-data-[session-ready=true]/shell:max-dapp:[&.is-dark]:text-on-dark',
    ),
  },
  variants: {
    dark: {
      true: {
        root: 'is-dark shadow-none border-0',
        label: 'text-on-dark group-data-[tab=community]/shell:dapp:text-xs group-data-[tab=community]/shell:dapp:tracking-[-0.26px]',
        value: 'text-white',
        volume: 'text-coral-bright',
      },
      false: {
        root: 'shadow-[0_0.5rem_1.5rem_rgba(18,26,51,0.06)]',
        label: 'group-data-[tab=community]/shell:max-dapp:text-faint',
        value: 'text-ink-strong',
      },
    },
    mobileCentered: {
      true: {
        root: 'items-center text-center shadow-card [&>b]:hidden [&>small]:hidden [&>span]:text-xs [&>span]:tracking-[-0.11px] [&>strong]:text-lg [&>strong]:tracking-[-0.54px]',
      },
      false: {},
    },
    withImage: {
      true: { root: 'relative overflow-visible' },
      false: {},
    },
  },
  defaultVariants: {
    dark: false,
    mobileCentered: false,
    withImage: false,
  },
})

export function CommunityStatGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn(communityStatGrid(), className)}>{children}</div>
}

function CommunityStatCard({
  children,
  className,
  dark = false,
  image,
  label,
  mobileCentered = false,
  today,
  value,
  volume,
}: {
  children?: ReactNode
  className?: string
  dark?: boolean
  image?: string
  label: ReactNode
  mobileCentered?: boolean
  today?: ReactNode
  value: ReactNode
  volume?: ReactNode
}) {
  const styles = communityStatCard({
    dark,
    mobileCentered,
    withImage: Boolean(image),
  })

  return (
    <Card
      as="article"
      surface={dark ? undefined : 'elevated'}
      tone={dark ? 'dark' : undefined}
      className={cn(styles.root(), className)}
      data-reveal
    >
      <Text
        as="span"
        size="xs"
        tone={dark ? 'onDark' : 'body'}
        className={styles.label()}
      >
        {label}
      </Text>
      <Text as="strong" size="2xl" weight="semibold" className={styles.value()}>
        {value}
      </Text>
      {volume ? (
        <Text as="b" size="sm" weight="semibold" tone="coral" className={styles.volume()}>
          {volume}
        </Text>
      ) : null}
      {today ? (
        <Text
          as="small"
          size="xs"
          tone={dark ? 'onDark' : 'muted'}
          className={styles.hint()}
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

export function CommunityOverviewStatCard({
  dark,
  image,
  label,
  mobileCentered = false,
  today,
  value,
  volume,
}: {
  dark?: boolean
  image?: string
  label: ReactNode
  mobileCentered?: boolean
  today?: ReactNode
  value: ReactNode
  volume?: ReactNode
}) {
  return (
    <CommunityStatCard
      dark={dark}
      image={image}
      label={label}
      mobileCentered={mobileCentered}
      today={today}
      value={value}
      volume={volume}
    />
  )
}
