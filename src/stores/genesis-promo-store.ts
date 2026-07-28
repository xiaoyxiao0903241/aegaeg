import { create } from 'zustand'
import type { GenesisPromoSnapshot, SeasonOption } from '~/core/presale/genesis-promo-types'

export type GenesisPromoState = {
  /** Shell 时钟 SSOT（GenesisPromoSync 15s tick）。 */
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
 * 跨 Tab Genesis chrome（rail / swap footer / community / 购买季选择）。
 * 不持久化；链上读仍以 React Query 为 SSOT。GenesisPromoSync 是唯一写入方。
 */
export const useGenesisPromoStore = create<GenesisPromoState>((set) => ({
  nowSeconds: Math.floor(Date.now() / 1000),
  activeSeasonNumber: 1,
  discountLabel: '—',
  isLoading: true,
  promoSnapshot: null,
  seasonOptions: [],
  setNowSeconds: (nowSeconds) => set({ nowSeconds }),
  setPromo: (next) => set(next),
}))
