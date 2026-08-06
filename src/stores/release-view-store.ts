import { releaseHashForView, type ReleaseView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { ReleaseView }

const releaseView = createDappSubviewStore<ReleaseView>({
  hub: 'hub',
  hashForView: releaseHashForView,
})

/** 当前释放子页与切换动画状态；滚动复位由宿主页面处理。 */
export const useReleaseViewStore = releaseView.useStore
export const useReleaseViewMotion = releaseView.useMotion
