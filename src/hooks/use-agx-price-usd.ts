import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { readAgxUsd1SpotPriceWei } from '~/web3/exchange/read-exchange-pool'

const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

/**
 * AGX/USD1 交易对即时价（链上读取，报价级缓存）
 *
 * 用作全站「≈$」参考价，与 PreSale 的 agxPrice 无关。
 *
 * @returns 原始 wei 金额；读取失败时由查询层置为 null
 * @see 手册 §7 Swap
 */
export function useAgxUsd1SpotPriceQuery() {
  return useChainQuery({
    queryKey: queryKeys.chain.agxUsd1SpotPrice,
    scope: 'public',
    freshness: 'quote',
    queryFn: () => readAgxUsd1SpotPriceWei(),
  })
}

/**
 * AGX 市场参考价（换算为 USD1 十进制的数值）
 *
 * 页面「≈$」展示依赖此值；缺价或读取失败时返回 null，展示侧按 `0.00` 兜底。
 *
 * @returns AGX 市场参考价（美元数值）
 * @see 手册 §7 Swap
 */
export function useAgxPriceUsd(): number | null {
  const spotQuery = useAgxUsd1SpotPriceQuery()
  if (spotQuery.isError || spotQuery.data == null) return null
  return formatTokenAmountToNumber(spotQuery.data, USD1_DECIMALS)
}
