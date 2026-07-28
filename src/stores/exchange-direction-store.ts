import { create } from 'zustand'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'

interface ExchangeDirectionStore {
  direction: ExchangeDirection
  flipDirection: () => void
}

export const useExchangeDirectionStore = create<ExchangeDirectionStore>((set) => ({
  direction: 'reverse',
  flipDirection: () =>
    set((state) => ({
      direction: state.direction === 'forward' ? 'reverse' : 'forward',
    })),
}))
