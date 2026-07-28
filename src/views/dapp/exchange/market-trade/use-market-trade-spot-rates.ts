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

/** Direction-independent USD1↔AGX spot rates + pair spot for empty sell amount. */
export function useMarketTradeSpotRates({
  pair,
  quotesEnabled,
  poolContext,
  amountIn,
}: UseMarketTradeSpotRatesArgs) {
  const readClient = useChainReadClient()
  const agxToUsd1Pair = getExchangePairTokens('reverse')
  const usd1ToAgxPair = getExchangePairTokens('forward')
  const spotQuoteAmount = 10n ** BigInt(pair.sell.decimals)
  const exchangeSpotAmount = 10n ** BigInt(usd1ToAgxPair.sell.decimals)
  const exchangeSpotAmountInverted = 10n ** BigInt(agxToUsd1Pair.sell.decimals)

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
      usd1ToAgxPair.sell.address,
      usd1ToAgxPair.buy.address,
      exchangeSpotAmount.toString(),
    ),
    queryFn: () =>
      fetchExchangeQuote({
        amountIn: exchangeSpotAmount,
        tokenIn: usd1ToAgxPair.sell.address,
        tokenOut: usd1ToAgxPair.buy.address,
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
  /** Reverse rate derived from forward quote — no second poll. */
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
          decimalsIn: usd1ToAgxPair.sell.decimals,
          decimalsOut: usd1ToAgxPair.buy.decimals,
          symbolIn: usd1ToAgxPair.sell.symbol,
          symbolOut: usd1ToAgxPair.buy.symbol,
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
            decimalsIn: agxToUsd1Pair.sell.decimals,
            decimalsOut: agxToUsd1Pair.buy.decimals,
            symbolIn: agxToUsd1Pair.sell.symbol,
            symbolOut: agxToUsd1Pair.buy.symbol,
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
