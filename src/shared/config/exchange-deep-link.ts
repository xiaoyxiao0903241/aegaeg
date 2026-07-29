import { tabOrder, type DappTab } from '~/shared/config/dapp-tabs'
import { isAssetsView, type AssetsView } from '~/shared/config/assets-deep-link'
import { isRewardsView, type RewardsView } from '~/shared/config/rewards-deep-link'
import { isStakingView, type StakingView } from '~/shared/config/staking-deep-link'

export type ExchangeView = 'hub' | 'flash' | 'trade' | 'burn' | 'turbine'
export type { StakingView, AssetsView, RewardsView }

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
 * Deep-link surface for exchange + staking + assets + rewards subviews.
 * Hash forms: `#exchange` | `#exchange/burn` | `#staking/stake` | `#assets/lpbond` | `#rewards/lucky` | …
 * Legacy: `#swap` → exchange hub.
 */
export function resolveDappLocationFromHash(hash: string): {
  tab: DappTab
  exchangeView: ExchangeView | null
  stakingView: StakingView | null
  assetsView: AssetsView | null
  rewardsView: RewardsView | null
} | null {
  const raw = hash.replace(/^#/, '').trim()
  if (!raw) return null
  if (raw === 'swap')
    return {
      tab: 'exchange',
      exchangeView: 'hub',
      stakingView: null,
      assetsView: null,
      rewardsView: null,
    }

  const parts = raw.split('/')
  const tabPart = parts[0]
  const viewPart = parts[1]
  if (!tabPart || !isDappTab(tabPart)) return null

  if (tabPart === 'exchange') {
    if (!viewPart)
      return {
        tab: 'exchange',
        exchangeView: null,
        stakingView: null,
        assetsView: null,
        rewardsView: null,
      }
    if (!isExchangeView(viewPart))
      return {
        tab: 'exchange',
        exchangeView: 'hub',
        stakingView: null,
        assetsView: null,
        rewardsView: null,
      }
    return {
      tab: 'exchange',
      exchangeView: viewPart,
      stakingView: null,
      assetsView: null,
      rewardsView: null,
    }
  }

  if (tabPart === 'staking') {
    if (!viewPart)
      return {
        tab: 'staking',
        exchangeView: null,
        stakingView: null,
        assetsView: null,
        rewardsView: null,
      }
    if (!isStakingView(viewPart))
      return {
        tab: 'staking',
        exchangeView: null,
        stakingView: 'hub',
        assetsView: null,
        rewardsView: null,
      }
    return {
      tab: 'staking',
      exchangeView: null,
      stakingView: viewPart,
      assetsView: null,
      rewardsView: null,
    }
  }

  if (tabPart === 'assets') {
    if (!viewPart)
      return {
        tab: 'assets',
        exchangeView: null,
        stakingView: null,
        assetsView: null,
        rewardsView: null,
      }
    if (!isAssetsView(viewPart))
      return {
        tab: 'assets',
        exchangeView: null,
        stakingView: null,
        assetsView: 'hub',
        rewardsView: null,
      }
    return {
      tab: 'assets',
      exchangeView: null,
      stakingView: null,
      assetsView: viewPart,
      rewardsView: null,
    }
  }

  if (tabPart === 'rewards') {
    if (!viewPart)
      return {
        tab: 'rewards',
        exchangeView: null,
        stakingView: null,
        assetsView: null,
        rewardsView: null,
      }
    if (!isRewardsView(viewPart))
      return {
        tab: 'rewards',
        exchangeView: null,
        stakingView: null,
        assetsView: null,
        rewardsView: 'hub',
      }
    return {
      tab: 'rewards',
      exchangeView: null,
      stakingView: null,
      assetsView: null,
      rewardsView: viewPart,
    }
  }

  return {
    tab: tabPart,
    exchangeView: null,
    stakingView: null,
    assetsView: null,
    rewardsView: null,
  }
}
