/**
 * 可领红点是否未读：空态永不亮；有可领且指纹与上次在子页看到的不同才亮。
 *
 * 指纹是锅的身份（档位本金、已到期冷却 index、轮次），不是此刻可领 wei。
 * 线性释放滴漏不会重新点亮；领到 0 后若在子页聚焦会把 seen 写成空，下一锅才会再亮。
 *
 * @param current 当前指纹；无源可领为 `''`
 * @param seen 该地址+源上次在子页写下的指纹；从未写过为 null
 * @returns 是否应显示红点
 * @see docs/onchain-manual/contracts/rewardqueue.md
 * @see docs/onchain-manual/contracts/turbine.md
 */
export function isUnread(current: string, seen: string | null | undefined): boolean {
  if (current === '') return false
  return current !== (seen ?? '')
}

/**
 * 把一组身份 id 收成稳定指纹；空列表为空串。
 *
 * @param ids 无序、可重复的身份片段
 */
export function fingerprintIdList(ids: readonly string[]): string {
  return [...new Set(ids.filter((id) => id.length > 0))].sort().join('|')
}

export type ReleaseQueueFingerprintPlan = {
  planIndex: number
  total: bigint
  claimable: bigint
}

/**
 * 释放队列指纹：仅纳入此刻有可领的档；身份是 `planIndex:total`（本金），不含可领 wei。
 *
 * @param plans 队列各档快照
 */
export function fingerprintReleaseQueue(plans: readonly ReleaseQueueFingerprintPlan[]): string {
  return fingerprintIdList(
    plans.filter((plan) => plan.claimable > 0n).map((plan) => `${plan.planIndex}:${plan.total}`),
  )
}

export type ReleaseBufferFingerprintInput = {
  agxClaimable: bigint
  gagxClaimable: bigint
  agxAmount: bigint
  gagxAmount: bigint
}

/**
 * 缓冲池指纹：无可领为空；有可领则用 AGX/gAGX 本金，滴漏不改变指纹。
 *
 * @param input 缓冲池可领与本金
 */
export function fingerprintReleaseBuffer(input: ReleaseBufferFingerprintInput): string {
  if (input.agxClaimable <= 0n && input.gagxClaimable <= 0n) return ''
  return `${input.agxAmount}|${input.gagxAmount}`
}

export type LuckyFingerprintInput = {
  claimable: boolean
  rewardAmount: bigint
  roundId: bigint
}

/**
 * 幸运奖指纹：可领时用 roundId；不可领或金额为 0 为空。
 *
 * @param snap 幸运奖领取快照；缺数为空
 */
export function fingerprintLucky(snap: LuckyFingerprintInput | null | undefined): string {
  if (!snap?.claimable || snap.rewardAmount <= 0n) return ''
  return snap.roundId.toString()
}

/**
 * 正数金额指纹（奖励卡 API / 链上换算后的预览）。
 *
 * @param value 数字或十进制字符串；缺数、非有限、≤0 为空
 */
export function fingerprintPositiveDecimal(value: number | string | null | undefined): string {
  if (value == null) return ''
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value <= 0) return ''
    return String(value)
  }
  const trimmed = value.trim()
  if (!trimmed) return ''
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed) || parsed <= 0) return ''
  return trimmed
}
