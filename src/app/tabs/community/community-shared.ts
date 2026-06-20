import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

export type CommunityStat = {
  dark?: boolean
  image?: string
  label: ReactNode
  today?: ReactNode
  value: ReactNode
  volume?: ReactNode
}

export const REFERRAL_CARD_CLASS = cn(
  '[&_strong]:block [&_strong]:max-w-full [&_strong]:truncate',
  'rounded-2xl px-4 py-3.5',
  '[&_label]:text-xs [&_label]:text-faint',
)

export const SHAREHOLDER_ACTION_CLASS = cn(
  'mt-4 min-h-10 hover:shadow-primary-hover-xl focus-visible:shadow-primary-hover-xl max-dapp:hidden',
)

export const COMMUNITY_STAT_GRID = cn(
  'mt-3.5 grid grid-cols-3 gap-3.5',
  'max-[1100px]:grid-cols-[repeat(auto-fit,minmax(min(100%,9.5rem),1fr))]',
  'max-dapp:mt-3 max-dapp:min-w-0 max-dapp:grid-cols-3 max-dapp:gap-2.5',
)
