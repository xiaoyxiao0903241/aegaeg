import { calcProgressPercent } from '../api/format-display'
import { PERSONAL_PRESALE_RANK_THRESHOLDS_USD } from './rank'

export const TEAM_PRESALE_RANK_THRESHOLDS_USD = [5000, 10000, 30000] as const

const MAX_PRESALE_RANK = PERSONAL_PRESALE_RANK_THRESHOLDS_USD.length

/** Team leg requirements for S4–S6 (rank index 3–5). */
export const TEAM_LEG_REQUIREMENT_RANKS = [3, 4, 5] as const

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

export function resolveNextPresaleRank(currentRank: number): number | null {
  const normalized = Number.isFinite(currentRank) ? Math.max(0, Math.trunc(currentRank)) : 0
  if (normalized >= MAX_PRESALE_RANK) return null
  return normalized <= 0 ? 1 : normalized + 1
}

export function buildNextTierProgress(
  currentRank: number,
  personalVolumeUsd: number,
  teamVolumeUsd: number,
): NextTierProgress {
  const normalizedRank = Number.isFinite(currentRank) ? Math.max(0, Math.trunc(currentRank)) : 0
  const personalCurrentUsd = Math.max(0, Number(personalVolumeUsd) || 0)
  const teamCurrentUsd = Math.max(0, Number(teamVolumeUsd) || 0)
  const nextRank = resolveNextPresaleRank(normalizedRank)

  if (nextRank == null) {
    const maxPersonalTarget = PERSONAL_PRESALE_RANK_THRESHOLDS_USD[MAX_PRESALE_RANK - 1]
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
      teamLegRank: TEAM_LEG_REQUIREMENT_RANKS[TEAM_LEG_REQUIREMENT_RANKS.length - 1],
      teamProgressPercent: null,
      teamRemainingUsd: null,
    }
  }

  const personalTargetUsd = PERSONAL_PRESALE_RANK_THRESHOLDS_USD[nextRank - 1]
  const personalRemainingUsd = Math.max(0, personalTargetUsd - personalCurrentUsd)
  const teamTargetUsd =
    nextRank <= TEAM_PRESALE_RANK_THRESHOLDS_USD.length
      ? TEAM_PRESALE_RANK_THRESHOLDS_USD[nextRank - 1]
      : null
  const teamLegRank =
    nextRank > TEAM_PRESALE_RANK_THRESHOLDS_USD.length
      ? TEAM_LEG_REQUIREMENT_RANKS[nextRank - TEAM_PRESALE_RANK_THRESHOLDS_USD.length - 1]
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
