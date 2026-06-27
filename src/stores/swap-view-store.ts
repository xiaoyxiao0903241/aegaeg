import { create } from 'zustand'

export type SwapView = 'hub' | 'flash' | 'trade'

interface SwapViewStore {
  view: SwapView
  setView: (view: SwapView) => void
  backToHub: () => void
}

export const useSwapViewStore = create<SwapViewStore>((set) => ({
  view: 'hub',
  setView: (view) => set({ view }),
  backToHub: () => set({ view: 'hub' }),
}))
