import { create } from 'zustand'

import { FLASH_PAIR_DEFAULT, type FlashPairId, isFlashPairId } from '~/core/exchange/flash-pair'

interface ExchangeFlashPairStore {
  pairId: FlashPairId
  setPairId: (pairId: FlashPairId) => void
}

/** 闪兑币对：Hub「获取 USD1」等入口可预选；默认 gAGX↔AGX。 */
export const useExchangeFlashPairStore = create<ExchangeFlashPairStore>((set) => ({
  pairId: FLASH_PAIR_DEFAULT,
  setPairId: (pairId) => {
    if (!isFlashPairId(pairId)) return
    set({ pairId })
  },
}))
