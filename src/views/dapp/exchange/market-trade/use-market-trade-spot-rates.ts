import { keepPreviousData } from '@tanstack/react-query'
import { liveQuotedOut } from '~/core/exchange/live-quoted-out'
import {
  formatExchangeRateApprox,
  emptySpotRateDash,
} from '~/views/dapp/exchange/exchange-format-rate'
import type { ExchangePairTokens } from '~/views/dapp/exchange/exchange-pair'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { fetchExchangeQuote, type ExchangePoolReadContext } from '~/web3/exchange/exchange-read'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useVisibleInterval } from '~/hooks/queries/use-visible-interval'
import { useChainQuery } from '~/hooks/use-chain-query'

type UseMarketTradeSpotRatesArgs = {
  pair: ExchangePairTokens
  path: readonly `0x${string}`[]
  pathKey: string
  quotesEnabled: boolean
  poolContext: ExchangePoolReadContext | undefined
  /** Live sell amountIn — when zero, spot quoting drives the empty-rate skeleton. */
  amountIn: bigint
}

/** Current sell→buy spot (+ inverted buy→sell) for meta / overview. */
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
    placeholderData: keepPreviousData,
  })

  useVisibleInterval(spotQuoteQuery, EXCHANGE_CONFIG.quoteRefreshIntervalMs, quotesEnabled)
  useVisibleInterval(invertedSpotQuoteQuery, EXCHANGE_CONFIG.quoteRefreshIntervalMs, quotesEnabled)

  const spotQuotedOut = liveQuotedOut(
    spotQuoteQuery.isPlaceholderData,
    spotQuoteQuery.data?.quotedOut,
  )
  const invertedQuotedOut = liveQuotedOut(
    invertedSpotQuoteQuery.isPlaceholderData,
    invertedSpotQuoteQuery.data?.quotedOut,
  )
  const isSpotQuoting =
    amountIn === 0n &&
    (spotQuoteQuery.isPending || spotQuoteQuery.isPlaceholderData) &&
    spotQuotedOut === 0n
  const isExchangePriceQuoting =
    (spotQuoteQuery.isPending || spotQuoteQuery.isPlaceholderData) && spotQuotedOut === 0n
  const isExchangePriceInvertedQuoting =
    (invertedSpotQuoteQuery.isPending || invertedSpotQuoteQuery.isPlaceholderData) &&
    invertedQuotedOut === 0n

  const exchangePriceEmpty = emptySpotRateDash(spotQuotedOut, isExchangePriceQuoting)
  const exchangePriceLabel =
    exchangePriceEmpty !== null
      ? exchangePriceEmpty
      : formatExchangeRateApprox({
          amountIn: spotQuoteAmount,
          amountOut: spotQuotedOut,
          decimalsIn: pair.sell.decimals,
          decimalsOut: pair.buy.decimals,
          symbolIn: pair.sell.symbol,
          symbolOut: pair.buy.symbol,
          fractionDigits: 6,
        })

  const invertedEmpty = emptySpotRateDash(invertedQuotedOut, isExchangePriceInvertedQuoting)
  const exchangePriceLabelInverted =
    invertedEmpty !== null
      ? invertedEmpty
      : formatExchangeRateApprox({
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
