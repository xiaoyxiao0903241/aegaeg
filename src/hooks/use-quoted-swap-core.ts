import { keepPreviousData, useQuery, type QueryKey } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { calcAmountOutMin } from '~/core/swap/calc-amount-out-min'
import {
  canSubmitQuotedSwap,
  resolveLiveQuotedOut,
} from '~/core/swap/resolve-live-quoted-out'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/swap/token-amount'
import { SWAP_QUOTE_FAILED } from '~/views/dapp/web3/resolve-contract-error-message'
import { WalletTransactionWaitError } from '~/views/dapp/web3/wait-wallet-transaction'
import { needsTokenApproval } from '~/views/dapp/web3/swap-write'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { useVisibleQueryInterval } from '~/hooks/queries/use-visible-query-interval'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useDebouncedValue } from '~/hooks/use-debounced-value'

const DEFAULT_QUOTE_DEBOUNCE_MS = 400

export type UseQuotedSwapCoreOptions<TQuote> = {
  authenticated: boolean
  quotesEnabled: boolean
  decimals: number
  buyDecimals: number
  sellBalance: bigint
  allowance: bigint
  balancesLoaded: boolean
  walletReady: boolean
  isBalancesLoading: boolean
  slippageBps: number
  debounceMs?: number
  quoteRefreshIntervalMs: number
  getQuoteQueryKey: (amountIn: bigint) => QueryKey
  fetchQuote: (amountIn: bigint) => Promise<TQuote>
  selectQuotedOut: (quote: TQuote | undefined) => bigint
  onBeforeCap?: () => void
}

export function useQuotedSwapCore<TQuote>({
  authenticated,
  quotesEnabled,
  decimals,
  buyDecimals,
  sellBalance,
  allowance,
  balancesLoaded,
  walletReady,
  isBalancesLoading,
  slippageBps,
  debounceMs = DEFAULT_QUOTE_DEBOUNCE_MS,
  quoteRefreshIntervalMs,
  getQuoteQueryKey,
  fetchQuote,
  selectQuotedOut,
  onBeforeCap,
}: UseQuotedSwapCoreOptions<TQuote>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<unknown>(null)
  /** Blocks re-submit after a pending tx with unknown confirmation outcome. */
  const [blockResubmit, setBlockResubmit] = useState(false)

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
    decimals,
    balance: sellBalance,
    balancesLoaded,
    authenticated,
    onBeforeCap: onBeforeCap ?? clearSubmitError,
  })

  const debouncedAmountIn = useDebouncedValue(amountIn, debounceMs)
  const isAmountDebouncing = amountIn > 0n && amountIn !== debouncedAmountIn

  const amountQuoteQuery = useQuery({
    queryKey: getQuoteQueryKey(debouncedAmountIn),
    queryFn: () => fetchQuote(debouncedAmountIn),
    enabled: quotesEnabled && authenticated && debouncedAmountIn > 0n,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleQueryInterval(
    amountQuoteQuery,
    quoteRefreshIntervalMs,
    quotesEnabled && authenticated && debouncedAmountIn > 0n,
  )

  const quotedOut = resolveLiveQuotedOut(
    amountQuoteQuery.isPlaceholderData,
    selectQuotedOut(amountQuoteQuery.data),
  )

  const isQuoting =
    authenticated &&
    amountIn > 0n &&
    (isAmountDebouncing ||
      amountQuoteQuery.isPending ||
      amountQuoteQuery.isPlaceholderData ||
      (amountQuoteQuery.isFetching && quotedOut === 0n))

  const validationError = useMemo(() => {
    if (!amountQuoteQuery.error) return null
    return SWAP_QUOTE_FAILED
  }, [amountQuoteQuery.error])

  const error = submitError ?? validationError

  const sellAmountDisplay = useMemo(
    () => formatTokenAmountInputDisplay(sellAmount),
    [sellAmount],
  )

  const buyAmount = useMemo(
    () =>
      authenticated && amountIn > 0n && quotedOut > 0n && !isAmountDebouncing
        ? formatTokenAmountInputDisplay(formatTokenAmount(quotedOut, buyDecimals, 6))
        : '',
    [authenticated, amountIn, buyDecimals, isAmountDebouncing, quotedOut],
  )

  const amountOutMin = useMemo(
    () => (quotedOut > 0n ? calcAmountOutMin(quotedOut, slippageBps) : 0n),
    [quotedOut, slippageBps],
  )

  const needsMaxApproval =
    walletReady && amountIn > 0n && needsTokenApproval(allowance, amountIn)

  const canSubmit =
    !isAmountDebouncing &&
    canSubmitQuotedSwap({
      walletReady,
      amountIn: debouncedAmountIn,
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

  const runQuotedSubmit = useCallback(
    async (
      execute: () => Promise<void>,
    ): Promise<{ ok: true } | { ok: false; error: unknown | null }> => {
      // canSubmit already requires !isAmountDebouncing ⇒ amountIn === debouncedAmountIn.
      if (!canSubmit || amountIn !== debouncedAmountIn) {
        return { ok: false, error: null }
      }

      setIsSubmitting(true)
      setSubmitError(null)

      try {
        await execute()
        setBlockResubmit(false)
        clearAmount()
        return { ok: true }
      } catch (caught: unknown) {
        if (caught instanceof WalletTransactionWaitError && caught.outcome === 'unknown') {
          setBlockResubmit(true)
        }
        setSubmitError(caught)
        return { ok: false, error: caught }
      } finally {
        setIsSubmitting(false)
      }
    },
    [amountIn, canSubmit, clearAmount, debouncedAmountIn],
  )

  return {
    sellAmount,
    sellAmountDisplay,
    amountIn,
    debouncedAmountIn,
    isAmountDebouncing,
    setSellAmount: setSellAmountAndUnlock,
    clearAmount,
    fillPercent,
    buyAmount,
    quotedOut,
    amountOutMin,
    isQuoting,
    canSubmit,
    needsMaxApproval,
    isSubmitting,
    submitError,
    setSubmitError,
    clearSubmitError,
    blockResubmit,
    setBlockResubmit,
    validationError,
    error,
    amountQuoteQuery,
    runQuotedSubmit,
  }
}
