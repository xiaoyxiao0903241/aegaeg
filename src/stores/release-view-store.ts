import { releaseHashForView, type ReleaseView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { ReleaseView }

const releaseView = createDappSubviewStore<ReleaseView>({
  hub: 'hub',
  hashForView: releaseHashForView,
})

export const useReleaseViewStore = releaseView.useStore
export const useReleaseViewMotion = releaseView.useMotion
