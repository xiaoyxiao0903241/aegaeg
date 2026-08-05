import { releaseHashForView, type ReleaseView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { ReleaseView }

const releaseView = createDappSubviewStore<ReleaseView>({
  hub: 'hub',
  hashForView: releaseHashForView,
})

/** 纯视图与切换动画状态；面板滚动复位属 DOM 副作用，由外壳页面处理。 */
export const useReleaseViewStore = releaseView.useStore
export const useReleaseViewMotion = releaseView.useMotion
