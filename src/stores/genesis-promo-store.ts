import { create } from 'zustand'
import type { GenesisPromoSnapshot } from '~/views/dapp/genesis/genesis-promo'

export type GenesisPromoState = {
  /** Shell clock SSOT (15s tick from GenesisPromoSync). */
  nowSeconds: number
  activeSeasonNumber: number
  discountLabel: string
  isLoading: boolean
  promoSnapshot: GenesisPromoSnapshot | null
  setNowSeconds: (nowSeconds: number) => void
  setPromo: (next: {
    activeSeasonNumber: number
    discountLabel: string
    isLoading: boolean
    promoSnapshot: GenesisPromoSnapshot | null
  }) => void
}

/**
 * Cross-tab Genesis chrome (rail / swap footer / community season label).
 * Not persisted — React Query remains the chain-read SSOT; this store only
 * holds derived UI fields so consumers can selector-subscribe without mounting
 * the full purchase widget.
 */
export const useGenesisPromoStore = create<GenesisPromoState>((set) => ({
  nowSeconds: Math.floor(Date.now() / 1000),
  activeSeasonNumber: 1,
  discountLabel: '—',
  isLoading: true,
  promoSnapshot: null,
  setNowSeconds: (nowSeconds) => set({ nowSeconds }),
  setPromo: (next) => set(next),
}))
