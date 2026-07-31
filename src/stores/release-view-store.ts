import { releaseHashForView, type ReleaseView } from '~/shared/config/release-deep-link'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { ReleaseView }

function syncReleaseHash(view: ReleaseView) {
  const next = releaseHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== next) {
    window.location.hash = next
  }
}

export const useReleaseViewStore = createDappSubviewStore<ReleaseView>({
  hub: 'hub',
  syncHash: syncReleaseHash,
})
