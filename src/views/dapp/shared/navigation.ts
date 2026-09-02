import {
  assetsHashForView,
  type AssetsView,
  exchangeHashForView,
  type ExchangeView,
  isXmineSubviewClosed,
  releaseHashForView,
  type ReleaseView,
  rewardsHashForView,
  type RewardsView,
  stakingHashForView,
  type StakingView,
} from '~/shared/config/dapp-deep-links'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import { useDappHostStore } from '~/stores/dapp-host-store'
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
  openSubview(
    useAssetsViewStore.getState().setView,
    assetsHashForView,
    isXmineSubviewClosed(view) ? 'hub' : view,
  )
}

/** 跳转到指定 staking 子视图（hub 模式卡片 / 深链接）。 */
export function openStakingView(view: StakingView) {
  openSubview(
    useStakingViewStore.getState().setView,
    stakingHashForView,
    isXmineSubviewClosed(view) ? 'hub' : view,
  )
}

/** 跳转到指定 rewards 子视图。 */
export function openRewardsView(view: RewardsView) {
  openSubview(useRewardsViewStore.getState().setView, rewardsHashForView, view)
}

/** 跳转到指定 release 子视图。 */
export function openReleaseView(view: ReleaseView) {
  openSubview(useReleaseViewStore.getState().setView, releaseHashForView, view)
}

/**
 * 跳转到社区页，让用户补绑推荐人。
 *
 * 手册 §5 规定：未绑定推荐关系的地址在质押 / 债券等写操作前必须补绑，
 * 后端在需要补绑时返回 need_referral / notBound，前端据此引导用户去绑定。
 *
 * @see 手册 §5 推荐关系 Referral
 */
export function goBindReferral(): void {
  useDappHostStore.getState().selectTab('community')
}
