import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { CommunityStatCard } from '~/app/components/dapp-card'
import { cn } from '~/lib/utils'

export const communityStatGrid = tv({
  base: cn(
    'grid grid-cols-4 gap-3.5',
    'max-tablet:grid-cols-[repeat(auto-fit,minmax(min(100%,9.5rem),1fr))]',
    'max-dapp:min-w-0 max-dapp:grid-cols-2 max-dapp:gap-2.5',
  ),
})

const communityStatCard = tv({
  variants: {
    mobileCentered: {
      true: 'items-center text-center shadow-card [&>b]:hidden [&>small]:hidden [&>span]:text-xs [&>span]:tracking-[-0.11px] [&>strong]:text-lg [&>strong]:tracking-[-0.54px]',
      false: '',
    },
  },
  defaultVariants: {
    mobileCentered: false,
  },
})

export function CommunityStatGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn(communityStatGrid(), className)}>{children}</div>
}

export function CommunityOverviewStatCard({
  dark,
  image,
  label,
  mobileCentered = false,
  today,
  value,
  volume,
}: {
  dark?: boolean
  image?: string
  label: ReactNode
  mobileCentered?: boolean
  today?: ReactNode
  value: ReactNode
  volume?: ReactNode
}) {
  return (
    <CommunityStatCard
      className={communityStatCard({ mobileCentered })}
      dark={dark}
      image={image}
      label={label}
      today={today}
      value={value}
      volume={volume}
    />
  )
}
