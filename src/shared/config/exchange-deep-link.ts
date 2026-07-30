import { tabOrder, type DappTab } from '~/shared/config/dapp-tabs'
import { isAssetsView, type AssetsView } from '~/shared/config/assets-deep-link'
import { isReleaseView, type ReleaseView } from '~/shared/config/release-deep-link'
import { isRewardsView, type RewardsView } from '~/shared/config/rewards-deep-link'
import { isStakingView, type StakingView } from '~/shared/config/staking-deep-link'

export type ExchangeView = 'hub' | 'flash' | 'trade' | 'burn' | 'turbine'
export type { StakingView, AssetsView, RewardsView, ReleaseView }

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

type DappLocation = {
  tab: DappTab
  exchangeView: ExchangeView | null
  stakingView: StakingView | null
  assetsView: AssetsView | null
  rewardsView: RewardsView | null
  releaseView: ReleaseView | null
}

function emptyViews(tab: DappTab, patch: Partial<DappLocation> = {}): DappLocation {
  return {
    tab,
    exchangeView: null,
    stakingView: null,
    assetsView: null,
    rewardsView: null,
    releaseView: null,
    ...patch,
  }
}

/**
 * Deep-link surface for exchange + staking + assets + rewards + release subviews.
 * Hash forms: `#exchange` | `#exchange/burn` | `#staking/stake` | `#assets/lpbond` | `#rewards/lucky` | `#release/queue` | …
 * Legacy: `#swap` → exchange hub.
 * Release subviews are `hub|queue|buffer` only — never `rewards`.
 */
export function resolveDappLocationFromHash(hash: string): DappLocation | null {
  const raw = hash.replace(/^#/, '').trim()
  if (!raw) return null
  if (raw === 'swap') return emptyViews('exchange', { exchangeView: 'hub' })

  const parts = raw.split('/')
  const tabPart = parts[0]
  const viewPart = parts[1]
  if (!tabPart || !isDappTab(tabPart)) return null

  if (tabPart === 'exchange') {
    if (!viewPart) return emptyViews('exchange')
    if (!isExchangeView(viewPart)) return emptyViews('exchange', { exchangeView: 'hub' })
    return emptyViews('exchange', { exchangeView: viewPart })
  }

  if (tabPart === 'staking') {
    if (!viewPart) return emptyViews('staking')
    if (!isStakingView(viewPart)) return emptyViews('staking', { stakingView: 'hub' })
    return emptyViews('staking', { stakingView: viewPart })
  }

  if (tabPart === 'assets') {
    if (!viewPart) return emptyViews('assets')
    if (!isAssetsView(viewPart)) return emptyViews('assets', { assetsView: 'hub' })
    return emptyViews('assets', { assetsView: viewPart })
  }

  if (tabPart === 'rewards') {
    if (!viewPart) return emptyViews('rewards')
    if (!isRewardsView(viewPart)) return emptyViews('rewards', { rewardsView: 'hub' })
    return emptyViews('rewards', { rewardsView: viewPart })
  }

  if (tabPart === 'release') {
    if (!viewPart) return emptyViews('release')
    // Reject legacy prototype name `rewards` as a release subview.
    if (viewPart === 'rewards' || !isReleaseView(viewPart)) {
      return emptyViews('release', { releaseView: 'hub' })
    }
    return emptyViews('release', { releaseView: viewPart })
  }

  return emptyViews(tabPart)
}

/** Map URL hash → tab; legacy `#swap` and `#exchange/<view>` supported. */
export function resolveTabFromHash(hash: string): DappTab | null {
  return resolveDappLocationFromHash(hash)?.tab ?? null
}

/** Initial DApp tab from `window.location.hash` (browser-only). */
export function getInitialTab(): DappTab {
  return resolveTabFromHash(window.location.hash.slice(1)) ?? 'exchange'
}
