import { tabOrder, type DappTab } from '~/shared/config/dapp-tabs'
import { isStakingView, type StakingView } from '~/shared/config/staking-deep-link'

export type ExchangeView = 'hub' | 'flash' | 'trade' | 'burn' | 'turbine'
export type { StakingView }

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
 * Deep-link surface for exchange + staking subviews.
 * Hash forms: `#exchange` | `#exchange/burn` | `#staking` | `#staking/stake` | …
 * Legacy: `#swap` → exchange hub.
 */
export function resolveDappLocationFromHash(hash: string): {
  tab: DappTab
  exchangeView: ExchangeView | null
  stakingView: StakingView | null
} | null {
  const raw = hash.replace(/^#/, '').trim()
  if (!raw) return null
  if (raw === 'swap') return { tab: 'exchange', exchangeView: 'hub', stakingView: null }

  const parts = raw.split('/')
  const tabPart = parts[0]
  const viewPart = parts[1]
  if (!tabPart || !isDappTab(tabPart)) return null

  if (tabPart === 'exchange') {
    if (!viewPart) return { tab: 'exchange', exchangeView: null, stakingView: null }
    if (!isExchangeView(viewPart))
      return { tab: 'exchange', exchangeView: 'hub', stakingView: null }
    return { tab: 'exchange', exchangeView: viewPart, stakingView: null }
  }

  if (tabPart === 'staking') {
    if (!viewPart) return { tab: 'staking', exchangeView: null, stakingView: null }
    if (!isStakingView(viewPart)) return { tab: 'staking', exchangeView: null, stakingView: 'hub' }
    return { tab: 'staking', exchangeView: null, stakingView: viewPart }
  }

  return { tab: tabPart, exchangeView: null, stakingView: null }
}
