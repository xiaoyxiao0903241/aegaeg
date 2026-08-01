import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { readAgxUsd1SpotPriceWei } from '~/web3/exchange/read-exchange-pool'

const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

/** AGX/USD1 Pair 即时价（USD1 单位）；不可用 → null。非 PreSale.agxPrice。 */
export function useAgxUsd1SpotPriceQuery() {
  return useChainQuery({
    queryKey: queryKeys.chain.agxUsd1SpotPrice,
    scope: 'public',
    freshness: 'quote',
    queryFn: () => readAgxUsd1SpotPriceWei(),
  })
}

/** AGX 市场参考价（USD1 human）；null = 缺价，≈$ 走 `0.00`。 */
export function useAgxPriceUsd(): number | null {
  const spotQuery = useAgxUsd1SpotPriceQuery()
  if (spotQuery.isError || spotQuery.data == null) return null
  return formatTokenAmountToNumber(spotQuery.data, USD1_DECIMALS)
}
