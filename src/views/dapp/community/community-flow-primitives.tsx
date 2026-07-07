import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
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
    action:
      'm-0 cursor-pointer border-0 bg-transparent p-0 text-left text-sm font-semibold leading-[1.3] tracking-[-0.26px] text-primary max-dapp:text-xs',
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
      <span className="m-0 text-xs font-semibold uppercase leading-[1.3] tracking-[0.88px] text-primary">
        {label}
      </span>
      <h3 className="m-0 max-w-[38ch] text-base font-semibold leading-[1.3] tracking-[-0.48px] text-foreground max-dapp:text-sm max-dapp:leading-[1.2]">
        {title}
      </h3>
      <p className="m-0 max-w-[38ch] text-sm leading-[1.5] tracking-[-0.26px] text-ink-strong max-dapp:text-xs">
        {body}
      </p>
      {navigableHref ? (
        <a
          className={cn(styles.action(), 'no-underline hover:underline')}
          href={navigableHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          {action}
        </a>
      ) : (
        <button className={cn(styles.action(), 'hover:underline')} type="button">
          {action}
        </button>
      )}
    </Card>
  )
}
