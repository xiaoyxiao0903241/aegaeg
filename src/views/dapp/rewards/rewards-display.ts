import { formatTokenAmount } from '~/core/exchange/token-amount'
import {
  formatApiDateTime,
  formatBlockTime,
  formatGroupedNumber,
  formatRegisterDate,
  formatShortAddress,
  formatTableGenesisRank,
  TABLE_EMPTY,
} from '~/shared/api/format-display'
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
import type { RewardsView } from '~/shared/config/dapp-deep-links'

/** 数值指标空 / pending → 经格式化器出零（不用命名 dash/loading 别名）。 */

/**
 * 非数值空态（日期、哈希、标签）。
 * 禁走 `formatApiDecimalAmount(null)`（会得到 `"0.00"`）。
 */
export const NON_NUMERIC_EMPTY = '—'

export type MixedClaimView = Extract<RewardsView, 'lucky' | 'cobuild'>

/** 后端 SUM / 小数字符串金额 → 分组展示（禁臆造）。 */
export function formatApiDecimalAmount(
  raw: string | null | undefined,
  options: { digits?: number; prefix?: string; suffix?: string } = {},
): string {
  const digits = options.digits ?? 2
  if (raw == null || raw.trim() === '') {
    return formatGroupedNumber(0, { digits, prefix: options.prefix, suffix: options.suffix })
  }
  const n = Number(raw)
  if (!Number.isFinite(n)) {
    return formatGroupedNumber(0, { digits, prefix: options.prefix, suffix: options.suffix })
  }
  return formatGroupedNumber(n, {
    digits,
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
  // 仅冷启动 pending+null 出零（refetch 时 keepPreviousData 仍带 raw）。
  if (!sessionReady || (isPending && raw == null)) return formatApiDecimalAmount(null, options)
  return formatApiDecimalAmount(raw, options)
}

/** API 整数 / 计数；session/pending 门闸同 formatApiStatLabel。 */
export function formatApiCountLabel(
  sessionReady: boolean,
  isPending: boolean,
  raw: number | null | undefined,
): string {
  if (!sessionReady) return '0'
  if (isPending && raw == null) return '0'
  if (raw == null) return '0'
  return String(raw)
}

/** 绑定 session/pending，避免详情视图重复三件套门闸。 */
export function bindApiLabelFormatters(sessionReady: boolean, isPending: boolean) {
  return {
    stat: (
      raw: string | null | undefined,
      options?: { digits?: number; prefix?: string; suffix?: string },
    ) => formatApiStatLabel(sessionReady, isPending, raw, options),
    count: (raw: number | null | undefined) => formatApiCountLabel(sessionReady, isPending, raw),
  }
}

export function formatDaoGrantStatus(
  status: DaoGrantStatus,
  labels: RewardLogStatusLabels,
): string {
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

/** 表 StatusBadge tone：待领 coral · 已领 muted · 处理中 coral · 失败 destructive */
export function daoGrantStatusTone(
  status: DaoGrantStatus,
): 'pending' | 'muted' | 'processing' | 'failed' {
  switch (status) {
    case 'READY':
      return 'pending'
    case 'CLAIMED':
      return 'muted'
    case 'CANCELLED':
      return 'failed'
    default:
      return 'processing'
  }
}

export function formatMakingRankLabel(rank: number | null | undefined, emptyLabel: string): string {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return emptyLabel
  return `A${Math.trunc(rank)}`
}

export function splitAmountByPct(amount: bigint, pct: number): bigint {
  return (amount * BigInt(pct)) / 100n
}

/** 贡献快照占位：未连接 / 加载中 / 有值。 */
export function formatContributionPlaceholder(input: {
  walletReady: boolean
  hasAddress: boolean
  isPending: boolean
  contribution: bigint | undefined
  decimals: number
  fractionDigits?: number
}): string {
  if (!input.walletReady || !input.hasAddress || input.contribution === undefined) {
    return formatApiDecimalAmount(null, { digits: input.fractionDigits ?? 2 })
  }
  return (
    formatTokenAmount(input.contribution, input.decimals, input.fractionDigits ?? 2) ||
    formatApiDecimalAmount(null, { digits: input.fractionDigits ?? 2 })
  )
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

function mapDaoGrantAwardLogToRow(
  item: {
    created_at: string | null
    awarded_gross: string
    status: DaoGrantStatus
    fully_claimed_at: string | null
  },
  labels: RewardLogStatusLabels,
): string[] {
  return [
    formatApiDateTime(item.created_at),
    formatApiDecimalAmount(item.awarded_gross),
    formatDaoGrantStatus(item.status, labels),
    formatApiDateTime(item.fully_claimed_at),
  ]
}

export function mapParticipationAwardLogToRow(
  item: ParticipationAwardLogItem,
  labels: RewardLogStatusLabels,
): string[] {
  return mapDaoGrantAwardLogToRow(item, labels)
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
    formatMakingRankLabel(item.benefit_level, TABLE_EMPTY),
    formatApiDecimalAmount(item.awarded_gross, { digits: 4, suffix: ' gAGX' }),
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
  return mapDaoGrantAwardLogToRow(item, labels)
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
