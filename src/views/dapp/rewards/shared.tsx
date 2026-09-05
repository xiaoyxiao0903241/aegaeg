/**
 * 奖励域共享的格式化与表格行映射
 *
 * 集中处理金额、日期、状态标签，以及各类奖励记录到表格行 / 单元格的转换，
 * 供各奖励详情页复用。
 */
import type { ReactNode } from 'react'

import { formatContributionPoints } from '~/core/exchange/format-contribution-points'
import { formatTokenAmount, PERSONAL_TOKEN_DIGITS } from '~/core/exchange/token-amount'
import type {
  CommunityFundLogItem,
  DaoGrantStatus,
  LuckyRewardMyRoundItem,
  LuckyRewardWinnerItem,
  MarketAllowanceClaimLogItem,
  MarketAllowancePaidLogItem,
  ParticipationAwardInviter,
  RankRewardLogItem,
  RankRewardPeerSurpassLogItem,
  RankRewardTeamMemberItem,
  ReferralAwardDirectReferralItem,
  RewardLogItem,
  TeamRewardClaimLogItem,
} from '~/shared/api/types'
import { StatusBadge } from '~/shared/components/badge'
import { ExplorerLink } from '~/shared/components/explorer-link'
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import {
  formatApiAmount,
  formatApiContributionPoints,
  formatApiDateTime,
  formatBlockTime,
  formatDecimal,
  formatMakingRankLabel,
  formatRegisterDate,
  formatTableGenesisRank,
  interpolateLive,
  LIVE_DATA_PLACEHOLDER,
  parseApiAmount,
  TABLE_EMPTY,
  toUsd,
} from '~/shared/presenters/format'

/**
 * 非数值空态占位（日期、哈希、标签、无字段指标用「—」）。
 * 金额 / 数量缺数走 `formatApiAmount`，显 `--`。
 */
export const NON_NUMERIC_EMPTY = '—'

const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

/**
 * Tracker 累计 USD1（18 位）→ `$1.23`；缺数显示 `--`。
 */
export function formatLuckyUsd1Amount(raw: bigint | null | undefined): string {
  return formatTokenAmount(raw, USD1_DECIMALS, { digits: 2, trimZeros: false, prefix: '$' })
}

export type MixedClaimView = Extract<RewardsView, 'lucky' | 'cobuild' | 'referral' | 'participate'>

/** 金额字符串展示的唯一来源是 `~/shared/presenters/format`；此处再导出供页袋旧 import。 */
export { formatApiAmount }

/**
 * 后端金额统计。缺数 → `--`；已知 0 → 按精度印。
 */
export function formatApiStatLabel(
  raw: string | null | undefined,
  options?: { digits?: number; prefix?: string; suffix?: string },
): string {
  return formatApiAmount(raw, { digits: PERSONAL_TOKEN_DIGITS, ...options })
}

/** 后端贡献点数统计。缺数 → `--`。 */
export function formatApiContributionStatLabel(raw: string | null | undefined): string {
  return formatApiContributionPoints(raw)
}

/** 后端整数字段。缺数 → `--`。 */
export function formatApiCountLabel(raw: number | null | undefined): string {
  if (raw == null) return LIVE_DATA_PLACEHOLDER
  return String(raw)
}

/**
 * AGX 数量 × 现价 → `$…`（仓位 / 业绩主值；设计稿用 `$` 前缀，无 ≈）。
 * 缺数量或单价 → `--`；单价 0 → `$0.00`。
 */
export function formatApiAgxUsdLabel(
  raw: string | null | undefined,
  priceUsd: number | null,
): string {
  const n = parseApiAmount(raw)
  if (n == null || priceUsd == null || !Number.isFinite(priceUsd) || priceUsd < 0) {
    return LIVE_DATA_PLACEHOLDER
  }
  return formatDecimal(n * priceUsd, { digits: 2, prefix: '$' })
}

/**
 * gAGX 奖励主值旁注：`≈ $…`（设计稿有 ≈ 才挂 Tile.Note）。
 */
export function formatApiGagxApproxUsd(
  raw: string | null | undefined,
  priceUsd: number | null,
): string {
  return formatDecimal(toUsd(parseApiAmount(raw), priceUsd), { digits: 2, prefix: '≈ $' })
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

/**
 * 按百分比切分 bigint 金额，供拆分展示使用。
 *
 * @param amount 待切分金额
 * @param pct 0–100 的百分比
 * @returns 切分后的金额
 */
export function splitAmountByPct(amount: bigint, pct: number): bigint {
  return (amount * BigInt(pct)) / 100n
}

/**
 * 贡献快照：没有 bigint → `--`。
 */
export function formatContributionPlaceholder(input: {
  contribution: bigint | undefined
  decimals: number
}): string {
  if (input.contribution === undefined) return LIVE_DATA_PLACEHOLDER
  return formatContributionPoints(input.contribution, input.decimals)
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

/**
 * 计算可领取金额：总额减已领取，下限为 0。
 *
 * @param total 后端总额字符串
 * @param claimed 后端已领取字符串
 * @returns 可领取金额
 */
export function claimableAmountValue(total: string, claimed: string): number {
  const totalN = parseApiAmount(total) ?? 0
  const claimedN = parseApiAmount(claimed) ?? 0
  return Math.max(0, totalN - claimedN)
}

/**
 * 销售奖励记录 → 表格行。
 *
 * @param item 后端销售奖励记录
 * @param labels 各状态对应的多语文案
 * @returns 时间、金额、来源地址、订单金额与状态的单元格数组
 */
export function mapRewardLogToRow(item: RewardLogItem, labels: RewardLogStatusLabels): ReactNode[] {
  const signedAmount = parseApiAmount(item.amount)
  const amountLabel =
    signedAmount != null
      ? formatDecimal(Math.abs(signedAmount), { digits: 2, prefix: '$' })
      : LIVE_DATA_PLACEHOLDER
  const orderAmount = parseApiAmount(item.order_amount)
  const orderLabel =
    orderAmount != null && orderAmount > 0
      ? formatDecimal(orderAmount, { digits: 0, prefix: '$' })
      : LIVE_DATA_PLACEHOLDER

  return [
    formatBlockTime(item.block_time),
    amountLabel,
    <ExplorerLink key={item.from_address} value={item.from_address} />,
    orderLabel,
    formatRewardStatus(item.status, labels),
  ]
}

/**
 * 团队奖励领取单 → 表格行。
 *
 * @param item 后端领取单记录
 * @param labels 各状态对应的多语文案
 * @returns 领取时间、金额、预售等级与状态的单元格数组
 */
export function mapTeamRewardClaimLogToRow(
  item: TeamRewardClaimLogItem,
  labels: RewardLogStatusLabels,
): string[] {
  const amountNum = parseApiAmount(item.amount)
  const amountLabel =
    amountNum != null
      ? formatDecimal(Math.abs(amountNum), { digits: 2, prefix: '$' })
      : LIVE_DATA_PLACEHOLDER
  const statusKey = teamRewardClaimStatusKey(item.status)

  return [
    formatApiDateTime(item.claimed_at ?? item.created_at),
    amountLabel,
    formatTableGenesisRank(item.presale_rank),
    labels[statusKey],
  ]
}

/**
 * 社区基金流水 → 表格行。
 *
 * @param item 后端社区基金记录
 * @param labels 各状态对应的多语文案
 * @returns 区块时间、金额与状态的单元格数组
 */
export function mapCommunityFundLogToRow(
  item: CommunityFundLogItem,
  labels: RewardLogStatusLabels,
): string[] {
  const amountNum = parseApiAmount(item.amount)
  const amountLabel =
    amountNum != null
      ? formatDecimal(Math.abs(amountNum), { digits: 2, prefix: '$' })
      : LIVE_DATA_PLACEHOLDER
  const statusKey = communityFundLogStatusKey(item.status)

  return [formatBlockTime(item.block_time), amountLabel, labels[statusKey]]
}

/** 参与奖 / 推荐奖发放记录与 DAO 发放同一列结构。 */
export function mapDaoGrantAwardLogToRow(
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
    formatApiAmount(item.awarded_gross, { digits: 4, suffix: ' gAGX' }),
    formatDaoGrantStatus(item.status, labels),
    formatApiDateTime(item.fully_claimed_at),
  ]
}

/**
 * 参与奖邀请人信息 → 表格行。
 *
 * @param item 后端邀请人记录
 * @returns 绑定时间、地址、个人持仓与贡献奖励的单元格数组
 */
export function mapParticipationAwardInviterToRow(item: ParticipationAwardInviter): ReactNode[] {
  return [
    formatApiDateTime(item.bound_at),
    <ExplorerLink key={item.address} value={item.address} />,
    formatApiAmount(item.active_stake_balance, { digits: 2, prefix: '$' }),
    formatApiAmount(item.total_brought_reward, { digits: 4, suffix: ' gAGX' }),
  ]
}

/**
 * 等级共建奖发放记录 → 表格行。
 *
 * @param item 后端等级共建奖记录
 * @param labels 各状态对应的多语文案
 * @returns 时间、等级、金额、状态与领取时间的单元格数组
 */
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

/**
 * 等级共建团队成员 → 表格行。
 *
 * making_market 为 AGX，按现价折 `$` 展示（与共建级别卡同一口径）。
 *
 * @param item 后端团队成员记录
 * @param agxPriceUsd AGX 美元单价；无价时 `--`
 * @returns 绑定时间、地址、团队业绩与共建级别的单元格数组
 */
export function mapRankRewardTeamMemberToRow(
  item: RankRewardTeamMemberItem,
  agxPriceUsd: number | null,
): ReactNode[] {
  return [
    formatApiDateTime(item.bound_at),
    <ExplorerLink key={item.address} value={item.address} />,
    formatApiAgxUsdLabel(item.making_market, agxPriceUsd),
    formatMakingRankLabel(item.making_rank, TABLE_EMPTY),
  ]
}

/**
 * 直接推荐用户 → 表格行。
 *
 * @param item 后端直推用户记录
 * @returns 绑定时间、地址、持仓与贡献奖励的单元格数组
 */
export function mapReferralAwardDirectToRow(item: ReferralAwardDirectReferralItem): ReactNode[] {
  return [
    formatApiDateTime(item.bound_at),
    <ExplorerLink key={item.address} value={item.address} />,
    formatApiAmount(item.active_stake_balance, { digits: 2, prefix: '$' }),
    formatApiAmount(item.contributed_reward_total, { digits: 4, suffix: ' gAGX' }),
  ]
}

/** API 津贴比例为百分比数字；已带 `%` 则原样展示。 */
function formatSubsidyRate(raw: string | null | undefined): string {
  const trimmed = raw?.trim()
  if (!trimmed) return TABLE_EMPTY
  if (trimmed.endsWith('%')) return trimmed
  return formatDecimal(parseApiAmount(trimmed), { digits: 2, fraction: 'natural', suffix: '%' })
}

/**
 * 市场基金已付记录 → 表格行。
 *
 * @param item 后端已付记录
 * @returns 付款时间、AGX 金额、操作类型、交易哈希、补贴率与额度单元格
 */
export function mapMarketAllowancePaidLogToRow(item: MarketAllowancePaidLogItem): ReactNode[] {
  return [
    formatBlockTime(item.paid_time),
    formatApiAmount(item.agx_amount, { digits: 4, suffix: ' AGX' }),
    item.operation_type || TABLE_EMPTY,
    item.tx_hash ? (
      <ExplorerLink key={item.tx_hash} kind="tx" showIcon value={item.tx_hash} />
    ) : (
      TABLE_EMPTY
    ),
    formatSubsidyRate(item.subsidy_rate),
    formatApiAmount(item.allowance_amount, { digits: 4, suffix: ' gAGX' }),
  ]
}

/**
 * 市场基金领取记录 → 表格行。
 *
 * @param item 后端领取记录
 * @returns 领取时间、额度与交易哈希单元格
 */
export function mapMarketAllowanceClaimLogToRow(item: MarketAllowanceClaimLogItem): ReactNode[] {
  return [
    formatBlockTime(item.claim_time),
    formatApiAmount(item.allowance_amount, { digits: 4, suffix: ' gAGX' }),
    item.tx_hash ? <ExplorerLink key={item.tx_hash} kind="tx" value={item.tx_hash} /> : TABLE_EMPTY,
  ]
}

/**
 * 幸运奖中奖名单 → 表格行；当前用户地址可附加「我」徽标。
 *
 * @param item 后端中奖记录
 * @param opts 当前地址、「我」文案，以及链上质押额
 * @returns 名次、地址、质押金额与奖励的单元格数组
 */
export function mapLuckyWinnerToRow(
  item: LuckyRewardWinnerItem,
  opts?: {
    selfAddress?: string | null
    meLabel?: string
    stakeAmountUsd1?: bigint | null
  },
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
    formatLuckyUsd1Amount(opts?.stakeAmountUsd1),
    formatApiAmount(item.reward_amount, { digits: 4, suffix: ' gAGX' }),
  ]
}

/**
 * 当前用户幸运奖轮次 → 表格行；中奖轮次展示可领取奖励。
 *
 * @param item 后端轮次记录
 * @param labels 中奖与未中奖文案，以及链上质押额
 * @returns 日期、质押金额、结果与开奖交易哈希单元格
 */
export function mapLuckyMyRoundToRow(
  item: LuckyRewardMyRoundItem,
  labels: { won: string; lost: string; stakeAmountUsd1?: bigint | null },
): ReactNode[] {
  const wonAmount = formatApiAmount(item.reward_amount, { digits: 4, suffix: ' gAGX' })
  const result =
    item.is_winner === true ? (
      <StatusBadge size="compact" tone="pending">
        {interpolateLive(labels.won, { amount: wonAmount })}
      </StatusBadge>
    ) : (
      <StatusBadge size="compact" tone="muted">
        {labels.lost}
      </StatusBadge>
    )

  return [
    formatRegisterDate(item.date),
    formatLuckyUsd1Amount(labels.stakeAmountUsd1),
    result,
    item.draw_tx_hash ? (
      <ExplorerLink key={item.draw_tx_hash} kind="tx" showIcon value={item.draw_tx_hash} />
    ) : (
      TABLE_EMPTY
    ),
  ]
}
