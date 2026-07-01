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
const POST_LAUNCH_RANKS = [
  'A2',
  'A3',
  'A4',
  'A5',
  'A6',
  'A7',
  'A8',
  'A9',
  'A10',
  'A11',
] as const

export const REWARD_TIER_ROW_COUNT = PERSONAL_PRESALE_RANK_THRESHOLDS_USD.length

export function getTeamBonusRateLabel(rank: number): string {
  if (rank <= 0) return TEAM_BONUS_RATES[0]
  const index = Math.min(rank - 1, TEAM_BONUS_RATES.length - 1)
  return TEAM_BONUS_RATES[index]
}

export function getPostLaunchRankLabel(rank: number): string {
  if (rank <= 0) return ''
  const index = Math.min(rank - 1, POST_LAUNCH_RANKS.length - 1)
  return POST_LAUNCH_RANKS[index]
}

export function getBoostedPostLaunchRankLabel(rank: number): string {
  if (rank <= 0) return ''
  const boostedRank = Math.min(rank + 1, POST_LAUNCH_RANKS.length)
  return POST_LAUNCH_RANKS[boostedRank - 1]
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
      POST_LAUNCH_RANKS[index],
    ]
  })
}
