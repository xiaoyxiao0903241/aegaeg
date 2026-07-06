import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '~/lib/utils'

export const communityProgramGrid = tv({
  base: cn('grid grid-cols-2 gap-2', 'max-dapp:grid-cols-1 max-dapp:gap-2'),
})

export const communityProgramCard = tv({
  base: 'max-dapp:gap-1.5 max-dapp:py-3',
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
