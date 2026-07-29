import { useRewardsViewStore, type RewardsView } from '~/stores/rewards-view-store'
import { rewardsHashForView } from '~/shared/config/rewards-deep-link'

export function openRewardsView(view: RewardsView) {
  useRewardsViewStore.getState().setView(view)
  const nextHash = rewardsHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== nextHash) {
    window.location.hash = nextHash
  }
}
