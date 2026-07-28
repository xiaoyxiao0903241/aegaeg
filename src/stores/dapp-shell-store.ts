import { create } from 'zustand'
import { getInitialTab, resolveTabFromHash } from '~/app/utils'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { useExchangeViewStore } from '~/stores/exchange-view-store'

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

/** Pure tab state — URL hash sync lives in the shell (external system). */
export const useDappShellStore = create<DappShellStore>((set) => ({
  activeTab: getInitialTab(),
  detailCollapsed: false,
  mobileNavOpen: false,
  selectTab: (tab) => {
    if (tab !== 'exchange') {
      useExchangeViewStore.getState().backToHub()
    }
    set(() => ({
      activeTab: tab,
    }))
  },
  selectMobileTab: (tab) => {
    if (tab !== 'exchange') {
      useExchangeViewStore.getState().backToHub()
    }
    set({
      activeTab: tab,
      mobileNavOpen: false,
    })
  },
  toggleDetailCollapsed: () => set((state) => ({ detailCollapsed: !state.detailCollapsed })),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  syncTabFromHash: () => {
    const tab = resolveTabFromHash(window.location.hash.slice(1))
    if (tab) {
      set({ activeTab: tab })
    }
  },
}))
