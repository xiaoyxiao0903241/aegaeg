/**
 * 奖励域共享的格式化与表格行映射
 *
 * 集中处理金额、日期、状态标签，以及各类奖励记录到表格行 / 单元格的转换，
 * 供各奖励详情页复用。
 */
import type { ReactNode } from 'react'
import { formatUnits } from 'viem'

import {
  formatApiContributionPoints,
  formatContributionPoints,
} from '~/core/exchange/format-contribution-points'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { interpolate } from '~/i18n/interpolate'
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
  formatApiDateTime,
  formatBlockTime,
  formatMakingRankLabel,
  formatNumber,
  formatRegisterDate,
  formatTableGenesisRank,
  formatUsdApprox,
  parseApiAmount,
  TABLE_EMPTY,
} from '~/shared/presenters/format'

/**
 * 非数值空态占位（日期、哈希、标签、无字段指标用「—」）。
 * 金额 / 数量缺数走 `formatApiAmount` / `formatNumber(0…)`，显 0。
 */
export const NON_NUMERIC_EMPTY = '—'

const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

/**
 * Tracker 累计 USD1（18 位）→ `$1.23`；缺数显示「—」，不回退成 0。
 */
export function formatLuckyUsd1Amount(raw: bigint | null | undefined): string {
  if (raw == null) return NON_NUMERIC_EMPTY
  const n = Number(formatUnits(raw, USD1_DECIMALS))
  if (!Number.isFinite(n)) return NON_NUMERIC_EMPTY
  return `$${formatTokenAmount(raw, USD1_DECIMALS, 2)}`
}

export type MixedClaimView = Extract<RewardsView, 'lucky' | 'cobuild' | 'referral' | 'participate'>

/** 金额字符串展示的唯一来源是 `~/shared/presenters/format`；此处再导出供页袋旧 import。 */
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
 * 后端贡献点数统计：会话未就绪或冷启动 pending → `0.0000`，否则向下舍 4 位。
 */
export function formatApiContributionStatLabel(
  sessionReady: boolean,
  isPending: boolean,
  raw: string | null | undefined,
): string {
  if (!sessionReady || (isPending && raw == null)) return formatApiContributionPoints(null)
  return formatApiContributionPoints(raw)
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
 * AGX 数量 × 现价 → `$…`（仓位 / 业绩主值；设计稿用 `$` 前缀，无 ≈）。
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
 * gAGX 奖励主值旁注：`≈ $…`（设计稿有 ≈ 才挂 Tile.Note）。
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
 * 贡献快照占位文本：未连接 / 加载中 → 空，有值 → 代币金额
 *
 * @param input.walletReady 钱包是否就绪
 * @param input.hasAddress 是否已连接地址
 * @param input.isPending 链上查询是否加载中
 * @param input.contribution 贡献值（bigint）
 * @param input.decimals 代币精度
 */
export function formatContributionPlaceholder(input: {
  walletReady: boolean
  hasAddress: boolean
  isPending: boolean
  contribution: bigint | undefined
  decimals: number
}): string {
  if (!input.walletReady || !input.hasAddress || input.contribution === undefined) {
    return formatApiContributionPoints(null)
  }
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
      ? formatNumber(Math.abs(signedAmount), { digits: 2, prefix: '$' })
      : formatNumber(0, { digits: 2, prefix: '$' })
  const orderAmount = parseApiAmount(item.order_amount)
  const orderLabel =
    orderAmount != null && orderAmount > 0
      ? formatNumber(orderAmount, { digits: 0, prefix: '$' })
      : formatNumber(0, { digits: 0, prefix: '$' })

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
      ? formatNumber(Math.abs(amountNum), { digits: 2, prefix: '$' })
      : formatNumber(0, { digits: 2, prefix: '$' })
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
      ? formatNumber(Math.abs(amountNum), { digits: 2, prefix: '$' })
      : formatNumber(0, { digits: 2, prefix: '$' })
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
 * @param agxPriceUsd AGX 美元单价；无价时 `$0.00`
 * @returns 绑定时间、地址、团队业绩与做市等级的单元格数组
 */
export function mapRankRewardTeamMemberToRow(
  item: RankRewardTeamMemberItem,
  agxPriceUsd: number | null,
): ReactNode[] {
  return [
    formatApiDateTime(item.bound_at),
    <ExplorerLink key={item.address} value={item.address} />,
    formatApiAgxUsdLabel(true, false, item.making_market, agxPriceUsd),
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
  if (raw == null) return TABLE_EMPTY
  const trimmed = raw.trim()
  if (!trimmed) return TABLE_EMPTY
  if (trimmed.endsWith('%')) return trimmed
  const n = parseApiAmount(trimmed)
  if (n == null) return TABLE_EMPTY
  return `${formatNumber(n, { digits: 2, trimZeros: true })}%`
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
    formatApiAmount(item.allowance_amount),
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
        {interpolate(labels.won, { amount: wonAmount })}
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
