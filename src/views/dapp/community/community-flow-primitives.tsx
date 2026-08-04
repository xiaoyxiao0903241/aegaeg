import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn, navigableHref } from '~/shared/lib/utils'

export const communityProgramGrid = tv({
  base: cn('grid grid-cols-2 gap-4', 'max-dapp:grid-cols-1 max-dapp:gap-2'),
})

/** Figma `4301:242` / `4794:3825`：elevated · 右下 deco · 下划线珊瑚 CTA */
const communityProgramCard = tv({
  slots: {
    root: cn(
      revealClass(),
      'relative flex min-h-32 w-full min-w-0 flex-col gap-3 overflow-clip rounded-2xl p-4',
    ),
    action: cn(
      'm-0 cursor-pointer border-0 bg-transparent p-0 text-left font-medium text-primary underline',
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
  image,
  label,
  title,
}: {
  action: string
  body: ReactNode
  className?: string
  href?: string
  image?: string
  label: string
  title: ReactNode
}) {
  const styles = communityProgramCard()
  const safeHref = navigableHref(href)

  const actionNode = (
    <Text as="span" className="font-medium text-primary underline" variant="support">
      {action}
    </Text>
  )

  return (
    <Card as="article" className={cn(styles.root(), className)} data-reveal surface="elevated">
      <Text as="span" className="m-0 text-foreground normal-case" variant="support">
        {label}
      </Text>
      <div className="grid gap-1 pr-16">
        <Text as="h3" className="m-0 font-semibold" tone="foreground" variant="detail">
          {title}
        </Text>
        <Text as="p" className="m-0 text-foreground/40" variant="support">
          {body}
        </Text>
      </div>
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
      {image ? (
        <img
          alt=""
          className="pointer-events-none absolute right-2 bottom-2 size-18 object-contain"
          height="72"
          loading="lazy"
          src={image}
          width="72"
        />
      ) : null}
    </Card>
  )
}
