import { stakingHashForView, type StakingView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { StakingView }

const stakingView = createDappSubviewStore<StakingView>({
  hub: 'hub',
  hashForView: stakingHashForView,
})

/** 当前质押子页与切换动画状态。 */
export const useStakingViewStore = stakingView.useStore
export const useStakingViewMotion = stakingView.useMotion
