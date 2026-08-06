import type { ReactNode } from 'react'

import { formatApiAmount, parseApiAmount } from '~/shared/api/format-display'
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
import { ChipTabs } from '~/shared/components/chip-tabs'
import { Text } from '~/shared/components/text'
import {
  daoGrantStatusTone,
  formatDaoGrantStatus,
  mapMarketAllowanceClaimLogToRow,
  mapMarketAllowancePaidLogToRow,
  mapParticipationAwardLogToRow,
  mapRankRewardLogToRow,
  mapReferralAwardLogToRow,
  NON_NUMERIC_EMPTY,
  type RewardLogStatusLabels,
} from '~/views/dapp/rewards/shared'

type PillOption = { label: string; value: string }

/**
 * 奖励记录表的 pill Tab 表头
 *
 * @param args.ariaLabel Tab 组无障碍标签
 * @param args.options Tab 选项
 * @param args.value 当前选中值
 * @param args.onChange 切换回调
 */
export function rewardsRecordsChipTabsHeader(args: {
  ariaLabel: string
  options: readonly PillOption[]
  value: string
  onChange: (value: string) => void
}) {
  const { ariaLabel, options, value, onChange } = args
  return (
    <ChipTabs
      activeTone="coral"
      ariaLabel={ariaLabel}
      className="justify-start"
      items={options.map((option) => ({
        active: option.value === value,
        label: option.label,
      }))}
      onSelect={(index) => {
        const next = options[index]
        if (next) onChange(next.value)
      }}
    />
  )
}

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
  const n = parseApiAmount(raw)
  if (n == null || n === 0) {
    return {
      text: formatApiAmount(raw, { digits: 4, suffix: ' gAGX' }),
      positive: false,
      negative: false,
    }
  }
  const abs = formatApiAmount(String(Math.abs(n)), { digits: 4, suffix: ' gAGX' })
  if (n > 0) return { text: `+${abs}`, positive: true, negative: false }
  return { text: `−${abs}`, positive: false, negative: true }
}

/** 发展津贴发放表：类型标签 + 带正负色的津贴数量 */
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
