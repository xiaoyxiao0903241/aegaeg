import { useEffect, useState } from 'react'

import { useDappShell } from '~/app/use-dapp-shell'
import {
  useRankRewardLogs,
  useRankRewardPeerSurpassLogs,
  useRankRewardSummary,
  useRankRewardTeamMembers,
} from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { mapRankRewardLogToCells } from '~/views/dapp/rewards/detail/rewards-table-cells'
import {
  bindApiLabelFormatters,
  formatMakingRankLabel,
  mapRankRewardTeamMemberToRow,
  NON_NUMERIC_EMPTY,
  type RewardLogStatusLabels,
} from '~/views/dapp/rewards/rewards-display'

type CobuildRecordsTab = 'cobuild' | 'equalize'

type TierReqBadge = { kind: 'achieved' } | { kind: 'pct'; value: string } | { kind: 'empty' }

export type CobuildTierReq = {
  label: string
  hint: string
  value: string
  target: string
  badge: TierReqBadge
}

function parseMoneyish(raw: string | null | undefined): number | null {
  if (raw == null) return null
  const n = Number(String(raw).replace(/[$,%\s,]/g, ''))
  return Number.isFinite(n) ? n : null
}

/** 需求进度徽章：已达成 | n%（含 0%）| 无数字门槛则不画 */
function progressPct(current: number | null, targetRaw: string): TierReqBadge {
  const target = parseMoneyish(targetRaw)
  if (current == null) return { kind: 'empty' }
  if (target == null || target <= 0) return { kind: 'empty' }
  if (current >= target) return { kind: 'achieved' }
  const pct = Math.max(0, Math.min(99, Math.floor((current / target) * 100)))
  return { kind: 'pct', value: `${pct}%` }
}

/**
 * 共建奖详情视图模型
 *
 * 聚合等级奖励接口（rank-reward）的汇总、等级记录与直推成员数据，
 * 计算当前 / 下一级档位与需求进度徽章，供详情页渲染。
 *
 * @see docs/backend-api/api.md #rank-reward/summary
 */
export function useRewardsCobuildContentView() {
  const { messages: t } = useI18n()
  const cobuild = t.rewards.cobuild
  const { sessionReady } = useDappShell()
  const [recordsTab, setRecordsTab] = useState<CobuildRecordsTab>('cobuild')
  const [recordsPage, setRecordsPage] = useState(1)
  const [directsPage, setDirectsPage] = useState(1)
  const statusLabels = t.rewards.logStatus as RewardLogStatusLabels
  const tierEmpty = t.rewards.hub.stats.tierEmpty
  const tierRows = t.rewards.hub.tierTable.rows
  const achievedLabel = cobuild.reqAchieved

  useEffect(() => {
    setRecordsPage(1)
  }, [recordsTab])

  const summaryQuery = useRankRewardSummary(sessionReady)
  const pageParams = tablePageQuery(recordsPage)
  const cobuildLogsQuery = useRankRewardLogs(pageParams, sessionReady && recordsTab === 'cobuild')
  const equalizeLogsQuery = useRankRewardPeerSurpassLogs(
    pageParams,
    sessionReady && recordsTab === 'equalize',
  )
  const directsQuery = useRankRewardTeamMembers(tablePageQuery(directsPage), sessionReady)

  const summary = summaryQuery.data
  const label = bindApiLabelFormatters(sessionReady, summaryQuery.isLoading)
  const totalRewards = label.stat(summary?.total_rank_reward)
  const totalPerformance = label.stat(summary?.making_market)
  const myPosition = label.stat(summary?.active_stake_balance)
  const referralCount = label.count(summary?.direct_referral_count)
  const contributionValue = label.stat(summary?.available_contribution)

  const rank = sessionReady ? summary?.making_rank : null
  const hasRank = rank != null && Number.isFinite(rank) && rank > 0
  const truncRank = hasRank ? Math.trunc(rank) : 0
  const tierCurrent =
    !sessionReady || (summaryQuery.isLoading && summary == null)
      ? tierEmpty
      : formatMakingRankLabel(rank, tierEmpty)
  const currentRow = hasRank ? tierRows.find((row) => row.level === `A${truncRank}`) : undefined
  const currentIndex = hasRank ? tierRows.findIndex((row) => row.level === `A${truncRank}`) : -1
  /**
   * 下一级档位：未达任何档 → A1；已达 → 机制表下一行（A4→A5；A13→终身成就奖）。
   * 需求门槛与进度徽章一律对齐「下一级」档位。
   */
  const nextRow = hasRank
    ? currentIndex >= 0
      ? tierRows[currentIndex + 1]
      : tierRows.find((row) => row.level === `A${truncRank + 1}`)
    : tierRows.find((row) => row.level === 'A1')
  const reqRow = nextRow ?? currentRow
  const tierNext = nextRow?.level ?? NON_NUMERIC_EMPTY
  const tierCurrentRate = currentRow?.rate ?? NON_NUMERIC_EMPTY
  const tierNextRate = nextRow?.rate ?? NON_NUMERIC_EMPTY

  const holdingValue = label.stat(summary?.active_stake_balance)
  const accountsValue = label.count(summary?.effective_direct_referral_count)
  const performanceValue = label.stat(summary?.making_market)
  const teamMoney = reqRow?.team?.match(/\$[\d,]+/)?.[0] ?? ''
  /**
   * 进度徽章读数：未连接按 0（与展示的 0.00 对齐，显示「0%」）；
   * 冷启动加载中且无数据 → null（不画徽章）；已加载但缺字段按 0。
   */
  const holdingCurrent = !sessionReady
    ? 0
    : summaryQuery.isLoading && summary == null
      ? null
      : (parseMoneyish(summary?.active_stake_balance) ?? 0)
  const accountsCurrent = !sessionReady
    ? 0
    : summaryQuery.isLoading && summary == null
      ? null
      : (summary?.effective_direct_referral_count ?? 0)
  const performanceCurrent = !sessionReady
    ? 0
    : summaryQuery.isLoading && summary == null
      ? null
      : (parseMoneyish(summary?.making_market) ?? 0)

  const tierReqs: CobuildTierReq[] = [
    {
      label: cobuild.reqHolding,
      hint: cobuild.reqHoldingHint,
      value: holdingValue,
      target: reqRow?.holding ? `/ ${reqRow.holding}` : `/ ${NON_NUMERIC_EMPTY}`,
      badge: progressPct(holdingCurrent, reqRow?.holding ?? ''),
    },
    {
      label: cobuild.reqAccounts,
      hint: cobuild.reqAccountsHint,
      value: accountsValue,
      target: reqRow?.accounts ? `/ ${reqRow.accounts}` : `/ ${NON_NUMERIC_EMPTY}`,
      badge: progressPct(accountsCurrent, reqRow?.accounts ?? ''),
    },
    {
      label: cobuild.reqPerformance,
      hint: cobuild.reqPerformanceHint,
      value: performanceValue,
      target: teamMoney ? `/ ${teamMoney}` : `/ ${NON_NUMERIC_EMPTY}`,
      badge: progressPct(performanceCurrent, teamMoney),
    },
  ]

  const activeLogsQuery = recordsTab === 'cobuild' ? cobuildLogsQuery : equalizeLogsQuery
  const recordRows =
    activeLogsQuery.data?.items.map((item) => mapRankRewardLogToCells(item, statusLabels)) ?? []
  const directRows =
    directsQuery.data?.items.map((item) => mapRankRewardTeamMemberToRow(item)) ?? []

  return {
    t,
    cobuild,
    sessionReady,
    recordsTab,
    setRecordsTab,
    contributionValue,
    referralCount,
    totalRewards,
    totalPerformance,
    myPosition,
    nextPayout: NON_NUMERIC_EMPTY,
    tierCurrent,
    tierNext,
    tierCurrentRate,
    tierNextRate,
    achievedLabel,
    tierReqs,
    recordRows,
    recordsLoading: sessionReady && activeLogsQuery.isLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal: activeLogsQuery.data?.total ?? 0,
    directRows,
    directsLoading: sessionReady && directsQuery.isLoading,
    directsPage,
    setDirectsPage,
    directsTotal: directsQuery.data?.total ?? 0,
    recordsTabOptions: [
      { label: cobuild.recordsTabCobuild, value: 'cobuild' as const },
      { label: cobuild.recordsTabEqualize, value: 'equalize' as const },
    ],
  }
}
