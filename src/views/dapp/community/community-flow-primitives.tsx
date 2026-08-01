import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { revealClass } from '~/shared/lib/reveal'
import { cn, navigableHref } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

export const communityProgramGrid = tv({
  base: cn('grid grid-cols-2 gap-2', 'max-dapp:grid-cols-1'),
})

/** Community program card — elevated, coral accent. */
const communityProgramCard = tv({
  slots: {
    root: cn(revealClass(), 'flex w-full min-w-0 flex-col gap-2 p-5'),
    action: cn(
      'm-0 cursor-pointer border-0 bg-transparent p-0 text-left',
      'duration-dapp-fast transition-opacity ease-out hover:opacity-80',
    ),
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
  const safeHref = navigableHref(href)

  const actionNode = (
    <Text as="span" variant="copy" className="font-semibold text-coral">
      {action}
    </Text>
  )

  return (
    <Card as="article" surface="elevated" className={cn(styles.root(), className)} data-reveal>
      <Text as="span" variant="eyebrow" className="m-0 text-coral normal-case">
        {label}
      </Text>
      <Text as="h3" variant="headline" tone="foreground" className="m-0">
        {title}
      </Text>
      <Text as="p" variant="copy" tone="muted-foreground" className="m-0">
        {body}
      </Text>
      {safeHref ? (
        <a
          className={cn(styles.action(), 'no-underline')}
          href={safeHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          {actionNode}
        </a>
      ) : (
        <button className={styles.action()} type="button">
          {actionNode}
        </button>
      )}
    </Card>
  )
}
