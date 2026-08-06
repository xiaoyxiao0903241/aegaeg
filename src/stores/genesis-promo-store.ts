import { create } from 'zustand'

import { genesisPromoChromeEqual } from '~/core/presale/genesis-promo-equality'
import type { GenesisPromoSnapshot, SeasonOption } from '~/core/presale/genesis-promo-types'

export type GenesisPromoState = {
  /** 展示时钟（GenesisPromoSync 每 15 秒推进一次）；与 setPromo 分离更新，避免被推广位等值判断短路。 */
  nowSeconds: number
  activeSeasonNumber: number
  discountLabel: string
  isLoading: boolean
  promoSnapshot: GenesisPromoSnapshot | null
  seasonOptions: SeasonOption[]
  setNowSeconds: (nowSeconds: number) => void
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
 */
export const useGenesisPromoStore = create<GenesisPromoState>((set) => ({
  nowSeconds: Math.floor(Date.now() / 1000),
  activeSeasonNumber: 1,
  discountLabel: '—',
  isLoading: true,
  promoSnapshot: null,
  seasonOptions: [],
  setNowSeconds: (nowSeconds) =>
    set((state) => (state.nowSeconds === nowSeconds ? state : { nowSeconds })),
  setPromo: (next) =>
    set((state) => (genesisPromoChromeEqual(state, next) ? state : { ...state, ...next })),
}))
