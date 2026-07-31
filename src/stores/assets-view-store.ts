import { assetsHashForView, type AssetsView } from '~/shared/config/assets-deep-link'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { AssetsView }

function syncAssetsHash(view: AssetsView) {
  const next = assetsHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== next) {
    window.location.hash = next
  }
}

/** Pure view/motion state — panel scroll lives in the shell (DOM side effect). */
export const useAssetsViewStore = createDappSubviewStore<AssetsView>({
  hub: 'hub',
  syncHash: syncAssetsHash,
})
