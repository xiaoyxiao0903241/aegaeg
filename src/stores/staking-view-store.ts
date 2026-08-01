import { stakingHashForView, type StakingView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { StakingView }

const stakingView = createDappSubviewStore<StakingView>({
  hub: 'hub',
  hashForView: stakingHashForView,
})

/** Pure view/motion state — panel scroll lives in the shell (DOM side effect). */
export const useStakingViewStore = stakingView.useStore
export const useStakingViewMotion = stakingView.useMotion
