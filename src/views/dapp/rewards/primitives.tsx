/**
 * 奖励详情表展示组件
 *
 * 提供记录表的 Tab 头、状态徽标与各奖励域的表格单元格映射。
 */
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

import type {
  DaoGrantStatus,
  MarketAllowancePaidLogItem,
  ParticipationAwardLogItem,
  RankRewardLogItem,
  RankRewardPeerSurpassLogItem,
  ReferralAwardLogItem,
} from '~/shared/api/types'
import { StatusBadge } from '~/shared/components/badge'
import { ChipTabs } from '~/shared/components/chip-tabs'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { formatApiAmount, parseApiAmount } from '~/shared/presenters/format'
import {
  daoGrantStatusTone,
  formatDaoGrantStatus,
  mapDaoGrantAwardLogToRow,
  mapMarketAllowancePaidLogToRow,
  mapRankRewardLogToRow,
  NON_NUMERIC_EMPTY,
  type RewardLogStatusLabels,
} from '~/views/dapp/rewards/shared'

type PillOption = { label: string; value: string }

/**
 * 「隐藏 0」勾选：表标题行右侧；勾选后请求只返回非零业绩 / 持仓。
 */
export function HideZeroToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: (next: boolean) => void
}) {
  return (
    <button
      aria-checked={checked}
      className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-foreground/55 transition-colors hover:text-foreground"
      onClick={() => onChange(!checked)}
      role="checkbox"
      type="button"
    >
      <span
        aria-hidden
        className={cn(
          'grid size-3.75 shrink-0 place-items-center rounded-[0.25rem] border-[1.5px] transition-colors',
          checked ? 'border-primary bg-primary' : 'border-foreground/30 bg-transparent',
        )}
      >
        <Check
          aria-hidden
          className={cn('size-2.25 text-white', checked ? 'opacity-100' : 'opacity-0')}
          strokeWidth={3}
        />
      </span>
      <Text as="span" variant="caption">
        {label}
      </Text>
    </button>
  )
}

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
  const cells = mapDaoGrantAwardLogToRow(item, labels)
  return [cells[0], cells[1], statusBadge(item.status, labels), cells[3]]
}

export function mapParticipationAwardLogToCells(
  item: ParticipationAwardLogItem,
  labels: RewardLogStatusLabels,
): ReactNode[] {
  const cells = mapDaoGrantAwardLogToRow(item, labels)
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
