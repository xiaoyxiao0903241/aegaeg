/**
 * 提交/展示用的实时报价数量。
 * `keepPreviousData` 占位不得驱动 UI 或 canSubmit。
 */
export function resolveLiveQuotedOut(
  isPlaceholderData: boolean,
  quotedOut: bigint | undefined | null,
): bigint {
  if (isPlaceholderData) return 0n
  return quotedOut ?? 0n
}

/** Trade / Flash 在实时报价解析后的提交门闸。 */
export function canSubmitQuotedSwap({
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
  /** 优先传入 `resolveLiveQuotedOut(...)`，占位已归零。 */
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
 * Re-run quote submit gate after approve (or any await). Throws the
 * `SWAP_SUBMIT_GATE_FAILED` sentinel when the live quote is no longer submittable.
 * Sentinel string must stay identical to `resolve-contract-error-message`.
 */
export function assertQuotedSwapStillSubmittable(
  params: Parameters<typeof canSubmitQuotedSwap>[0],
): void {
  if (!canSubmitQuotedSwap(params)) {
    throw new Error('SWAP_SUBMIT_GATE_FAILED')
  }
}
