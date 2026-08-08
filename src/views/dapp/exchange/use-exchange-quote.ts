import { keepPreviousData, type QueryKey } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { ZERO_BI } from '~/core/constants'
import { calcAmountOutMin } from '~/core/exchange/exchange-math'
import {
  assertQuotedExchangeStillSubmittable,
  canSubmitQuotedExchange,
  liveQuotedOut,
} from '~/core/exchange/live-quoted-out'
import { formatTokenAmountDraft, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainQuery } from '~/hooks/use-chain-query'
import { QUERY_STALE_TIME, queryClient } from '~/shared/api/query/query-client'
import type { QuotedSubmitCore, QuotedSubmitExecute } from '~/views/dapp/exchange/shared'
import { useExchangeWriteMutation } from '~/views/dapp/exchange/use-exchange-write-mutation'
import { EXCHANGE_QUOTE_FAILED, EXCHANGE_SUBMIT_BLOCKED } from '~/web3/contract-error-message'
import { needsTokenApproval } from '~/web3/exchange/exchange-write'

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
  /** 设置后仅门禁提交（不影响余额读取），默认跟随 walletReady。 */
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

/**
 * 报价型兑换的核心状态机（市价交易 / 闪电兑换 / 销毁共用）
 *
 * 统一维护金额输入防抖、链上报价、最小收到数量与提交门禁；
 * 提交时先实时复检报价再写链，失败由调用方提示阻断原因。
 */
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
  const isAmountDebouncing = amountIn > ZERO_BI && amountIn !== debouncedAmountIn

  const amountQuoteQuery = useChainQuery({
    queryKey: getQuoteQueryKey(debouncedAmountIn),
    queryFn: () => fetchQuote(debouncedAmountIn),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled && sessionReady && debouncedAmountIn > ZERO_BI,
    refetchInterval: quoteRefreshIntervalMs,
    placeholderData: keepPreviousData,
  })

  const rawQuotedOut = selectQuotedOut(amountQuoteQuery.data) ?? ZERO_BI
  // 提交门禁专用：占位旧值不得影响 canSubmit / amountOutMin
  const quotedOut = liveQuotedOut(amountQuoteQuery.isPlaceholderData, rawQuotedOut)

  const isQuoting =
    sessionReady &&
    amountIn > ZERO_BI &&
    (isAmountDebouncing ||
      amountQuoteQuery.isPending ||
      amountQuoteQuery.isPlaceholderData ||
      (amountQuoteQuery.isFetching && quotedOut === ZERO_BI))

  const validationError = amountQuoteQuery.error ? EXCHANGE_QUOTE_FAILED : null

  // 每次报价失败自增，UI 可据此避免对同一错误重复提示
  const quoteErrorUpdatedAt = amountQuoteQuery.error ? amountQuoteQuery.errorUpdatedAt : 0

  const sellAmountDisplay = formatTokenAmountInputDisplay(sellAmount)

  const [retainedBuyAmount, setRetainedBuyAmount] = useState('')
  // 展示面用原始报价（含防抖期间的旧值）；门禁始终用 liveQuotedOut
  const faceBuyAmount =
    sessionReady && amountIn > ZERO_BI && !isAmountDebouncing && rawQuotedOut > ZERO_BI
      ? formatTokenAmountInputDisplay(formatTokenAmountDraft(rawQuotedOut, buyDecimals, 6))
      : null

  if (amountIn === ZERO_BI || !sessionReady) {
    if (retainedBuyAmount !== '') setRetainedBuyAmount('')
  } else if (faceBuyAmount != null && faceBuyAmount !== retainedBuyAmount) {
    setRetainedBuyAmount(faceBuyAmount)
  }

  // 防抖或空报价期间保留上一帧买入面值；稳定为空时保持 `''`
  const buyAmount =
    amountIn === ZERO_BI || !sessionReady ? '' : (faceBuyAmount ?? retainedBuyAmount)

  const amountOutMin = quotedOut > ZERO_BI ? calcAmountOutMin(quotedOut, slippageBps) : ZERO_BI

  const needsApproval = walletReady && amountIn > ZERO_BI && needsTokenApproval(allowance, amountIn)

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

    // 提交前实时复检：授权后强制刷新报价（可能已超过报价有效期），
    // 再从查询缓存读取，而非用发起提交时的渲染快照。
    // 调用方必须传入刷新后的 sellBalance，闭包里的余额已过期。
    const assertStillSubmittable = async (live?: {
      sellBalance: bigint
    }): Promise<{ amountOutMin: bigint; quotedOut: bigint }> => {
      if (live === undefined) {
        throw new Error(EXCHANGE_SUBMIT_BLOCKED)
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
        quotedOutLive > ZERO_BI ? calcAmountOutMin(quotedOutLive, slippageBps) : ZERO_BI
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
    needsApproval,
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
