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

/** 跳转到指定 exchange 子视图（如从 rewards 页打开 burn）。 */
export function openExchangeView(view: ExchangeView) {
  openSubview(useExchangeViewStore.getState().setView, exchangeHashForView, view)
}

/** 跳转到指定 assets 子视图（hub 卡片 / 空态按钮 / 深链接）。 */
export function openAssetsView(view: AssetsView) {
  openSubview(useAssetsViewStore.getState().setView, assetsHashForView, view)
}

/** 跳转到指定 staking 子视图（hub 模式卡片 / 深链接）。 */
export function openStakingView(view: StakingView) {
  openSubview(useStakingViewStore.getState().setView, stakingHashForView, view)
}

/** 跳转到指定 rewards 子视图。 */
export function openRewardsView(view: RewardsView) {
  openSubview(useRewardsViewStore.getState().setView, rewardsHashForView, view)
}

/** 跳转到指定 release 子视图。 */
export function openReleaseView(view: ReleaseView) {
  openSubview(useReleaseViewStore.getState().setView, releaseHashForView, view)
}
