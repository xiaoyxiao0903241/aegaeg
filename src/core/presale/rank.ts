/** 个人贡献金额门槛（S1–S10，与奖励等级表对齐）。 */
export const PERSONAL_PRESALE_RANK_THRESHOLDS_USD = [
  500, 1000, 2000, 3000, 5000, 10_000, 10_000, 10_000, 10_000, 20_000,
] as const

/** 最高预售等级 = 门槛数组长度（S10）。 */
export const MAX_PRESALE_RANK = PERSONAL_PRESALE_RANK_THRESHOLDS_USD.length

/**
 * 规范化 API 返回的预售等级（S1=1 起）用于展示。
 *
 * 只做夹取不做推断：非法或非正返回 0，超上限截断到最高等级。
 *
 * @param apiRank API 返回的等级
 * @returns 展示用等级
 */
export function displayPresaleRank(apiRank: number): number {
  if (!Number.isFinite(apiRank) || apiRank <= 0) return 0
  return Math.min(MAX_PRESALE_RANK, Math.trunc(apiRank))
}
