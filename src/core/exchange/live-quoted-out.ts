import { EXCHANGE_SUBMIT_BLOCKED } from '~/core/exchange/exchange-sentinels'

/**
 * 取提交门闸用的报价数量。
 *
 * React Query 的 keepPreviousData 可能把旧报价填进 data，
 * 占位数据时归零，避免把旧值喂给买入/汇率展示。
 *
 * @param isPlaceholderData 是否为占位数据
 * @param quotedOut 实时报价数量；未加载时 null/undefined
 * @returns 报价数量；占位或未知返回 0n
 */
export function liveQuotedOut(
  isPlaceholderData: boolean,
  quotedOut: bigint | undefined | null,
): bigint {
  if (isPlaceholderData) return 0n
  return quotedOut ?? 0n
}

/** Trade / Flash 在实时报价解析后的提交门闸。 */
export function canSubmitQuotedExchange({
  walletReady,
  amountIn,
  sellBalance,
  quotedOut,
  amountOutMin,
  isPlaceholderData,
  isQuotePending,
  isBalancesLoading,
  isSubmitting,
  blockResubmit = false,
  quoteUpdatedAt,
  maxQuoteAgeMs,
  nowMs = Date.now(),
}: {
  walletReady: boolean
  amountIn: bigint
  sellBalance: bigint
  /** 优先传入 `liveQuotedOut(...)`，占位已归零。 */
  quotedOut: bigint
  /** 链上地板；有实时报价时必须 > 0。 */
  amountOutMin: bigint
  /** 双保险：调用方未清零占位报价时，这里同样阻断提交，防止旧值成交。 */
  isPlaceholderData: boolean
  isQuotePending: boolean
  /** 余额仍在加载时，勿把 sellBalance===0 当成空钱包。 */
  isBalancesLoading: boolean
  isSubmitting: boolean
  /** `WalletTransactionWaitError` outcome `unknown` 后锁定，防双提交。 */
  blockResubmit?: boolean
  /** 金额报价的 `query.dataUpdatedAt`；与 `maxQuoteAgeMs` 联用。 */
  quoteUpdatedAt?: number
  maxQuoteAgeMs?: number
  nowMs?: number
}): boolean {
  const exceedsBalance = walletReady && amountIn > sellBalance
  const quoteTooOld =
    typeof maxQuoteAgeMs === 'number' &&
    maxQuoteAgeMs >= 0 &&
    (typeof quoteUpdatedAt !== 'number' ||
      quoteUpdatedAt <= 0 ||
      nowMs - quoteUpdatedAt > maxQuoteAgeMs)

  return (
    walletReady &&
    amountIn > 0n &&
    !exceedsBalance &&
    !isBalancesLoading &&
    !isPlaceholderData &&
    quotedOut > 0n &&
    amountOutMin > 0n &&
    !isQuotePending &&
    !quoteTooOld &&
    !isSubmitting &&
    !blockResubmit
  )
}

/**
 * approve（或任意 await）后重跑提交门闸。
 *
 * 实时报价已不可提交时抛 EXCHANGE_SUBMIT_BLOCKED，
 * 供调用方在写交易前中止。
 *
 * @param params 与 canSubmitQuotedExchange 相同的入参
 */
export function assertQuotedExchangeStillSubmittable(
  params: Parameters<typeof canSubmitQuotedExchange>[0],
): void {
  if (!canSubmitQuotedExchange(params)) {
    throw new Error(EXCHANGE_SUBMIT_BLOCKED)
  }
}
