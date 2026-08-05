import { keepPreviousData } from '@tanstack/react-query'

import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { type ExchangePairTokens, formatExchangeRateApprox } from '~/views/dapp/exchange/shared'
import { type ExchangePoolReadContext, fetchExchangeQuote } from '~/web3/exchange/exchange-read'

type UseMarketTradeSpotRatesArgs = {
  pair: ExchangePairTokens
  path: readonly `0x${string}`[]
  pathKey: string
  quotesEnabled: boolean
  poolContext: ExchangePoolReadContext | undefined
  /** 当前卖出金额；为 0 时用行情报价驱动空态汇率骨架。 */
  amountIn: bigint
}

/** 当前币对的正向 / 反向行情报价，供信息行与概览使用。 */
export function useMarketTradeSpotRates({
  pair,
  path,
  pathKey,
  quotesEnabled,
  poolContext,
  amountIn,
}: UseMarketTradeSpotRatesArgs) {
  const spotQuoteAmount = 10n ** BigInt(pair.sell.decimals)
  const invertedSpotAmount = 10n ** BigInt(pair.buy.decimals)
  const invertedPath = [...path].reverse() as `0x${string}`[]
  const invertedPathKey = invertedPath.join('-').toLowerCase()

  const spotQuoteQuery = useChainQuery({
    queryKey: queryKeys.chain.swapQuote(
      pair.sell.address,
      pair.buy.address,
      spotQuoteAmount.toString(),
      pathKey,
    ),
    queryFn: () =>
      fetchExchangeQuote({
        amountIn: spotQuoteAmount,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        path,
        poolContext,
      }),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled,
    refetchInterval: EXCHANGE_CONFIG.quoteRefreshIntervalMs,
    placeholderData: keepPreviousData,
  })

  const invertedSpotQuoteQuery = useChainQuery({
    queryKey: queryKeys.chain.swapQuote(
      pair.buy.address,
      pair.sell.address,
      invertedSpotAmount.toString(),
      invertedPathKey,
    ),
    queryFn: () =>
      fetchExchangeQuote({
        amountIn: invertedSpotAmount,
        tokenIn: pair.buy.address,
        tokenOut: pair.sell.address,
        path: invertedPath,
        poolContext,
      }),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled,
    refetchInterval: EXCHANGE_CONFIG.quoteRefreshIntervalMs,
    placeholderData: keepPreviousData,
  })

  // 展示面保留上一次报价，不用 liveQuotedOut 置零（那是提交门禁专用）
  const spotQuotedOut = spotQuoteQuery.data?.quotedOut ?? 0n
  const invertedQuotedOut = invertedSpotQuoteQuery.data?.quotedOut ?? 0n
  const isSpotQuoting =
    amountIn === 0n &&
    (spotQuoteQuery.isPending || spotQuoteQuery.isPlaceholderData) &&
    spotQuotedOut === 0n
  const isExchangePriceQuoting =
    (spotQuoteQuery.isPending || spotQuoteQuery.isPlaceholderData) && spotQuotedOut === 0n
  const isExchangePriceInvertedQuoting =
    (invertedSpotQuoteQuery.isPending || invertedSpotQuoteQuery.isPlaceholderData) &&
    invertedQuotedOut === 0n

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
