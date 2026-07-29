import { useStakingViewStore, type StakingView } from '~/stores/staking-view-store'
import { stakingHashForView } from '~/shared/config/staking-deep-link'

/** Navigate to a concrete staking subview (hub mode cards / deep links). */
export function openStakingView(view: StakingView) {
  useStakingViewStore.getState().setView(view)
  const nextHash = stakingHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== nextHash) {
    window.location.hash = nextHash
  }
}
