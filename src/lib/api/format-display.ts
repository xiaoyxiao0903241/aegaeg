import type { RewardLogItem, SalesLogItem, TeamReferralItem } from './types'
import { estimateAgxFromUsd1 } from '../presale/presale-math'
import { PRESALE_CONFIG } from '../../config/presale'

export function formatPresaleRank(rank: number): string {
  if (!Number.isFinite(rank) || rank <= 0) return 'S0'
  return `S${rank}`
}

/** Maps API presale_rank (S1=1 … S6=6) to 0-based row indices in the tier table. */
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
  if (!row) return fallback
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

export function formatUsdCompact(value: string | number): string {
  const num = Number(value)
  if (!Number.isFinite(num)) return '$0'

  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }

  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`
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
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${month}-${day} ${hours}:${minutes}`
}

export function formatRegisterDate(iso: string | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toISOString().slice(0, 10)
}

export function formatShortAddress(address: string): string {
  if (address.length < 10) return address
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function formatRewardPercent(rewardPercent: number): string {
  if (!Number.isFinite(rewardPercent) || rewardPercent === 0) return '—'
  return `-${rewardPercent}%`
}

export function formatRewardStatus(status: number): string {
  switch (status) {
    case 0:
      return 'Pending'
    case 1:
      return 'Processing'
    case 2:
      return 'Paid'
    case 3:
      return 'Failed'
    default:
      return '—'
  }
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
    formatShortAddress(item.address),
    formatPresaleRank(item.presale_rank),
    '—',
    formatUsd(Number(item.sales_team_market)),
  ]
}

export function mapTeamReferralToMobileRow(item: TeamReferralItem): string[] {
  return [
    formatRegisterDate(item.register_time).slice(5),
    formatShortAddress(item.address),
    formatPresaleRank(item.presale_rank),
    formatUsdCompact(item.sales_team_market),
  ]
}

export function mapTeamReferralToFullRow(item: TeamReferralItem): string[] {
  return [
    formatRegisterDate(item.register_time),
    formatShortAddress(item.address),
    '—',
    formatPresaleRank(item.presale_rank),
    '—',
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
      Number(item.sales_team_market),
    ),
  ]
}

/** Sum human-readable USD amounts from sales log rows (same unit as table display). */
export function sumSalesLogAmountUsd(items: readonly SalesLogItem[]): number {
  return items.reduce((total, item) => {
    const num = Number(item.amount)
    return Number.isFinite(num) ? total + num : total
  }, 0)
}

function resolveSalesLogDiscountBps(rewardPercent: number): number {
  if (!Number.isFinite(rewardPercent) || rewardPercent <= 0) return 0
  return rewardPercent < 100 ? rewardPercent * 100 : rewardPercent
}

function formatEstimatedAgx(
  item: SalesLogItem,
  agxPriceUsd = Number(PRESALE_CONFIG.agxPriceUsd),
): string {
  const amountUsd1 = Number(item.amount)
  if (!Number.isFinite(amountUsd1) || amountUsd1 <= 0) return '—'

  const estimated = estimateAgxFromUsd1(
    amountUsd1,
    resolveSalesLogDiscountBps(item.reward_percent),
    agxPriceUsd,
  )
  return estimated > 0 ? estimated.toFixed(2) : '—'
}

export function mapSalesLogToDesktopRow(
  item: SalesLogItem,
  agxPriceUsd = Number(PRESALE_CONFIG.agxPriceUsd),
): string[] {
  return [
    formatBlockTime(item.block_time),
    formatAmountToken(item.amount, 'USD1'),
    formatRewardPercent(item.reward_percent),
    formatEstimatedAgx(item, agxPriceUsd),
    item.tx_hash ? formatShortAddress(item.tx_hash) : '—',
  ]
}

export function mapSalesLogToMobileRow(
  item: SalesLogItem,
  agxPriceUsd = Number(PRESALE_CONFIG.agxPriceUsd),
): string[] {
  return [
    formatBlockTime(item.block_time),
    formatAmountToken(item.amount, 'USD1'),
    formatRewardPercent(item.reward_percent),
    formatEstimatedAgx(item, agxPriceUsd),
  ]
}

export function mapRewardLogToRow(item: RewardLogItem): string[] {
  const signedAmount = Number(item.amount)
  const amountLabel = Number.isFinite(signedAmount)
    ? `+${formatUsd(Math.abs(signedAmount), 2)}`
    : '—'

  return [
    formatBlockTime(item.block_time),
    amountLabel,
    formatShortAddress(item.from_address),
    '—',
    item.times ? `${item.times}%` : '—',
    formatRewardStatus(item.status),
  ]
}

export function isReferralRewardLog(item: RewardLogItem): boolean {
  return item.reward_type.includes('referral')
}

export function isTeamRewardLog(item: RewardLogItem): boolean {
  return !isReferralRewardLog(item)
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
