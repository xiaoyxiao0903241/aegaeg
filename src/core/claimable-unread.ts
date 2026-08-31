/**
 * 可领红点是否未读：空态永不亮；有可领且指纹与上次在子页看到的不同才亮。
 *
 * 指纹是锅的身份（档位本金、已到期冷却 index、到期仓 id、轮次），不是此刻可领 wei。
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
  totalUnclaimedAmount: bigint
}

/**
 * 幸运奖指纹：可领时用合计未领；不可领或合计为 0 为空。
 *
 * @param snap 幸运奖领取快照；缺数为空
 */
export function fingerprintLucky(snap: LuckyFingerprintInput | null | undefined): string {
  if (!snap?.claimable || snap.totalUnclaimedAmount <= 0n) return ''
  return snap.totalUnclaimedAmount.toString()
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

function isUnixReached(at: bigint, nowSec: number): boolean {
  if (at <= 0n) return false
  return nowSec >= Number(at)
}

export type AssetsStakeExpiryRow = {
  id: string
  kind: 'liquid' | 'locked' | 'early'
  expiry: bigint
  inWarmup?: boolean
  warmupExpired?: boolean
}

export type AssetsBondExpiryRow = {
  id: string
  vestingEndTime: bigint
}

export type AssetsXmineExpiryInput = {
  warmupGons: bigint
  warmupEndTime: bigint
}

/**
 * 质押到期指纹：活期只认预热已过；定期只认 unix `expiry` 已到。
 *
 * 身份是 `id:expiry`，不含可赎本金。未到期即使已有 claimable 也不纳入。
 *
 * @param rows 资产质押仓位
 * @param nowSec 当前 unix 秒（定期倒计时用）
 * @see docs/onchain-manual/contracts/lockedstaking.md
 * @see docs/onchain-manual/contracts/earlystaking.md
 * @see docs/onchain-manual/contracts/liquidstaking.md
 */
export function fingerprintAssetsStakeExpiry(
  rows: readonly AssetsStakeExpiryRow[],
  nowSec: number,
): string {
  return fingerprintIdList(
    rows.flatMap((row) => {
      if (row.kind === 'liquid') {
        if (!row.inWarmup || !row.warmupExpired) return []
        return [`${row.id}:${row.expiry}`]
      }
      if (!isUnixReached(row.expiry, nowSec)) return []
      return [`${row.id}:${row.expiry}`]
    }),
  )
}

/**
 * 债券到期指纹：只认 `vestingEndTime` 已到的仓；身份是 `id:vestingEndTime`。
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

/**
 * X 挖矿到期指纹：仅预热仓已过 `warmupEndTime` 时亮；身份含结束时间以免下一轮同槽吞掉。
 *
 * 已激活的挖矿本金可随时解绑，不算到期。
 *
 * @param snap X 挖矿仓位；缺数为空
 * @param nowSec 当前 unix 秒
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export function fingerprintAssetsXmineExpiry(
  snap: AssetsXmineExpiryInput | null | undefined,
  nowSec: number,
): string {
  if (!snap || snap.warmupGons <= 0n) return ''
  if (!isUnixReached(snap.warmupEndTime, nowSec)) return ''
  return `warmup:${snap.warmupEndTime}`
}
