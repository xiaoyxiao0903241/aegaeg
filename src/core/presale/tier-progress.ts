import { calcProgressPercent } from '~/core/math/calc-progress-percent'
import { MAX_PRESALE_RANK, PERSONAL_PRESALE_RANK_THRESHOLDS_USD } from '~/core/presale/rank'

/** 团队贡献金额门槛（早期等级）；更高等级改以团队腿为要求。 */
export const TEAM_PRESALE_RANK_THRESHOLDS_USD = [5000, 10_000, 30_000] as const

/** 需要两条团队腿的等级索引（S4–S10，即索引 3–9）。 */
export const TEAM_LEG_REQUIREMENT_RANKS = [3, 4, 5, 6, 7, 8, 9] as const

/** 下一等级进度：个人 / 团队当前值、目标、剩余与进度百分比。 */
export type NextTierProgress = {
  currentRank: number
  isMaxRank: boolean
  nextRank: number
  personalCurrentUsd: number
  personalTargetUsd: number
  personalRemainingUsd: number
  personalProgressPercent: number
  teamCurrentUsd: number
  teamTargetUsd: number | null
  teamLegRank: number | null
  teamProgressPercent: number | null
  teamRemainingUsd: number | null
}

function nextPresaleRank(currentRank: number): number | null {
  const normalized = Number.isFinite(currentRank) ? Math.max(0, Math.trunc(currentRank)) : 0
  if (normalized >= MAX_PRESALE_RANK) return null
  return normalized <= 0 ? 1 : normalized + 1
}

/**
 * 计算下一等级的进度（个人 + 团队）。
 *
 * 当前已是最高等级时返回 isMaxRank=true，团队维度置空；目标等级需要
 * 团队腿时 teamTargetUsd 为 null、改用 teamLegRank 表达。
 *
 * @param currentRank 当前等级
 * @param personalVolumeUsd 个人贡献金额
 * @param teamVolumeUsd 团队贡献金额
 * @returns 下一等级进度
 * @see 手册 §6.1 页面用途
 */
export function nextTierProgress(
  currentRank: number,
  personalVolumeUsd: number,
  teamVolumeUsd: number,
): NextTierProgress {
  const normalizedRank = Number.isFinite(currentRank) ? Math.max(0, Math.trunc(currentRank)) : 0
  const personalCurrentUsd = Math.max(0, Number(personalVolumeUsd) || 0)
  const teamCurrentUsd = Math.max(0, Number(teamVolumeUsd) || 0)
  const nextRank = nextPresaleRank(normalizedRank)

  if (nextRank == null) {
    const maxPersonalTarget =
      PERSONAL_PRESALE_RANK_THRESHOLDS_USD[MAX_PRESALE_RANK - 1] ??
      PERSONAL_PRESALE_RANK_THRESHOLDS_USD[0] ??
      0
    const maxTeamLegRank = TEAM_LEG_REQUIREMENT_RANKS[TEAM_LEG_REQUIREMENT_RANKS.length - 1] ?? null
    return {
      currentRank: normalizedRank,
      isMaxRank: true,
      nextRank: MAX_PRESALE_RANK,
      personalCurrentUsd,
      personalTargetUsd: maxPersonalTarget,
      personalRemainingUsd: 0,
      personalProgressPercent: 100,
      teamCurrentUsd,
      teamTargetUsd: null,
      teamLegRank: maxTeamLegRank,
      teamProgressPercent: null,
      teamRemainingUsd: null,
    }
  }

  // nextRank ∈ 1..MAX 且 MAX === thresholds.length → 索引必有值。
  const personalTargetUsd = PERSONAL_PRESALE_RANK_THRESHOLDS_USD[nextRank - 1]
  if (personalTargetUsd == null) {
    throw new Error(`PRESALE_RANK_THRESHOLD_MISSING:${nextRank}`)
  }

  const personalRemainingUsd = Math.max(0, personalTargetUsd - personalCurrentUsd)
  const teamTargetUsd =
    nextRank <= TEAM_PRESALE_RANK_THRESHOLDS_USD.length
      ? (TEAM_PRESALE_RANK_THRESHOLDS_USD[nextRank - 1] ?? null)
      : null
  const teamLegRank =
    nextRank > TEAM_PRESALE_RANK_THRESHOLDS_USD.length
      ? (TEAM_LEG_REQUIREMENT_RANKS[nextRank - TEAM_PRESALE_RANK_THRESHOLDS_USD.length - 1] ?? null)
      : null
  const teamRemainingUsd =
    teamTargetUsd == null ? null : Math.max(0, teamTargetUsd - teamCurrentUsd)

  return {
    currentRank: normalizedRank,
    isMaxRank: false,
    nextRank,
    personalCurrentUsd,
    personalTargetUsd,
    personalRemainingUsd,
    personalProgressPercent: calcProgressPercent(personalCurrentUsd, personalTargetUsd),
    teamCurrentUsd,
    teamTargetUsd,
    teamLegRank,
    teamProgressPercent:
      teamTargetUsd == null ? null : calcProgressPercent(teamCurrentUsd, teamTargetUsd),
    teamRemainingUsd,
  }
}
