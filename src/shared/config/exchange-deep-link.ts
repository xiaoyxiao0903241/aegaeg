import { tabOrder, type DappTab } from '~/shared/config/dapp-tabs'

export type ExchangeView = 'hub' | 'flash' | 'trade' | 'burn' | 'turbine'

const EXCHANGE_VIEWS = new Set<ExchangeView>(['hub', 'flash', 'trade', 'burn', 'turbine'])

function isDappTab(value: string): value is DappTab {
  return tabOrder.includes(value as DappTab)
}

export function isExchangeView(value: string): value is ExchangeView {
  return EXCHANGE_VIEWS.has(value as ExchangeView)
}

export function exchangeHashForView(view: ExchangeView): string {
  return view === 'hub' ? '#exchange' : `#exchange/${view}`
}

/**
 * EX-B4 — stable deep-link surface for exchange subviews.
 * Hash forms: `#exchange` | `#exchange/burn` | `#exchange/flash` | …
 * Legacy: `#swap` → exchange hub.
 */
export function resolveDappLocationFromHash(hash: string): {
  tab: DappTab
  exchangeView: ExchangeView | null
} | null {
  const raw = hash.replace(/^#/, '').trim()
  if (!raw) return null
  if (raw === 'swap') return { tab: 'exchange', exchangeView: 'hub' }

  const parts = raw.split('/')
  const tabPart = parts[0]
  const viewPart = parts[1]
  if (!tabPart || !isDappTab(tabPart)) return null
  if (tabPart !== 'exchange') return { tab: tabPart, exchangeView: null }
  if (!viewPart) return { tab: 'exchange', exchangeView: null }
  if (!isExchangeView(viewPart)) return { tab: 'exchange', exchangeView: 'hub' }
  return { tab: 'exchange', exchangeView: viewPart }
}
