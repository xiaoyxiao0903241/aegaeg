import type {
  CommunityFundLogItem,
  RewardLogItem,
  TeamRewardClaimLogItem,
} from '~/shared/api/types'
import {
  formatGroupedNumber,
  TABLE_EMPTY,
  formatApiDateTime,
  formatBlockTime,
  formatShortAddress,
  formatTableGenesisRank,
} from '~/shared/api/format-display'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import type { DurationPlan } from '~/core/assets/claim-plans'
import type { RewardsView } from '~/shared/config/rewards-deep-link'

/** Em dash placeholder for unset rewards UI values. */
export const REWARDS_DASH = '—'
export const REWARDS_LOADING = '…'

export type MixedClaimView = Extract<RewardsView, 'lucky' | 'cobuild'>

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

function resolveRewardLogStatusKey(status: number): RewardLogStatusKey {
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
function resolveTeamRewardClaimStatusKey(status: number): RewardLogStatusKey {
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

function resolveCommunityFundLogStatusKey(status: number): RewardLogStatusKey {
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
  return labels[resolveRewardLogStatusKey(status)]
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
  const statusKey = resolveTeamRewardClaimStatusKey(item.status)

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
  const statusKey = resolveCommunityFundLogStatusKey(item.status)

  return [formatBlockTime(item.block_time), amountLabel, labels[statusKey]]
}
