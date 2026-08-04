import type { ReactNode } from 'react'

import type {
  DaoGrantStatus,
  MarketAllowanceClaimLogItem,
  MarketAllowancePaidLogItem,
  ParticipationAwardLogItem,
  RankRewardLogItem,
  RankRewardPeerSurpassLogItem,
  ReferralAwardLogItem,
} from '~/shared/api/types'
import { StatusBadge } from '~/shared/components/badge'
import { Text } from '~/shared/components/text'
import {
  daoGrantStatusTone,
  formatApiDecimalAmount,
  formatDaoGrantStatus,
  mapMarketAllowanceClaimLogToRow,
  mapMarketAllowancePaidLogToRow,
  mapParticipationAwardLogToRow,
  mapRankRewardLogToRow,
  mapReferralAwardLogToRow,
  NON_NUMERIC_EMPTY,
  type RewardLogStatusLabels,
} from '~/views/dapp/rewards/rewards-display'

function statusBadge(status: DaoGrantStatus, labels: RewardLogStatusLabels): ReactNode {
  return (
    <StatusBadge tone={daoGrantStatusTone(status)}>
      {formatDaoGrantStatus(status, labels)}
    </StatusBadge>
  )
}

export function mapReferralAwardLogToCells(
  item: ReferralAwardLogItem,
  labels: RewardLogStatusLabels,
): ReactNode[] {
  const cells = mapReferralAwardLogToRow(item, labels)
  return [cells[0], cells[1], statusBadge(item.status, labels), cells[3]]
}

export function mapParticipationAwardLogToCells(
  item: ParticipationAwardLogItem,
  labels: RewardLogStatusLabels,
): ReactNode[] {
  const cells = mapParticipationAwardLogToRow(item, labels)
  return [cells[0], cells[1], statusBadge(item.status, labels), cells[3]]
}

export function mapRankRewardLogToCells(
  item: RankRewardLogItem | RankRewardPeerSurpassLogItem,
  labels: RewardLogStatusLabels,
): ReactNode[] {
  const cells = mapRankRewardLogToRow(item, labels)
  return [cells[0], cells[1], cells[2], statusBadge(item.status, labels), cells[4]]
}

function formatSignedAllowance(raw: string): {
  text: string
  positive: boolean
  negative: boolean
} {
  const n = Number(raw)
  if (!Number.isFinite(n) || n === 0) {
    return {
      text: formatApiDecimalAmount(raw, { digits: 4, suffix: ' gAGX' }),
      positive: false,
      negative: false,
    }
  }
  const abs = formatApiDecimalAmount(String(Math.abs(n)), { digits: 4, suffix: ' gAGX' })
  if (n > 0) return { text: `+${abs}`, positive: true, negative: false }
  return { text: `−${abs}`, positive: false, negative: true }
}

/** Grant 发放表：类型 pill · 津贴数量 +/- 色（稿 4411:238） */
export function mapMarketAllowancePaidLogToCells(item: MarketAllowancePaidLogItem): ReactNode[] {
  const base = mapMarketAllowancePaidLogToRow(item)
  const op = item.operation_type
  const signed = formatSignedAllowance(item.allowance_amount)
  const typeBadge =
    op === '质押' ? (
      <StatusBadge tone="pending">{op}</StatusBadge>
    ) : op === '赎回' ? (
      <Text
        as="span"
        className="inline-flex items-center rounded-full bg-claim-restake/10 px-2.5 py-0.75 leading-none font-semibold text-claim-restake"
        variant="support"
      >
        {op}
      </Text>
    ) : (
      <Text as="span" className="text-foreground/70" variant="copy">
        {op || NON_NUMERIC_EMPTY}
      </Text>
    )

  return [
    base[0],
    base[1],
    typeBadge,
    base[3],
    base[4],
    <Text
      as="span"
      className={
        signed.positive
          ? 'font-semibold text-success'
          : signed.negative
            ? 'font-semibold text-coral-emphasis'
            : 'font-semibold'
      }
      key="allowance"
      variant="copy"
    >
      {signed.text}
    </Text>,
  ]
}

export function mapMarketAllowanceClaimLogToCells(item: MarketAllowanceClaimLogItem): ReactNode[] {
  return mapMarketAllowanceClaimLogToRow(item)
}
