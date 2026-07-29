import { create } from 'zustand'
import { getInitialTab, resolveTabFromHash } from '~/app/utils'
import { resolveDappLocationFromHash } from '~/shared/config/exchange-deep-link'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useStakingViewStore } from '~/stores/staking-view-store'

interface DappShellStore {
  activeTab: DappTab
  detailCollapsed: boolean
  mobileNavOpen: boolean
  selectTab: (tab: DappTab) => void
  selectMobileTab: (tab: DappTab) => void
  toggleDetailCollapsed: () => void
  setMobileNavOpen: (open: boolean) => void
  syncTabFromHash: () => void
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
  if (window.location.hash.slice(1) !== tab) {
    window.location.hash = tab
  }
}

function resetForeignSubviewStores(tab: DappTab) {
  if (tab !== 'exchange') {
    useExchangeViewStore.getState().backToHub({ syncHash: false })
  }
  if (tab !== 'staking') {
    useStakingViewStore.getState().backToHub({ syncHash: false })
  }
  if (tab !== 'assets') {
    useAssetsViewStore.getState().backToHub({ syncHash: false })
  }
}

/** Pure tab state — URL hash sync lives in the shell (external system). */
export const useDappShellStore = create<DappShellStore>((set) => ({
  activeTab: getInitialTab(),
  detailCollapsed: false,
  mobileNavOpen: false,
  selectTab: (tab) => {
    resetForeignSubviewStores(tab)
    set(() => ({
      activeTab: tab,
    }))
    writeTabHash(tab)
  },
  selectMobileTab: (tab) => {
    resetForeignSubviewStores(tab)
    set({
      activeTab: tab,
      mobileNavOpen: false,
    })
    writeTabHash(tab)
  },
  toggleDetailCollapsed: () => set((state) => ({ detailCollapsed: !state.detailCollapsed })),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  syncTabFromHash: () => {
    const loc = resolveDappLocationFromHash(window.location.hash.slice(1))
    if (!loc) {
      const tab = resolveTabFromHash(window.location.hash.slice(1))
      if (tab) set({ activeTab: tab })
      return
    }
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
  },
}))
