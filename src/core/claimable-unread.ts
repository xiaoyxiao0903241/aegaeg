/**
 * 可领红点：两种模式共用 `isClaimableDotLit`。
 *
 * - `balance`（涡轮 / 奖励 / 释放完成 / 缓冲完成）：投影非空就亮，本地 ack 不参与。
 * - `event`（定期质押 / 债券到期）：当前身份有不在 ack 里的才亮；进入子页后并入 ack。
 *
 * 投影只决定谁进当前集合。滴漏、活期、X 挖矿、持仓发息不进集合。
 * `balance` 身份不含金额，避免额变被当成新事件。
 *
 * @see docs/onchain-manual/contracts/rewardqueue.md
 * @see docs/onchain-manual/contracts/turbine.md
 * @see docs/onchain-manual/contracts/aegissplitter.md
 */

/** 欠账钉住 vs 到期看过即焚。 */
export type ClaimableDotKind = 'balance' | 'event'

/** 欠账类非空投影的占位身份；金额不进集合。 */
export const CLAIMABLE_BALANCE_ID = 'pending'

/**
 * 红点是否应亮。
 *
 * 空投影永不亮。`balance` 只看当前非空；`event` 看当前相对 ack 的差集（禁止字符串整段相等）。
 *
 * @param kind 红点模式
 * @param current 当前投影指纹；无事为 `''`
 * @param ack `event` 已确认身份；从未写过为 null。`balance` 忽略
 */
export function isClaimableDotLit(
  kind: ClaimableDotKind,
  current: string,
  ack: string | null | undefined,
): boolean {
  if (current === '') return false
  if (kind === 'balance') return true
  const seen = new Set(parseFingerprintIds(ack ?? ''))
  return parseFingerprintIds(current).some((id) => !seen.has(id))
}

/**
 * 把一组身份 id 收成稳定指纹；空列表为空串。
 *
 * @param ids 无序、可重复的身份片段
 */
export function fingerprintIdList(ids: readonly string[]): string {
  return [...new Set(ids.filter((id) => id.length > 0))].sort().join('|')
}

/** 把 `|` 拼接的指纹拆成身份。 */
export function parseFingerprintIds(fingerprint: string): string[] {
  if (!fingerprint) return []
  return fingerprint.split('|').filter((id) => id.length > 0)
}

/**
 * `event` ack 单调并：进入子页时把当前身份并入已看过的集合，禁止用当前指纹覆盖。
 *
 * @param ack 已确认指纹
 * @param current 当前投影
 */
export function mergeAckFingerprint(ack: string | null | undefined, current: string): string {
  return fingerprintIdList([...parseFingerprintIds(ack ?? ''), ...parseFingerprintIds(current)])
}

export type ReleaseQueueFingerprintPlan = {
  planIndex: number
  total: bigint
  /** 整档已解锁可领；完成判定用这个，不用当前 50 条窗。 */
  overallClaimable: bigint
  /** 尚未线性释放；完成后为 0。 */
  releasing: bigint
}

/**
 * 释放队列投影：仅纳入已释放完成且整档仍可领的档。
 *
 * 完成 = `releasing === 0` 且 `overallClaimable > 0`。滴漏中途（releasing > 0）不进。
 * 部分领取后 overall 仍大于 0 则继续亮。
 *
 * @param plans 队列各档快照
 */
export function fingerprintReleaseQueue(plans: readonly ReleaseQueueFingerprintPlan[]): string {
  return fingerprintIdList(
    plans
      .filter((plan) => plan.releasing === 0n && plan.overallClaimable > 0n)
      .map((plan) => `${plan.planIndex}:${plan.total}`),
  )
}

export type ReleaseBufferFingerprintInput = {
  agxClaimable: bigint
  gagxClaimable: bigint
  agxReleasing: bigint
  gagxReleasing: bigint
}

function bufferBucketComplete(claimable: bigint, releasing: bigint): boolean {
  return releasing === 0n && claimable > 0n
}

/**
 * 缓冲池投影：AGX / gAGX 桶各自「释放完成且还可领」才纳入。
 *
 * @param input 缓冲池可领与尚未释放
 */
export function fingerprintReleaseBuffer(input: ReleaseBufferFingerprintInput): string {
  const ids: string[] = []
  if (bufferBucketComplete(input.agxClaimable, input.agxReleasing)) ids.push('agx')
  if (bufferBucketComplete(input.gagxClaimable, input.gagxReleasing)) ids.push('gagx')
  return fingerprintIdList(ids)
}

export type LuckyFingerprintInput = {
  claimable: boolean
  totalUnclaimedAmount: bigint
}

/**
 * 幸运奖欠账投影：可领且合计未领 > 0 则为占位身份，不含金额。
 *
 * @param snap 幸运奖领取快照；缺数为空
 */
export function fingerprintLucky(snap: LuckyFingerprintInput | null | undefined): string {
  if (!snap?.claimable || snap.totalUnclaimedAmount <= 0n) return ''
  return CLAIMABLE_BALANCE_ID
}

/**
 * 正数金额 → 欠账占位；缺数、非有限、≤0 为空。金额本身不进指纹。
 *
 * @param value 数字或十进制字符串
 */
export function fingerprintPositiveDecimal(value: number | string | null | undefined): string {
  if (value == null) return ''
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value <= 0) return ''
    return CLAIMABLE_BALANCE_ID
  }
  const trimmed = value.trim()
  if (!trimmed) return ''
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed) || parsed <= 0) return ''
  return CLAIMABLE_BALANCE_ID
}

function isUnixReached(at: bigint, nowSec: number): boolean {
  if (at <= 0n) return false
  return nowSec >= Number(at)
}

export type AssetsStakeExpiryRow = {
  id: string
  kind: 'liquid' | 'locked' | 'early'
  expiry: bigint
}

export type AssetsBondExpiryRow = {
  id: string
  vestingEndTime: bigint
}

/**
 * 质押到期投影：只认定期 / 共建 unix `expiry` 已到。活期永不纳入。
 *
 * 身份是 `id:expiry`。未到期即使已有 claimable 也不纳入。
 *
 * @param rows 资产质押仓位
 * @param nowSec 当前 unix 秒
 * @see docs/onchain-manual/contracts/lockedstaking.md
 * @see docs/onchain-manual/contracts/earlystaking.md
 */
export function fingerprintAssetsStakeExpiry(
  rows: readonly AssetsStakeExpiryRow[],
  nowSec: number,
): string {
  return fingerprintIdList(
    rows.flatMap((row) => {
      if (row.kind === 'liquid') return []
      if (!isUnixReached(row.expiry, nowSec)) return []
      return [`${row.id}:${row.expiry}`]
    }),
  )
}

/**
 * 债券到期投影：只认 `vestingEndTime` 已到的仓；身份是 `id:vestingEndTime`。
 *
 * 未到期的 `pendingPayout` 滴漏不造点。
 *
 * @param rows 资产债券仓位
 * @param nowSec 当前 unix 秒
 * @see docs/onchain-manual/01-frontend-integration-guide.md
 */
export function fingerprintAssetsBondExpiry(
  rows: readonly AssetsBondExpiryRow[],
  nowSec: number,
): string {
  return fingerprintIdList(
    rows.flatMap((row) =>
      isUnixReached(row.vestingEndTime, nowSec) ? [`${row.id}:${row.vestingEndTime}`] : [],
    ),
  )
}
