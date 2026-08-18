import { useState } from 'react'

import { ZERO_BI } from '~/core/constants'
import { HIGH_EXCHANGE_PRICE_IMPACT_BPS } from '~/core/exchange/calc-price-impact-bps'
import { formatTokenAmount, slippagePercentToBps } from '~/core/exchange/token-amount'
import { autoTradeSlippagePercent, resolveTradeSlippagePercent } from '~/core/exchange/trade-path'
import {
  formatEstimatedGasBnb,
  formatPriceImpactPercent,
  marketTradeInfoMetricLabel,
} from '~/core/exchange/trade-quote-metrics'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { pancakeSwapDeepLink } from '~/shared/config/pancake-exchange-links'
import { formatNumber } from '~/shared/presenters/format'
import { useExchangeTradePairStore } from '~/stores/exchange-trade-pair-store'
import { submitMarketTrade } from '~/views/dapp/exchange/market-trade/submit-market-trade'
import { useMarketTradeBalances } from '~/views/dapp/exchange/market-trade/use-market-trade-balances'
import { useMarketTradeSpotRates } from '~/views/dapp/exchange/market-trade/use-market-trade-spot-rates'
import {
  buyKeysForSell,
  canFlipTradePair,
  formatTradeRouteLabel,
  getTradePairTokens,
  getTradeSwapPath,
  getTradeToken,
  isSellOnlyTradeToken,
  TRADE_TOKEN_KEYS,
  type TradeTokenKey,
} from '~/views/dapp/exchange/shared'
import { useExchangePoolReads } from '~/views/dapp/exchange/use-exchange-pool-reads'
import { useExchangeQuote } from '~/views/dapp/exchange/use-exchange-quote'
import { fetchExchangeQuote } from '~/web3/exchange/exchange-read'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

/**
 * 市价交易会话状态
 *
 * 管理币对选择、滑点、余额 / 授权、报价与提交；余额跟随钱包
 * 账户加载，报价 / 提交 / 金额上限跟随会话就绪。
 *
 * @param sessionReady 会话就绪（SIWE），控制报价、提交与金额上限
 * @param quotesEnabled 是否开启报价轮询
 * @param readsEnabled 是否开启链上读取
 */
export function useMarketTradeSession(
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
  const [slippageMode, setSlippageModeState] = useState<'auto' | 'custom'>('auto')
  const [slippageCustomText, setSlippageCustomTextState] = useState('')
  const autoSlippagePercent = autoTradeSlippagePercent(sellKey)
  const slippage = resolveTradeSlippagePercent(slippageMode, slippageCustomText, sellKey)

  function setSlippageMode(mode: 'auto' | 'custom') {
    if (mode === 'auto') setSlippageCustomTextState('')
    setSlippageModeState(mode)
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
      queryKeys.chain.swapQuote(
        pair.sell.address,
        pair.buy.address,
        amountIn.toString(),
        pathKey,
        address ?? '',
        slippageBps,
      ),
    fetchQuote: (amountIn) =>
      fetchExchangeQuote({
        amountIn,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        path,
        poolContext,
        account: walletReady ? (address as `0x${string}`) : undefined,
        slippageBps,
        allowance,
      }),
    selectQuotedOut: (quote) => quote?.quotedOut ?? ZERO_BI,
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
  const priceImpactBps = amountQuote?.priceImpactBps ?? null
  const metricsReady = sessionReady && core.amountIn > ZERO_BI
  const quoteSettled = amountQuote != null
  const quoteFailed = amountQuote == null && core.amountQuoteQuery.isError

  const routeLabel = formatTradeRouteLabel(sellKey, buyKey)
  const pancakeSwapUrl = pancakeSwapDeepLink(pair.sell.address, pair.buy.address)
  const priceImpactLabel = marketTradeInfoMetricLabel(
    metricsReady,
    !metricsReady || !quoteSettled
      ? quoteFailed
        ? null
        : undefined
      : priceImpactBps == null
        ? null
        : formatPriceImpactPercent(priceImpactBps),
  )
  const gasEstimateLabel = marketTradeInfoMetricLabel(
    metricsReady,
    !metricsReady || !quoteSettled
      ? quoteFailed
        ? null
        : undefined
      : amountQuote.gasCostWei == null
        ? null
        : formatEstimatedGasBnb(amountQuote.gasCostWei),
  )
  const isHighPriceImpact =
    sessionReady &&
    core.amountIn > ZERO_BI &&
    priceImpactBps != null &&
    priceImpactBps >= HIGH_EXCHANGE_PRICE_IMPACT_BPS

  const canFlip = canFlipTradePair(sellKey, buyKey)

  function flipDirection() {
    if (!canFlip) return
    core.clearLock()
    flipPair()
    core.clearAmount()
  }

  function selectSellToken(key: TradeTokenKey) {
    if (key === sellKey) return
    core.clearLock()
    setSellKey(key)
    core.clearAmount()
  }

  function selectBuyToken(key: TradeTokenKey) {
    if (key === buyKey || isSellOnlyTradeToken(key)) return
    core.clearLock()
    setBuyKey(key)
    core.clearAmount()
  }

  async function submit(): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
    return submitMarketTrade({ pair, path, core })
  }

  const sellPickerKeys: TradeTokenKey[] = [...TRADE_TOKEN_KEYS]
  const buyPickerKeys: TradeTokenKey[] = [...buyKeysForSell(sellKey)]

  return {
    sellAmount: core.sellAmount,
    sellAmountDisplay: core.sellAmountDisplay,
    setSellAmount: core.setSellAmount,
    sellKey,
    buyKey,
    selectSellToken,
    selectBuyToken,
    flipDirection,
    canFlip,
    slippage,
    slippageMode,
    setSlippageMode,
    slippageCustomText:
      slippageCustomText === '' ? String(autoSlippagePercent) : slippageCustomText,
    setSlippageCustomText: setSlippageCustomTextState,
    autoSlippagePercent,
    pair,
    path,
    sellPickerKeys,
    buyPickerKeys,
    getToken: getTradeToken,
    sellBalanceLabel: sellBalanceKnown
      ? formatTokenAmount(balanceByKey[sellKey], pair.sell.decimals, 4)
      : '',
    buyBalanceLabel: buyBalanceKnown
      ? formatTokenAmount(balanceByKey[buyKey], pair.buy.decimals, 4)
      : '',
    balanceLabelFor: (key: TradeTokenKey) => {
      const token = getTradeToken(key)
      if (!balanceKnownByKey[key]) return formatNumber(0, { digits: 4 })
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
