import type { RewardLogItem, SalesLogItem, TeamReferralItem, TeamRewardClaimLogItem } from '~/lib/api/types'
import { estimateAgxFromUsd1 } from '~/lib/presale/presale-math'
import { PRESALE_CONFIG } from '~/config/presale'

/** Empty / unknown placeholder for table cells (ASCII hyphen, not em dash). */
export const TABLE_EMPTY = '-'

export function formatPresaleRank(rank: number): string {
  if (!Number.isFinite(rank) || rank <= 0) return 'S0'
  return `S${rank}`
}

/** Community invite table — missing rank shows `-`, otherwise S0–S10. */
export function formatTableGenesisRank(rank: number | undefined | null): string {
  if (rank == null || !Number.isFinite(rank) || rank < 0) return TABLE_EMPTY
  return `S${Math.trunc(rank)}`
}

/** Community member table — S0 or missing rank shows placeholder, otherwise S1–S10. */
export function formatMemberGenesisTitle(rank: number | undefined): string {
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

export function getPresaleRankHighlightedRowsForPage(
  rank: number | undefined,
  rowCount: number,
  page: number,
  pageSize: number,
): number[] {
  const pageStart = (page - 1) * pageSize
  return getPresaleRankHighlightedRows(rank, rowCount)
    .map((index) => index - pageStart)
    .filter((index) => index >= 0 && index < pageSize)
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
  return template.replace('{bonus}', row[3]).replace('{postLaunch}', row[4])
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

export function formatUsdCompact(value: string | number): string {
  const num = Number(value)
  if (!Number.isFinite(num)) return '$0'

  if (num >= 1_000_000) {
    return `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(num / 1_000_000)}M`
  }

  if (num >= 1_000) {
    return `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(num / 1_000)}K`
  }

  return formatUsd(num)
}

export function formatAmountToken(amount: string, symbol: string): string {
  const num = Number(amount)
  if (!Number.isFinite(num)) return `0 ${symbol}`

  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)} ${symbol}`
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

export function formatPaidAmountCompact(amount: string): string {
  const num = Number(amount)
  if (!Number.isFinite(num)) return '—'

  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num)
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

function resolvePhaseDiscountBps(phaseId: number): number {
  if (!Number.isFinite(phaseId) || phaseId < 0) return 0
  return PRESALE_CONFIG.phases[phaseId]?.discountBps ?? 0
}

export function formatRewardStatus(
  status: number,
  labels: RewardLogStatusLabels,
): string {
  return labels[resolveRewardLogStatusKey(status)]
}

export const REWARD_TYPE_I18N_KEYS = {
  referral_paid: 'referralPaid',
  referral_withdrawn: 'referralWithdrawn',
  MARKET: 'marketTeam',
  PRESALE: 'presaleTeam',
} as const

export type RewardTypeI18nKey =
  | (typeof REWARD_TYPE_I18N_KEYS)[keyof typeof REWARD_TYPE_I18N_KEYS]
  | 'unknown'

export type RewardLogStatusKey =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'unknown'

export type RewardTypeLabels = Record<RewardTypeI18nKey, string>
export type RewardLogStatusLabels = Record<RewardLogStatusKey, string>

export interface RewardLogRowLabels {
  rewardType: RewardTypeLabels
  logStatus: RewardLogStatusLabels
}

export function resolveRewardTypeI18nKey(rewardType: string): RewardTypeI18nKey {
  const key = REWARD_TYPE_I18N_KEYS[rewardType as keyof typeof REWARD_TYPE_I18N_KEYS]
  return key ?? 'unknown'
}

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

export function formatRewardTypeLabel(
  rewardType: string,
  labels: RewardTypeLabels,
): string {
  return labels[resolveRewardTypeI18nKey(rewardType)]
}

export function formatClaimableAmount(total: string, claimed: string): string {
  const pending = Math.max(0, Number(total) - Number(claimed))
  return formatUsd(pending, 2)
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

export function mapTeamReferralToMobileRow(item: TeamReferralItem): string[] {
  return [
    formatApiDateTime(item.register_time),
    formatShortAddress(item.address),
    formatTableGenesisRank(item.presale_rank),
    formatUsdCompact(item.sales_team_market),
  ]
}

export function mapTeamReferralToFullRow(item: TeamReferralItem): string[] {
  return [
    formatRegisterDate(item.register_time),
    formatShortAddress(item.address),
    formatTableUsdAmount(item.presale_volume),
    formatTableGenesisRank(item.presale_rank),
    formatCount(item.direct_referral_count ?? 0),
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
      Number(item.sales_team_market),
    ),
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

/** Sum human-readable USD amounts from sales log rows (same unit as table display). */
export function sumSalesLogAmountUsd(items: readonly SalesLogItem[]): number {
  return items.reduce((total, item) => {
    const num = Number(item.amount)
    return Number.isFinite(num) ? total + num : total
  }, 0)
}

function formatSalesLogAgx(
  item: SalesLogItem,
  agxPriceUsd = Number(PRESALE_CONFIG.agxPriceUsd),
): string {
  const tokens = Number(item.tokens)
  if (Number.isFinite(tokens) && tokens > 0) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(tokens)
  }

  const amountUsd1 = Number(item.amount)
  if (!Number.isFinite(amountUsd1) || amountUsd1 <= 0) return TABLE_EMPTY

  const estimated = estimateAgxFromUsd1(
    amountUsd1,
    resolvePhaseDiscountBps(item.phase_id),
    agxPriceUsd,
  )
  return estimated > 0
    ? new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(estimated)
    : TABLE_EMPTY
}

export function mapSalesLogToDesktopRow(
  item: SalesLogItem,
  agxPriceUsd = Number(PRESALE_CONFIG.agxPriceUsd),
): string[] {
  return [
    formatBlockTime(item.block_time),
    formatUsd(Number(item.amount), 0),
    formatDiscountBps(resolvePhaseDiscountBps(item.phase_id)),
    formatSalesLogAgx(item, agxPriceUsd),
    item.tx_hash ? formatShortAddress(item.tx_hash) : TABLE_EMPTY,
  ]
}

export function mapSalesLogToMobileRow(
  item: SalesLogItem,
  agxPriceUsd = Number(PRESALE_CONFIG.agxPriceUsd),
): string[] {
  return [
    formatBlockTime(item.block_time),
    formatUsd(Number(item.amount), 0),
    formatDiscountBps(resolvePhaseDiscountBps(item.phase_id)),
    formatSalesLogAgx(item, agxPriceUsd),
  ]
}

export function mapRewardLogToRow(
  item: RewardLogItem,
  labels: RewardLogRowLabels,
): string[] {
  const signedAmount = Number(item.amount)
  const amountLabel = Number.isFinite(signedAmount)
    ? `+${formatUsd(Math.abs(signedAmount), 2)}`
    : TABLE_EMPTY

  return [
    formatBlockTime(item.block_time),
    amountLabel,
    formatShortAddress(item.from_address),
    formatOrderAmountUsd(item.order_amount),
    formatRewardStatus(item.status, labels.logStatus),
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
    ? `+${formatUsd(Math.abs(amountNum), 2)}`
    : TABLE_EMPTY
  const statusKey = resolveTeamRewardClaimStatusKey(item.status)
  const statusLabel = labels.logStatus[statusKey]

  return [
    formatApiDateTime(item.claimed_at ?? item.created_at),
    amountLabel,
    formatMemberGenesisTitle(item.presale_rank),
    statusLabel,
  ]
}

export function isReferralRewardLog(item: RewardLogItem): boolean {
  return item.reward_type === 'referral_paid' || item.reward_type === 'referral_withdrawn'
}

export function buildReferralLink(address: string): string {
  const host = typeof window !== 'undefined' ? window.location.host : 'aegis-x.io'
  return `${host}/r/${address}`
}

/** Sidebar display: host + shortened address (Figma `aegis-x.io/r/0x8F32…91A2`). */
export function formatReferralLinkDisplay(address: string): string {
  const host = typeof window !== 'undefined' ? window.location.host : 'aegis-x.io'
  return `${host}/r/${formatShortAddress(address)}`
}
