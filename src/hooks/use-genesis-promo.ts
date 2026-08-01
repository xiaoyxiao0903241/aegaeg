import { useGenesisPromoStore } from '~/stores/genesis-promo-store'

/**
 * Rail / community chrome：只订标量，避免 seasonOptions/promoSnapshot 新引用每 15s 打醒。
 * 购买季列表由 genesis chain-reads 另订 seasonOptions。
 */
export function useGenesisPromoChrome() {
  const activeSeasonNumber = useGenesisPromoStore((state) => state.activeSeasonNumber)
  const discountLabel = useGenesisPromoStore((state) => state.discountLabel)
  const isLoading = useGenesisPromoStore((state) => state.isLoading)

  return {
    activeSeasonNumber,
    discountLabel,
    isLoading,
  }
}

/** @deprecated 用 {@link useGenesisPromoChrome}；保留别名避免旧 import 过宽订阅。 */
export function useGenesisPromo() {
  return useGenesisPromoChrome()
}
