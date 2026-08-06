/**
 * 模块级 unknown 结果锁 + 按 (address, WRITE_PATH) 的在飞互斥（禁双提交）。
 * 锁跨 React 卸载仍有效；仅 owner 配对成功清除，或显式 clearLock。
 * latch 按地址写入 sessionStorage，刷新后仍阻断同地址同路径重提。
 */

const STORAGE_KEY = 'aegis:unknown-receipt-lock:v2'

const latchedOwners = new Map<string, symbol>()
const inFlightPaths = new Set<string>()
const listeners = new Set<() => void>()

function normalizeAddress(address: string): string {
  return address.trim().toLowerCase()
}

function latchKey(address: string, path: WritePath): string {
  return `${normalizeAddress(address)}::${path}`
}

type PersistedLatch = { address: string; path: string }

function readPersistedLatches(): PersistedLatch[] {
  try {
    if (typeof sessionStorage === 'undefined') return []
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const out: PersistedLatch[] = []
    for (const item of parsed) {
      if (
        item &&
        typeof item === 'object' &&
        typeof (item as PersistedLatch).address === 'string' &&
        typeof (item as PersistedLatch).path === 'string'
      ) {
        out.push({
          address: normalizeAddress((item as PersistedLatch).address),
          path: (item as PersistedLatch).path,
        })
      }
    }
    return out
  } catch {
    return []
  }
}

function writePersistedLatches(entries: PersistedLatch[]): void {
  try {
    if (typeof sessionStorage === 'undefined') return
    if (entries.length === 0) {
      sessionStorage.removeItem(STORAGE_KEY)
      // 丢弃 v1 无地址键，避免跨钱包误继承
      sessionStorage.removeItem('aegis:unknown-receipt-lock:v1')
      return
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    sessionStorage.removeItem('aegis:unknown-receipt-lock:v1')
  } catch {
    // 隐私模式 / 配额满：内存锁仍有效
  }
}

function persistLatches(): void {
  const entries: PersistedLatch[] = []
  for (const key of latchedOwners.keys()) {
    const sep = key.indexOf('::')
    if (sep <= 0) continue
    entries.push({ address: key.slice(0, sep), path: key.slice(sep + 2) })
  }
  writePersistedLatches(entries)
}

function hydratePersistedLatches(): void {
  for (const { address, path } of readPersistedLatches()) {
    const key = latchKey(address, path as WritePath)
    if (!latchedOwners.has(key)) {
      latchedOwners.set(key, Symbol(`persisted:${key}`))
    }
  }
}

hydratePersistedLatches()

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

export function isUnknownReceiptLocked(path: WritePath, address: string | undefined): boolean {
  if (!address) return false
  return latchedOwners.has(latchKey(address, path))
}

function isWritePathInFlight(path: WritePath, address: string | undefined): boolean {
  if (!address) return false
  return inFlightPaths.has(latchKey(address, path))
}

/** 已上锁或在飞：同地址同路径的其他提交按钮须视为 busy。 */
export function isWritePathBusy(path: WritePath, address: string | undefined): boolean {
  return isUnknownReceiptLocked(path, address) || isWritePathInFlight(path, address)
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
  address: string,
): { ok: true; owner: symbol } | { ok: false; reason: 'locked' | 'in_flight' } {
  const key = latchKey(address, path)
  if (latchedOwners.has(key)) return { ok: false, reason: 'locked' }
  if (inFlightPaths.has(key)) return { ok: false, reason: 'in_flight' }
  const owner = Symbol(key)
  inFlightPaths.add(key)
  notifyWritePathBusy()
  return { ok: true, owner }
}

export function endWritePath(path: WritePath, address: string): void {
  if (!inFlightPaths.delete(latchKey(address, path))) return
  notifyWritePathBusy()
}

export function lockUnknownReceipt(path: WritePath, owner: symbol, address: string): void {
  latchedOwners.set(latchKey(address, path), owner)
  persistLatches()
  notifyWritePathBusy()
}

/**
 * 清除 unknown 结果锁
 *
 * 带 `owner`：仅设置者可清；不带：显式 clearLock 强制清除（现行产品契约）。
 */
export function clearUnknownReceiptLock(
  path: WritePath,
  address: string | undefined,
  owner?: symbol,
): void {
  if (!address) return
  const key = latchKey(address, path)
  if (owner !== undefined) {
    if (latchedOwners.get(key) !== owner) return
  }
  if (!latchedOwners.delete(key)) return
  persistLatches()
  notifyWritePathBusy()
}

/** 仅单测重置。 */
export function resetUnknownReceiptLocksForTests(): void {
  latchedOwners.clear()
  inFlightPaths.clear()
  writePersistedLatches([])
  notifyWritePathBusy()
}

/** 单测：清空内存后从 sessionStorage 再水合（仿真刷新）。 */
export function rehydrateUnknownReceiptLocksForTests(): void {
  latchedOwners.clear()
  inFlightPaths.clear()
  hydratePersistedLatches()
  notifyWritePathBusy()
}
