import { useAssetsViewStore, type AssetsView } from '~/stores/assets-view-store'
import { assetsHashForView } from '~/shared/config/assets-deep-link'

/** Navigate to a concrete assets subview (hub cards / empty CTAs / deep links). */
export function openAssetsView(view: AssetsView) {
  useAssetsViewStore.getState().setView(view)
  const nextHash = assetsHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== nextHash) {
    window.location.hash = nextHash
  }
}
