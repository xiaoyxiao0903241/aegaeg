import type { ElementType, ReactNode } from 'react'
import { Text } from '~/shared/ui/text'
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
    <Component className={cn('min-w-0 break-words', className)}>
      <Text as="span" variant="headline" tone="foreground">
        {label}
      </Text>
    </Component>
  )
}
