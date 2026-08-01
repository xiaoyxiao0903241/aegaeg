import { rewardsHashForView, type RewardsView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { RewardsView }

export const useRewardsViewStore = createDappSubviewStore<RewardsView>({
  hub: 'hub',
  hashForView: rewardsHashForView,
})
