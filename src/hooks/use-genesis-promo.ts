import { useGenesisPromoStore } from '~/stores/genesis-promo-store'

/** Selector facade for rail / swap footer / community — backed by genesis-promo-store. */
export function useGenesisPromo() {
  const activeSeasonNumber = useGenesisPromoStore((state) => state.activeSeasonNumber)
  const discountLabel = useGenesisPromoStore((state) => state.discountLabel)
  const isLoading = useGenesisPromoStore((state) => state.isLoading)
  const promoSnapshot = useGenesisPromoStore((state) => state.promoSnapshot)

  return {
    activeSeasonNumber,
    discountLabel,
    isLoading,
    promoSnapshot,
  }
}
