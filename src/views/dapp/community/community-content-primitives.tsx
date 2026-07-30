import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import { communityStatCardMobileShell } from '~/app/shell/dapp-skeleton'

export const communityStatGrid = tv({
  base: cn(
    'grid grid-cols-3 gap-3.5',
    'max-tablet:grid-cols-[repeat(auto-fit,minmax(min(100%,9.5rem),1fr))]',
    'max-dapp:min-w-0 max-dapp:grid-cols-1 max-dapp:gap-2.5',
  ),
})

export { communityStatCardMobileShell } from '~/app/shell/dapp-skeleton'

const communityStatCard = tv({
  slots: {
    root: cn(
      revealClass(),
      'community-stat flex flex-col items-start gap-1 rounded-lg p-4.5',
      communityStatCardMobileShell(),
    ),
    label: cn('relative z-1', 'max-dapp:w-full'),
    value: cn('relative z-1', 'max-dapp:mt-1 max-dapp:w-full'),
    volume: cn('relative z-1', 'max-dapp:mt-1 max-dapp:block max-dapp:w-full'),
  },
  variants: {
    dark: {
      true: {
        // inverse surface owns elevation; dark sc clears shadow for art.
        root: 'is-dark rounded-md border-0 shadow-none',
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

export function CommunityStatCard({
  children,
  className,
  dark = false,
  image,
  label,
  value,
  volume,
}: {
  children?: ReactNode
  className?: string
  dark?: boolean
  image?: string
  label: ReactNode
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
      surface={dark ? 'inverse' : 'soft'}
      className={cn(styles.root(), className)}
      data-reveal
    >
      <Text
        as="span"
        variant="support"
        tone={dark ? 'inverse-muted' : 'muted-foreground'}
        className={styles.label()}
      >
        {label}
      </Text>
      <Text
        as="strong"
        variant="figure"
        tone={dark ? 'inverse' : 'foreground'}
        className={cn(styles.value(), 'text-3xl leading-[1.2] tracking-[-0.04em]')}
      >
        {value}
      </Text>
      {volume ? (
        <Text
          as="b"
          variant="headline"
          tone={dark ? 'primary-bright' : undefined}
          className={cn(styles.volume(), 'text-sm leading-[1.2]', !dark && 'text-coral')}
        >
          {volume}
        </Text>
      ) : null}
      {children}
      {image ? (
        <img
          alt=""
          className="pointer-events-none absolute -right-2.5 -bottom-6 z-1 h-auto w-24 max-w-28 min-w-22"
          height="156"
          loading="lazy"
          src={image}
          width="104"
        />
      ) : null}
    </Card>
  )
}
