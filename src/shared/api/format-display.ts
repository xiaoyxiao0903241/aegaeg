import type {
  CommunityFundLogItem,
  RewardLogItem,
  TeamReferralItem,
  TeamRewardClaimLogItem,
} from '~/shared/api/types'
import { getRuntimeHost } from '~/shared/lib/runtime-host'

/** Empty / unknown placeholder for table cells (ASCII hyphen, not em dash). */
export const TABLE_EMPTY = '-'

export function formatPresaleRank(rank: number): string {
  if (!Number.isFinite(rank) || rank <= 0) return 'S0'
  return `S${rank}`
}

/** Community member table — missing rank or S0 shows `-`, otherwise S1–S10. */
export function formatTableGenesisRank(rank: number | undefined | null): string {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return TABLE_EMPTY
  return `S${Math.trunc(rank)}`
}

/** Maps API presale_rank (S1=1 …) to 0-based row indices in the tier table. */
export function getPresaleRankHighlightedRows(
  rank: number | undefined,
  rowCount: number,
): number[] {
  if (rank == null || !Number.isFinite(rank) || rank <= 0 || rowCount <= 0) return []
  const index = Math.min(Math.trunc(rank) - 1, rowCount - 1)
  return index >= 0 ? [index] : []
}

export function formatShareholderHintForRank(
  rank: number,
  template: string,
  fallback: string,
  tierRows: readonly (readonly string[])[],
): string {
  if (!Number.isFinite(rank) || rank <= 0 || rank > tierRows.length) return fallback
  const row = tierRows[rank - 1]
  if (!row || !template) return fallback
  return template.replace('{bonus}', row[3])
}

export function formatUsd(value: string | number, fractionDigits = 0): string {
  const num = Number(value)
  if (!Number.isFinite(num)) return '$0'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(num)
}

/** Tooltip / hint copy — `5,000 USD` (no leading currency symbol). */
export function formatUsdAmountLabel(value: string | number, fractionDigits = 0): string {
  const num = Number(value)
  if (!Number.isFinite(num)) return '0 USD'

  const amount = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(num)

  return `${amount} USD`
}

export function formatBlockTime(timestamp: number): string {
  if (!timestamp) return '—'

  const date = new Date(timestamp * 1000)
  return formatDateTimeParts(date)
}

export function formatCount(value: number | string | bigint): string {
  const num = Number(value)
  if (!Number.isFinite(num)) return '0'
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatApiDateTime(iso: string | null): string {
  if (!iso) return '—'

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'

  return formatDateTimeParts(date)
}

function formatDateTimeParts(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${month}-${day} ${hours}:${minutes}`
}

export function formatRegisterDate(iso: string | null): string {
  if (!iso) return TABLE_EMPTY
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return TABLE_EMPTY

  return date.toISOString().slice(0, 10)
}

/** Community member table address — Figma `0x05…E515` (4 chars + ellipsis + last 4). */
export function formatInviteMemberAddress(address: string): string {
  if (address.length < 9) return address
  return `${address.slice(0, 4)}…${address.slice(-4)}`
}

export function formatShortAddress(address: string): string {
  if (address.length < 10) return address
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function formatDiscountBps(discountBps: number): string {
  if (!Number.isFinite(discountBps) || discountBps <= 0) return '—'
  return `-${discountBps / 100}%`
}

export function formatRewardStatus(
  status: number,
  labels: RewardLogStatusLabels,
): string {
  return labels[resolveRewardLogStatusKey(status)]
}

export type RewardLogStatusKey =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'claimed'
  | 'failed'
  | 'unknown'

export type RewardLogStatusLabels = Record<RewardLogStatusKey, string>

export function resolveRewardLogStatusKey(status: number): RewardLogStatusKey {
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
export function resolveTeamRewardClaimStatusKey(status: number): RewardLogStatusKey {
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

export function resolveCommunityFundLogStatusKey(status: number): RewardLogStatusKey {
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

export function formatClaimableAmount(total: string, claimed: string): string {
  const pending = Math.max(0, Number(total) - Number(claimed))
  return formatUsd(pending, 2)
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

export function calcProgressPercent(current: string | number, target: string | number): number {
  const currentNum = Number(current)
  const targetNum = Number(target)
  if (!Number.isFinite(currentNum) || !Number.isFinite(targetNum) || targetNum <= 0) {
    return 0
  }

  return Math.min(100, (currentNum / targetNum) * 100)
}

export function mapTeamReferralToCompactRow(item: TeamReferralItem): string[] {
  return [
    formatRegisterDate(item.register_time),
    formatInviteMemberAddress(item.address),
    formatTableUsdAmount(item.presale_volume),
    formatTableGenesisRank(item.presale_rank),
    formatCount(item.direct_referral_count ?? 0),
    formatTableVolume(item.sales_team_market),
  ]
}

function formatTableUsdAmount(value: string | number | undefined | null): string {
  const num = Number(value)
  if (!Number.isFinite(num) || num <= 0) return TABLE_EMPTY
  return formatUsd(num)
}

function formatTableVolume(value: string | number | undefined | null): string {
  const num = Number(value)
  if (!Number.isFinite(num)) return TABLE_EMPTY
  return formatCount(num)
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

function formatOrderAmountUsd(orderAmount: string | undefined): string {
  const num = Number(orderAmount)
  if (!Number.isFinite(num) || num <= 0) return TABLE_EMPTY
  return formatUsd(num, 0)
}

export function mapTeamRewardClaimLogToRow(
  item: TeamRewardClaimLogItem,
  labels: {
    logStatus: RewardLogStatusLabels
  },
): string[] {
  const amountNum = Number(item.amount)
  const amountLabel = Number.isFinite(amountNum)
    ? formatUsd(Math.abs(amountNum), 2)
    : TABLE_EMPTY
  const statusKey = resolveTeamRewardClaimStatusKey(item.status)
  const statusLabel = labels.logStatus[statusKey]

  return [
    formatApiDateTime(item.claimed_at ?? item.created_at),
    amountLabel,
    formatTableGenesisRank(item.presale_rank),
    statusLabel,
  ]
}

export function mapCommunityFundLogToRow(
  item: CommunityFundLogItem,
  labels: {
    logStatus: RewardLogStatusLabels
  },
): string[] {
  const amountNum = Number(item.amount)
  const amountLabel = Number.isFinite(amountNum)
    ? formatUsd(Math.abs(amountNum), 2)
    : TABLE_EMPTY
  const statusKey = resolveCommunityFundLogStatusKey(item.status)
  const statusLabel = labels.logStatus[statusKey]

  return [
    formatBlockTime(item.block_time),
    amountLabel,
    statusLabel,
  ]
}

/** Sidebar display: host + shortened address (Figma `aegis-x.io/r/0x8F32…91A2`). */
export function formatReferralLinkDisplay(address: string): string {
  return `${getRuntimeHost()}/r/${formatShortAddress(address)}`
}
