import { releaseHashForView, type ReleaseView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { ReleaseView }

export const useReleaseViewStore = createDappSubviewStore<ReleaseView>({
  hub: 'hub',
  hashForView: releaseHashForView,
})
