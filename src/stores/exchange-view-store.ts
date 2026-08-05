import { exchangeHashForView, type ExchangeView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { ExchangeView }

const exchangeView = createDappSubviewStore<ExchangeView>({
  hub: 'hub',
  hashForView: exchangeHashForView,
})

/** 纯视图与切换动画状态；面板滚动复位属 DOM 副作用，由外壳页面处理。 */
export const useExchangeViewStore = exchangeView.useStore
export const useExchangeViewMotion = exchangeView.useMotion
