import type {
  CommunityFundLogItem,
  DaoGrantStatus,
  LuckyRewardMyRoundItem,
  LuckyRewardWinnerItem,
  MarketAllowanceClaimLogItem,
  MarketAllowancePaidLogItem,
  ParticipationAwardInviter,
  ParticipationAwardLogItem,
  RankRewardLogItem,
  RankRewardPeerSurpassLogItem,
  RankRewardTeamMemberItem,
  ReferralAwardDirectReferralItem,
  ReferralAwardLogItem,
  RewardLogItem,
  TeamRewardClaimLogItem,
} from '~/shared/api/types'
import {
  formatGroupedNumber,
  TABLE_EMPTY,
  formatApiDateTime,
  formatBlockTime,
  formatRegisterDate,
  formatShortAddress,
  formatTableGenesisRank,
} from '~/shared/api/format-display'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import type { DurationPlan } from '~/core/assets/claim-plans'
import type { RewardsView } from '~/shared/config/rewards-deep-link'

/** Em dash placeholder for unset rewards UI values. */
export const REWARDS_DASH = '—'
export const REWARDS_LOADING = '…'

export type MixedClaimView = Extract<RewardsView, 'lucky' | 'cobuild' | 'participate' | 'referral'>

/** Backend SUM / decimal-string amounts → grouped display (never invent). */
export function formatApiDecimalAmount(
  raw: string | null | undefined,
  options: { digits?: number; prefix?: string; suffix?: string } = {},
): string {
  if (raw == null || raw.trim() === '') return REWARDS_DASH
  const n = Number(raw)
  if (!Number.isFinite(n)) return REWARDS_DASH
  return formatGroupedNumber(n, {
    digits: options.digits ?? 2,
    prefix: options.prefix,
    suffix: options.suffix,
  })
}

export function formatApiStatLabel(
  sessionReady: boolean,
  isPending: boolean,
  raw: string | null | undefined,
  options?: { digits?: number; prefix?: string; suffix?: string },
): string {
  if (!sessionReady) return REWARDS_DASH
  if (isPending && raw == null) return REWARDS_LOADING
  return formatApiDecimalAmount(raw, options)
}

function formatDaoGrantStatus(status: DaoGrantStatus, labels: RewardLogStatusLabels): string {
  switch (status) {
    case 'READY':
      return labels.pending
    case 'RESERVED':
    case 'PARTIALLY_CLAIMED':
      return labels.processing
    case 'CLAIMED':
      return labels.claimed
    case 'CANCELLED':
      return labels.failed
    default:
      return labels.unknown
  }
}

export function formatMakingRankLabel(rank: number | null | undefined, emptyLabel: string): string {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return emptyLabel
  return String(Math.trunc(rank))
}

export function planLabel(
  days: number,
  plans: readonly DurationPlan[] | undefined,
  daysTax: string,
  daysOnly: string,
  taxRate: string,
): string {
  const plan = plans?.find(
    (p) => p.exists !== false && Number(p.durationSeconds / 86_400n) === days,
  )
  if (plan?.taxBps != null) {
    const tax = taxRate.replace('{rate}', String(Number(plan.taxBps) / 100))
    return daysTax.replace('{days}', String(days)).replace('{tax}', tax)
  }
  return daysOnly.replace('{days}', String(days))
}

export function splitAmountByPct(amount: bigint, pct: number): bigint {
  return (amount * BigInt(pct)) / 100n
}

/** Placeholder for contribution snapshot: disconnected / loading / value. */
export function formatContributionPlaceholder(input: {
  walletReady: boolean
  hasAddress: boolean
  isPending: boolean
  contribution: bigint | undefined
  decimals: number
  fractionDigits?: number
}): string {
  if (!input.walletReady || !input.hasAddress) return REWARDS_DASH
  if (input.isPending) return REWARDS_LOADING
  if (input.contribution === undefined) return REWARDS_DASH
  return formatTokenAmount(input.contribution, input.decimals, input.fractionDigits ?? 2)
}

export type RewardLogStatusKey =
  'pending' | 'processing' | 'paid' | 'claimed' | 'failed' | 'unknown'

export type RewardLogStatusLabels = Record<RewardLogStatusKey, string>

function rewardLogStatusKey(status: number): RewardLogStatusKey {
  switch (status) {
    case 0:
      return 'pending'
    case 1:
      return 'processing'
    case 2:
      return 'paid'
    case 3:
      return 'failed'
    default:
      return 'unknown'
  }
}

/** reward_claim_orders: 0=待领取, 1=已领取, 2=已领取, 3=领取失败 */
function teamRewardClaimStatusKey(status: number): RewardLogStatusKey {
  switch (status) {
    case 0:
      return 'pending'
    case 1:
    case 2:
      return 'paid'
    case 3:
      return 'failed'
    default:
      return 'unknown'
  }
}

function communityFundLogStatusKey(status: number): RewardLogStatusKey {
  switch (status) {
    case 0:
      return 'pending'
    case 1:
      return 'claimed'
    case 2:
      return 'paid'
    case 3:
      return 'failed'
    default:
      return 'unknown'
  }
}

function formatRewardStatus(status: number, labels: RewardLogStatusLabels): string {
  return labels[rewardLogStatusKey(status)]
}

export function claimableAmountValue(total: string, claimed: string): number {
  const pending = Math.max(0, Number(total) - Number(claimed))
  return Number.isFinite(pending) ? pending : 0
}

export function mapRewardLogToRow(item: RewardLogItem, labels: RewardLogStatusLabels): string[] {
  const signedAmount = Number(item.amount)
  const amountLabel = Number.isFinite(signedAmount)
    ? formatGroupedNumber(Math.abs(signedAmount), { digits: 2, prefix: '$' })
    : TABLE_EMPTY
  const orderAmount = Number(item.order_amount)
  const orderLabel =
    Number.isFinite(orderAmount) && orderAmount > 0
      ? formatGroupedNumber(orderAmount, { digits: 0, prefix: '$' })
      : TABLE_EMPTY

  return [
    formatBlockTime(item.block_time),
    amountLabel,
    formatShortAddress(item.from_address),
    orderLabel,
    formatRewardStatus(item.status, labels),
  ]
}

export function mapTeamRewardClaimLogToRow(
  item: TeamRewardClaimLogItem,
  labels: RewardLogStatusLabels,
): string[] {
  const amountNum = Number(item.amount)
  const amountLabel = Number.isFinite(amountNum)
    ? formatGroupedNumber(Math.abs(amountNum), { digits: 2, prefix: '$' })
    : TABLE_EMPTY
  const statusKey = teamRewardClaimStatusKey(item.status)

  return [
    formatApiDateTime(item.claimed_at ?? item.created_at),
    amountLabel,
    formatTableGenesisRank(item.presale_rank),
    labels[statusKey],
  ]
}

export function mapCommunityFundLogToRow(
  item: CommunityFundLogItem,
  labels: RewardLogStatusLabels,
): string[] {
  const amountNum = Number(item.amount)
  const amountLabel = Number.isFinite(amountNum)
    ? formatGroupedNumber(Math.abs(amountNum), { digits: 2, prefix: '$' })
    : TABLE_EMPTY
  const statusKey = communityFundLogStatusKey(item.status)

  return [formatBlockTime(item.block_time), amountLabel, labels[statusKey]]
}

export function mapParticipationAwardLogToRow(
  item: ParticipationAwardLogItem,
  labels: RewardLogStatusLabels,
): string[] {
  return [
    formatApiDateTime(item.created_at),
    formatApiDecimalAmount(item.awarded_gross),
    formatDaoGrantStatus(item.status, labels),
    formatApiDateTime(item.fully_claimed_at),
  ]
}

export function mapParticipationAwardInviterToRow(item: ParticipationAwardInviter): string[] {
  return [
    formatApiDateTime(item.bound_at),
    formatShortAddress(item.address),
    formatApiDecimalAmount(item.active_stake_balance),
    formatApiDecimalAmount(item.total_brought_reward),
  ]
}

export function mapRankRewardLogToRow(
  item: RankRewardLogItem | RankRewardPeerSurpassLogItem,
  labels: RewardLogStatusLabels,
): string[] {
  return [
    formatApiDateTime(item.created_at),
    String(item.benefit_level),
    formatApiDecimalAmount(item.awarded_gross),
    formatDaoGrantStatus(item.status, labels),
    formatApiDateTime(item.fully_claimed_at),
  ]
}

export function mapRankRewardTeamMemberToRow(item: RankRewardTeamMemberItem): string[] {
  return [
    formatApiDateTime(item.bound_at),
    formatShortAddress(item.address),
    formatApiDecimalAmount(item.making_market),
    formatMakingRankLabel(item.making_rank, TABLE_EMPTY),
  ]
}

export function mapReferralAwardLogToRow(
  item: ReferralAwardLogItem,
  labels: RewardLogStatusLabels,
): string[] {
  return [
    formatApiDateTime(item.created_at),
    formatApiDecimalAmount(item.awarded_gross),
    formatDaoGrantStatus(item.status, labels),
    formatApiDateTime(item.fully_claimed_at),
  ]
}

export function mapReferralAwardDirectToRow(item: ReferralAwardDirectReferralItem): string[] {
  return [
    formatApiDateTime(item.bound_at),
    formatShortAddress(item.address),
    formatApiDecimalAmount(item.active_stake_balance),
    formatApiDecimalAmount(item.contributed_reward_total),
  ]
}

export function mapMarketAllowancePaidLogToRow(item: MarketAllowancePaidLogItem): string[] {
  return [
    formatBlockTime(item.paid_time),
    formatApiDecimalAmount(item.agx_amount),
    item.operation_type || TABLE_EMPTY,
    item.tx_hash ? formatShortAddress(item.tx_hash) : TABLE_EMPTY,
    item.subsidy_rate || TABLE_EMPTY,
    formatApiDecimalAmount(item.allowance_amount),
  ]
}

export function mapMarketAllowanceClaimLogToRow(item: MarketAllowanceClaimLogItem): string[] {
  return [
    formatBlockTime(item.claim_time),
    formatApiDecimalAmount(item.allowance_amount),
    item.tx_hash ? formatShortAddress(item.tx_hash) : TABLE_EMPTY,
  ]
}

export function mapLuckyWinnerToRow(item: LuckyRewardWinnerItem): string[] {
  return [
    String(item.rank),
    formatShortAddress(item.address),
    formatApiDecimalAmount(item.participation_amount),
    formatApiDecimalAmount(item.reward_amount),
  ]
}

export function mapLuckyMyRoundToRow(item: LuckyRewardMyRoundItem): string[] {
  const result =
    item.winner_status?.trim() ||
    (item.is_winner === true ? '1' : item.is_winner === false ? TABLE_EMPTY : TABLE_EMPTY)
  return [
    formatRegisterDate(item.date),
    formatApiDecimalAmount(item.participation_amount),
    result,
    item.draw_tx_hash ? formatShortAddress(item.draw_tx_hash) : TABLE_EMPTY,
  ]
}
