import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { resolveLiveQuotedOut } from '~/core/exchange/resolve-live-quoted-out'
import {
  formatExchangeRateApprox,
  resolveEmptySpotRatePlaceholder,
} from '~/views/dapp/exchange/exchange-format-rate'
import { getExchangePairTokens, type ExchangePairTokens } from '~/views/dapp/exchange/exchange-pair'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { fetchExchangeQuote, type ExchangePoolReadContext } from '~/web3/exchange/exchange-read'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useVisibleInterval } from '~/hooks/queries/use-visible-interval'
import { useChainReadClient } from '~/web3/use-chain-read-client'

type UseMarketTradeSpotRatesArgs = {
  pair: ExchangePairTokens
  quotesEnabled: boolean
  poolContext: ExchangePoolReadContext | undefined
  /** Live sell amountIn — when zero, spot quoting drives the empty-rate skeleton. */
  amountIn: bigint
}

/** Direction-independent USDT↔USD1 spot rates + pair spot for empty sell amount. */
export function useMarketTradeSpotRates({
  pair,
  quotesEnabled,
  poolContext,
  amountIn,
}: UseMarketTradeSpotRatesArgs) {
  const readClient = useChainReadClient()
  const usdtToUsd1Pair = getExchangePairTokens('reverse')
  const usd1ToUsdtPair = getExchangePairTokens('forward')
  const spotQuoteAmount = 10n ** BigInt(pair.sell.decimals)
  const exchangeSpotAmount = 10n ** BigInt(usdtToUsd1Pair.sell.decimals)
  const exchangeSpotAmountInverted = 10n ** BigInt(usd1ToUsdtPair.sell.decimals)

  const spotQuoteQuery = useQuery({
    queryKey: queryKeys.chain.swapQuote(
      pair.sell.address,
      pair.buy.address,
      spotQuoteAmount.toString(),
    ),
    queryFn: () =>
      fetchExchangeQuote({
        amountIn: spotQuoteAmount,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        client: readClient,
        poolContext,
      }),
    enabled: quotesEnabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  const exchangeSpotQuoteQuery = useQuery({
    queryKey: queryKeys.chain.swapQuote(
      usdtToUsd1Pair.sell.address,
      usdtToUsd1Pair.buy.address,
      exchangeSpotAmount.toString(),
    ),
    queryFn: () =>
      fetchExchangeQuote({
        amountIn: exchangeSpotAmount,
        tokenIn: usdtToUsd1Pair.sell.address,
        tokenOut: usdtToUsd1Pair.buy.address,
        client: readClient,
        poolContext,
      }),
    enabled: quotesEnabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleInterval(spotQuoteQuery, EXCHANGE_CONFIG.quoteRefreshIntervalMs, quotesEnabled)
  useVisibleInterval(exchangeSpotQuoteQuery, EXCHANGE_CONFIG.quoteRefreshIntervalMs, quotesEnabled)

  const spotQuotedOut = resolveLiveQuotedOut(
    spotQuoteQuery.isPlaceholderData,
    spotQuoteQuery.data?.quotedOut,
  )
  const exchangeSpotQuotedOut = resolveLiveQuotedOut(
    exchangeSpotQuoteQuery.isPlaceholderData,
    exchangeSpotQuoteQuery.data?.quotedOut,
  )
  const isSpotQuoting =
    amountIn === 0n &&
    (spotQuoteQuery.isPending || spotQuoteQuery.isPlaceholderData) &&
    spotQuotedOut === 0n
  const isExchangePriceQuoting =
    (exchangeSpotQuoteQuery.isPending || exchangeSpotQuoteQuery.isPlaceholderData) &&
    exchangeSpotQuotedOut === 0n
  /** 反方向汇率由正向 quote 反推，不再单独轮询。 */
  const isExchangePriceInvertedQuoting = isExchangePriceQuoting

  const exchangePriceEmpty = resolveEmptySpotRatePlaceholder(
    exchangeSpotQuotedOut,
    isExchangePriceQuoting,
  )
  const exchangePriceLabel =
    exchangePriceEmpty !== null
      ? exchangePriceEmpty
      : formatExchangeRateApprox({
          amountIn: exchangeSpotAmount,
          amountOut: exchangeSpotQuotedOut,
          decimalsIn: usdtToUsd1Pair.sell.decimals,
          decimalsOut: usdtToUsd1Pair.buy.decimals,
          symbolIn: usdtToUsd1Pair.sell.symbol,
          symbolOut: usdtToUsd1Pair.buy.symbol,
          fractionDigits: 6,
        })

  const invertedEmpty = resolveEmptySpotRatePlaceholder(
    exchangeSpotQuotedOut,
    isExchangePriceInvertedQuoting,
  )
  const invertedAmountOut =
    exchangeSpotQuotedOut === 0n
      ? 0n
      : (exchangeSpotAmountInverted * exchangeSpotAmount) / exchangeSpotQuotedOut
  const exchangePriceLabelInverted =
    invertedEmpty !== null
      ? invertedEmpty
      : invertedAmountOut === 0n
        ? '—'
        : formatExchangeRateApprox({
            amountIn: exchangeSpotAmountInverted,
            amountOut: invertedAmountOut,
            decimalsIn: usd1ToUsdtPair.sell.decimals,
            decimalsOut: usd1ToUsdtPair.buy.decimals,
            symbolIn: usd1ToUsdtPair.sell.symbol,
            symbolOut: usd1ToUsdtPair.buy.symbol,
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
