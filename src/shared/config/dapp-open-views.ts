import {
  assetsHashForView,
  type AssetsView,
  exchangeHashForView,
  type ExchangeView,
  releaseHashForView,
  type ReleaseView,
  rewardsHashForView,
  type RewardsView,
  stakingHashForView,
  type StakingView,
} from '~/shared/config/dapp-deep-links'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { useStakingViewStore } from '~/stores/staking-view-store'

function syncHash(nextHashWithHash: string) {
  const nextHash = nextHashWithHash.slice(1)
  if (window.location.hash.slice(1) !== nextHash) {
    window.location.hash = nextHash
  }
}

function openSubview<T extends string>(
  setView: (view: T) => void,
  hashForView: (view: T) => string,
  view: T,
) {
  setView(view)
  syncHash(hashForView(view))
}

/** Navigate other rails to a concrete exchange subview (e.g. rewards → burn). EX-B4. */
export function openExchangeView(view: ExchangeView) {
  openSubview(useExchangeViewStore.getState().setView, exchangeHashForView, view)
}

/** Navigate to a concrete assets subview (hub cards / empty CTAs / deep links). */
export function openAssetsView(view: AssetsView) {
  openSubview(useAssetsViewStore.getState().setView, assetsHashForView, view)
}

/** Navigate to a concrete staking subview (hub mode cards / deep links). */
export function openStakingView(view: StakingView) {
  openSubview(useStakingViewStore.getState().setView, stakingHashForView, view)
}

export function openRewardsView(view: RewardsView) {
  openSubview(useRewardsViewStore.getState().setView, rewardsHashForView, view)
}

export function openReleaseView(view: ReleaseView) {
  openSubview(useReleaseViewStore.getState().setView, releaseHashForView, view)
}
