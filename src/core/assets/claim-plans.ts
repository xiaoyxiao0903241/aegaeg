/**
 * Mixed 领取的释放 / 复投计划档位（纯数据与匹配逻辑）。
 *
 * UI 的天数选项与链上计划按秒级时长匹配：释放计划进 RewardQueue，
 * 复投计划进 RestakeConfig；天数档位与开放质押的活期 / 180 天等无对应关系。
 */

export const RELEASE_DURATION_DAYS = [5, 20, 40, 60] as const
export type ReleaseDurationDays = (typeof RELEASE_DURATION_DAYS)[number]

export const RESTAKE_DURATION_DAYS = [360, 540] as const
export type RestakeDurationDays = (typeof RESTAKE_DURATION_DAYS)[number]

export const SECONDS_PER_DAY = 86_400n

export type DurationPlan = {
  /** 链上数组原始索引（RewardQueue 释放计划 / RestakeConfig 复投计划）。 */
  index: number
  /** 计划时长（秒）。 */
  durationSeconds: bigint
  /** 复投计划的可选税率（RestakeConfig taxBP，仅用于展示）。 */
  taxBps?: bigint
  exists?: boolean
}

/**
 * 按天数（秒）匹配 UI 档位到链上计划索引。
 *
 * 未匹配到计划时返回 null，调用方须中止提交——写参数需要计划索引；
 * `exists === false` 的停用计划跳过。
 *
 * @param plans 链上计划列表
 * @param days 界面选择的天数
 * @returns 匹配的计划索引；无匹配返回 null
 * @see 手册 §9.3 Mixed 领奖前端流程
 */
export function matchPlanIndexByDurationDays(
  plans: readonly DurationPlan[],
  days: number,
): number | null {
  const target = BigInt(days) * SECONDS_PER_DAY
  for (const plan of plans) {
    if (plan.exists === false) continue
    if (plan.durationSeconds === target) return plan.index
  }
  return null
}

export type ClaimPlanBundle = {
  releasePlans: readonly DurationPlan[]
  restakePlans: readonly DurationPlan[]
}

/**
 * 同时解析释放与复投计划索引（UI / 提交 / 写前复核共用）。
 *
 * @param plans 计划包；未加载时为 null / undefined
 * @param releaseDays 释放天数
 * @param restakeDays 复投天数
 * @returns 释放与复投索引；计划未加载或任一无匹配则为 null
 * @see 手册 §9.3 Mixed 领奖前端流程
 */
export function matchClaimPlanIndices(
  plans: ClaimPlanBundle | null | undefined,
  releaseDays: number,
  restakeDays: number,
): { releaseIndex: number | null; restakeIndex: number | null } {
  if (!plans) return { releaseIndex: null, restakeIndex: null }
  return {
    releaseIndex: matchPlanIndexByDurationDays(plans.releasePlans, releaseDays),
    restakeIndex: matchPlanIndexByDurationDays(plans.restakePlans, restakeDays),
  }
}

/**
 * 复投百分比（0–100）转 bps（0–10000）。
 *
 * 合约 restakeBps 以 10000 为分母，前端输入按百分比换算，先夹取为整数。
 *
 * @param restakePct 复投百分比
 * @returns 0–10000 的 bps 值
 * @see 手册 §9.1 Mixed 领奖概念
 */
export function restakeBpsFromPct(restakePct: number): number {
  const pct = Math.min(100, Math.max(0, Math.round(restakePct)))
  return pct * 100
}

/**
 * 计划档位选项文案（释放 / 复投天数，可选税率后缀）。
 *
 * 核心层不引入 i18n；调用方传入模板，`{days}` / `{tax}` / `{rate}` 占位替换。
 *
 * @param days 界面选择的天数
 * @param plans 链上计划列表（可选）
 * @param daysTax 含税文案模板
 * @param daysOnly 纯天数文案模板
 * @param taxRate 税率文案模板
 * @returns 计划选项文案
 * @see 手册 §9.1 Mixed 领奖概念
 */
export function planLabel(
  days: number,
  plans: readonly DurationPlan[] | undefined,
  daysTax: string,
  daysOnly: string,
  taxRate: string,
): string {
  const target = BigInt(days) * SECONDS_PER_DAY
  const plan = plans?.find((p) => p.exists !== false && p.durationSeconds === target)
  if (plan?.taxBps != null) {
    const tax = taxRate.replace('{rate}', String(Number(plan.taxBps) / 100))
    return daysTax.replace('{days}', String(days)).replace('{tax}', tax)
  }
  return daysOnly.replace('{days}', String(days))
}

/**
 * 释放百分比夹取到 0–100 整数（滑块与拆分计算的唯一取值入口）。
 *
 * @param releasePct 原始释放百分比
 * @returns 0–100 的整数
 */
export function clampReleasePct(releasePct: number): number {
  return Math.min(100, Math.max(0, Math.round(releasePct)))
}

/**
 * 释放百分比换算复投百分比，两者恒等于 100%。
 *
 * @param releasePct 释放百分比
 * @returns 释放与复投百分比
 */
export function claimSplitFromReleasePct(releasePct: number): {
  releasePct: number
  restakePct: number
} {
  const release = clampReleasePct(releasePct)
  return { releasePct: release, restakePct: 100 - release }
}
