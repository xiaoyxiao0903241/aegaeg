import { create } from 'zustand'

import {
  buyKeyAfterSellChange,
  isTradeTokenLive,
  type TradeTokenKey,
} from '~/core/exchange/trade-path'

interface ExchangeTradePairStore {
  sellKey: TradeTokenKey
  buyKey: TradeTokenKey
  setSellKey: (key: TradeTokenKey) => void
  setBuyKey: (key: TradeTokenKey) => void
  flipPair: () => void
}

/** 默认交易对 Sell USD1 / Buy AGX（设计稿默认）；尚未启用的代币键会被拒绝。 */
export const useExchangeTradePairStore = create<ExchangeTradePairStore>((set) => ({
  sellKey: 'usd1',
  buyKey: 'agx',
  setSellKey: (sellKey) => {
    if (!isTradeTokenLive(sellKey)) return
    set((state) => ({
      sellKey,
      buyKey: buyKeyAfterSellChange(sellKey, state.buyKey),
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
