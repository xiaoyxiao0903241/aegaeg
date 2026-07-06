import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from 'thirdweb/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatSwapRate, formatSwapRateColon } from '~/lib/swap/format-swap-rate'
import {
  capTokenAmountInput,
  formatTokenAmount,
  formatTokenAmountInputDisplay,
  parseTokenAmount,
  sanitizeTokenAmountInput,
} from '~/core/swap/token-amount'
import { getSwapPairTokens } from '~/core/swap/swap-pair'
import { SWAP_CONFIG } from '~/shared/config/swap'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useDappActions } from '~/stores/dapp-actions'
import { GENESIS_PURCHASE_ERROR } from '~/views/dapp/web3/resolve-contract-error-message'
import { hasWalletAccount } from '~/views/dapp/web3/wallet-connection-state'
import { useVisibleQueryInterval } from '~/hooks/queries/use-visible-query-interval'
import { useChainReadClient } from '~/hooks/use-chain-read-client'
import { calcAmountOutMin } from '~/core/swap/calc-amount-out-min'
import { readFlashSwapBalances, readFlashSwapQuote } from '~/views/dapp/web3/flash-swap-read'
import { approveUsdtForFlashSwapIfNeeded, executeFlashSwap } from '~/views/dapp/web3/flash-swap-write'

/** Fixed tolerance (0.5%) below the displayed quote for the on-chain floor. */
const FLASH_SWAP_SLIPPAGE_BPS = 50

/** One-way USDT → USD1 via AegisUsd1Swap; no slippage UI (fixed small tolerance). */
export function useFlashSwapWidget(authenticated: boolean, quotesEnabled = true) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const afterSwap = useDappActions((state) => state.afterSwap)
  const pair = useMemo(() => getSwapPairTokens('reverse'), [])
  const [sellAmount, setSellAmountRaw] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<unknown>(null)
  const readClient = useChainReadClient()

  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const amountIn = useMemo(
    () => parseTokenAmount(sellAmount, pair.sell.decimals),
    [pair.sell.decimals, sellAmount],
  )
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

  const sellBalance = balancesQuery.data?.usdt ?? 0n
  const buyBalance = balancesQuery.data?.usd1 ?? 0n
  // Only cap input against a real balance; capping against the 0n fallback
  // while balances are still loading would wipe whatever the user typed.
  const balancesLoaded = balancesQuery.data !== undefined
  const isBalancesLoading = walletReady && balancesQuery.isLoading
  const quotedOut = amountQuoteQuery.data ?? 0n
  const spotQuotedOut = spotQuoteQuery.data ?? 0n
  const isQuoting =
    authenticated && amountIn > 0n && amountQuoteQuery.isFetching && quotedOut === 0n
  const isExchangePriceQuoting = spotQuoteQuery.isFetching && spotQuotedOut === 0n

  const setSellAmount = useCallback(
    (value: string) => {
      const fractionLimit = Math.min(pair.sell.decimals, 6)

      if (!authenticated || !balancesLoaded) {
        setSellAmountRaw(sanitizeTokenAmountInput(value, fractionLimit))
        return
      }

      setSubmitError(null)
      setSellAmountRaw(capTokenAmountInput(value, sellBalance, pair.sell.decimals, 6))
    },
    [authenticated, balancesLoaded, pair.sell.decimals, sellBalance],
  )

  useEffect(() => {
    if (!authenticated || !balancesLoaded || !sellAmount) return
    const capped = capTokenAmountInput(sellAmount, sellBalance, pair.sell.decimals, 6)
    if (capped !== sellAmount) setSellAmountRaw(capped)
  }, [authenticated, balancesLoaded, pair.sell.decimals, sellAmount, sellBalance])

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

  const exceedsBalance = walletReady && amountIn > sellBalance
  const canSubmit =
    walletReady &&
    amountIn > 0n &&
    !exceedsBalance &&
    quotedOut > 0n &&
    !amountQuoteQuery.isPending &&
    !isSubmitting

  const fillPercent = useCallback(
    (percent: number) => {
      if (!walletReady || sellBalance === 0n) return
      const value = (sellBalance * BigInt(percent)) / 100n
      setSellAmountRaw(formatTokenAmount(value, pair.sell.decimals, 6))
    },
    [walletReady, pair.sell.decimals, sellBalance],
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
        // Allow a small tolerance below the displayed quote; using the raw
        // quote as a strict floor reverts on any price tick between quoting
        // and execution.
        minUsd1Out: calcAmountOutMin(quotedOut, FLASH_SWAP_SLIPPAGE_BPS),
      })
      setSellAmountRaw('')
      afterSwap()
      await balancesQuery.refetch()
      return { ok: true }
    } catch (caught: unknown) {
      setSubmitError(caught)
      // The tx may still land (unknown outcome) — refresh balances so the UI
      // re-caps the amount instead of inviting an identical resubmit.
      void balancesQuery.refetch()
      return { ok: false, error: caught }
    } finally {
      setIsSubmitting(false)
    }
  }, [account, afterSwap, amountIn, balancesQuery, canSubmit, quotedOut, wallet])

  return {
    sellAmount,
    sellAmountDisplay,
    setSellAmount,
    pair,
    sellBalanceLabel: formatTokenAmount(sellBalance, pair.sell.decimals, 4),
    buyBalanceLabel: formatTokenAmount(buyBalance, pair.buy.decimals, 4),
    buyAmount,
    exchangePriceLabel,
    routeLabel,
    overviewRateLabel,
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
