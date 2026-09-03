import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import {
  useMarketAllowanceClaimLogs,
  useMarketAllowancePaidLogs,
  useMarketAllowanceSummary,
} from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { formatMakingRankLabel } from '~/shared/presenters/format'
import { useGrantSessionStore } from '~/stores/rewards-session-store'
import { mapMarketAllowancePaidLogToCells } from '~/views/dapp/rewards/primitives'
import {
  formatApiGagxApproxUsd,
  formatApiStatLabel,
  mapMarketAllowanceClaimLogToRow,
} from '~/views/dapp/rewards/shared'

/**
 * 发展津贴详情视图模型
 *
 * 聚合发展津贴汇总与发放 / 领取明细，按 Tab 切换列表。
 * Tab / 分页在 `useGrantSessionStore`（切 Tab 时 action 内归页）。
 *
 * @see docs/backend-api/api.md #market-allowance/summary
 */
export function useGrant() {
  const { messages: t } = useI18n()
  const grant = t.rewards.grant
  const { sessionReady } = useDappHost()
  const { recordsTab, setRecordsTab, recordsPage, setRecordsPage } = useGrantSessionStore()
  const tierEmpty = t.rewards.hub.stats.tierEmpty

  const summaryQuery = useMarketAllowanceSummary(sessionReady)
  const priceUsd = useAgxPriceUsd()
  const pageParams = tablePageQuery(recordsPage)
  const issueLogsQuery = useMarketAllowancePaidLogs(
    pageParams,
    sessionReady && recordsTab === 'issue',
  )
  const claimLogsQuery = useMarketAllowanceClaimLogs(
    pageParams,
    sessionReady && recordsTab === 'claim',
  )

  const summary = summaryQuery.data
  const pending = summaryQuery.isLoading
  const tier = !sessionReady
    ? tierEmpty
    : pending && summary == null
      ? '0.00'
      : formatMakingRankLabel(summary?.making_rank, tierEmpty, summary)
  const totalClaimed = formatApiStatLabel(sessionReady, pending, summary?.total_claimed_allowance, {
    suffix: ' gAGX',
  })
  const totalClaimedApprox = formatApiGagxApproxUsd(
    sessionReady,
    pending,
    summary?.total_claimed_allowance,
    priceUsd,
  )

  const isIssue = recordsTab === 'issue'
  const activeLogsQuery = isIssue ? issueLogsQuery : claimLogsQuery
  const recordRows = isIssue
    ? (issueLogsQuery.data?.items.map((item) => mapMarketAllowancePaidLogToCells(item)) ?? [])
    : (claimLogsQuery.data?.items.map((item) => mapMarketAllowanceClaimLogToRow(item)) ?? [])

  return {
    grant,
    recordsTab,
    setRecordsTab,
    recordsTabOptions: [
      { label: grant.recordsTabIssue, value: 'issue' as const },
      { label: grant.recordsTabClaim, value: 'claim' as const },
    ],
    isIssue,
    tier,
    totalClaimed,
    totalClaimedApprox,
    recordRows,
    recordsLoading: sessionReady && activeLogsQuery.isLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal: activeLogsQuery.data?.total ?? 0,
  }
}
