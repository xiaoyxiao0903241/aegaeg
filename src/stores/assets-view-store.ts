import { assetsHashForView, type AssetsView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { AssetsView }

const assetsView = createDappSubviewStore<AssetsView>({
  hub: 'hub',
  hashForView: assetsHashForView,
})

/** Pure view/motion state — panel scroll lives in the shell (DOM side effect). */
export const useAssetsViewStore = assetsView.useStore
export const useAssetsViewMotion = assetsView.useMotion
