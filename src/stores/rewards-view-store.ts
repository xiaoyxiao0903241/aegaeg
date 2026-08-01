import { rewardsHashForView, type RewardsView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { RewardsView }

function syncRewardsHash(view: RewardsView) {
  const next = rewardsHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== next) {
    window.location.hash = next
  }
}

export const useRewardsViewStore = createDappSubviewStore<RewardsView>({
  hub: 'hub',
  syncHash: syncRewardsHash,
})
