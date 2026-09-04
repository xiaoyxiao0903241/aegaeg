import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import {
  useReferralAwardDirectReferrals,
  useReferralAwardLogs,
  useReferralAwardSummary,
} from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { useReferralSessionStore } from '~/stores/rewards-session-store'
import { mapReferralAwardLogToCells } from '~/views/dapp/rewards/primitives'
import {
  formatApiAgxUsdLabel,
  formatApiContributionStatLabel,
  formatApiCountLabel,
  formatApiGagxApproxUsd,
  formatApiStatLabel,
  mapReferralAwardDirectToRow,
  type RewardLogStatusLabels,
} from '~/views/dapp/rewards/shared'

/**
 * 推荐奖详情视图模型
 *
 * 聚合推荐奖汇总、奖励记录与直推成员列表。
 * 分页在 `useReferralSessionStore`。
 *
 * @see docs/backend-api/api.md #referral-award/summary
 * @see docs/backend-api/api.md #referral-award/direct-referrals
 */
export function useRewardsReferral() {
  const { messages: t } = useI18n()
  const referral = t.rewards.referral
  const { sessionReady } = useDappHost()
  const priceUsd = useAgxPriceUsd()
  const statusLabels = t.rewards.logStatus as RewardLogStatusLabels
  const {
    recordsPage,
    setRecordsPage,
    referralsPage,
    setReferralsPage,
    hideZeroPosition,
    setHideZeroPosition,
  } = useReferralSessionStore()

  const summaryQuery = useReferralAwardSummary(sessionReady)
  const logsQuery = useReferralAwardLogs(tablePageQuery(recordsPage), sessionReady)
  const directsQuery = useReferralAwardDirectReferrals(
    { ...tablePageQuery(referralsPage), hide_zero_position: hideZeroPosition },
    sessionReady,
  )

  const summary = summaryQuery.data
  const totalRewards = formatApiStatLabel(summary?.total_referral_reward, { suffix: ' gAGX' })
  const totalRewardsApprox = formatApiGagxApproxUsd(summary?.total_referral_reward, priceUsd)
  const myPosition = formatApiAgxUsdLabel(summary?.active_stake_balance, priceUsd)
  const referralCount = formatApiCountLabel(summary?.direct_referral_count)
  const contributionValue = formatApiContributionStatLabel(summary?.available_contribution)

  const recordRows =
    logsQuery.data?.items.map((item) => mapReferralAwardLogToCells(item, statusLabels)) ?? []
  const referralRows =
    directsQuery.data?.items.map((item) => mapReferralAwardDirectToRow(item)) ?? []

  return {
    referral,
    totalRewards,
    totalRewardsApprox,
    myPosition,
    referralCount,
    contributionValue,
    recordRows,
    recordsLoading: sessionReady && logsQuery.isLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal: logsQuery.data?.total ?? 0,
    referralRows,
    referralsLoading: sessionReady && directsQuery.isLoading,
    referralsPage,
    setReferralsPage,
    hideZeroPosition,
    setHideZeroPosition,
    referralsTotal: directsQuery.data?.total ?? 0,
  }
}
