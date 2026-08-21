/**
 * 交易结果未知时的路径锁，以及同地址同路径「提交进行中」互斥（禁止连点两次）。
 *
 * 拿到广播 hash 后写入闩，刷新后用同一个 `waitForTransactionReceipt` 续等。
 * 无 hash（发送超时）只挡提交，不自动开闩。
 * 清除方式：配对令牌、改表单强制清除，或收据终态后 `settleUnknownReceiptLock`。
 */

import type { Hash } from 'viem'

const STORAGE_KEY = 'aegis:unknown-receipt-lock:v3'
const STORAGE_KEY_V2 = 'aegis:unknown-receipt-lock:v2'
const STORAGE_KEY_V1 = 'aegis:unknown-receipt-lock:v1'

const TX_HASH_RE = /^0x[0-9a-fA-F]{64}$/

const latchedOwners = new Map<string, symbol>()
const latchedEvidence = new Map<string, LatchEvidence>()
const inFlightPaths = new Set<string>()
const listeners = new Set<() => void>()

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

export type UnknownReceiptLatchEvidence = {
  hash?: Hash
}

export type UnknownReceiptLatch = {
  address: string
  path: WritePath
  hash?: Hash
}

type LatchEvidence = UnknownReceiptLatchEvidence
type PersistedLatch = { address: string; path: string; hash?: string }

function normalizeAddress(address: string): string {
  return address.trim().toLowerCase()
}

function latchKey(address: string, path: WritePath): string {
  return `${normalizeAddress(address)}::${path}`
}

function isTxHash(value: unknown): value is Hash {
  return typeof value === 'string' && TX_HASH_RE.test(value)
}

function sanitizeEvidence(
  evidence: UnknownReceiptLatchEvidence | undefined,
): LatchEvidence | undefined {
  if (!evidence) return undefined
  const hash = isTxHash(evidence.hash) ? (evidence.hash.toLowerCase() as Hash) : undefined
  if (!hash) return undefined
  return { hash }
}

function parseLatches(raw: string): PersistedLatch[] {
  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed)) return []
  const out: PersistedLatch[] = []
  for (const item of parsed) {
    if (
      !item ||
      typeof item !== 'object' ||
      typeof (item as PersistedLatch).address !== 'string' ||
      typeof (item as PersistedLatch).path !== 'string'
    ) {
      continue
    }
    const address = normalizeAddress((item as PersistedLatch).address)
    const path = (item as PersistedLatch).path
    const evidence = sanitizeEvidence({
      hash: (item as PersistedLatch).hash as Hash | undefined,
    })
    out.push({
      address,
      path,
      ...(evidence?.hash ? { hash: evidence.hash } : {}),
    })
  }
  return out
}

function readStorageItem(key: string): string | null {
  try {
    if (typeof sessionStorage === 'undefined') return null
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function readPersistedLatches(): PersistedLatch[] {
  try {
    const v3 = readStorageItem(STORAGE_KEY)
    if (v3) return parseLatches(v3)
    const v2 = readStorageItem(STORAGE_KEY_V2)
    if (!v2) return []
    const entries = parseLatches(v2)
    writePersistedLatches(entries)
    return entries
  } catch {
    return []
  }
}

function writePersistedLatches(entries: PersistedLatch[]): void {
  try {
    if (typeof sessionStorage === 'undefined') return
    sessionStorage.removeItem(STORAGE_KEY_V1)
    sessionStorage.removeItem(STORAGE_KEY_V2)
    if (entries.length === 0) {
      sessionStorage.removeItem(STORAGE_KEY)
      return
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // 隐私模式 / 配额满：内存锁仍有效
  }
}

function persistLatches(): void {
  const entries: PersistedLatch[] = []
  for (const key of latchedOwners.keys()) {
    const sep = key.indexOf('::')
    if (sep <= 0) continue
    const evidence = latchedEvidence.get(key)
    entries.push({
      address: key.slice(0, sep),
      path: key.slice(sep + 2),
      ...(evidence?.hash ? { hash: evidence.hash } : {}),
    })
  }
  writePersistedLatches(entries)
}

function hydratePersistedLatches(): void {
  for (const entry of readPersistedLatches()) {
    const key = latchKey(entry.address, entry.path as WritePath)
    if (!latchedOwners.has(key)) {
      latchedOwners.set(key, Symbol(`persisted:${key}`))
    }
    const evidence = sanitizeEvidence({
      hash: entry.hash as Hash | undefined,
    })
    if (evidence) latchedEvidence.set(key, evidence)
  }
}

hydratePersistedLatches()

function notifyWritePathBusy(): void {
  for (const listener of listeners) listener()
}

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

let writeHashListener: ((hash: Hash) => void) | undefined

/**
 * 本次提交广播出 hash 时回调（信封用来把 hash 写进闩，供刷新后续等）。
 *
 * @param onHash 拿到交易 hash 时的回调
 * @returns 取消监听
 */
export function listenForWriteHash(onHash: (hash: Hash) => void): () => void {
  writeHashListener = onHash
  return () => {
    if (writeHashListener === onHash) writeHashListener = undefined
  }
}

/** 写路径在 `eth_sendTransaction` 返回 hash 后通知信封。 */
export function notifyWriteHash(hash: Hash): void {
  writeHashListener?.(hash)
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
 * 能拿到的交易 hash 一并写入，供刷新后同一 wait 续等。
 *
 * @param path 写路径键
 * @param owner 本次提交令牌（由 tryBeginWritePath 返回）
 * @param address 钱包地址
 * @param evidence 可选交易 hash
 */
export function lockUnknownReceipt(
  path: WritePath,
  owner: symbol,
  address: string,
  evidence?: UnknownReceiptLatchEvidence,
): void {
  const key = latchKey(address, path)
  latchedOwners.set(key, owner)
  const sanitized = sanitizeEvidence(evidence)
  if (sanitized) latchedEvidence.set(key, sanitized)
  persistLatches()
  notifyWritePathBusy()
}

/**
 * 读取已上闩条目上的 hash；无证据返回 undefined。
 *
 * @param path 写路径键
 * @param address 钱包地址
 */
export function getUnknownReceiptLatchEvidence(
  path: WritePath,
  address: string | undefined,
): UnknownReceiptLatchEvidence | undefined {
  if (!address) return undefined
  return latchedEvidence.get(latchKey(address, path))
}

/**
 * 列出当前全部未知回执闩，供启动后续等。
 */
export function listUnknownReceiptLatches(): UnknownReceiptLatch[] {
  const out: UnknownReceiptLatch[] = []
  for (const key of latchedOwners.keys()) {
    const sep = key.indexOf('::')
    if (sep <= 0) continue
    const evidence = latchedEvidence.get(key)
    out.push({
      address: key.slice(0, sep),
      path: key.slice(sep + 2) as WritePath,
      ...(evidence?.hash ? { hash: evidence.hash } : {}),
    })
  }
  return out
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
  if (latchedEvidence.delete(key)) changed = true
  if (REWARD_WRITE_PATHS.has(path) && path !== WRITE_PATH.REWARD_CLAIM) {
    const legacyKey = latchKey(address, WRITE_PATH.REWARD_CLAIM)
    if (latchedOwners.delete(legacyKey)) changed = true
    if (latchedEvidence.delete(legacyKey)) changed = true
  }
  if (!changed) return
  persistLatches()
  notifyWritePathBusy()
}

/**
 * 观察到链上终态后强制开闩（刷新后 Symbol 对不上，不配对 owner）。
 *
 * @param path 写路径键
 * @param address 钱包地址
 * @returns 确实清掉了一条闩时返回 true
 */
export function settleUnknownReceiptLock(path: WritePath, address: string): boolean {
  if (!isUnknownReceiptLocked(path, address)) return false
  clearUnknownReceiptLock(path, address)
  return true
}

/** 仅单测重置。 */
export function resetUnknownReceiptLocksForTests(): void {
  latchedOwners.clear()
  latchedEvidence.clear()
  inFlightPaths.clear()
  writePersistedLatches([])
  notifyWritePathBusy()
}

/** 单测：清空内存后从 sessionStorage 再读入（模拟刷新页面）。 */
export function rehydrateUnknownReceiptLocksForTests(): void {
  latchedOwners.clear()
  latchedEvidence.clear()
  inFlightPaths.clear()
  hydratePersistedLatches()
  notifyWritePathBusy()
}
