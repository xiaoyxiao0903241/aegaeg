import { create } from 'zustand'

import { genesisPromoChromeEqual } from '~/core/presale/genesis-promo-equality'
import type { GenesisPromoSnapshot, SeasonOption } from '~/core/presale/genesis-promo-types'

export type GenesisPromoState = {
  activeSeasonNumber: number
  discountLabel: string
  isLoading: boolean
  promoSnapshot: GenesisPromoSnapshot | null
  seasonOptions: SeasonOption[]
  setPromo: (next: {
    activeSeasonNumber: number
    discountLabel: string
    isLoading: boolean
    promoSnapshot: GenesisPromoSnapshot | null
    seasonOptions: SeasonOption[]
  }) => void
}

/**
 * 跨 Tab 的 Genesis 推广位数据（导航栏 / swap 页脚 / 社区 / 购买季选择）。
 * 不持久化；链上读取仍以 React Query 缓存为唯一来源。GenesisPromoSync 是唯一写入方。
 * 展示用时钟见全局 `useWallClockSec`，本 store 不再自维护秒表。
 */
export const useGenesisPromoStore = create<GenesisPromoState>((set) => ({
  activeSeasonNumber: 1,
  discountLabel: '—',
  isLoading: true,
  promoSnapshot: null,
  seasonOptions: [],
  setPromo: (next) =>
    set((state) => (genesisPromoChromeEqual(state, next) ? state : { ...state, ...next })),
}))
