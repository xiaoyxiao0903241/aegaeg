import { useGenesisPromoStore } from '~/stores/genesis-promo-store'

/** Selector facade for rail / exchange footer / community / genesis chrome — store SSOT. */
export function useGenesisPromo() {
  const activeSeasonNumber = useGenesisPromoStore((state) => state.activeSeasonNumber)
  const discountLabel = useGenesisPromoStore((state) => state.discountLabel)
  const isLoading = useGenesisPromoStore((state) => state.isLoading)
  const promoSnapshot = useGenesisPromoStore((state) => state.promoSnapshot)
  const seasonOptions = useGenesisPromoStore((state) => state.seasonOptions)

  return {
    activeSeasonNumber,
    discountLabel,
    isLoading,
    promoSnapshot,
    seasonOptions,
  }
}
