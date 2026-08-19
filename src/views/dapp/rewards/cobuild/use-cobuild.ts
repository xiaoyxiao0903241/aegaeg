import {
  agxAmountToUsdProgressCurrent,
  parseMoneyish,
  progressPct,
  type TierReqBadge,
} from '~/core/rewards/cobuild-tier-progress'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import {
  useRankRewardLogs,
  useRankRewardPeerSurpassLogs,
  useRankRewardSummary,
  useRankRewardTeamMembers,
} from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { formatMakingRankLabel } from '~/shared/presenters/format'
import { useCobuildSessionStore } from '~/stores/rewards-session-store'
import { mapRankRewardLogToCells } from '~/views/dapp/rewards/primitives'
import {
  bindApiLabelFormatters,
  formatApiAgxUsdLabel,
  formatApiGagxApproxUsd,
  mapRankRewardTeamMemberToRow,
  NON_NUMERIC_EMPTY,
  type RewardLogStatusLabels,
} from '~/views/dapp/rewards/shared'

export type CobuildTierReq = {
  label: string
  hint: string
  value: string
  target: string
  badge: TierReqBadge
}

/**
 * 共建奖详情视图模型
 *
 * 聚合等级奖励接口（rank-reward）的汇总、等级记录与团队成员数据，
 * 计算当前 / 下一级档位与需求进度徽章，供详情页渲染。
 * Tab / 分页 / 隐藏 0 业绩在 `useCobuildSessionStore`（切 Tab 时 action 内归页）。
 *
 * @see docs/backend-api/api.md #rank-reward/summary
 * @see docs/backend-api/api.md #rank-reward/team-members
 */
export function useCobuild() {
  const { messages: t } = useI18n()
  const cobuild = t.rewards.cobuild
  const { sessionReady } = useDappHost()
  const agxPriceUsd = useAgxPriceUsd()
  const {
    recordsTab,
    setRecordsTab,
    recordsPage,
    setRecordsPage,
    directsPage,
    setDirectsPage,
    hideZeroMarket,
    setHideZeroMarket,
  } = useCobuildSessionStore()
  const statusLabels = t.rewards.logStatus as RewardLogStatusLabels
  const tierEmpty = t.rewards.hub.stats.tierEmpty
  const tierRows = t.rewards.hub.tierTable.rows
  const achievedLabel = cobuild.reqAchieved

  const summaryQuery = useRankRewardSummary(sessionReady)
  const pageParams = tablePageQuery(recordsPage)
  const cobuildLogsQuery = useRankRewardLogs(pageParams, sessionReady && recordsTab === 'cobuild')
  const equalizeLogsQuery = useRankRewardPeerSurpassLogs(
    pageParams,
    sessionReady && recordsTab === 'equalize',
  )
  const directsQuery = useRankRewardTeamMembers(
    { ...tablePageQuery(directsPage), hide_zero_market: hideZeroMarket },
    sessionReady,
  )

  const summary = summaryQuery.data
  const label = bindApiLabelFormatters(sessionReady, summaryQuery.isLoading)
  const pending = summaryQuery.isLoading
  const totalRewards = label.stat(summary?.total_rank_reward, { suffix: ' gAGX' })
  const totalRewardsApprox = formatApiGagxApproxUsd(
    sessionReady,
    pending,
    summary?.total_rank_reward,
    agxPriceUsd,
  )
  const totalPerformance = formatApiAgxUsdLabel(
    sessionReady,
    pending,
    summary?.making_market,
    agxPriceUsd,
  )
  const myPosition = formatApiAgxUsdLabel(
    sessionReady,
    pending,
    summary?.active_stake_balance,
    agxPriceUsd,
  )
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

  const holdingValue = formatApiAgxUsdLabel(
    sessionReady,
    pending,
    summary?.active_stake_balance,
    agxPriceUsd,
  )
  const accountsValue = label.count(summary?.effective_direct_referral_count)
  const performanceValue = formatApiAgxUsdLabel(
    sessionReady,
    pending,
    summary?.making_market,
    agxPriceUsd,
  )
  const teamMoney = reqRow?.team?.match(/\$[\d,]+/)?.[0] ?? ''
  /**
   * 进度徽章读数：未连接按 0（与展示的 0.00 对齐，显示「0%」）；
   * 冷启动加载中且无数据 → null（不画徽章）；已加载但缺字段按 0 AGX。
   * 持仓/做市门槛为 USD：无 AGX/$ 单价时不折、不画（禁 AGX↔$ 直比）。
   */
  const holdingCurrent = !sessionReady
    ? 0
    : summaryQuery.isLoading && summary == null
      ? null
      : agxAmountToUsdProgressCurrent(
          parseMoneyish(summary?.active_stake_balance) ?? 0,
          agxPriceUsd,
        )
  const accountsCurrent = !sessionReady
    ? 0
    : summaryQuery.isLoading && summary == null
      ? null
      : (summary?.effective_direct_referral_count ?? 0)
  const performanceCurrent = !sessionReady
    ? 0
    : summaryQuery.isLoading && summary == null
      ? null
      : agxAmountToUsdProgressCurrent(parseMoneyish(summary?.making_market) ?? 0, agxPriceUsd)

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
    directsQuery.data?.items.map((item) => mapRankRewardTeamMemberToRow(item, agxPriceUsd)) ?? []
  const achievedCount = tierReqs.filter((req) => req.badge.kind === 'achieved').length
  const currentRateLabel =
    tierCurrentRate !== NON_NUMERIC_EMPTY
      ? interpolate(cobuild.tierRate, { rate: tierCurrentRate })
      : NON_NUMERIC_EMPTY
  const nextRateLabel =
    tierNextRate !== NON_NUMERIC_EMPTY
      ? interpolate(cobuild.tierRate, { rate: tierNextRate })
      : NON_NUMERIC_EMPTY
  const tierHasNext = nextRow != null

  return {
    t,
    cobuild,
    sessionReady,
    recordsTab,
    setRecordsTab,
    contributionValue,
    referralCount,
    totalRewards,
    totalRewardsApprox,
    totalPerformance,
    myPosition,
    nextPayout: NON_NUMERIC_EMPTY,
    hideZeroMarket,
    setHideZeroMarket,
    tierCurrent,
    tierNext,
    tierCurrentRate: currentRateLabel,
    tierNextRate: nextRateLabel,
    tierHasNext,
    tierMaxLabel: cobuild.tierMax,
    tierProgressTitle: interpolate(cobuild.tierProgress, { level: tierNext }),
    tierProgressCount: interpolate(cobuild.tierProgressCount, {
      done: achievedCount,
      total: tierReqs.length,
    }),
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
