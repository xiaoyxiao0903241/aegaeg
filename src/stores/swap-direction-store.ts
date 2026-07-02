import { create } from 'zustand'
import type { SwapDirection } from '~/lib/swap/swap-pair'

interface SwapDirectionStore {
  direction: SwapDirection
  flipDirection: () => void
}

export const useSwapDirectionStore = create<SwapDirectionStore>((set) => ({
  direction: 'reverse',
  flipDirection: () =>
    set((state) => ({
      direction: state.direction === 'forward' ? 'reverse' : 'forward',
    })),
}))
