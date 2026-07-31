import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import {
  useMarketAllowanceClaimLogs,
  useMarketAllowancePaidLogs,
  useMarketAllowanceSummary,
} from '~/hooks/use-api-data'
import {
  formatApiStatLabel,
  formatMakingRankLabel,
  mapMarketAllowanceClaimLogToRow,
  mapMarketAllowancePaidLogToRow,
} from '~/views/dapp/rewards/rewards-display'

type GrantRecordsTab = 'issue' | 'claim'

export function useRewardsGrantContentView() {
  const { messages: t } = useI18n()
  const grant = t.rewards.grant
  const { sessionReady } = useDappShell()
  const [recordsTab, setRecordsTab] = useState<GrantRecordsTab>('issue')
  const tierEmpty = t.rewards.hub.stats.tierEmpty

  const summaryQuery = useMarketAllowanceSummary(sessionReady)
  const issueLogsQuery = useMarketAllowancePaidLogs({}, sessionReady && recordsTab === 'issue')
  const claimLogsQuery = useMarketAllowanceClaimLogs({}, sessionReady && recordsTab === 'claim')

  const summary = summaryQuery.data
  const tier = !sessionReady
    ? tierEmpty
    : summaryQuery.isLoading && summary == null
      ? '…'
      : formatMakingRankLabel(summary?.making_rank, tierEmpty)
  const totalClaimed = formatApiStatLabel(
    sessionReady,
    summaryQuery.isLoading,
    summary?.total_claimed_allowance,
  )

  const isIssue = recordsTab === 'issue'
  const recordRows = isIssue
    ? (issueLogsQuery.data?.items.map((item) => mapMarketAllowancePaidLogToRow(item)) ?? [])
    : (claimLogsQuery.data?.items.map((item) => mapMarketAllowanceClaimLogToRow(item)) ?? [])
  const recordsLoading =
    sessionReady && (isIssue ? issueLogsQuery.isLoading : claimLogsQuery.isLoading)

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
  }
}
