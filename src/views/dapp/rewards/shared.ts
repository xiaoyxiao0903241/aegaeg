import { formatTokenAmount } from '~/core/exchange/token-amount'
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
import {
  formatApiAmount,
  formatApiDateTime,
  formatBlockTime,
  formatNumber,
  formatRegisterDate,
  formatShortAddress,
  formatTableGenesisRank,
  parseApiAmount,
  TABLE_EMPTY,
} from '~/shared/presenters/format-display'

/**
 * 非数值空态占位（日期、哈希、标签用「—」）。
 * 数值字段不能走 `formatApiAmount(null)`，否则会显示「0.00」。
 */
export const NON_NUMERIC_EMPTY = '—'

export type MixedClaimView = Extract<RewardsView, 'lucky' | 'cobuild'>

/** 金额字符串展示 SSOT 在 `~/shared/presenters/format-display`；此处再导出供页袋旧 import。 */
export { formatApiAmount }

/**
 * 指标统计标签：会话未就绪或冷启动加载中 → 显示 0
 *
 * 重新拉取时 keepPreviousData 会保留旧值，因此只有
 * 「会话未就绪」或「首次加载且无数据」才回退成 0。
 *
 * @param sessionReady 登录会话是否就绪
 * @param isPending 是否加载中
 * @param raw 后端数值字符串
 */
export function formatApiStatLabel(
  sessionReady: boolean,
  isPending: boolean,
  raw: string | null | undefined,
  options?: { digits?: number; prefix?: string; suffix?: string },
): string {
  // 仅冷启动 pending+null 出零（refetch 时 keepPreviousData 仍带 raw）。
  if (!sessionReady || (isPending && raw == null)) return formatApiAmount(null, options)
  return formatApiAmount(raw, options)
}

/**
 * 后端整数字段（计数）→ 文本
 *
 * 会话未就绪或加载中且无数据时返回「0」，规则同 formatApiStatLabel。
 */
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

/**
 * 把会话就绪与加载中状态绑进格式化器，避免各详情视图重复判断
 */
export function bindApiLabelFormatters(sessionReady: boolean, isPending: boolean) {
  return {
    stat: (
      raw: string | null | undefined,
      options?: { digits?: number; prefix?: string; suffix?: string },
    ) => formatApiStatLabel(sessionReady, isPending, raw, options),
    count: (raw: number | null | undefined) => formatApiCountLabel(sessionReady, isPending, raw),
  }
}

/**
 * DAO 发放状态 → 展示文案
 *
 * @param status 后端状态枚举
 * @param labels 各状态对应的多语文案
 */
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

/** StatusBadge 配色：待领 coral · 已领 muted · 处理中同 pending · 失败 destructive */
export function daoGrantStatusTone(status: DaoGrantStatus): 'pending' | 'muted' | 'failed' {
  switch (status) {
    case 'READY':
      return 'pending'
    case 'CLAIMED':
      return 'muted'
    case 'CANCELLED':
      return 'failed'
    default:
      return 'pending'
  }
}

export function formatMakingRankLabel(rank: number | null | undefined, emptyLabel: string): string {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return emptyLabel
  return `A${Math.trunc(rank)}`
}

export function splitAmountByPct(amount: bigint, pct: number): bigint {
  return (amount * BigInt(pct)) / 100n
}

/**
 * 贡献快照占位文本：未连接 / 加载中 → 空，有值 → 代币金额
 *
 * @param input.walletReady 钱包是否就绪
 * @param input.hasAddress 是否已连接地址
 * @param input.isPending 链上查询是否加载中
 * @param input.contribution 贡献值（bigint）
 * @param input.decimals 代币精度
 * @param input.fractionDigits 小数位
 */
export function formatContributionPlaceholder(input: {
  walletReady: boolean
  hasAddress: boolean
  isPending: boolean
  contribution: bigint | undefined
  decimals: number
  fractionDigits?: number
}): string {
  if (!input.walletReady || !input.hasAddress || input.contribution === undefined) {
    return formatApiAmount(null, { digits: input.fractionDigits ?? 2 })
  }
  return (
    formatTokenAmount(input.contribution, input.decimals, input.fractionDigits ?? 2) ||
    formatApiAmount(null, { digits: input.fractionDigits ?? 2 })
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

/** 团队奖励领取单状态码映射：0 待领取 · 1/2 已领取 · 3 领取失败 */
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
  const totalN = parseApiAmount(total) ?? 0
  const claimedN = parseApiAmount(claimed) ?? 0
  return Math.max(0, totalN - claimedN)
}

export function mapRewardLogToRow(item: RewardLogItem, labels: RewardLogStatusLabels): string[] {
  const signedAmount = parseApiAmount(item.amount)
  const amountLabel =
    signedAmount != null
      ? formatNumber(Math.abs(signedAmount), { digits: 2, prefix: '$' })
      : TABLE_EMPTY
  const orderAmount = parseApiAmount(item.order_amount)
  const orderLabel =
    orderAmount != null && orderAmount > 0
      ? formatNumber(orderAmount, { digits: 0, prefix: '$' })
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
  const amountNum = parseApiAmount(item.amount)
  const amountLabel =
    amountNum != null ? formatNumber(Math.abs(amountNum), { digits: 2, prefix: '$' }) : TABLE_EMPTY
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
  const amountNum = parseApiAmount(item.amount)
  const amountLabel =
    amountNum != null ? formatNumber(Math.abs(amountNum), { digits: 2, prefix: '$' }) : TABLE_EMPTY
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
    formatApiAmount(item.awarded_gross),
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
    formatApiAmount(item.active_stake_balance),
    formatApiAmount(item.total_brought_reward),
  ]
}

export function mapRankRewardLogToRow(
  item: RankRewardLogItem | RankRewardPeerSurpassLogItem,
  labels: RewardLogStatusLabels,
): string[] {
  return [
    formatApiDateTime(item.created_at),
    formatMakingRankLabel(item.benefit_level, TABLE_EMPTY),
    formatApiAmount(item.awarded_gross, { digits: 4, suffix: ' gAGX' }),
    formatDaoGrantStatus(item.status, labels),
    formatApiDateTime(item.fully_claimed_at),
  ]
}

export function mapRankRewardTeamMemberToRow(item: RankRewardTeamMemberItem): string[] {
  return [
    formatApiDateTime(item.bound_at),
    formatShortAddress(item.address),
    formatApiAmount(item.making_market),
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
    formatApiAmount(item.active_stake_balance),
    formatApiAmount(item.contributed_reward_total),
  ]
}

export function mapMarketAllowancePaidLogToRow(item: MarketAllowancePaidLogItem): string[] {
  return [
    formatBlockTime(item.paid_time),
    formatApiAmount(item.agx_amount),
    item.operation_type || TABLE_EMPTY,
    item.tx_hash ? formatShortAddress(item.tx_hash) : TABLE_EMPTY,
    item.subsidy_rate || TABLE_EMPTY,
    formatApiAmount(item.allowance_amount),
  ]
}

export function mapMarketAllowanceClaimLogToRow(item: MarketAllowanceClaimLogItem): string[] {
  return [
    formatBlockTime(item.claim_time),
    formatApiAmount(item.allowance_amount),
    item.tx_hash ? formatShortAddress(item.tx_hash) : TABLE_EMPTY,
  ]
}

export function mapLuckyWinnerToRow(item: LuckyRewardWinnerItem): string[] {
  return [
    String(item.rank),
    formatShortAddress(item.address),
    formatApiAmount(item.participation_amount),
    formatApiAmount(item.reward_amount),
  ]
}

export function mapLuckyMyRoundToRow(item: LuckyRewardMyRoundItem): string[] {
  const result =
    item.winner_status?.trim() ||
    (item.is_winner === true ? '1' : item.is_winner === false ? TABLE_EMPTY : TABLE_EMPTY)
  return [
    formatRegisterDate(item.date),
    formatApiAmount(item.participation_amount),
    result,
    item.draw_tx_hash ? formatShortAddress(item.draw_tx_hash) : TABLE_EMPTY,
  ]
}
