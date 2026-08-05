import { assetsHashForView, type AssetsView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { AssetsView }

const assetsView = createDappSubviewStore<AssetsView>({
  hub: 'hub',
  hashForView: assetsHashForView,
})

/** 纯视图与切换动画状态；面板滚动复位属 DOM 副作用，由外壳页面处理。 */
export const useAssetsViewStore = assetsView.useStore
export const useAssetsViewMotion = assetsView.useMotion
