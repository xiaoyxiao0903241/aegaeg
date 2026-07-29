export type RewardsView =
  'hub' | 'lucky' | 'referral' | 'participate' | 'cobuild' | 'grant' | 'genesis'

const REWARDS_VIEWS = new Set<RewardsView>([
  'hub',
  'lucky',
  'referral',
  'participate',
  'cobuild',
  'grant',
  'genesis',
])

export function isRewardsView(value: string): value is RewardsView {
  return REWARDS_VIEWS.has(value as RewardsView)
}

export function rewardsHashForView(view: RewardsView): string {
  return view === 'hub' ? '#rewards' : `#rewards/${view}`
}

/** Card → contract key (grilling 14 / ticket 08). */
export const REWARDS_CARD_CONTRACT = {
  lucky: 'LuckyPool',
  referral: 'CommunityFund',
  participate: 'IncentivePool',
  cobuild: 'DaoPool',
  grant: 'MarketFund',
  genesis: 'RewardClaimer',
} as const satisfies Record<Exclude<RewardsView, 'hub'>, string>
