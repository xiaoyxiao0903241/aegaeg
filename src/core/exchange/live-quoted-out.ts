import { EXCHANGE_SUBMIT_BLOCKED } from '~/core/exchange/exchange-sentinels'

/**
 * 提交/展示用的实时报价数量。
 * `keepPreviousData` 占位不得驱动 UI 或 canSubmit。
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
  /** 即使调用方忘记清零 placeholder quotedOut，也 fail-closed。 */
  isPlaceholderData: boolean
  isQuotePending: boolean
  /** 余额仍在加载时，勿把 sellBalance===0 当成空钱包。 */
  isBalancesLoading: boolean
  isSubmitting: boolean
  /** `WalletTransactionWaitError` outcome `unknown` 后闩锁，防双提交。 */
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
 * Re-run quote submit check after approve (or any await). Throws
 * {@link EXCHANGE_SUBMIT_BLOCKED} when the live quote is no longer submittable.
 */
export function assertQuotedExchangeStillSubmittable(
  params: Parameters<typeof canSubmitQuotedExchange>[0],
): void {
  if (!canSubmitQuotedExchange(params)) {
    throw new Error(EXCHANGE_SUBMIT_BLOCKED)
  }
}
