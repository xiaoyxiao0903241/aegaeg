import { exchangeHashForView, type ExchangeView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { ExchangeView }

function syncExchangeHash(view: ExchangeView) {
  const next = exchangeHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== next) {
    window.location.hash = next
  }
}

/** Pure view/motion state — panel scroll lives in the shell (DOM side effect). */
export const useExchangeViewStore = createDappSubviewStore<ExchangeView>({
  hub: 'hub',
  syncHash: syncExchangeHash,
})
