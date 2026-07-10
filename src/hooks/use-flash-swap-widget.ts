import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useCallback, useMemo, useState } from 'react'
import { formatSwapRate, formatSwapRateColon } from '~/views/dapp/swap/format-swap-rate'
import {
  formatTokenAmount,
  formatTokenAmountInputDisplay,
} from '~/core/swap/token-amount'
import { getSwapPairTokens } from '~/views/dapp/swap/swap-pair'
import { SWAP_CONFIG } from '~/shared/config/swap'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { invalidateAfterSwap } from '~/shared/api/query/invalidate'
import { GENESIS_PURCHASE_ERROR } from '~/views/dapp/web3/resolve-contract-error-message'
import { WalletTransactionWaitError } from '~/views/dapp/web3/wait-wallet-transaction'
import { hasWalletAccount } from '~/views/dapp/web3/wallet-connection-state'
import { useVisibleQueryInterval } from '~/hooks/queries/use-visible-query-interval'
import { useChainReadClient } from '~/hooks/use-chain-read-client'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { calcAmountOutMin } from '~/core/swap/calc-amount-out-min'
import {
  canSubmitQuotedSwap,
  resolveLiveQuotedOut,
} from '~/core/swap/resolve-live-quoted-out'
import { readFlashSwapBalances, readFlashSwapQuote } from '~/views/dapp/web3/flash-swap-read'
import { approveUsdtForFlashSwapIfNeeded, executeFlashSwap } from '~/views/dapp/web3/flash-swap-write'

/** Fixed tolerance (0.5%) below the displayed quote for the on-chain floor. */
const FLASH_SWAP_SLIPPAGE_BPS = 50

/** One-way USDT → USD1 via AegisUsd1Swap; no slippage UI (fixed small tolerance). */
export function useFlashSwapWidget(authenticated: boolean, quotesEnabled = true) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const pair = useMemo(() => getSwapPairTokens('reverse'), [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<unknown>(null)
  /** Blocks re-submit after a pending tx with unknown confirmation outcome. */
  const [blockResubmit, setBlockResubmit] = useState(false)
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

  const spotQuoteQuery = useQuery({
    queryKey: queryKeys.chain.flashSwapQuote(spotQuoteAmount.toString()),
    queryFn: () => readFlashSwapQuote(spotQuoteAmount, readClient),
    enabled: quotesEnabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  const sellBalance = balancesQuery.data?.usdt ?? 0n
  const buyBalance = balancesQuery.data?.usd1 ?? 0n
  const balancesLoaded = balancesQuery.data !== undefined

  const clearSubmitError = useCallback(() => {
    setSubmitError(null)
  }, [])

  const {
    amount: sellAmount,
    amountIn,
    setAmount: setSellAmount,
    clearAmount,
    fillPercent: fillSellPercent,
  } = useCappedTokenAmountInput({
    decimals: pair.sell.decimals,
    balance: sellBalance,
    balancesLoaded,
    authenticated,
    onBeforeCap: clearSubmitError,
  })

  const amountQuoteQuery = useQuery({
    queryKey: queryKeys.chain.flashSwapQuote(amountIn.toString()),
    queryFn: () => readFlashSwapQuote(amountIn, readClient),
    enabled: quotesEnabled && authenticated && amountIn > 0n,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleQueryInterval(spotQuoteQuery, SWAP_CONFIG.quoteRefreshIntervalMs, quotesEnabled)
  useVisibleQueryInterval(
    amountQuoteQuery,
    SWAP_CONFIG.quoteRefreshIntervalMs,
    quotesEnabled && authenticated && amountIn > 0n,
  )

  // Only cap input against a real balance; capping against the 0n fallback
  // while balances are still loading would wipe whatever the user typed.
  const isBalancesLoading = walletReady && balancesQuery.isLoading
  // keepPreviousData must not drive submit/UI: placeholder is a prior amountIn's quote.
  const quotedOut = resolveLiveQuotedOut(
    amountQuoteQuery.isPlaceholderData,
    amountQuoteQuery.data,
  )
  const spotQuotedOut = resolveLiveQuotedOut(
    spotQuoteQuery.isPlaceholderData,
    spotQuoteQuery.data,
  )
  const isQuoting =
    authenticated &&
    amountIn > 0n &&
    (amountQuoteQuery.isPending ||
      amountQuoteQuery.isPlaceholderData ||
      (amountQuoteQuery.isFetching && quotedOut === 0n))
  const isExchangePriceQuoting =
    spotQuoteQuery.isPending ||
    spotQuoteQuery.isPlaceholderData ||
    (spotQuoteQuery.isFetching && spotQuotedOut === 0n)

  const validationError = useMemo(() => {
    if (!amountQuoteQuery.error) return null
    return amountQuoteQuery.error instanceof Error
      ? amountQuoteQuery.error.message
      : 'Quote failed'
  }, [amountQuoteQuery.error])

  const error = submitError ?? validationError

  const sellAmountDisplay = useMemo(
    () => formatTokenAmountInputDisplay(sellAmount),
    [sellAmount],
  )

  const buyAmount = useMemo(
    () =>
      authenticated && amountIn > 0n && quotedOut > 0n
        ? formatTokenAmountInputDisplay(formatTokenAmount(quotedOut, pair.buy.decimals, 6))
        : '',
    [authenticated, amountIn, pair.buy.decimals, quotedOut],
  )

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

  const amountOutMin = useMemo(
    () => (quotedOut > 0n ? calcAmountOutMin(quotedOut, FLASH_SWAP_SLIPPAGE_BPS) : 0n),
    [quotedOut],
  )

  const minUsd1OutLabel = useMemo(
    () =>
      authenticated && amountIn > 0n && amountOutMin > 0n
        ? formatTokenAmountInputDisplay(formatTokenAmount(amountOutMin, pair.buy.decimals, 6))
        : '—',
    [amountIn, amountOutMin, authenticated, pair.buy.decimals],
  )

  const canSubmit = canSubmitQuotedSwap({
    walletReady,
    amountIn,
    sellBalance,
    quotedOut,
    amountOutMin,
    isPlaceholderData: amountQuoteQuery.isPlaceholderData,
    isQuotePending: amountQuoteQuery.isPending,
    isBalancesLoading,
    isSubmitting,
    blockResubmit,
    quoteUpdatedAt: amountQuoteQuery.dataUpdatedAt,
    maxQuoteAgeMs: QUERY_STALE_TIME.quote,
  })

  const setSellAmountAndUnlock = useCallback(
    (value: string) => {
      setBlockResubmit(false)
      setSellAmount(value)
    },
    [setSellAmount],
  )

  const fillPercent = useCallback(
    (percent: number) => {
      if (!walletReady) return
      setBlockResubmit(false)
      fillSellPercent(percent)
    },
    [fillSellPercent, walletReady],
  )

  const submit = useCallback(async (): Promise<{ ok: true } | { ok: false; error: unknown }> => {
    if (!account || !wallet) {
      const error = GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED
      setSubmitError(error)
      return { ok: false, error }
    }
    if (!canSubmit) return { ok: false, error: null }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await approveUsdtForFlashSwapIfNeeded({ wallet, amountIn })
      void balancesQuery.refetch()

      await executeFlashSwap({
        wallet,
        usdtAmount: amountIn,
        minUsd1Out: amountOutMin,
      })
      setBlockResubmit(false)
      clearAmount()
      invalidateAfterSwap()
      await balancesQuery.refetch()
      return { ok: true }
    } catch (caught: unknown) {
      if (caught instanceof WalletTransactionWaitError && caught.outcome === 'unknown') {
        setBlockResubmit(true)
      }
      setSubmitError(caught)
      void balancesQuery.refetch()
      return { ok: false, error: caught }
    } finally {
      setIsSubmitting(false)
    }
  }, [account, amountIn, amountOutMin, balancesQuery, canSubmit, clearAmount, wallet])

  return {
    sellAmount,
    sellAmountDisplay,
    setSellAmount: setSellAmountAndUnlock,
    pair,
    sellBalanceLabel: formatTokenAmount(sellBalance, pair.sell.decimals, 4),
    buyBalanceLabel: formatTokenAmount(buyBalance, pair.buy.decimals, 4),
    buyAmount,
    exchangePriceLabel,
    routeLabel,
    overviewRateLabel,
    minUsd1OutLabel,
    walletReady,
    canSubmit,
    isQuoting,
    isExchangePriceQuoting,
    isBalancesLoading,
    isSubmitting,
    error,
    validationError,
    fillPercent,
    submit,
  }
}
