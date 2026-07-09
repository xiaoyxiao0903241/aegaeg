import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn, resolveNavigableHref } from '~/shared/lib/utils'

export const communityProgramGrid = tv({
  base: cn('grid grid-cols-2 gap-2', 'max-dapp:grid-cols-1 max-dapp:gap-2'),
})

/** Figma `pcard` `4040:7354` — elevated · pad 20 · gap 8 · label 11 / title 16 / body+cta 13. */
const communityProgramCard = tv({
  slots: {
    root: cn(revealClass(), 'flex flex-col gap-2 p-5'),
    action:
      'm-0 cursor-pointer border-0 bg-transparent p-0 text-left text-[13px] font-semibold leading-[1.3] tracking-[-0.26px] text-primary transition-opacity duration-[220ms] ease-[cubic-bezier(.2,.8,.2,1)] hover:opacity-80',
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
      <Text
        as="span"
        variant="eyebrow"
        tone="primary"
        className="m-0 normal-case leading-[1.3] tracking-[0.88px]"
      >
        {label}
      </Text>
      <Text
        as="h3"
        variant="headline"
        tone="foreground"
        className="m-0 max-w-[38ch] leading-[1.3] tracking-[-0.48px]"
      >
        {title}
      </Text>
      <Text
        as="p"
        variant="copy"
        tone="muted-foreground"
        className="m-0 max-w-[38ch] text-[13px] leading-[1.5] tracking-[-0.26px]"
      >
        {body}
      </Text>
      {navigableHref ? (
        <a
          className={cn(styles.action(), 'no-underline')}
          href={navigableHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          {action}
        </a>
      ) : (
        <button className={styles.action()} type="button">
          {action}
        </button>
      )}
    </Card>
  )
}
