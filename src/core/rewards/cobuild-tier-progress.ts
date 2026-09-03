/**
 * 共建档位进度：AGX 量 ↔ USD 门槛（有价才比）。
 *
 * @see docs/backend-api/api.md #rank-reward/summary（active_stake_balance / making_market / other_lines_market 为 AGX）
 */

export type TierReqBadge = { kind: 'achieved' } | { kind: 'pct'; value: string } | { kind: 'empty' }

/** AGX 数量折 USD 供与 `$` 门槛比较；无有效单价 → null（禁 AGX↔$ 直比）。 */
export function agxAmountToUsdProgressCurrent(
  agxAmount: number,
  agxPriceUsd: number | null | undefined,
): number | null {
  if (!(agxAmount >= 0) || !Number.isFinite(agxAmount)) return null
  if (agxPriceUsd == null || !(agxPriceUsd > 0) || !Number.isFinite(agxPriceUsd)) return null
  return agxAmount * agxPriceUsd
}

export function parseMoneyish(raw: string | null | undefined): number | null {
  if (raw == null) return null
  const n = Number(String(raw).replace(/[$,%\s,]/g, ''))
  return Number.isFinite(n) ? n : null
}

/** 需求进度徽章：已达成 | n%（含 0%）| 无数字门槛 / 缺 current 则不画 */
export function progressPct(current: number | null, targetRaw: string): TierReqBadge {
  const target = parseMoneyish(targetRaw)
  if (current == null) return { kind: 'empty' }
  if (target == null || target <= 0) return { kind: 'empty' }
  if (current >= target) return { kind: 'achieved' }
  const pct = Math.max(0, Math.min(99, Math.floor((current / target) * 100)))
  return { kind: 'pct', value: `${pct}%` }
}

/**
 * 双线徽章：是否达成以后端 `is_dual_line_qualified` 为准；条数只用来画未达成时的百分比。
 *
 * @param count `qualified_direct_rank_count`
 * @param qualified `is_dual_line_qualified`；缺任一则不画
 * @param target 门槛条数（现为 2）
 */
export function dualLineProgressBadge(
  count: number | null,
  qualified: boolean | null,
  target: number,
): TierReqBadge {
  if (count == null || qualified == null) return { kind: 'empty' }
  if (qualified) return { kind: 'achieved' }
  return progressPct(count, String(target))
}
