function amountOrZero(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0
}

/**
 * 资产 Hub 左卡：总收益 = 已领 + 未领；占比 = 总收益 / 实际投资。
 *
 * 缺数、非法、负数一律当 0（展示 0.00 / 0.00%），不用 —。
 * 投资 ≤ 0 时占比为 0，避免除零。
 *
 * @param args.claimed 接口已领（与未领同单位）
 * @param args.unclaimed 链上当前可领
 * @param args.invest 接口实际投资（分母）
 * @returns 总收益与占比（百分数，如 1.4 表示 1.40%）
 * @see src/views/dapp/assets/hub/use-hub.ts
 */
export function assetsHubProductReturn(args: {
  claimed: number
  unclaimed: number
  invest: number
}): { totalReward: number; pct: number } {
  const totalReward = amountOrZero(args.claimed) + amountOrZero(args.unclaimed)
  const invest = amountOrZero(args.invest)
  if (!(invest > 0)) return { totalReward, pct: 0 }
  const pct = (totalReward / invest) * 100
  if (!Number.isFinite(pct) || pct < 0) return { totalReward, pct: 0 }
  return { totalReward, pct }
}

/**
 * 已领 X 按当前「每 X 的 AGX」折成 gAGX（gAGX 与 AGX 1:1）。
 *
 * 缺数量或缺汇率 → 0。
 *
 * @param xAmount 已领 X（人类可读）
 * @param agxPerX 1 X 折合 AGX
 */
export function xRewardToGagx(xAmount: number, agxPerX: number): number {
  const x = amountOrZero(xAmount)
  const rate = amountOrZero(agxPerX)
  if (!(x > 0) || !(rate > 0)) return 0
  const gagx = x * rate
  return Number.isFinite(gagx) && gagx > 0 ? gagx : 0
}
