import { rewardsHashForView, type RewardsView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { RewardsView }

const rewardsView = createDappSubviewStore<RewardsView>({
  hub: 'hub',
  hashForView: rewardsHashForView,
})

export const useRewardsViewStore = rewardsView.useStore
export const useRewardsViewMotion = rewardsView.useMotion
