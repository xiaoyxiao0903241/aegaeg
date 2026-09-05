import { cobuildTeamSortToParams } from '~/core/rewards/cobuild-team-sort'
import {
  cobuildLevelFromRank,
  type CobuildLevelId,
  cobuildNextReqSpecs,
  cobuildNextTier,
  cobuildReqGridCols,
  type CobuildReqSpec,
} from '~/core/rewards/cobuild-tier-ladder'
import {
  agxAmountToUsdProgressCurrent,
  dualLineProgressBadge,
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
import {
  formatDecimal,
  formatMakingRankBoostSuffix,
  interpolateLive,
  makingRankDisplayRank,
} from '~/shared/presenters/format'
import { useCobuildSessionStore } from '~/stores/rewards-session-store'
import { mapRankRewardLogToCells } from '~/views/dapp/rewards/primitives'
import {
  formatApiAgxUsdLabel,
  formatApiContributionStatLabel,
  formatApiCountLabel,
  formatApiGagxApproxUsd,
  formatApiStatLabel,
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

type CobuildCopy = ReturnType<typeof useI18n>['messages']['rewards']['cobuild']
type HubTierRow = { level: string; rate: string }

function cobuildRateOf(id: CobuildLevelId, rows: readonly HubTierRow[]): string {
  if (id === 'NONE') return NON_NUMERIC_EMPTY
  if (id === 'LIFETIME') return rows[rows.length - 1]?.rate ?? NON_NUMERIC_EMPTY
  return rows.find((row) => row.level === id)?.rate ?? NON_NUMERIC_EMPTY
}

function cobuildLevelLabel(id: CobuildLevelId, cobuild: CobuildCopy): string {
  if (id === 'NONE') return cobuild.tierNoLevel
  if (id === 'LIFETIME') return cobuild.tierLifetime
  return id
}

function usdLabel(n: number): string {
  return formatDecimal(n, { prefix: '$' })
}

function specToReq(
  spec: CobuildReqSpec,
  cobuild: CobuildCopy,
  preview: {
    holding: string
    accounts: string
    performance: string
    dualLines: string
    otherLine: string
    holdingCurrent: number | null
    accountsCurrent: number | null
    performanceCurrent: number | null
    dualLinesCurrent: number | null
    dualLineQualified: boolean | null
    otherLineCurrent: number | null
  },
): CobuildTierReq {
  if (spec.kind === 'holding') {
    return {
      label: cobuild.reqHolding,
      hint: cobuild.reqHoldingHint,
      value: preview.holding,
      target: `/ ${usdLabel(spec.targetUsd)}`,
      badge: progressPct(preview.holdingCurrent, String(spec.targetUsd)),
    }
  }
  if (spec.kind === 'accounts') {
    return {
      label: cobuild.reqAccounts,
      hint: cobuild.reqAccountsHint,
      value: preview.accounts,
      target: `/ ${spec.target}`,
      badge: progressPct(preview.accountsCurrent, String(spec.target)),
    }
  }
  if (spec.kind === 'volume') {
    return {
      label: cobuild.reqPerformance,
      hint: cobuild.reqPerformanceHint,
      value: preview.performance,
      target: `/ ${usdLabel(spec.targetUsd)}`,
      badge: progressPct(preview.performanceCurrent, String(spec.targetUsd)),
    }
  }
  if (spec.kind === 'dual') {
    return {
      label: interpolate(cobuild.reqDualLines, { level: spec.lineLevel }),
      hint: interpolate(cobuild.reqDualLinesHint, { level: spec.lineLevel }),
      value: preview.dualLines,
      target: `/ ${cobuild.reqDualLinesTarget}`,
      badge: dualLineProgressBadge(
        preview.dualLinesCurrent,
        preview.dualLineQualified,
        spec.target,
      ),
    }
  }
  return {
    label: cobuild.reqOtherLine,
    hint: interpolate(cobuild.reqOtherLineHint, { level: spec.lineLevel }),
    value: preview.otherLine,
    target: `/ ${usdLabel(spec.targetUsd)}`,
    badge: progressPct(preview.otherLineCurrent, String(spec.targetUsd)),
  }
}

/**
 * 共建奖详情视图模型
 *
 * 聚合等级奖励接口（rank-reward）的汇总、等级记录与团队成员数据，
 * 按接口 `making_rank` 计算下一档条件（A1–A5 总业绩、A6–A9 双线+其他线、A10 起仅双线）。
 * Tab / 分页 / 隐藏 0 业绩 / 团队列头排序在 `useCobuildSessionStore`（切 Tab 时 action 内归页）。
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
    teamSort,
    setTeamSortColumn,
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
    {
      ...tablePageQuery(directsPage),
      hide_zero_market: hideZeroMarket,
      ...cobuildTeamSortToParams(teamSort),
    },
    sessionReady,
  )

  const summary = summaryQuery.data
  const pending = summaryQuery.isLoading
  const totalRewards = formatApiStatLabel(summary?.total_rank_reward, { suffix: ' gAGX' })
  const totalRewardsApprox = formatApiGagxApproxUsd(summary?.total_rank_reward, agxPriceUsd)
  const totalPerformance = formatApiAgxUsdLabel(summary?.making_market, agxPriceUsd)
  const myPosition = formatApiAgxUsdLabel(summary?.active_stake_balance, agxPriceUsd)
  const referralCount = formatApiCountLabel(summary?.direct_referral_count)
  const contributionValue = formatApiContributionStatLabel(summary?.available_contribution)

  const currentLevel = cobuildLevelFromRank(
    sessionReady ? makingRankDisplayRank(summary?.making_rank, summary) : null,
  )
  const isNone = currentLevel === 'NONE'
  const nextDef = cobuildNextTier(currentLevel)
  const liveLoading = !sessionReady || (pending && summary == null)

  const tierCurrent = liveLoading
    ? tierEmpty
    : `${cobuildLevelLabel(currentLevel, cobuild)}${formatMakingRankBoostSuffix(summary)}`
  const tierNext = nextDef == null ? NON_NUMERIC_EMPTY : cobuildLevelLabel(nextDef.id, cobuild)
  const tierCurrentRate =
    isNone || liveLoading ? NON_NUMERIC_EMPTY : cobuildRateOf(currentLevel, tierRows)
  const tierNextRate = nextDef == null ? NON_NUMERIC_EMPTY : cobuildRateOf(nextDef.id, tierRows)

  const holdingValue = formatApiAgxUsdLabel(summary?.active_stake_balance, agxPriceUsd)
  const accountsValue = formatApiCountLabel(summary?.effective_direct_referral_count)
  const performanceValue = formatApiAgxUsdLabel(summary?.making_market, agxPriceUsd)
  /**
   * 进度徽章读数：未连接按 0（与展示的 0.00 对齐，显示「0%」）；
   * 冷启动加载中且无数据 → null（不画徽章）；已加载但缺字段按 0。
   * 持仓 / 做市 / 其他线门槛为 USD：无 AGX/$ 单价时不折、不画（禁 AGX↔$ 直比）。
   * 双线是否达成以后端 `is_dual_line_qualified` 为准。
   */
  const holdingCurrent = !sessionReady
    ? 0
    : pending && summary == null
      ? null
      : agxAmountToUsdProgressCurrent(
          parseMoneyish(summary?.active_stake_balance) ?? 0,
          agxPriceUsd,
        )
  const accountsCurrent = !sessionReady
    ? 0
    : pending && summary == null
      ? null
      : (summary?.effective_direct_referral_count ?? 0)
  const performanceCurrent = !sessionReady
    ? 0
    : pending && summary == null
      ? null
      : agxAmountToUsdProgressCurrent(parseMoneyish(summary?.making_market) ?? 0, agxPriceUsd)
  const dualLinesCurrent = !sessionReady
    ? 0
    : pending && summary == null
      ? null
      : (summary?.qualified_direct_rank_count ?? 0)
  const dualLineQualified = !sessionReady
    ? false
    : pending && summary == null
      ? null
      : (summary?.is_dual_line_qualified ?? false)
  const otherLineCurrent = !sessionReady
    ? 0
    : pending && summary == null
      ? null
      : agxAmountToUsdProgressCurrent(parseMoneyish(summary?.other_lines_market) ?? 0, agxPriceUsd)
  const dualLinesValue = interpolateLive(cobuild.reqDualLinesValue, {
    count: formatApiCountLabel(summary?.qualified_direct_rank_count),
  })
  const otherLineValue = formatApiAgxUsdLabel(summary?.other_lines_market, agxPriceUsd)

  const tierReqs: CobuildTierReq[] = cobuildNextReqSpecs(currentLevel).map((spec) =>
    specToReq(spec, cobuild, {
      holding: holdingValue,
      accounts: accountsValue,
      performance: performanceValue,
      dualLines: dualLinesValue,
      otherLine: otherLineValue,
      holdingCurrent,
      accountsCurrent,
      performanceCurrent,
      dualLinesCurrent,
      dualLineQualified,
      otherLineCurrent,
    }),
  )

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
  const tierHasNext = nextDef != null

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
    hideZeroMarket,
    setHideZeroMarket,
    teamSort,
    setTeamSortColumn,
    tierCurrent,
    tierNext,
    tierCurrentRate: currentRateLabel,
    tierNextRate: nextRateLabel,
    tierHasNext,
    tierMaxLabel: cobuild.tierMax,
    noLevelHint: isNone && !liveLoading ? cobuild.tierNoLevelHint : null,
    reqCols: cobuildReqGridCols(tierReqs.length),
    tierProgressTitle: interpolate(isNone ? cobuild.tierProgressReach : cobuild.tierProgress, {
      level: tierNext,
    }),
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
