import { PERSONAL_PRESALE_RANK_THRESHOLDS_USD } from '~/core/presale/rank'
import {
  TEAM_LEG_REQUIREMENT_RANKS,
  TEAM_PRESALE_RANK_THRESHOLDS_USD,
} from '~/core/presale/tier-progress'

/** 各等级团队奖励比例文案（S1–S10）。 */
const TEAM_BONUS_RATES = ['1%', '2%', '3%', '4%', '5%', '6%', '7%', '8%', '9%', '10%'] as const

/**
 * 承诺门槛在 A 档的最高等级（上限 A13）。
 *
 * 门槛等级来自做市概览接口的承诺门槛字段；S 档最高仍是 S10。
 */
export const MAX_COMMITMENT_FLOOR_A_RANK = 13

/**
 * 规范化承诺门槛等级（上限 A13）。
 *
 * @param apiRank API 返回的等级
 * @returns 0–13 的门槛等级；非法或非正返回 0
 */
export function commitmentFloorRank(apiRank: number): number {
  if (!Number.isFinite(apiRank) || apiRank <= 0) return 0
  return Math.min(MAX_COMMITMENT_FLOOR_A_RANK, Math.trunc(apiRank))
}

/**
 * 按等级返回团队奖励比例文案，超上限时取最高档。
 *
 * @param rank 等级
 * @returns 比例文案
 */
export function getTeamBonusRateLabel(rank: number): string {
  if (rank <= 0) return TEAM_BONUS_RATES[0] ?? '1%'
  const index = Math.min(rank - 1, TEAM_BONUS_RATES.length - 1)
  return TEAM_BONUS_RATES[index] ?? TEAM_BONUS_RATES[0] ?? '1%'
}

/**
 * 承诺门槛对应的 A 档标签（门槛 3 → A3）。
 *
 * @param floorRank 门槛等级
 * @returns A 档标签；非正返回空字符串
 */
export function getCommitmentFloorPostLaunchLabel(floorRank: number): string {
  if (floorRank <= 0) return ''
  const aRank = Math.min(floorRank, MAX_COMMITMENT_FLOOR_A_RANK)
  return `A${aRank}`
}

/**
 * 承诺门槛 30 天提升后的 A 档标签（门槛 + 1，上限 A13）。
 *
 * @param floorRank 门槛等级
 * @returns 提升后的 A 档标签；非正返回空字符串
 */
export function getCommitmentFloorBoostedPostLaunchLabel(floorRank: number): string {
  if (floorRank <= 0) return ''
  const aRank = Math.min(floorRank + 1, MAX_COMMITMENT_FLOOR_A_RANK)
  return `A${aRank}`
}

/**
 * 承诺门槛的 30 天提升 / 已达最高档文案。
 *
 * 已达最高档时返回 maxRankCopy，否则用模板替换提升后的等级。
 *
 * @param floorRank 门槛等级
 * @param options.boostTemplate 提升文案模板（{rank} 占位）
 * @param options.maxRankCopy 已达最高档文案
 * @returns 文案；门槛非正返回 undefined
 */
export function commitmentFloorBoostCopy(
  floorRank: number,
  options: {
    boostTemplate: string
    maxRankCopy: string
  },
): string | undefined {
  if (floorRank <= 0) return undefined
  if (floorRank >= MAX_COMMITMENT_FLOOR_A_RANK) return options.maxRankCopy
  return options.boostTemplate.replace(
    '{rank}',
    getCommitmentFloorBoostedPostLaunchLabel(floorRank),
  )
}

function formatUsdThreshold(value: number): string {
  return `$${value.toLocaleString('en-US')}`
}

function formatMinPersonalContribution(value: number): string {
  return `≥ ${formatUsdThreshold(value)}`
}

/**
 * 等级要求的团队腿等级。
 *
 * 早期等级按团队金额门槛，更高等级要求两条团队腿；金额门槛阶段返回 null。
 *
 * @param rank 等级
 * @returns 要求的团队腿等级；无需团队腿返回 null
 */
export function getTeamRequirementLegRank(rank: number): number | null {
  if (rank <= TEAM_PRESALE_RANK_THRESHOLDS_USD.length) return null
  return TEAM_LEG_REQUIREMENT_RANKS[rank - TEAM_PRESALE_RANK_THRESHOLDS_USD.length - 1] ?? null
}

function formatTeamRequirement(rank: number): string {
  const legRank = getTeamRequirementLegRank(rank)
  if (legRank != null) {
    return `Two legs S${legRank}`
  }

  if (rank <= TEAM_PRESALE_RANK_THRESHOLDS_USD.length) {
    const threshold = TEAM_PRESALE_RANK_THRESHOLDS_USD[rank - 1]
    if (threshold == null) return '-'
    return formatUsdThreshold(threshold)
  }

  return '-'
}

/**
 * 奖励等级表行（个人门槛 / 团队要求 / 团队奖励比例）。
 *
 * @returns 每行四列的字符串数组
 * @see 手册 §6.1 页面用途
 */
export function rewardTierRows(): readonly (readonly string[])[] {
  return PERSONAL_PRESALE_RANK_THRESHOLDS_USD.map((personalUsd, index) => {
    const rank = index + 1
    return [
      `S${rank}`,
      formatMinPersonalContribution(personalUsd),
      formatTeamRequirement(rank),
      TEAM_BONUS_RATES[index] ?? TEAM_BONUS_RATES[0] ?? '1%',
    ]
  })
}
