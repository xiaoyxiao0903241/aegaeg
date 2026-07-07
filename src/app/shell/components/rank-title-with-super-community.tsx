import type { ElementType, ReactNode } from 'react'
import { dappRankTitleClass } from '~/app/dapp-type-scale'
import { cn } from '~/shared/lib/utils'

type RankTitleWithSuperCommunityProps = {
  as?: ElementType
  children?: ReactNode
  className?: string
  isSuperCommunity?: boolean
  superCommunityLabel: string
  title: string
}

export function RankTitleWithSuperCommunity({
  as: Component = 'span',
  className,
  isSuperCommunity = false,
  superCommunityLabel,
  title,
}: RankTitleWithSuperCommunityProps) {
  if (!title) return null

  const label = isSuperCommunity ? `${title} · ${superCommunityLabel}` : title

  return (
    <Component className={cn(dappRankTitleClass, 'min-w-0 break-words', className)}>
      {label}
    </Component>
  )
}
