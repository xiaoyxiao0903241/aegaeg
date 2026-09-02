import { keepPreviousData } from '@tanstack/react-query'

import { TEN_BI, ZERO_BI } from '~/core/constants'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { type ExchangePairTokens, formatExchangeRateApprox } from '~/views/dapp/exchange/shared'
import { quoteV2AmountsOut } from '~/web3/exchange/quote-v2-amounts-out'

type UseMarketTradeSpotRatesArgs = {
  pair: ExchangePairTokens
  path: readonly `0x${string}`[]
  pathKey: string
  quotesEnabled: boolean
  /** 当前卖出金额；为 0 时用单位报价驱动空态汇率骨架。 */
  amountIn: bigint
}

/**
 * 当前币对的正向 / 反向兑换价格
 *
 * 只读 Pancake Router `getAmountsOut` 的返回值，不扣卖税、不走池子储备价。
 * 成交数量仍由另一笔报价计算。
 */
export function useMarketTradeSpotRates({
  pair,
  path,
  pathKey,
  quotesEnabled,
  amountIn,
}: UseMarketTradeSpotRatesArgs) {
  const spotQuoteAmount = TEN_BI ** BigInt(pair.sell.decimals)
  const invertedSpotAmount = TEN_BI ** BigInt(pair.buy.decimals)
  const invertedPath = [...path].reverse() as `0x${string}`[]
  const invertedPathKey = invertedPath.join('-').toLowerCase()

  const spotQuoteQuery = useChainQuery({
    queryKey: queryKeys.chain.swapSpotRate(
      pair.sell.address,
      pair.buy.address,
      spotQuoteAmount.toString(),
      pathKey,
    ),
    queryFn: () =>
      quoteV2AmountsOut({
        router: EXCHANGE_CONFIG.router,
        amountIn: spotQuoteAmount,
        path,
      }),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled,
    refetchInterval: EXCHANGE_CONFIG.quoteRefreshIntervalMs,
    placeholderData: keepPreviousData,
  })

  const invertedSpotQuoteQuery = useChainQuery({
    queryKey: queryKeys.chain.swapSpotRate(
      pair.buy.address,
      pair.sell.address,
      invertedSpotAmount.toString(),
      invertedPathKey,
    ),
    queryFn: () =>
      quoteV2AmountsOut({
        router: EXCHANGE_CONFIG.router,
        amountIn: invertedSpotAmount,
        path: invertedPath,
      }),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled,
    refetchInterval: EXCHANGE_CONFIG.quoteRefreshIntervalMs,
    placeholderData: keepPreviousData,
  })

  // 展示面保留上一次报价，不用 liveQuotedOut 置零（那是提交门禁专用）
  const spotQuotedOut = spotQuoteQuery.data ?? ZERO_BI
  const invertedQuotedOut = invertedSpotQuoteQuery.data ?? ZERO_BI
  const isSpotQuoting =
    amountIn === ZERO_BI &&
    (spotQuoteQuery.isPending || spotQuoteQuery.isPlaceholderData) &&
    spotQuotedOut === ZERO_BI
  const isExchangePriceQuoting =
    (spotQuoteQuery.isPending || spotQuoteQuery.isPlaceholderData) && spotQuotedOut === ZERO_BI
  const isExchangePriceInvertedQuoting =
    (invertedSpotQuoteQuery.isPending || invertedSpotQuoteQuery.isPlaceholderData) &&
    invertedQuotedOut === ZERO_BI

  const exchangePriceLabel = formatExchangeRateApprox({
    amountIn: spotQuoteAmount,
    amountOut: spotQuotedOut,
    decimalsIn: pair.sell.decimals,
    decimalsOut: pair.buy.decimals,
    symbolIn: pair.sell.symbol,
    symbolOut: pair.buy.symbol,
    fractionDigits: 6,
  })

  const exchangePriceLabelInverted = formatExchangeRateApprox({
    amountIn: invertedSpotAmount,
    amountOut: invertedQuotedOut,
    decimalsIn: pair.buy.decimals,
    decimalsOut: pair.sell.decimals,
    symbolIn: pair.buy.symbol,
    symbolOut: pair.sell.symbol,
    fractionDigits: 6,
  })

  return {
    isSpotQuoting,
    isExchangePriceQuoting,
    isExchangePriceInvertedQuoting,
    exchangePriceLabel,
    exchangePriceLabelInverted,
  }
}
