import type { ReactNode } from 'react'
import { Text } from '~/shared/ui/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

/**
 * Detail-column section title — same Text `section` token on every tab.
 * Title→content gap `pb-4`; no per-tab tracking/leading forks.
 */
export function DappContentHeading({
  children,
  className,
  id,
  reveal = false,
}: {
  children: ReactNode
  className?: string
  id?: string
  reveal?: boolean
}) {
  return (
    <Text
      as="h2"
      variant="section"
      className={cn('m-0 pb-4 max-dapp:mt-0', reveal && revealClass(), className)}
      data-reveal={reveal ? '' : undefined}
      id={id}
    >
      {children}
    </Text>
  )
}
