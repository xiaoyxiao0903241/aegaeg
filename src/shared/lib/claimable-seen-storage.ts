/**
 * 可领红点「已看过」指纹的本地存储。
 *
 * 按钱包地址 + 源（涡轮 / 释放池 / 缓冲池 / 奖励卡）记下用户上次在子页聚焦时的指纹。
 * 读失败一律视为从未看过（null），避免脏数据把红点永久掐灭。
 *
 * @see src/core/claimable-unread.ts
 */

export const CLAIMABLE_SEEN_STORAGE_KEY = 'aegis.claimable-seen.v1'

export type ClaimableSeenSource =
  | 'exchange.turbine'
  | 'release.queue'
  | 'release.buffer'
  | 'rewards.lucky'
  | 'rewards.grant'
  | 'rewards.genesis'

type SeenMap = Record<string, Partial<Record<ClaimableSeenSource, string>>>

const listeners = new Set<() => void>()

function emit(): void {
  for (const listener of listeners) listener()
}

/** 订阅 seen 写入；供 `useSyncExternalStore`。 */
export function subscribeClaimableSeen(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange)
  return () => {
    listeners.delete(onStoreChange)
  }
}

function parseSeenMap(raw: string | null): SeenMap {
  if (!raw) return {}
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return parsed as SeenMap
  } catch {
    return {}
  }
}

function addressKey(address: string): string {
  return address.trim().toLowerCase()
}

/**
 * 读取某地址某源上次看过的指纹。
 *
 * @param address 钱包地址
 * @param source 红点源
 * @param storage 存储对象，默认 localStorage
 * @returns 指纹；从未写过或读失败为 null
 */
export function readClaimableSeen(
  address: string,
  source: ClaimableSeenSource,
  storage: Pick<Storage, 'getItem'> = localStorage,
): string | null {
  const key = addressKey(address)
  if (!key) return null
  const value = parseSeenMap(storage.getItem(CLAIMABLE_SEEN_STORAGE_KEY))[key]?.[source]
  return typeof value === 'string' ? value : null
}

/**
 * 写入某地址某源当前指纹（含空串，表示聚焦时已无可领）。
 *
 * @param address 钱包地址
 * @param source 红点源
 * @param fingerprint 当前指纹
 * @param storage 存储对象，默认 localStorage
 */
export function writeClaimableSeen(
  address: string,
  source: ClaimableSeenSource,
  fingerprint: string,
  storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage,
): void {
  const key = addressKey(address)
  if (!key) return
  const map = parseSeenMap(storage.getItem(CLAIMABLE_SEEN_STORAGE_KEY))
  const current = map[key]?.[source]
  if (current === fingerprint) return
  map[key] = { ...map[key], [source]: fingerprint }
  storage.setItem(CLAIMABLE_SEEN_STORAGE_KEY, JSON.stringify(map))
  emit()
}
