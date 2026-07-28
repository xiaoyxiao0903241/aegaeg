import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useState } from 'react'
import { HIGH_EXCHANGE_PRICE_IMPACT_BPS } from '~/core/exchange/calc-price-impact-bps'
import { formatGasEstimate } from '~/views/dapp/exchange/market-trade/exchange-format-gas-estimate'
import { resolvePancakeSwapDeepLink } from '~/shared/config/pancake-exchange-links'
import {
  clampSlippagePercent,
  formatTokenAmount,
  slippagePercentToBps,
} from '~/core/exchange/token-amount'
import { getExchangePairTokens } from '~/views/dapp/exchange/exchange-pair'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { fetchExchangeQuote } from '~/web3/exchange/exchange-read'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useExchangeDirectionStore } from '~/stores/exchange-direction-store'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useChainReadClient } from '~/web3/use-chain-read-client'
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
export function useMarketTradeWidget(sessionReady: boolean, quotesEnabled = true) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { writeReady } = useWriteReadiness()
  const direction = useExchangeDirectionStore((state) => state.direction)
  const flipDirectionInStore = useExchangeDirectionStore((state) => state.flipDirection)
  const [slippage, setSlippageRaw] = useState(() =>
    clampSlippagePercent(EXCHANGE_CONFIG.defaultSlippageBps / 100),
  )
  function setSlippage(value: number) {
    setSlippageRaw(clampSlippagePercent(value))
  }
  const readClient = useChainReadClient()
  const { poolContext } = useExchangePoolReads(quotesEnabled)

  const pair = getExchangePairTokens(direction)
  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const slippageBps = slippagePercentToBps(slippage)

  const { balancesQuery, sellBalance, buyBalance, allowance, balancesLoaded, isBalancesLoading } =
    useMarketTradeBalances({
      address,
      sellAddress: pair.sell.address,
      buyAddress: pair.buy.address,
      quotesEnabled,
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
      queryKeys.chain.swapQuote(pair.sell.address, pair.buy.address, amountIn.toString()),
    fetchQuote: (amountIn) =>
      fetchExchangeQuote({
        amountIn,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        client: readClient,
        poolContext,
      }),
    selectQuotedOut: (quote) => quote?.quotedOut ?? 0n,
  })

  const spot = useMarketTradeSpotRates({
    pair,
    quotesEnabled,
    poolContext,
    amountIn: core.amountIn,
  })

  const amountQuote = core.amountQuoteQuery.isPlaceholderData
    ? undefined
    : core.amountQuoteQuery.data
  const priceImpactBps = amountQuote?.priceImpactBps ?? 0
  const gasEstimate = amountQuote?.gasEstimate ?? 0n

  const routeLabel = `${pair.sell.symbol} → ${pair.buy.symbol}`
  const pancakeSwapUrl = resolvePancakeSwapDeepLink(pair.sell.symbol, pair.buy.symbol)
  const priceImpactLabel =
    !sessionReady || core.amountIn === 0n || core.isQuoting
      ? ''
      : `${(priceImpactBps / 100).toFixed(2)}%`
  const gasEstimateLabel = formatGasEstimate(gasEstimate)
  const isHighPriceImpact =
    sessionReady && core.amountIn > 0n && priceImpactBps >= HIGH_EXCHANGE_PRICE_IMPACT_BPS

  function flipDirection() {
    core.setBlockResubmit(false)
    flipDirectionInStore()
    core.clearAmount()
  }

  async function submit(): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
    return submitMarketTrade({ account, wallet, pair, core, balancesQuery })
  }

  return {
    sellAmount: core.sellAmount,
    sellAmountDisplay: core.sellAmountDisplay,
    setSellAmount: core.setSellAmount,
    direction,
    flipDirection,
    slippage,
    setSlippage,
    pair,
    sellBalanceLabel: formatTokenAmount(sellBalance, pair.sell.decimals, 4),
    buyBalanceLabel: formatTokenAmount(buyBalance, pair.buy.decimals, 4),
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
    needsMaxApproval: core.needsMaxApproval,
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
