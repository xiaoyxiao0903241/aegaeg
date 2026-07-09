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
    <Text
      as={Component}
      variant="brand"
      tone="foreground"
      className={cn(
        // 4175 dappRankTitleClass: body-lg 17px / lh 1.3 / tracking -0.34 (api brand)
        'min-w-0 break-words leading-[1.3] tracking-[-0.02em]',
        className,
      )}
    >
      {label}
    </Text>
  )
}
