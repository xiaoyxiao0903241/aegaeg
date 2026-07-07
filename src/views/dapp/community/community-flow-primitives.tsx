import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn, resolveNavigableHref } from '~/shared/lib/utils'

export const communityProgramGrid = tv({
  base: cn('grid grid-cols-2 gap-2', 'max-dapp:grid-cols-1 max-dapp:gap-2'),
})

const communityProgramCard = tv({
  slots: {
    root: cn(
      revealClass(),
      'flex flex-col gap-2 p-5 max-dapp:rounded-md max-dapp:p-4 max-dapp:gap-1.5 max-dapp:py-3',
    ),
    kicker: 'm-0',
    title: 'm-0 max-w-[38ch]',
    body: 'm-0 max-w-[38ch]',
    action:
      'm-0 cursor-pointer border-0 bg-transparent p-0 text-left no-underline hover:underline',
  },
})

export function CommunityProgramGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn(communityProgramGrid(), className)}>{children}</div>
}

export function CommunityProgramCard({
  action,
  body,
  className,
  href = '',
  label,
  title,
}: {
  action: string
  body: ReactNode
  className?: string
  href?: string
  label: string
  title: ReactNode
}) {
  const styles = communityProgramCard()
  const navigableHref = resolveNavigableHref(href)

  return (
    <Card as="article" surface="elevated" className={cn(styles.root(), className)} data-reveal>
      <Text as="span" variant="kicker" tone="accent" className={styles.kicker()}>
        {label}
      </Text>
      <Text as="h3" variant="title-lg" tone="foreground" className={styles.title()}>
        {title}
      </Text>
      <Text as="p" variant="body" tone="subtle" className={styles.body()}>
        {body}
      </Text>
      {navigableHref ? (
        <a
          className={styles.action()}
          href={navigableHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Text variant="body" weight="semibold" tone="accent">
            {action}
          </Text>
        </a>
      ) : (
        <button className={styles.action()} type="button">
          <Text variant="body" weight="semibold" tone="accent">
            {action}
          </Text>
        </button>
      )}
    </Card>
  )
}
