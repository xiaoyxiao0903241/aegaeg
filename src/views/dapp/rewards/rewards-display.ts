import type {
  CommunityFundLogItem,
  RewardLogItem,
  TeamRewardClaimLogItem,
} from '~/shared/api/types'
import {
  TABLE_EMPTY,
  formatApiDateTime,
  formatBlockTime,
  formatShortAddress,
  formatTableGenesisRank,
  formatUsd,
} from '~/shared/api/format-display'

export type RewardLogStatusKey =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'claimed'
  | 'failed'
  | 'unknown'

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

function formatOrderAmountUsd(orderAmount: string | undefined): string {
  const num = Number(orderAmount)
  if (!Number.isFinite(num) || num <= 0) return TABLE_EMPTY
  return formatUsd(num, 0)
}

export function claimableAmountValue(total: string, claimed: string): number {
  const pending = Math.max(0, Number(total) - Number(claimed))
  return Number.isFinite(pending) ? pending : 0
}

export function formatClaimableAmount(total: string, claimed: string): string {
  return formatUsd(claimableAmountValue(total, claimed), 2)
}

export function formatCommunityFundLockedAmount(
  total: string,
  claimed: string,
  unlockedClaimable: string,
): string {
  const locked = Math.max(
    0,
    Number(total) - Number(claimed) - Number(unlockedClaimable),
  )
  return formatUsd(locked, 2)
}

export function mapRewardLogToRow(
  item: RewardLogItem,
  labels: RewardLogStatusLabels,
): string[] {
  const signedAmount = Number(item.amount)
  const amountLabel = Number.isFinite(signedAmount)
    ? formatUsd(Math.abs(signedAmount), 2)
    : TABLE_EMPTY

  return [
    formatBlockTime(item.block_time),
    amountLabel,
    formatShortAddress(item.from_address),
    formatOrderAmountUsd(item.order_amount),
    formatRewardStatus(item.status, labels),
  ]
}

export function mapTeamRewardClaimLogToRow(
  item: TeamRewardClaimLogItem,
  labels: RewardLogStatusLabels,
): string[] {
  const amountNum = Number(item.amount)
  const amountLabel = Number.isFinite(amountNum)
    ? formatUsd(Math.abs(amountNum), 2)
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
    ? formatUsd(Math.abs(amountNum), 2)
    : TABLE_EMPTY
  const statusKey = resolveCommunityFundLogStatusKey(item.status)

  return [
    formatBlockTime(item.block_time),
    amountLabel,
    labels[statusKey],
  ]
}
