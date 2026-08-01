import { keepPreviousData } from '@tanstack/react-query'
import {
  formatExchangeRateColon,
  emptySpotRateDash,
} from '~/views/dapp/exchange/exchange-format-rate'
import type { ExchangePairTokens, FlashPairId } from '~/views/dapp/exchange/exchange-pair'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useChainQuery } from '~/hooks/use-chain-query'
import { readFlashPairQuote } from '~/web3/exchange/flash-exchange-read'

/** Fixed 10^decimals spot quote for flash exchange / overview rate labels. */
export function useFlashExchangeSpotRates({
  pairId,
  direction,
  pair,
  quotesEnabled,
}: {
  pairId: FlashPairId
  direction: ExchangeDirection
  pair: ExchangePairTokens
  quotesEnabled: boolean
}) {
  const spotQuoteAmount = 10n ** BigInt(pair.sell.decimals)

  const spotQuoteQuery = useChainQuery({
    queryKey: queryKeys.chain.flashSwapQuote(pairId, direction, spotQuoteAmount.toString()),
    queryFn: () => readFlashPairQuote(pairId, spotQuoteAmount),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled,
    // gagx has no live spot pool — one-shot read only
    refetchInterval: pairId === 'gagx' ? false : EXCHANGE_CONFIG.quoteRefreshIntervalMs,
    placeholderData: keepPreviousData,
  })

  const spotQuotedOut = spotQuoteQuery.data ?? 0n
  const isExchangePriceQuoting =
    pairId === 'gagx'
      ? false
      : (spotQuoteQuery.isPending || spotQuoteQuery.isPlaceholderData) && spotQuotedOut === 0n

  const exchangePriceEmpty = emptySpotRateDash(spotQuotedOut)
  // Figma flash meta + overview both use colon form (`1 : 1`), not `1 TOKEN = …`.
  const rateLabel =
    exchangePriceEmpty !== null
      ? exchangePriceEmpty
      : formatExchangeRateColon({
          amountIn: spotQuoteAmount,
          amountOut: spotQuotedOut,
          decimalsIn: pair.sell.decimals,
          decimalsOut: pair.buy.decimals,
        })

  return {
    exchangePriceLabel: rateLabel,
    overviewRateLabel: rateLabel,
    isExchangePriceQuoting,
  }
}
