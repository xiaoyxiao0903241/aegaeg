import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

export const communityStatGrid = tv({
  base: cn(
    'grid grid-cols-4 gap-3.5',
    'max-tablet:grid-cols-[repeat(auto-fit,minmax(min(100%,9.5rem),1fr))]',
    'max-dapp:min-w-0 max-dapp:grid-cols-2 max-dapp:gap-2.5',
  ),
})

/** Mobile stat card shell — stats only render when session is ready. */
export const communityStatCardMobileShell = tv({
  base: cn(
    'max-dapp:min-h-22 max-dapp:items-start max-dapp:rounded-md max-dapp:border-0',
    'max-dapp:p-[var(--dapp-community-stat-padding)] max-dapp:text-left max-dapp:shadow-card',
  ),
})

const communityStatCard = tv({
  slots: {
    root: cn(
      revealClass(),
      'community-stat flex flex-col items-start gap-1 rounded-md p-4.5',
      communityStatCardMobileShell(),
    ),
    label: cn('relative z-1', 'max-dapp:w-full'),
    value: cn('relative z-1', 'max-dapp:mt-1 max-dapp:w-full'),
    volume: cn('relative z-1 tracking-[-0.28px]', 'max-dapp:mt-1 max-dapp:block max-dapp:w-full max-dapp:leading-[1.2]'),
    hint: cn('relative z-1 tracking-[-0.12px]', 'max-dapp:mt-1 max-dapp:block max-dapp:w-full'),
  },
  variants: {
    dark: {
      true: {
        root: 'is-dark shadow-none border-0',
      },
      false: {
        root: 'shadow-[0_0.5rem_1.5rem_rgba(18,26,51,0.06)]',
      },
    },
    withImage: {
      true: { root: 'relative overflow-visible' },
      false: {},
    },
  },
  defaultVariants: {
    dark: false,
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
  const styles = communityStatCard({
    dark,
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
        variant="xs"
        tone={dark ? 'on-dark' : 'strong'}
        className={cn(
          styles.label(),
          'tracking-[-0.24px]',
          !dark && 'max-dapp:text-faint',
        )}
      >
        {label}
      </Text>
      <Text
        as="strong"
        variant="2xl"
        weight="semibold"
        tone={dark ? 'inverse' : 'strong'}
        className={styles.value()}
      >
        {value}
      </Text>
      {volume ? (
        <Text
          as="b"
          variant="sm"
          weight="semibold"
          tone="accent"
          className={cn(styles.volume(), dark && '!text-coral-bright')}
        >
          {volume}
        </Text>
      ) : null}
      {today ? (
        <Text
          as="small"
          variant="xs"
          tone={dark ? 'on-dark' : 'muted'}
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
  today,
  value,
  volume,
}: {
  dark?: boolean
  image?: string
  label: ReactNode
  today?: ReactNode
  value: ReactNode
  volume?: ReactNode
}) {
  return (
    <CommunityStatCard
      dark={dark}
      image={image}
      label={label}
      today={today}
      value={value}
      volume={volume}
    />
  )
}
