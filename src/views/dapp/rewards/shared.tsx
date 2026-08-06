import type { ReactNode } from 'react'

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
import { StatusBadge } from '~/shared/components/badge'
import { ExplorerLink } from '~/shared/components/explorer-link'
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import {
  formatApiAmount,
  formatApiDateTime,
  formatBlockTime,
  formatNumber,
  formatRegisterDate,
  formatTableGenesisRank,
  formatUsdApprox,
  parseApiAmount,
  TABLE_EMPTY,
} from '~/shared/presenters/format'

/**
 * 非数值空态占位（日期、哈希、标签用「—」）。
 * 数值字段不能走 `formatApiAmount(null)`，否则会显示「0.00」。
 */
export const NON_NUMERIC_EMPTY = '—'

export type MixedClaimView = Extract<RewardsView, 'lucky' | 'cobuild' | 'referral' | 'participate'>

/** 金额字符串展示 SSOT 在 `~/shared/presenters/format`；此处再导出供页袋旧 import。 */
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
 * AGX 数量 × 现价 → `$…`（仓位 / 业绩主值；稿面用 `$` 前缀，无 ≈）。
 * 无会话 / 冷启动 / 无价 → `$0.00`。
 */
export function formatApiAgxUsdLabel(
  sessionReady: boolean,
  isPending: boolean,
  raw: string | null | undefined,
  priceUsd: number | null,
): string {
  if (!sessionReady || (isPending && raw == null)) {
    return formatNumber(0, { digits: 2, prefix: '$' })
  }
  const n = parseApiAmount(raw)
  if (n == null || priceUsd == null || priceUsd <= 0) {
    return formatNumber(0, { digits: 2, prefix: '$' })
  }
  return formatNumber(n * priceUsd, { digits: 2, prefix: '$' })
}

/**
 * gAGX 奖励主值旁注：`≈ $…`（稿有 ≈ 才挂 Tile.Note）。
 */
export function formatApiGagxApproxUsd(
  sessionReady: boolean,
  isPending: boolean,
  raw: string | null | undefined,
  priceUsd: number | null,
): string {
  if (!sessionReady || (isPending && raw == null)) {
    return formatUsdApprox(0, null)
  }
  return formatUsdApprox(parseApiAmount(raw) ?? 0, priceUsd)
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

export function mapRewardLogToRow(item: RewardLogItem, labels: RewardLogStatusLabels): ReactNode[] {
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
    <ExplorerLink key={item.from_address} value={item.from_address} />,
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

export function mapParticipationAwardInviterToRow(item: ParticipationAwardInviter): ReactNode[] {
  return [
    formatApiDateTime(item.bound_at),
    <ExplorerLink key={item.address} value={item.address} />,
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

export function mapRankRewardTeamMemberToRow(item: RankRewardTeamMemberItem): ReactNode[] {
  return [
    formatApiDateTime(item.bound_at),
    <ExplorerLink key={item.address} value={item.address} />,
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

export function mapReferralAwardDirectToRow(item: ReferralAwardDirectReferralItem): ReactNode[] {
  return [
    formatApiDateTime(item.bound_at),
    <ExplorerLink key={item.address} value={item.address} />,
    formatApiAmount(item.active_stake_balance),
    formatApiAmount(item.contributed_reward_total),
  ]
}

export function mapMarketAllowancePaidLogToRow(item: MarketAllowancePaidLogItem): ReactNode[] {
  return [
    formatBlockTime(item.paid_time),
    formatApiAmount(item.agx_amount),
    item.operation_type || TABLE_EMPTY,
    item.tx_hash ? <ExplorerLink key={item.tx_hash} kind="tx" value={item.tx_hash} /> : TABLE_EMPTY,
    item.subsidy_rate || TABLE_EMPTY,
    formatApiAmount(item.allowance_amount),
  ]
}

export function mapMarketAllowanceClaimLogToRow(item: MarketAllowanceClaimLogItem): ReactNode[] {
  return [
    formatBlockTime(item.claim_time),
    formatApiAmount(item.allowance_amount),
    item.tx_hash ? <ExplorerLink key={item.tx_hash} kind="tx" value={item.tx_hash} /> : TABLE_EMPTY,
  ]
}

export function mapLuckyWinnerToRow(
  item: LuckyRewardWinnerItem,
  opts?: { selfAddress?: string | null; meLabel?: string },
): ReactNode[] {
  const isSelf =
    opts?.selfAddress != null &&
    opts.selfAddress.length > 0 &&
    item.address.toLowerCase() === opts.selfAddress.toLowerCase()
  const addressCell =
    isSelf && opts?.meLabel ? (
      <span className="inline-flex items-center gap-2">
        <ExplorerLink value={item.address} />
        <StatusBadge size="compact" tone="pending">
          {opts.meLabel}
        </StatusBadge>
      </span>
    ) : (
      <ExplorerLink value={item.address} />
    )

  return [
    String(item.rank).padStart(2, '0'),
    addressCell,
    formatApiAmount(item.participation_amount, { digits: 2, prefix: '$' }),
    formatApiAmount(item.reward_amount, { digits: 4, suffix: ' gAGX' }),
  ]
}

export function mapLuckyMyRoundToRow(
  item: LuckyRewardMyRoundItem,
  labels: { won: string; lost: string },
): ReactNode[] {
  const wonAmount = formatApiAmount(item.reward_amount, { digits: 4, suffix: ' gAGX' })
  const result =
    item.is_winner === true ? (
      <StatusBadge size="compact" tone="pending">
        {labels.won.replace('{amount}', wonAmount)}
      </StatusBadge>
    ) : (
      <StatusBadge size="compact" tone="muted">
        {labels.lost}
      </StatusBadge>
    )

  return [
    formatRegisterDate(item.date),
    formatApiAmount(item.participation_amount, { digits: 2, prefix: '$' }),
    result,
    item.draw_tx_hash ? <ExplorerLink kind="tx" showIcon value={item.draw_tx_hash} /> : TABLE_EMPTY,
  ]
}
