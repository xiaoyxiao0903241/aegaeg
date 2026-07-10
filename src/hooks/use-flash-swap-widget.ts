import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useCallback, useMemo } from 'react'
import { formatSwapRate, formatSwapRateColon } from '~/views/dapp/swap/format-swap-rate'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/swap/token-amount'
import { getSwapPairTokens } from '~/views/dapp/swap/swap-pair'
import { SWAP_CONFIG } from '~/shared/config/swap'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { invalidateAfterSwap } from '~/shared/api/query/invalidate'
import { GENESIS_PURCHASE_ERROR } from '~/views/dapp/web3/resolve-contract-error-message'
import { hasWalletAccount } from '~/views/dapp/web3/wallet-connection-state'
import { useVisibleInterval } from '~/hooks/queries/use-visible-interval'
import { useChainReadClient } from '~/hooks/use-chain-read-client'
import { useSwapQuote } from '~/hooks/use-swap-quote'
import { resolveLiveQuotedOut } from '~/core/swap/resolve-live-quoted-out'
import { readFlashSwapBalances, readFlashSwapQuote } from '~/views/dapp/web3/flash-swap-read'
import { approveUsdtForFlashSwapIfNeeded, flashSwap } from '~/views/dapp/web3/flash-swap-write'

/** Fixed tolerance (0.5%) below the displayed quote for the on-chain floor. */
const FLASH_SWAP_SLIPPAGE_BPS = 50

/** One-way USDT → USD1 via AegisUsd1Swap; no slippage UI (fixed small tolerance). */
export function useFlashSwapWidget(sessionReady: boolean, quotesEnabled = true) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const pair = useMemo(() => getSwapPairTokens('reverse'), [])
  const readClient = useChainReadClient()

  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const spotQuoteAmount = useMemo(
    () => 10n ** BigInt(pair.sell.decimals),
    [pair.sell.decimals],
  )

  const balancesQuery = useQuery({
    queryKey: queryKeys.chain.flashSwapBalances(address ?? ''),
    queryFn: () => readFlashSwapBalances(address!, readClient),
    enabled: quotesEnabled && walletReady,
    staleTime: QUERY_STALE_TIME.balances,
  })

  const sellBalance = balancesQuery.data?.usdt ?? 0n
  const buyBalance = balancesQuery.data?.usd1 ?? 0n
  const balancesLoaded = balancesQuery.data !== undefined
  const isBalancesLoading = walletReady && balancesQuery.isLoading

  const fetchFlashQuote = useCallback(
    (amountIn: bigint) => readFlashSwapQuote(amountIn, readClient),
    [readClient],
  )

  const core = useSwapQuote({
    sessionReady,
    quotesEnabled,
    decimals: pair.sell.decimals,
    buyDecimals: pair.buy.decimals,
    sellBalance,
    allowance: 0n,
    balancesLoaded,
    walletReady,
    isBalancesLoading,
    slippageBps: FLASH_SWAP_SLIPPAGE_BPS,
    quoteRefreshIntervalMs: SWAP_CONFIG.quoteRefreshIntervalMs,
    getQuoteQueryKey: (amountIn) => queryKeys.chain.flashSwapQuote(amountIn.toString()),
    fetchQuote: fetchFlashQuote,
    selectQuotedOut: (quote) => quote ?? 0n,
  })

  const spotQuoteQuery = useQuery({
    queryKey: queryKeys.chain.flashSwapQuote(spotQuoteAmount.toString()),
    queryFn: () => readFlashSwapQuote(spotQuoteAmount, readClient),
    enabled: quotesEnabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleInterval(spotQuoteQuery, SWAP_CONFIG.quoteRefreshIntervalMs, quotesEnabled)

  const spotQuotedOut = resolveLiveQuotedOut(
    spotQuoteQuery.isPlaceholderData,
    spotQuoteQuery.data,
  )
  const isExchangePriceQuoting =
    spotQuoteQuery.isPending ||
    spotQuoteQuery.isPlaceholderData ||
    (spotQuoteQuery.isFetching && spotQuotedOut === 0n)

  const exchangePriceLabel = useMemo(() => {
    if (spotQuotedOut === 0n) {
      return isExchangePriceQuoting ? '' : '—'
    }

    return formatSwapRate({
      amountIn: spotQuoteAmount,
      amountOut: spotQuotedOut,
      decimalsIn: pair.sell.decimals,
      decimalsOut: pair.buy.decimals,
      symbolIn: pair.sell.symbol,
      symbolOut: pair.buy.symbol,
      fractionDigits: 6,
    })
  }, [
    isExchangePriceQuoting,
    pair.buy.decimals,
    pair.buy.symbol,
    pair.sell.decimals,
    pair.sell.symbol,
    spotQuoteAmount,
    spotQuotedOut,
  ])

  const overviewRateLabel = useMemo(() => {
    if (spotQuotedOut === 0n) {
      return isExchangePriceQuoting ? '' : '—'
    }

    return formatSwapRateColon({
      amountIn: spotQuoteAmount,
      amountOut: spotQuotedOut,
      decimalsIn: pair.sell.decimals,
      decimalsOut: pair.buy.decimals,
    })
  }, [
    isExchangePriceQuoting,
    pair.buy.decimals,
    pair.sell.decimals,
    spotQuoteAmount,
    spotQuotedOut,
  ])

  const routeLabel = `${pair.sell.symbol} → ${pair.buy.symbol}`

  const minUsd1OutLabel = useMemo(
    () =>
      sessionReady && core.amountIn > 0n && core.amountOutMin > 0n
        ? formatTokenAmountInputDisplay(
            formatTokenAmount(core.amountOutMin, pair.buy.decimals, 6),
          )
        : '—',
    [sessionReady, core.amountIn, core.amountOutMin, pair.buy.decimals],
  )

  const submit = useCallback(async (): Promise<{ ok: true } | { ok: false; error: unknown }> => {
    if (!account || !wallet) {
      const error = GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED
      core.setSubmitError(error)
      return { ok: false, error }
    }

    const result = await core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
      await approveUsdtForFlashSwapIfNeeded({ wallet, amountIn: core.debouncedAmountIn })
      void balancesQuery.refetch()
      assertStillSubmittable()

      await flashSwap({
        wallet,
        usdtAmount: core.debouncedAmountIn,
        minUsd1Out: core.amountOutMin,
      })
      invalidateAfterSwap()
      await balancesQuery.refetch()
    })

    if (result.ok) return { ok: true }
    return { ok: false, error: result.error }
  }, [account, balancesQuery, core, wallet])

  return {
    sellAmount: core.sellAmount,
    sellAmountDisplay: core.sellAmountDisplay,
    setSellAmount: core.setSellAmount,
    pair,
    sellBalanceLabel: formatTokenAmount(sellBalance, pair.sell.decimals, 4),
    buyBalanceLabel: formatTokenAmount(buyBalance, pair.buy.decimals, 4),
    buyAmount: core.buyAmount,
    exchangePriceLabel,
    routeLabel,
    overviewRateLabel,
    minUsd1OutLabel,
    walletReady,
    canSubmit: core.canSubmit,
    isQuoting: core.isQuoting,
    isExchangePriceQuoting,
    isBalancesLoading,
    isSubmitting: core.isSubmitting,
    error: core.error,
    validationError: core.validationError,
    quoteErrorUpdatedAt: core.quoteErrorUpdatedAt,
    fillPercent: core.fillPercent,
    submit,
  }
}
