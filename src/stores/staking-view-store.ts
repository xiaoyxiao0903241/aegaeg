import { stakingHashForView, type StakingView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { StakingView }

const stakingView = createDappSubviewStore<StakingView>({
  hub: 'hub',
  hashForView: stakingHashForView,
})

/** 纯视图与切换动画状态；面板滚动复位属 DOM 副作用，由外壳页面处理。 */
export const useStakingViewStore = stakingView.useStore
export const useStakingViewMotion = stakingView.useMotion
