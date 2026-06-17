import type { ReactNode } from 'react'
import { dappHeading } from '../../lib/dapp-styles'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

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
    <h2
      className={cn(dappHeading.contentTitle, reveal && revealClass(), className)}
      data-reveal={reveal ? '' : undefined}
      id={id}
    >
      {children}
    </h2>
  )
}
