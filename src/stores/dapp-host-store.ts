import { create } from 'zustand'

import { dappLocationFromHash, getInitialTab } from '~/shared/config/dapp-deep-links'
import { type DappTab, resolveDappTabSelect } from '~/shared/config/dapp-tabs'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { useStakingViewStore } from '~/stores/staking-view-store'

interface DappHostStore {
  activeTab: DappTab
  detailCollapsed: boolean
  mobileNavOpen: boolean
  selectTab: (tab: DappTab) => void
  selectMobileTab: (tab: DappTab) => void
  toggleDetailCollapsed: () => void
  setMobileNavOpen: (open: boolean) => void
  syncTabFromHash: () => void
  /**
   * 重置非当前 Tab 的子视图仓库回 hub
   *
   * 需在内容淡出、displayTab 切换后调用；
   * 不能在 selectTab 时执行，否则子视图淡出期间会闪回 hub。
   */
  resetForeignSubviewStores: (tab: DappTab) => void
}

function writeTabHash(tab: DappTab) {
  if (tab === 'exchange') {
    if (!window.location.hash.startsWith('#exchange')) {
      window.location.hash = 'exchange'
    }
    return
  }
  if (tab === 'staking') {
    if (!window.location.hash.startsWith('#staking')) {
      window.location.hash = 'staking'
    }
    return
  }
  if (tab === 'assets') {
    if (!window.location.hash.startsWith('#assets')) {
      window.location.hash = 'assets'
    }
    return
  }
  if (tab === 'rewards') {
    if (!window.location.hash.startsWith('#rewards')) {
      window.location.hash = 'rewards'
    }
    return
  }
  if (tab === 'release') {
    if (!window.location.hash.startsWith('#release')) {
      window.location.hash = 'release'
    }
    return
  }
  if (window.location.hash.slice(1) !== tab) {
    window.location.hash = tab
  }
}

const subviewStoreByTab = {
  exchange: useExchangeViewStore,
  staking: useStakingViewStore,
  assets: useAssetsViewStore,
  rewards: useRewardsViewStore,
  release: useReleaseViewStore,
} as const

function resetForeignSubviewStores(tab: DappTab) {
  for (const [id, store] of Object.entries(subviewStoreByTab)) {
    if (id !== tab) {
      store.getState().backToHub({ syncHash: false })
    }
  }
}

function subviewStoreFor(tab: DappTab) {
  if (!(tab in subviewStoreByTab)) return undefined
  return subviewStoreByTab[tab as keyof typeof subviewStoreByTab]
}

/** 纯 Tab 状态；URL hash 同步属于外部系统（路由层），本仓库不负责。 */
export const useDappHostStore = create<DappHostStore>((set, get) => {
  function applyTabSelect(tab: DappTab, extras?: { mobileNavOpen: false }) {
    const store = subviewStoreFor(tab)
    const intent = resolveDappTabSelect({
      tab,
      activeTab: get().activeTab,
      subview: store?.getState().view,
    })
    if (intent === 'back-to-hub') {
      store?.getState().backToHub()
      if (extras) set(extras)
      return
    }
    if (intent === 'noop') {
      if (extras) set(extras)
      return
    }
    set({ activeTab: tab, ...extras })
    writeTabHash(tab)
  }

  return {
    activeTab: getInitialTab(),
    detailCollapsed: false,
    mobileNavOpen: false,
    selectTab: applyTabSelect,
    selectMobileTab: (tab) => {
      applyTabSelect(tab, { mobileNavOpen: false })
    },
    toggleDetailCollapsed: () => set((state) => ({ detailCollapsed: !state.detailCollapsed })),
    setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
    resetForeignSubviewStores,
    syncTabFromHash: () => {
      const loc = dappLocationFromHash(window.location.hash.slice(1))
      if (!loc) return
      set({ activeTab: loc.tab })
      if (loc.tab === 'exchange' && loc.exchangeView) {
        useExchangeViewStore.getState().hydrateView(loc.exchangeView)
      }
      if (loc.tab === 'staking' && loc.stakingView) {
        useStakingViewStore.getState().hydrateView(loc.stakingView)
      }
      if (loc.tab === 'assets' && loc.assetsView) {
        useAssetsViewStore.getState().hydrateView(loc.assetsView)
      }
      if (loc.tab === 'rewards' && loc.rewardsView) {
        useRewardsViewStore.getState().hydrateView(loc.rewardsView)
      }
      if (loc.tab === 'release' && loc.releaseView) {
        useReleaseViewStore.getState().hydrateView(loc.releaseView)
      }
    },
  }
})
