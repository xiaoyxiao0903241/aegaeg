/**
 * Module-level unknown-outcome latch (禁双提交).
 * Survives React unmount; clear only on confirmed success or explicit user reset.
 */
const latchedPaths = new Set<string>()

export const WRITE_PATH = {
  /** Persisted latch key — historical wire value `'swap'`; do not change. */
  EXCHANGE: 'swap',
  GENESIS: 'genesis',
  REWARD_CLAIM: 'reward-claim',
} as const

export type WritePath = (typeof WRITE_PATH)[keyof typeof WRITE_PATH]

export function isUnknownReceiptLocked(path: WritePath): boolean {
  return latchedPaths.has(path)
}

export function lockUnknownReceipt(path: WritePath): void {
  latchedPaths.add(path)
}

export function clearUnknownReceiptLock(path: WritePath): void {
  latchedPaths.delete(path)
}

/** Test-only reset. */
export function resetUnknownReceiptLocksForTests(): void {
  latchedPaths.clear()
}
