import { useState } from 'react'

import { useAppShell } from '~/app/use-app-shell'
import {
  useReferralAwardDirectReferrals,
  useReferralAwardLogs,
  useReferralAwardSummary,
} from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { mapReferralAwardLogToCells } from '~/views/dapp/rewards/primitives'
import {
  bindApiLabelFormatters,
  mapReferralAwardDirectToRow,
  NON_NUMERIC_EMPTY,
  type RewardLogStatusLabels,
} from '~/views/dapp/rewards/shared'

/**
 * 推荐奖详情视图模型
 *
 * 聚合推荐奖汇总、奖励记录与直推成员列表。
 *
 * @see docs/backend-api/api.md #referral-award/summary
 */
export function useReferral() {
  const { messages: t } = useI18n()
  const referral = t.rewards.referral
  const { sessionReady } = useAppShell()
  const statusLabels = t.rewards.logStatus as RewardLogStatusLabels
  const [recordsPage, setRecordsPage] = useState(1)
  const [referralsPage, setReferralsPage] = useState(1)

  const summaryQuery = useReferralAwardSummary(sessionReady)
  const logsQuery = useReferralAwardLogs(tablePageQuery(recordsPage), sessionReady)
  const directsQuery = useReferralAwardDirectReferrals(tablePageQuery(referralsPage), sessionReady)

  const summary = summaryQuery.data
  const label = bindApiLabelFormatters(sessionReady, summaryQuery.isLoading)
  const totalRewards = label.stat(summary?.total_referral_reward)
  const myPosition = label.stat(summary?.active_stake_balance)
  const referralCount = label.count(summary?.direct_referral_count)
  const contributionValue = label.stat(summary?.available_contribution)

  const recordRows =
    logsQuery.data?.items.map((item) => mapReferralAwardLogToCells(item, statusLabels)) ?? []
  const referralRows =
    directsQuery.data?.items.map((item) => mapReferralAwardDirectToRow(item)) ?? []

  return {
    referral,
    totalRewards,
    myPosition,
    referralCount,
    contributionValue,
    nextPayout: NON_NUMERIC_EMPTY,
    recordRows,
    recordsLoading: sessionReady && logsQuery.isLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal: logsQuery.data?.total ?? 0,
    referralRows,
    referralsLoading: sessionReady && directsQuery.isLoading,
    referralsPage,
    setReferralsPage,
    referralsTotal: directsQuery.data?.total ?? 0,
  }
}
