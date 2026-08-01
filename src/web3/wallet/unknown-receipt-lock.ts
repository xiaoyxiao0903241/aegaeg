/**
 * Module-level unknown-outcome latch + per-path in-flight mutex (禁双提交).
 * Survives React unmount; clear latch only on owner-matched success or explicit user reset.
 */
const latchedOwners = new Map<string, symbol>()
const inFlightPaths = new Set<string>()
const listeners = new Set<() => void>()

function notifyWritePathBusy(): void {
  for (const listener of listeners) listener()
}

export const WRITE_PATH = {
  /** Persisted latch key — historical wire value `'swap'`; do not change. */
  EXCHANGE: 'swap',
  GENESIS: 'genesis',
  REWARD_CLAIM: 'reward-claim',
  /** AGX liquid / locked stake open path. */
  STAKING: 'staking',
  /** BondHelper LP / Burn zap. */
  BOND_ZAP: 'bond-zap',
  /** XStakingPool gAGX mining stake. */
  XMINE: 'xmine',
  /** Assets Mixed claim / redeem / xmine claim+unstake. */
  ASSETS_CLAIM: 'assets-claim',
  /** Release queue vested claim / buffer PRV claim. */
  RELEASE_CLAIM: 'release-claim',
  /** ReferralRegistry bindReferrer. */
  REFERRAL_BIND: 'referral-bind',
} as const

export type WritePath = (typeof WRITE_PATH)[keyof typeof WRITE_PATH]

export function isUnknownReceiptLocked(path: WritePath): boolean {
  return latchedOwners.has(path)
}

function isWritePathInFlight(path: WritePath): boolean {
  return inFlightPaths.has(path)
}

/** Latch or in-flight — sibling CTAs on the same path should treat as busy. */
export function isWritePathBusy(path: WritePath): boolean {
  return isUnknownReceiptLocked(path) || isWritePathInFlight(path)
}

export function subscribeWritePathBusy(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange)
  return () => {
    listeners.delete(onStoreChange)
  }
}

/**
 * Atomically start an in-flight write for `path`.
 * Returns owner token, or `{ ok: false, reason }` when the path is already busy.
 */
export function tryBeginWritePath(
  path: WritePath,
): { ok: true; owner: symbol } | { ok: false; reason: 'locked' | 'in_flight' } {
  if (latchedOwners.has(path)) return { ok: false, reason: 'locked' }
  if (inFlightPaths.has(path)) return { ok: false, reason: 'in_flight' }
  const owner = Symbol(path)
  inFlightPaths.add(path)
  notifyWritePathBusy()
  return { ok: true, owner }
}

export function endWritePath(path: WritePath): void {
  if (!inFlightPaths.delete(path)) return
  notifyWritePathBusy()
}

export function lockUnknownReceipt(path: WritePath, owner: symbol): void {
  latchedOwners.set(path, owner)
  notifyWritePathBusy()
}

/**
 * Clear unknown latch.
 * - With `owner`: only the latch setter may clear (success path / paired unlock).
 * - Without `owner`: explicit user reset (`clearLock`).
 */
export function clearUnknownReceiptLock(path: WritePath, owner?: symbol): void {
  if (owner !== undefined) {
    if (latchedOwners.get(path) !== owner) return
  }
  if (!latchedOwners.delete(path)) return
  notifyWritePathBusy()
}

/** Test-only reset. */
export function resetUnknownReceiptLocksForTests(): void {
  latchedOwners.clear()
  inFlightPaths.clear()
  notifyWritePathBusy()
}
