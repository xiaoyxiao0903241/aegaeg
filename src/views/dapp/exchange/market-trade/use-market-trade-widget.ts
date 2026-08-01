import { useActiveAccount } from '~/web3/thirdweb-react'
import { useState } from 'react'
import { HIGH_EXCHANGE_PRICE_IMPACT_BPS } from '~/core/exchange/calc-price-impact-bps'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { pancakeSwapDeepLink } from '~/shared/config/pancake-exchange-links'
import {
  clampSlippagePercent,
  formatTokenAmount,
  slippagePercentToBps,
} from '~/core/exchange/token-amount'
import {
  formatTradeRouteLabel,
  getTradePairTokens,
  getTradeSwapPath,
  getTradeToken,
  isTradeTokenLive,
  tradeBuyOptions,
  type TradeTokenKey,
} from '~/views/dapp/exchange/exchange-pair'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { fetchExchangeQuote } from '~/web3/exchange/exchange-read'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useExchangeTradePairStore } from '~/stores/exchange-trade-pair-store'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useExchangeQuote } from '~/views/dapp/exchange/use-exchange-quote'
import { useExchangePoolReads } from '~/views/dapp/exchange/use-exchange-pool-reads'
import { useMarketTradeBalances } from '~/views/dapp/exchange/market-trade/use-market-trade-balances'
import { useMarketTradeSpotRates } from '~/views/dapp/exchange/market-trade/use-market-trade-spot-rates'
import { submitMarketTrade } from '~/views/dapp/exchange/market-trade/submit-market-trade'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

/**
 * @param sessionReady — SIWE session ready; gates quotes, swap submit, and amount capping.
 * Balances load on wallet account presence (`walletReady`), independent of SIWE.
 */
export function useMarketTradeWidget(
  sessionReady: boolean,
  quotesEnabled = true,
  readsEnabled = quotesEnabled,
) {
  const account = useActiveAccount()
  const { writeReady } = useWriteReadiness()
  const sellKey = useExchangeTradePairStore((state) => state.sellKey)
  const buyKey = useExchangeTradePairStore((state) => state.buyKey)
  const setSellKey = useExchangeTradePairStore((state) => state.setSellKey)
  const setBuyKey = useExchangeTradePairStore((state) => state.setBuyKey)
  const flipPair = useExchangeTradePairStore((state) => state.flipPair)
  const [slippage, setSlippageRaw] = useState(() =>
    clampSlippagePercent(EXCHANGE_CONFIG.defaultSlippageBps / 100),
  )
  function setSlippage(value: number) {
    setSlippageRaw(clampSlippagePercent(value))
  }
  const { poolContext } = useExchangePoolReads(readsEnabled, quotesEnabled)

  const pair = getTradePairTokens(sellKey, buyKey)
  const path = getTradeSwapPath(sellKey, buyKey)
  const pathKey = path.join('-').toLowerCase()
  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const slippageBps = slippagePercentToBps(slippage)

  const {
    sellBalance,
    buyBalance,
    sellBalanceKnown,
    buyBalanceKnown,
    balanceByKey,
    balanceKnownByKey,
    allowance,
    balancesLoaded,
    isBalancesLoading,
  } = useMarketTradeBalances({
    address,
    sellKey,
    buyKey,
    readsEnabled,
    walletReady,
  })

  const core = useExchangeQuote({
    sessionReady,
    quotesEnabled,
    decimals: pair.sell.decimals,
    buyDecimals: pair.buy.decimals,
    sellBalance,
    allowance,
    balancesLoaded,
    walletReady,
    writeReady,
    isBalancesLoading,
    slippageBps,
    quoteRefreshIntervalMs: EXCHANGE_CONFIG.quoteRefreshIntervalMs,
    getQuoteQueryKey: (amountIn) =>
      queryKeys.chain.swapQuote(pair.sell.address, pair.buy.address, amountIn.toString(), pathKey),
    fetchQuote: (amountIn) =>
      fetchExchangeQuote({
        amountIn,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        path,
        poolContext,
      }),
    selectQuotedOut: (quote) => quote?.quotedOut ?? 0n,
  })

  const spot = useMarketTradeSpotRates({
    pair,
    path,
    pathKey,
    quotesEnabled,
    poolContext,
    amountIn: core.amountIn,
  })

  const amountQuote = core.amountQuoteQuery.data
  const priceImpactBps = amountQuote?.priceImpactBps ?? 0
  const gasEstimate = amountQuote?.gasEstimate ?? 0n

  const routeLabel = formatTradeRouteLabel(sellKey, buyKey)
  const pancakeSwapUrl = pancakeSwapDeepLink(pair.sell.address, pair.buy.address)
  const priceImpactLabel =
    !sessionReady || core.amountIn === 0n ? '' : `${(priceImpactBps / 100).toFixed(2)}%`
  const gasEstimateLabel =
    gasEstimate === 0n
      ? '0'
      : formatGroupedNumber(gasEstimate, { digits: 0, trimZeros: true, prefix: '~' })
  const isHighPriceImpact =
    sessionReady && core.amountIn > 0n && priceImpactBps >= HIGH_EXCHANGE_PRICE_IMPACT_BPS

  function flipDirection() {
    core.clearLock()
    flipPair()
    core.clearAmount()
  }

  function selectSellToken(key: TradeTokenKey) {
    if (!isTradeTokenLive(key) || key === sellKey) return
    core.clearLock()
    setSellKey(key)
    core.clearAmount()
  }

  function selectBuyToken(key: TradeTokenKey) {
    if (!isTradeTokenLive(key) || key === buyKey || key === sellKey) return
    core.clearLock()
    setBuyKey(key)
    core.clearAmount()
  }

  async function submit(): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
    return submitMarketTrade({ pair, path, core })
  }

  const sellPickerKeys: TradeTokenKey[] = ['usd1', 'agx', 'x']
  const buyPickerKeys = tradeBuyOptions(sellKey)

  return {
    sellAmount: core.sellAmount,
    sellAmountDisplay: core.sellAmountDisplay,
    setSellAmount: core.setSellAmount,
    sellKey,
    buyKey,
    selectSellToken,
    selectBuyToken,
    flipDirection,
    slippage,
    setSlippage,
    pair,
    path,
    sellPickerKeys,
    buyPickerKeys,
    getToken: getTradeToken,
    isTokenLive: isTradeTokenLive,
    sellBalanceLabel: sellBalanceKnown ? formatTokenAmount(sellBalance, pair.sell.decimals, 4) : '',
    buyBalanceLabel: buyBalanceKnown ? formatTokenAmount(buyBalance, pair.buy.decimals, 4) : '',
    balanceLabelFor: (key: TradeTokenKey) => {
      if (!balanceKnownByKey[key]) return ''
      const token = getTradeToken(key)
      return formatTokenAmount(balanceByKey[key], token.decimals, 4)
    },
    buyAmount: core.buyAmount,
    exchangePriceLabel: spot.exchangePriceLabel,
    exchangePriceLabelInverted: spot.exchangePriceLabelInverted,
    routeLabel,
    pancakeSwapUrl,
    priceImpactLabel,
    gasEstimateLabel,
    isHighPriceImpact,
    walletReady,
    canSubmit: core.canSubmit,
    needsApproval: core.needsApproval,
    isQuoting: core.isQuoting,
    isSpotQuoting: spot.isSpotQuoting,
    isExchangePriceQuoting: spot.isExchangePriceQuoting,
    isExchangePriceInvertedQuoting: spot.isExchangePriceInvertedQuoting,
    isBalancesLoading,
    isSubmitting: core.isSubmitting,
    error: core.error,
    validationError: core.validationError,
    quoteErrorUpdatedAt: core.quoteErrorUpdatedAt,
    fillPercent: core.fillPercent,
    submit,
    amountOutMin: core.amountOutMin,
  }
}
