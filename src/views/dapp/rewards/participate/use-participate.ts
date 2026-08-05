import { useState } from 'react'

import { useAppShell } from '~/app/use-app-shell'
import {
  useParticipationAwardInviter,
  useParticipationAwardLogs,
  useParticipationAwardSummary,
} from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { mapParticipationAwardLogToCells } from '~/views/dapp/rewards/primitives'
import {
  formatApiStatLabel,
  mapParticipationAwardInviterToRow,
  NON_NUMERIC_EMPTY,
  type RewardLogStatusLabels,
} from '~/views/dapp/rewards/shared'

/**
 * 参与奖详情视图模型
 *
 * 聚合参与奖汇总、参与记录与邀请人信息。
 *
 * @see docs/backend-api/api.md #participation-award/summary
 */
export function useParticipate() {
  const { messages: t } = useI18n()
  const participate = t.rewards.participate
  const { sessionReady } = useAppShell()
  const statusLabels = t.rewards.logStatus as RewardLogStatusLabels
  const [recordsPage, setRecordsPage] = useState(1)

  const summaryQuery = useParticipationAwardSummary(sessionReady)
  const logsQuery = useParticipationAwardLogs(tablePageQuery(recordsPage), sessionReady)
  const inviterQuery = useParticipationAwardInviter(sessionReady)

  const summary = summaryQuery.data
  const totalRewards = formatApiStatLabel(
    sessionReady,
    summaryQuery.isLoading,
    summary?.total_participation_reward,
  )
  const myPosition = formatApiStatLabel(
    sessionReady,
    summaryQuery.isLoading,
    summary?.active_stake_balance,
  )
  const contributionValue = formatApiStatLabel(
    sessionReady,
    summaryQuery.isLoading,
    summary?.available_contribution,
  )

  const recordRows =
    logsQuery.data?.items.map((item) => mapParticipationAwardLogToCells(item, statusLabels)) ?? []
  const inviter = inviterQuery.data?.inviter
  const inviterRows = inviter != null ? [mapParticipationAwardInviterToRow(inviter)] : []

  return {
    participate,
    totalRewards,
    myPosition,
    contributionValue,
    nextPayout: NON_NUMERIC_EMPTY,
    recordRows,
    recordsLoading: sessionReady && logsQuery.isLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal: logsQuery.data?.total ?? 0,
    inviterRows,
    inviterLoading: sessionReady && inviterQuery.isLoading,
  }
}
