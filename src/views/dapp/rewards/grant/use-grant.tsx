import { useEffect, useState } from 'react'

import { useAppShell } from '~/app/use-app-shell'
import {
  useMarketAllowanceClaimLogs,
  useMarketAllowancePaidLogs,
  useMarketAllowanceSummary,
} from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import {
  mapMarketAllowanceClaimLogToCells,
  mapMarketAllowancePaidLogToCells,
} from '~/views/dapp/rewards/primitives'
import { formatApiStatLabel, formatMakingRankLabel } from '~/views/dapp/rewards/shared'

type GrantRecordsTab = 'issue' | 'claim'

/**
 * 发展津贴详情视图模型
 *
 * 聚合发展津贴汇总与发放 / 领取明细，按 Tab 切换列表。
 *
 * @see docs/backend-api/api.md #market-allowance/summary
 */
export function useGrant() {
  const { messages: t } = useI18n()
  const grant = t.rewards.grant
  const { sessionReady } = useAppShell()
  const [recordsTab, setRecordsTab] = useState<GrantRecordsTab>('issue')
  const [recordsPage, setRecordsPage] = useState(1)
  const tierEmpty = t.rewards.hub.stats.tierEmpty

  useEffect(() => {
    setRecordsPage(1)
  }, [recordsTab])

  const summaryQuery = useMarketAllowanceSummary(sessionReady)
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
  const tier = !sessionReady
    ? tierEmpty
    : summaryQuery.isLoading && summary == null
      ? '0.00'
      : formatMakingRankLabel(summary?.making_rank, tierEmpty)
  const totalClaimed = formatApiStatLabel(
    sessionReady,
    summaryQuery.isLoading,
    summary?.total_claimed_allowance,
  )

  const isIssue = recordsTab === 'issue'
  const activeLogsQuery = isIssue ? issueLogsQuery : claimLogsQuery
  const recordRows = isIssue
    ? (issueLogsQuery.data?.items.map((item) => mapMarketAllowancePaidLogToCells(item)) ?? [])
    : (claimLogsQuery.data?.items.map((item) => mapMarketAllowanceClaimLogToCells(item)) ?? [])
  const recordsLoading = sessionReady && activeLogsQuery.isLoading

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
    recordRows,
    recordsLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal: activeLogsQuery.data?.total ?? 0,
  }
}
