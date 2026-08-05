import { useGenesisPromoStore } from '~/stores/genesis-promo-store'

/**
 * Genesis 推广位展示数据（导航栏/社区角标）
 *
 * 只订阅标量字段，避免 seasonOptions/promoSnapshot 每 15 秒刷新产生新引用而触发整块重渲染；
 * 购买季列表由 genesis 链上读取单独订阅。
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

/** @deprecated 改用 {@link useGenesisPromoChrome}；保留别名避免旧调用方订阅过宽。 */
export function useGenesisPromo() {
  return useGenesisPromoChrome()
}
