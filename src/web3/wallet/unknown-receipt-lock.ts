/**
 * 模块级 unknown 结果锁 + 按 WRITE_PATH 的在飞互斥（禁双提交）。
 * 锁跨 React 卸载仍有效；仅 owner 配对成功清除，或显式 clearLock / 刷新可解。
 */
const latchedOwners = new Map<string, symbol>()
const inFlightPaths = new Set<string>()
const listeners = new Set<() => void>()

function notifyWritePathBusy(): void {
  for (const listener of listeners) listener()
}

export const WRITE_PATH = {
  /** 锁键历史值 `'swap'`，禁改。 */
  EXCHANGE: 'swap',
  GENESIS: 'genesis',
  REWARD_CLAIM: 'reward-claim',
  /** AGX 活期 / 锁仓质押开仓。 */
  STAKING: 'staking',
  /** BondHelper LP / Burn zap。 */
  BOND_ZAP: 'bond-zap',
  /** XStakingPool gAGX 挖矿质押。 */
  XMINE: 'xmine',
  /** Assets Mixed 领取 / 赎回 / xmine 领取与解押。 */
  ASSETS_CLAIM: 'assets-claim',
  /** Release 队列归属领取 / buffer PRV 领取。 */
  RELEASE_CLAIM: 'release-claim',
  /** ReferralRegistry.bindReferrer。 */
  REFERRAL_BIND: 'referral-bind',
} as const

export type WritePath = (typeof WRITE_PATH)[keyof typeof WRITE_PATH]

export function isUnknownReceiptLocked(path: WritePath): boolean {
  return latchedOwners.has(path)
}

function isWritePathInFlight(path: WritePath): boolean {
  return inFlightPaths.has(path)
}

/** 已上锁或在飞：同路径的其他提交按钮须视为 busy。 */
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
 * 原子占用路径的在飞槽
 *
 * 成功返回 owner；已上锁或已在飞则返回 `{ ok: false, reason }`。
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
 * 清除 unknown 结果锁
 *
 * 带 `owner`：仅设置者可清；不带：显式 clearLock 强制清除。
 */
export function clearUnknownReceiptLock(path: WritePath, owner?: symbol): void {
  if (owner !== undefined) {
    if (latchedOwners.get(path) !== owner) return
  }
  if (!latchedOwners.delete(path)) return
  notifyWritePathBusy()
}

/** 仅单测重置。 */
export function resetUnknownReceiptLocksForTests(): void {
  latchedOwners.clear()
  inFlightPaths.clear()
  notifyWritePathBusy()
}
