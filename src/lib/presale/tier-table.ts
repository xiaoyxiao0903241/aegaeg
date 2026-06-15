import { PERSONAL_PRESALE_RANK_THRESHOLDS_USD } from './rank'
import { TEAM_LEG_REQUIREMENT_RANKS, TEAM_PRESALE_RANK_THRESHOLDS_USD } from './tier-progress'

const TEAM_BONUS_RATES = ['1%', '2%', '3%', '4%', '5%', '6%'] as const
const POST_LAUNCH_RANKS = ['A2', 'A3', 'A4', 'A5', 'A6', 'A7'] as const

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

/** Rewards All Tiers table rows (aligned with tier-progress thresholds). */
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

export function buildMobileRewardTierRows(): readonly (readonly string[])[] {
  return buildRewardTierRows()
    .slice(0, 4)
    .map(([title, personalContribution, , bonusRate, postLaunchRank]) => [
      title,
      personalContribution,
      bonusRate,
      postLaunchRank,
    ])
}
