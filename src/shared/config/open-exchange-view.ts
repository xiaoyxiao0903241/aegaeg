import { useExchangeViewStore, type ExchangeView } from '~/stores/exchange-view-store'
import { exchangeHashForView } from '~/shared/config/exchange-deep-link'

/** Navigate other rails to a concrete exchange subview (e.g. rewards → burn). EX-B4. */
export function openExchangeView(view: ExchangeView) {
  useExchangeViewStore.getState().setView(view)
  const nextHash = exchangeHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== nextHash) {
    window.location.hash = nextHash
  }
}
