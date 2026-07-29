import { useReleaseViewStore, type ReleaseView } from '~/stores/release-view-store'
import { releaseHashForView } from '~/shared/config/release-deep-link'

export function openReleaseView(view: ReleaseView) {
  useReleaseViewStore.getState().setView(view)
  const nextHash = releaseHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== nextHash) {
    window.location.hash = nextHash
  }
}
