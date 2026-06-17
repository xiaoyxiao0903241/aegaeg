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
  if (rank <= 0) return TEAM_BONUS_RATES[1]
  const index = Math.min(rank - 1, TEAM_BONUS_RATES.length - 1)
  return TEAM_BONUS_RATES[index]
}

function formatUsdThreshold(value: number): string {
  return `$${value.toLocaleString('en-US')}`
}

function formatTeamRequirement(rank: number): string {
  if (rank <= TEAM_PRESALE_RANK_THRESHOLDS_USD.length) {
    return formatUsdThreshold(TEAM_PRESALE_RANK_THRESHOLDS_USD[rank - 1])
  }

  const legRank = TEAM_LEG_REQUIREMENT_RANKS[rank - TEAM_PRESALE_RANK_THRESHOLDS_USD.length - 1]
  return `Two legs S${legRank}`
}

export function buildRewardTierRows(): readonly (readonly string[])[] {
  return PERSONAL_PRESALE_RANK_THRESHOLDS_USD.map((personalUsd, index) => {
    const rank = index + 1
    return [
      `S${rank}`,
      formatUsdThreshold(personalUsd),
      formatTeamRequirement(rank),
      TEAM_BONUS_RATES[index],
      POST_LAUNCH_RANKS[index],
    ]
  })
}
