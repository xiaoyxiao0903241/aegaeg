import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useState } from 'react'
import { HIGH_SWAP_PRICE_IMPACT_BPS } from '~/core/swap/calc-price-impact-bps'
import { formatGasEstimate } from '~/views/dapp/swap/format-gas-estimate'
import { resolvePancakeSwapDeepLink } from '~/shared/config/pancake-swap-links'
import {
  clampSlippagePercent,
  formatTokenAmount,
  slippagePercentToBps,
} from '~/core/swap/token-amount'
import { getSwapPairTokens } from '~/views/dapp/swap/swap-pair'
import { SWAP_CONFIG } from '~/shared/config/swap'
import { fetchSwapQuote } from '~/views/dapp/web3/swap-read'
import { approveTokenIfNeeded, swapTokens } from '~/views/dapp/web3/swap-write'
import { queryKeys } from '~/shared/api/query/query-keys'
import { invalidateAfterSwap } from '~/shared/api/query/invalidate'
import { useSwapDirectionStore } from '~/stores/swap-direction-store'
import { WALLET_GATE_ERROR } from '~/views/dapp/web3/resolve-contract-error-message'
import { hasWalletAccount } from '~/views/dapp/web3/wallet-connection-state'
import { useChainReadClient } from '~/views/dapp/web3/use-chain-read-client'
import { useSwapQuote } from '~/views/dapp/swap/use-swap-quote'
import { useSwapPoolReads } from '~/views/dapp/swap/use-swap-pool-reads'
import { useSwapBalances } from '~/views/dapp/swap/use-swap-balances'
import { useSwapSpotRates } from '~/views/dapp/swap/use-swap-spot-rates'

/**
 * @param sessionReady — SIWE session ready; gates quotes, swap submit, and amount capping.
 * Balances load on wallet account presence (`walletReady`), independent of SIWE.
 */
export function useSwapWidget(sessionReady: boolean, quotesEnabled = true) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const direction = useSwapDirectionStore((state) => state.direction)
  const flipDirectionInStore = useSwapDirectionStore((state) => state.flipDirection)
  const [slippage, setSlippageRaw] = useState(() =>
    clampSlippagePercent(SWAP_CONFIG.defaultSlippageBps / 100),
  )
  function setSlippage(value: number) {
    setSlippageRaw(clampSlippagePercent(value))
  }
  const readClient = useChainReadClient()
  const { poolContext, poolFee } = useSwapPoolReads(quotesEnabled)

  const pair = getSwapPairTokens(direction)
  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const slippageBps = slippagePercentToBps(slippage)

  const {
    balancesQuery,
    sellBalance,
    buyBalance,
    allowance,
    balancesLoaded,
    isBalancesLoading,
  } = useSwapBalances({
    address,
    sellAddress: pair.sell.address,
    buyAddress: pair.buy.address,
    quotesEnabled,
    walletReady,
  })

  const core = useSwapQuote({
    sessionReady,
    quotesEnabled,
    decimals: pair.sell.decimals,
    buyDecimals: pair.buy.decimals,
    sellBalance,
    allowance,
    balancesLoaded,
    walletReady,
    isBalancesLoading,
    slippageBps,
    quoteRefreshIntervalMs: SWAP_CONFIG.quoteRefreshIntervalMs,
    getQuoteQueryKey: (amountIn) =>
      queryKeys.chain.swapQuote(pair.sell.address, pair.buy.address, amountIn.toString()),
    fetchQuote: (amountIn) =>
      fetchSwapQuote({
        amountIn,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        client: readClient,
        poolContext,
      }),
    selectQuotedOut: (quote) => quote?.quotedOut ?? 0n,
  })

  const spot = useSwapSpotRates({
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
    sessionReady && core.amountIn > 0n && priceImpactBps >= HIGH_SWAP_PRICE_IMPACT_BPS

  function flipDirection() {
    core.setBlockResubmit(false)
    flipDirectionInStore()
    core.clearAmount()
  }

  async function submit(): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
    if (!account || !wallet) {
      const error = WALLET_GATE_ERROR.NOT_CONNECTED
      core.setSubmitError(error)
      return { ok: false, error }
    }

    const result = await core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
      await approveTokenIfNeeded({
        wallet,
        token: pair.sell.address,
        amountIn: core.debouncedAmountIn,
      })
      await balancesQuery.refetch()
      const amountOutMin = await assertStillSubmittable()

      await swapTokens({
        wallet,
        amountIn: core.debouncedAmountIn,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        amountOutMin,
      })
      invalidateAfterSwap()
      await balancesQuery.refetch()
    })
    if (result.ok) return { ok: true }
    return { ok: false, error: result.error }
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
    poolFee,
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
