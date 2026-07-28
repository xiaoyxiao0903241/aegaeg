import type { ReactNode } from 'react'
import { Text, type TextProps } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

type RankTitleWithSuperCommunityProps = {
  as?: NonNullable<TextProps['as']>
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
      className={cn('min-w-0 leading-[1.3] wrap-break-word', className)}
    >
      {label}
    </Text>
  )
}
