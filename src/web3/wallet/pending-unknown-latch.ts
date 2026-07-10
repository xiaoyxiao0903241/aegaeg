/**
 * Module-level unknown-outcome latch (禁双提交).
 * Survives React unmount; clear only on confirmed success or explicit user reset.
 */
const latchedPaths = new Set<string>()

export const WRITE_PATH = {
  SWAP: 'swap',
  GENESIS: 'genesis',
  REWARD_CLAIM: 'reward-claim',
} as const

export type WritePath = (typeof WRITE_PATH)[keyof typeof WRITE_PATH]

export function isPendingUnknownLatched(path: WritePath): boolean {
  return latchedPaths.has(path)
}

export function latchPendingUnknown(path: WritePath): void {
  latchedPaths.add(path)
}

export function clearPendingUnknownLatch(path: WritePath): void {
  latchedPaths.delete(path)
}

/** Test-only reset. */
export function resetPendingUnknownLatchesForTests(): void {
  latchedPaths.clear()
}
