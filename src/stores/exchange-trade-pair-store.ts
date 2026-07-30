import { create } from 'zustand'
import {
  resolveBuyKeyAfterSellChange,
  type TradeTokenKey,
} from '~/core/exchange/resolve-trade-path'

interface ExchangeTradePairStore {
  sellKey: TradeTokenKey
  buyKey: TradeTokenKey
  setSellKey: (key: TradeTokenKey) => void
  setBuyKey: (key: TradeTokenKey) => void
  flipPair: () => void
}

/** Figma default: Sell USD1 / Buy AGX. */
export const useExchangeTradePairStore = create<ExchangeTradePairStore>((set) => ({
  sellKey: 'usd1',
  buyKey: 'agx',
  setSellKey: (sellKey) =>
    set((state) => ({
      sellKey,
      buyKey: resolveBuyKeyAfterSellChange(sellKey, state.buyKey),
    })),
  setBuyKey: (buyKey) =>
    set((state) => {
      if (buyKey === state.sellKey) return state
      return { buyKey }
    }),
  flipPair: () =>
    set((state) => ({
      sellKey: state.buyKey,
      buyKey: state.sellKey,
    })),
}))
