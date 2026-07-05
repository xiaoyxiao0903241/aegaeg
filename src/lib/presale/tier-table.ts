import { PERSONAL_PRESALE_RANK_THRESHOLDS_USD } from '~/lib/presale/rank'
import { TEAM_LEG_REQUIREMENT_RANKS, TEAM_PRESALE_RANK_THRESHOLDS_USD } from '~/lib/presale/tier-progress'

const TEAM_BONUS_RATES = [
  '1%',
  '2%',
  '3%',
  '4%',
  '5%',
  '6%',
  '7%',
  '8%',
  '9%',
  '10%',
] as const

/** Caps commitment-floor A-tier from /performance presale_commitment_floor_rank (max A13; S max remains S10). */
export const MAX_COMMITMENT_FLOOR_A_RANK = 13

export function resolveCommitmentFloorRank(apiRank: number): number {
  if (!Number.isFinite(apiRank) || apiRank <= 0) return 0
  return Math.min(MAX_COMMITMENT_FLOOR_A_RANK, Math.trunc(apiRank))
}

export const REWARD_TIER_ROW_COUNT = PERSONAL_PRESALE_RANK_THRESHOLDS_USD.length

export function getTeamBonusRateLabel(rank: number): string {
  if (rank <= 0) return TEAM_BONUS_RATES[0]
  const index = Math.min(rank - 1, TEAM_BONUS_RATES.length - 1)
  return TEAM_BONUS_RATES[index]
}

/** Commitment floor rank maps 1:1 to A-tier (floor 3 → A3). */
export function getCommitmentFloorPostLaunchLabel(floorRank: number): string {
  if (floorRank <= 0) return ''
  const aRank = Math.min(floorRank, MAX_COMMITMENT_FLOOR_A_RANK)
  return `A${aRank}`
}

/** 30-day boost after commitment floor: floor rank + 1 (floor 3 → A4). */
export function getCommitmentFloorBoostedPostLaunchLabel(floorRank: number): string {
  if (floorRank <= 0) return ''
  const aRank = Math.min(floorRank + 1, MAX_COMMITMENT_FLOOR_A_RANK)
  return `A${aRank}`
}

/** Hide 30-day boost copy when already at max A-tier (A13). */
export function shouldShowCommitmentFloorBoostLabel(floorRank: number): boolean {
  return floorRank > 0 && floorRank < MAX_COMMITMENT_FLOOR_A_RANK
}

function formatUsdThreshold(value: number): string {
  return `$${value.toLocaleString('en-US')}`
}

function formatMinPersonalContribution(value: number): string {
  return `≥ ${formatUsdThreshold(value)}`
}

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
    return formatUsdThreshold(TEAM_PRESALE_RANK_THRESHOLDS_USD[rank - 1])
  }

  return '-'
}

export function buildRewardTierRows(): readonly (readonly string[])[] {
  return PERSONAL_PRESALE_RANK_THRESHOLDS_USD.map((personalUsd, index) => {
    const rank = index + 1
    return [
      `S${rank}`,
      formatMinPersonalContribution(personalUsd),
      formatTeamRequirement(rank),
      TEAM_BONUS_RATES[index],
    ]
  })
}
