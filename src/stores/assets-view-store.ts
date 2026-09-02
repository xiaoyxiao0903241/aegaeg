import { assetsHashForView, type AssetsView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { AssetsView }

const assetsView = createDappSubviewStore<AssetsView>({
  hub: 'hub',
  hashForView: assetsHashForView,
})

/** 当前资产视图与面板切换动画状态。 */
export const useAssetsViewStore = assetsView.useStore
export const useAssetsViewMotion = assetsView.useMotion
