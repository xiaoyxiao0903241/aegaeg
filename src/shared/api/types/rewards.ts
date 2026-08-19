import type { DaoGrantStatus } from '~/shared/api/types/claim'
import type { PaginationParams } from '~/shared/api/types/common'

export interface LuckyRewardSummary {
  date: string
  today_total_prize: string
  is_winner: boolean
  win_count: number
}

export interface LuckyRewardMyRoundItem {
  date: string | null
  round_id: number
  participation_amount: string
  is_winner: boolean
  rank: number | null
  reward_amount: string
  draw_tx_hash: string | null
  winner_status: string | null
  claim_status: string | null
  claim_tx_hash: string | null
  claim_timestamp: number | null
}

export interface LuckyRewardWinnerItem {
  rank: number
  address: string
  participation_amount: string
  reward_amount: string
}

export interface LuckyRewardWinnersResponse {
  date: string
  draw_tx_hash: string | null
  items: LuckyRewardWinnerItem[]
}

export interface MarketAllowanceSummary {
  making_rank: number
  total_allowance: string
  total_claimed_allowance: string
  unlockable_allowance: string
  unlocked_claimable: string
}

export interface MarketAllowanceClaimLogItem {
  claim_time: number
  allowance_amount: string
  tx_hash: string | null
}

export interface MarketAllowancePaidLogItem {
  paid_time: number
  agx_amount: string
  operation_type: '质押' | '赎回'
  tx_hash: string | null
  subsidy_rate: string
  allowance_amount: string
}

export interface ParticipationAwardSummary {
  total_participation_reward: string
  active_stake_balance: string
  available_contribution: string
}

export interface ParticipationAwardLogItem {
  created_at: string | null
  status: DaoGrantStatus
  fully_claimed_at: string | null
  awarded_gross: string
}

export interface ParticipationAwardInviter {
  bound_at: string | null
  address: string
  active_stake_balance: string
  total_brought_reward: string
}

export interface ParticipationAwardInviterResponse {
  inviter: ParticipationAwardInviter | null
}

export interface RankRewardSummary {
  total_rank_reward: string
  making_market: string
  direct_referral_count: number
  effective_direct_referral_count: number
  making_rank: number
  active_stake_balance: string
  available_contribution: string
}

export interface RankRewardLogItem {
  benefit_level: number
  created_at: string | null
  status: DaoGrantStatus
  fully_claimed_at: string | null
  awarded_gross: string
}

export interface RankRewardPeerSurpassLogItem {
  benefit_level: number
  created_at: string | null
  status: DaoGrantStatus
  fully_claimed_at: string | null
  awarded_gross: string
}

export interface RankRewardTeamMemberItem {
  bound_at: string | null
  address: string
  making_market: string
  making_rank: number
}

export interface RankRewardTeamMembersParams extends PaginationParams {
  sort_bound_at?: 'asc' | 'desc'
  sort_making_market?: 'asc' | 'desc'
  sort_making_rank?: 'asc' | 'desc'
  hide_zero_market?: boolean
}

export interface ReferralAwardSummary {
  total_referral_reward: string
  active_stake_balance: string
  direct_referral_count: number
  available_contribution: string
}

export interface ReferralAwardLogItem {
  created_at: string | null
  status: DaoGrantStatus
  fully_claimed_at: string | null
  awarded_gross: string
}

export interface ReferralAwardDirectReferralItem {
  bound_at: string | null
  address: string
  active_stake_balance: string
  contributed_reward_total: string
}

export interface ReferralAwardDirectReferralsParams extends PaginationParams {
  hide_zero_position?: boolean
}
