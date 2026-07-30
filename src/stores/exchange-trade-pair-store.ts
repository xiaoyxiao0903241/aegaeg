import { create } from 'zustand'
import {
  isTradeTokenLive,
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

/** Figma default: Sell USD1 / Buy AGX. Non-live keys (X) rejected until handbook DEFER lifts. */
export const useExchangeTradePairStore = create<ExchangeTradePairStore>((set) => ({
  sellKey: 'usd1',
  buyKey: 'agx',
  setSellKey: (sellKey) => {
    if (!isTradeTokenLive(sellKey)) return
    set((state) => ({
      sellKey,
      buyKey: resolveBuyKeyAfterSellChange(sellKey, state.buyKey),
    }))
  },
  setBuyKey: (buyKey) => {
    if (!isTradeTokenLive(buyKey)) return
    set((state) => {
      if (buyKey === state.sellKey) return state
      return { buyKey }
    })
  },
  flipPair: () =>
    set((state) => {
      if (!isTradeTokenLive(state.sellKey) || !isTradeTokenLive(state.buyKey)) {
        return { sellKey: 'usd1', buyKey: 'agx' }
      }
      return {
        sellKey: state.buyKey,
        buyKey: state.sellKey,
      }
    }),
}))
