import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import {
  useRankRewardLogs,
  useRankRewardPeerSurpassLogs,
  useRankRewardSummary,
  useRankRewardTeamMembers,
} from '~/hooks/use-api-data'
import {
  bindApiLabelFormatters,
  formatMakingRankLabel,
  mapRankRewardLogToRow,
  mapRankRewardTeamMemberToRow,
  REWARDS_DASH,
  type RewardLogStatusLabels,
} from '~/views/dapp/rewards/rewards-display'

type CobuildRecordsTab = 'cobuild' | 'equalize'

export function useRewardsCobuildContentView() {
  const { messages: t } = useI18n()
  const cobuild = t.rewards.cobuild
  const { sessionReady } = useDappShell()
  const [recordsTab, setRecordsTab] = useState<CobuildRecordsTab>('cobuild')
  const statusLabels = t.rewards.logStatus as RewardLogStatusLabels
  const tierEmpty = t.rewards.hub.stats.tierEmpty

  const summaryQuery = useRankRewardSummary(sessionReady)
  const cobuildLogsQuery = useRankRewardLogs({}, sessionReady && recordsTab === 'cobuild')
  const equalizeLogsQuery = useRankRewardPeerSurpassLogs(
    {},
    sessionReady && recordsTab === 'equalize',
  )
  const directsQuery = useRankRewardTeamMembers({}, sessionReady)

  const summary = summaryQuery.data
  const label = bindApiLabelFormatters(sessionReady, summaryQuery.isLoading)
  const totalRewards = label.stat(summary?.total_rank_reward)
  const totalPerformance = label.stat(summary?.making_market)
  const myPosition = label.stat(summary?.active_stake_balance)
  const referralCount = label.count(summary?.direct_referral_count)
  const contributionValue = label.stat(summary?.available_contribution)
  const tierCurrent = !sessionReady
    ? tierEmpty
    : summaryQuery.isLoading && summary == null
      ? '…'
      : formatMakingRankLabel(summary?.making_rank, tierEmpty)
  const reqHolding = label.stat(summary?.active_stake_balance)
  const reqAccounts = label.count(summary?.effective_direct_referral_count)
  const reqPerformance = label.stat(summary?.making_market)

  const activeLogsQuery = recordsTab === 'cobuild' ? cobuildLogsQuery : equalizeLogsQuery
  const recordRows =
    activeLogsQuery.data?.items.map((item) => mapRankRewardLogToRow(item, statusLabels)) ?? []
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
    nextPayout: REWARDS_DASH,
    tierCurrent,
    tierNext: REWARDS_DASH,
    reqHolding,
    reqAccounts,
    reqPerformance,
    recordRows,
    recordsLoading: sessionReady && activeLogsQuery.isLoading,
    directRows,
    directsLoading: sessionReady && directsQuery.isLoading,
    recordsTabOptions: [
      { label: cobuild.recordsTabCobuild, value: 'cobuild' as const },
      { label: cobuild.recordsTabEqualize, value: 'equalize' as const },
    ],
  }
}
