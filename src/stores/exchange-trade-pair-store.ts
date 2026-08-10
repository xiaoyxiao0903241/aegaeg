import { create } from 'zustand'

import { pairAfterFlip, pairAfterTokenSelect, type TradeTokenKey } from '~/core/exchange/trade-path'

interface ExchangeTradePairStore {
  sellKey: TradeTokenKey
  buyKey: TradeTokenKey
  setSellKey: (key: TradeTokenKey) => void
  setBuyKey: (key: TradeTokenKey) => void
  flipPair: () => void
}

/**
 * 默认交易对 Sell USD1 / Buy AGX。
 *
 * 选币经 `pairAfterTokenSelect` 纠成合法有向对；翻转经 `pairAfterFlip`
 *（X 仅可卖，禁止翻成买 X）。
 *
 * @see 手册 xtoken `BuyNotAllowed`
 */
export const useExchangeTradePairStore = create<ExchangeTradePairStore>((set) => ({
  sellKey: 'usd1',
  buyKey: 'agx',
  setSellKey: (key) => {
    set((state) => pairAfterTokenSelect('sell', key, state.sellKey, state.buyKey))
  },
  setBuyKey: (key) => {
    set((state) => pairAfterTokenSelect('buy', key, state.sellKey, state.buyKey))
  },
  flipPair: () => set((state) => pairAfterFlip(state.sellKey, state.buyKey)),
}))
