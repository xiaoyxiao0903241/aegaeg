import type { ElementType, ReactNode } from 'react'
import { textVariants } from '~/shared/ui/text'
import { cn } from '~/lib/utils'

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
    <Component
      className={cn(
        textVariants({ size: 'bodyLg', weight: 'semibold' }),
        'min-w-0 break-words',
        className,
      )}
    >
      {label}
    </Component>
  )
}
