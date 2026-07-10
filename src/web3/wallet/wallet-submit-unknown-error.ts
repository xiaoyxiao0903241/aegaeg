/**
 * Pre-hash submit uncertainty (e.g. eth_sendTransaction timed out).
 * May still have been broadcast — same double-submit risk as receipt `unknown`.
 */
export class WalletSubmitUnknownError extends Error {
  readonly outcome = 'unknown' as const

  constructor(message = 'Wallet submit outcome is unknown') {
    super(message)
    this.name = 'WalletSubmitUnknownError'
  }
}

export function isUnknownSubmitOutcome(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  if ('outcome' in error && (error as { outcome?: unknown }).outcome === 'unknown') {
    return true
  }
  return false
}
