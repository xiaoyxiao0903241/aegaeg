import { keepPreviousData, type QueryKey } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { calcAmountOutMin } from '~/core/exchange/exchange-math'
import {
  assertQuotedExchangeStillSubmittable,
  canSubmitQuotedExchange,
  liveQuotedOut,
} from '~/core/exchange/live-quoted-out'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { EXCHANGE_QUOTE_FAILED } from '~/web3/contract-error-message'
import { needsTokenApproval } from '~/web3/exchange/exchange-write'
import { QUERY_STALE_TIME, queryClient } from '~/shared/api/query/query-client'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainQuery } from '~/hooks/use-chain-query'
import type {
  QuotedSubmitCore,
  QuotedSubmitExecute,
} from '~/views/dapp/exchange/quoted-submit-core'
import { useExchangeWriteMutation } from '~/views/dapp/exchange/use-exchange-write-mutation'

export type { QuotedSubmitCore, QuotedSubmitExecute }

const DEFAULT_QUOTE_DEBOUNCE_MS = 400

/** 值稳定 `delayMs` 后不再变化时返回。 */
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(timer)
  }, [delayMs, value])

  return debounced
}

export type UseExchangeQuoteOptions<TQuote> = {
  sessionReady: boolean
  quotesEnabled: boolean
  decimals: number
  buyDecimals: number
  sellBalance: bigint
  allowance: bigint
  balancesLoaded: boolean
  walletReady: boolean
  /** When set, gates submit (not balance reads). Defaults to `walletReady`. */
  writeReady?: boolean
  isBalancesLoading: boolean
  slippageBps: number
  debounceMs?: number
  quoteRefreshIntervalMs: number
  getQuoteQueryKey: (amountIn: bigint) => QueryKey
  fetchQuote: (amountIn: bigint) => Promise<TQuote>
  selectQuotedOut: (quote: TQuote | undefined) => bigint
  onBeforeCap?: () => void
}

export function useExchangeQuote<TQuote>({
  sessionReady,
  quotesEnabled,
  decimals,
  buyDecimals,
  sellBalance,
  allowance,
  balancesLoaded,
  walletReady,
  writeReady = walletReady,
  isBalancesLoading,
  slippageBps,
  debounceMs = DEFAULT_QUOTE_DEBOUNCE_MS,
  quoteRefreshIntervalMs,
  getQuoteQueryKey,
  fetchQuote,
  selectQuotedOut,
  onBeforeCap,
}: UseExchangeQuoteOptions<TQuote>) {
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
    sessionReady,
    onBeforeCap,
  })

  const { chainWrite, submitOutcomeRef, isSubmitting, blockResubmit } =
    useExchangeWriteMutation(clearAmount)

  const debouncedAmountIn = useDebouncedValue(amountIn, debounceMs)
  const isAmountDebouncing = amountIn > 0n && amountIn !== debouncedAmountIn

  const amountQuoteQuery = useChainQuery({
    queryKey: getQuoteQueryKey(debouncedAmountIn),
    queryFn: () => fetchQuote(debouncedAmountIn),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled && sessionReady && debouncedAmountIn > 0n,
    refetchInterval: quoteRefreshIntervalMs,
    placeholderData: keepPreviousData,
  })

  const quotedOut = liveQuotedOut(
    amountQuoteQuery.isPlaceholderData,
    selectQuotedOut(amountQuoteQuery.data),
  )

  const isQuoting =
    sessionReady &&
    amountIn > 0n &&
    (isAmountDebouncing ||
      amountQuoteQuery.isPending ||
      amountQuoteQuery.isPlaceholderData ||
      (amountQuoteQuery.isFetching && quotedOut === 0n))

  const validationError = amountQuoteQuery.error ? EXCHANGE_QUOTE_FAILED : null

  /** Bumps on each failed quote fetch so UI can re-toast the same sentinel. */
  const quoteErrorUpdatedAt = amountQuoteQuery.error ? amountQuoteQuery.errorUpdatedAt : 0

  const sellAmountDisplay = formatTokenAmountInputDisplay(sellAmount)

  const buyAmount =
    sessionReady && amountIn > 0n && quotedOut > 0n && !isAmountDebouncing
      ? formatTokenAmountInputDisplay(formatTokenAmount(quotedOut, buyDecimals, 6))
      : ''

  const amountOutMin = quotedOut > 0n ? calcAmountOutMin(quotedOut, slippageBps) : 0n

  const needsMaxApproval = walletReady && amountIn > 0n && needsTokenApproval(allowance, amountIn)

  const canSubmit =
    !isAmountDebouncing &&
    !blockResubmit &&
    canSubmitQuotedExchange({
      walletReady: writeReady,
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

  function clearLock() {
    chainWrite.clearLock()
  }

  function setSellAmountAndUnlock(value: string) {
    clearLock()
    setSellAmount(value)
  }

  function fillPercent(percent: number) {
    if (!walletReady) return
    clearLock()
    fillSellPercent(percent)
  }

  async function runQuotedSubmit(
    execute: QuotedSubmitExecute,
  ): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
    // canSubmit 已要求 !isAmountDebouncing ⇒ amountIn === debouncedAmountIn
    if (!canSubmit || amountIn !== debouncedAmountIn) {
      return { ok: false, error: null }
    }

    submitOutcomeRef.current = { ok: false, error: null }

    // Live re-check: force-refresh quote after approve (may exceed maxQuoteAgeMs),
    // then read from query cache — not the render snapshot that started submit.
    // Callers must pass post-refetch sellBalance; render-closure balance is stale.
    const assertStillSubmittable = async (live?: {
      sellBalance: bigint
    }): Promise<{ amountOutMin: bigint; quotedOut: bigint }> => {
      if (live === undefined) {
        throw new Error('EXCHANGE_SUBMIT_BLOCKED')
      }
      const queryKey = getQuoteQueryKey(debouncedAmountIn)
      await queryClient.fetchQuery({
        queryKey,
        queryFn: () => fetchQuote(debouncedAmountIn),
        staleTime: 0,
      })
      const queryState = queryClient.getQueryState<TQuote>(queryKey)
      const data = queryClient.getQueryData<TQuote>(queryKey)
      const quotedOutLive = liveQuotedOut(false, selectQuotedOut(data))
      const liveAmountOutMin =
        quotedOutLive > 0n ? calcAmountOutMin(quotedOutLive, slippageBps) : 0n
      assertQuotedExchangeStillSubmittable({
        walletReady: writeReady,
        amountIn: debouncedAmountIn,
        sellBalance: live.sellBalance,
        quotedOut: quotedOutLive,
        amountOutMin: liveAmountOutMin,
        isPlaceholderData: false,
        isQuotePending: queryState?.status === 'pending',
        isBalancesLoading: false,
        isSubmitting: false,
        blockResubmit: chainWrite.isLocked,
        quoteUpdatedAt: queryState?.dataUpdatedAt ?? 0,
        maxQuoteAgeMs: QUERY_STALE_TIME.quote,
      })
      return { amountOutMin: liveAmountOutMin, quotedOut: quotedOutLive }
    }

    await chainWrite.mutate(async (session) => {
      await execute({ session, assertStillSubmittable })
    })

    return submitOutcomeRef.current
  }

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
    blockResubmit,
    clearLock,
    validationError,
    quoteErrorUpdatedAt,
    error: validationError,
    amountQuoteQuery,
    runQuotedSubmit,
  }
}
