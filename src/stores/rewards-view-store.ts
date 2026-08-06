import { rewardsHashForView, type RewardsView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { RewardsView }

const rewardsView = createDappSubviewStore<RewardsView>({
  hub: 'hub',
  hashForView: rewardsHashForView,
})

/** 当前奖励子页与切换动画状态；滚动复位由宿主页面处理。 */
export const useRewardsViewStore = rewardsView.useStore
export const useRewardsViewMotion = rewardsView.useMotion
