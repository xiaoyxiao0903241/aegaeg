/**
 * 提交结果未知（如 eth_sendTransaction 超时）
 *
 * 交易可能已广播——与收据状态 unknown 有同样的双花风险，
 * 重提前必须等待确认。
 */
export class WalletSubmitUnknownError extends Error {
  readonly outcome = 'unknown' as const

  constructor(message = 'Wallet submit outcome is unknown') {
    super(message)
    this.name = 'WalletSubmitUnknownError'
  }
}

/** 判断错误是否为「结果未知」型提交错误（`outcome === 'unknown'`）。 */
export function isUnknownSubmitOutcome(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  if ('outcome' in error && (error as { outcome?: unknown }).outcome === 'unknown') {
    return true
  }
  return false
}
