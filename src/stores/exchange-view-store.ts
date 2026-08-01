import { exchangeHashForView, type ExchangeView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { ExchangeView }

const exchangeView = createDappSubviewStore<ExchangeView>({
  hub: 'hub',
  hashForView: exchangeHashForView,
})

/** Pure view/motion state — panel scroll lives in the shell (DOM side effect). */
export const useExchangeViewStore = exchangeView.useStore
export const useExchangeViewMotion = exchangeView.useMotion
