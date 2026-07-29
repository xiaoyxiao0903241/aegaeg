export type StakingView = 'hub' | 'stake' | 'lpbond' | 'burnbond' | 'xmine' | 'calc'

const STAKING_VIEWS = new Set<StakingView>(['hub', 'stake', 'lpbond', 'burnbond', 'xmine', 'calc'])

export function isStakingView(value: string): value is StakingView {
  return STAKING_VIEWS.has(value as StakingView)
}

export function stakingHashForView(view: StakingView): string {
  return view === 'hub' ? '#staking' : `#staking/${view}`
}
