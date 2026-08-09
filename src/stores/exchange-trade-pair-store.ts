import { create } from 'zustand'

import { pairAfterTokenSelect, type TradeTokenKey } from '~/core/exchange/trade-path'

interface ExchangeTradePairStore {
  sellKey: TradeTokenKey
  buyKey: TradeTokenKey
  setSellKey: (key: TradeTokenKey) => void
  setBuyKey: (key: TradeTokenKey) => void
  flipPair: () => void
}

/** 默认交易对 Sell USD1 / Buy AGX；选币经 `pairAfterTokenSelect` 纠成相邻对。 */
export const useExchangeTradePairStore = create<ExchangeTradePairStore>((set) => ({
  sellKey: 'usd1',
  buyKey: 'agx',
  setSellKey: (key) => {
    set((state) => pairAfterTokenSelect('sell', key, state.sellKey, state.buyKey))
  },
  setBuyKey: (key) => {
    set((state) => pairAfterTokenSelect('buy', key, state.sellKey, state.buyKey))
  },
  flipPair: () =>
    set((state) => ({
      sellKey: state.buyKey,
      buyKey: state.sellKey,
    })),
}))
