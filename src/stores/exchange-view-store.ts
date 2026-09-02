import { exchangeHashForView, type ExchangeView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { ExchangeView }

const exchangeView = createDappSubviewStore<ExchangeView>({
  hub: 'hub',
  hashForView: exchangeHashForView,
})

/** 当前交换子页与切换动画状态。 */
export const useExchangeViewStore = exchangeView.useStore
export const useExchangeViewMotion = exchangeView.useMotion
