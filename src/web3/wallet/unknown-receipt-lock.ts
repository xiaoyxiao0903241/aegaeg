/**
 * 交易结果未知时的路径锁，以及同地址同路径「提交进行中」互斥（禁止连点两次）。
 *
 * 锁在页面卸载后仍保留；清除方式二选一：
 * 带上本次提交令牌配对清除，或不带令牌强制清除（例如用户改了表单）。
 * 锁按地址写入 sessionStorage，刷新后仍禁止同地址同路径再提交。
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
  /** 旧锁键 `'reward-claim'`；新领奖路径在判断占用与清锁时仍认此键。 */
  REWARD_CLAIM: 'reward-claim',
  REWARD_LUCKY_MIXED: 'reward-lucky-mixed',
  REWARD_DAO_MIXED: 'reward-dao-mixed',
  REWARD_SIGNED_CLAIM: 'reward-signed-claim',
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

const REWARD_WRITE_PATHS: ReadonlySet<WritePath> = new Set([
  WRITE_PATH.REWARD_LUCKY_MIXED,
  WRITE_PATH.REWARD_DAO_MIXED,
  WRITE_PATH.REWARD_SIGNED_CLAIM,
  WRITE_PATH.REWARD_CLAIM,
])

function hasLegacyRewardClaimLatch(address: string): boolean {
  return latchedOwners.has(latchKey(address, WRITE_PATH.REWARD_CLAIM))
}

/**
 * 判断指定地址与写路径是否持有未知交易结果锁。
 *
 * 锁在刷新后仍保留；未清除前禁止再提同路径交易。
 * 新领奖路径仍认旧键 `reward-claim`，避免升级后留下的旧锁被绕过。
 *
 * @param path 写路径键
 * @param address 钱包地址，可为 undefined
 * @returns 已锁定返回 true
 */
export function isUnknownReceiptLocked(path: WritePath, address: string | undefined): boolean {
  if (!address) return false
  if (latchedOwners.has(latchKey(address, path))) return true
  if (REWARD_WRITE_PATHS.has(path) && path !== WRITE_PATH.REWARD_CLAIM) {
    return hasLegacyRewardClaimLatch(address)
  }
  return false
}

function isWritePathInFlight(path: WritePath, address: string | undefined): boolean {
  if (!address) return false
  return inFlightPaths.has(latchKey(address, path))
}

/** 已锁定或提交未完成时，同地址同路径视为占用中。 */
export function isWritePathBusy(path: WritePath, address: string | undefined): boolean {
  return isUnknownReceiptLocked(path, address) || isWritePathInFlight(path, address)
}

/**
 * 订阅写路径占用状态变化。
 *
 * @param onStoreChange 状态变化回调
 * @returns 取消订阅函数
 */
export function subscribeWritePathBusy(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange)
  return () => {
    listeners.delete(onStoreChange)
  }
}

/**
 * 占用写路径：标记「提交进行中」
 *
 * 成功时返回本次提交令牌；已锁定或已有提交在进行则失败。
 */
export function tryBeginWritePath(
  path: WritePath,
  address: string,
): { ok: true; owner: symbol } | { ok: false; reason: 'locked' | 'in_flight' } {
  const key = latchKey(address, path)
  if (latchedOwners.has(key)) return { ok: false, reason: 'locked' }
  if (REWARD_WRITE_PATHS.has(path) && hasLegacyRewardClaimLatch(address)) {
    return { ok: false, reason: 'locked' }
  }
  if (inFlightPaths.has(key)) return { ok: false, reason: 'in_flight' }
  const owner = Symbol(key)
  inFlightPaths.add(key)
  notifyWritePathBusy()
  return { ok: true, owner }
}

/**
 * 结束「提交进行中」占用。
 *
 * @param path 写路径键
 * @param address 钱包地址
 */
export function endWritePath(path: WritePath, address: string): void {
  if (!inFlightPaths.delete(latchKey(address, path))) return
  notifyWritePathBusy()
}

/**
 * 交易结果未知时加上持久锁
 *
 * 锁上会记下本次提交令牌；之后只有同一令牌才能配对清除，避免误清别次提交的锁。
 *
 * @param path 写路径键
 * @param owner 本次提交令牌（由 tryBeginWritePath 返回）
 * @param address 钱包地址
 */
export function lockUnknownReceipt(path: WritePath, owner: symbol, address: string): void {
  latchedOwners.set(latchKey(address, path), owner)
  persistLatches()
  notifyWritePathBusy()
}

/**
 * 清除未知交易结果锁
 *
 * 传入本次提交令牌时：仅令牌一致才清除。
 * 不传令牌时：强制清除（例如用户改了领取比例或天数）。
 * 清任一新的领奖路径时，同时清掉旧键 `reward-claim`，否则旧锁仍会挡住新路径。
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
  let changed = latchedOwners.delete(key)
  if (REWARD_WRITE_PATHS.has(path) && path !== WRITE_PATH.REWARD_CLAIM) {
    if (latchedOwners.delete(latchKey(address, WRITE_PATH.REWARD_CLAIM))) changed = true
  }
  if (!changed) return
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

/** 单测：清空内存后从 sessionStorage 再读入（模拟刷新页面）。 */
export function rehydrateUnknownReceiptLocksForTests(): void {
  latchedOwners.clear()
  inFlightPaths.clear()
  hydratePersistedLatches()
  notifyWritePathBusy()
}
