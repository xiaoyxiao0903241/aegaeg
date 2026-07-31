import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import {
  useReferralAwardDirectReferrals,
  useReferralAwardLogs,
  useReferralAwardSummary,
} from '~/hooks/use-api-data'
import {
  formatApiStatLabel,
  mapReferralAwardDirectToRow,
  mapReferralAwardLogToRow,
  REWARDS_DASH,
  type RewardLogStatusLabels,
} from '~/views/dapp/rewards/rewards-display'

export function useRewardsReferralContentView() {
  const { messages: t } = useI18n()
  const referral = t.rewards.referral
  const { sessionReady } = useDappShell()
  const statusLabels = t.rewards.logStatus as RewardLogStatusLabels

  const summaryQuery = useReferralAwardSummary(sessionReady)
  const logsQuery = useReferralAwardLogs({}, sessionReady)
  const directsQuery = useReferralAwardDirectReferrals({}, sessionReady)

  const summary = summaryQuery.data
  const totalRewards = formatApiStatLabel(
    sessionReady,
    summaryQuery.isLoading,
    summary?.total_referral_reward,
  )
  const myPosition = formatApiStatLabel(
    sessionReady,
    summaryQuery.isLoading,
    summary?.active_stake_balance,
  )
  const referralCount = !sessionReady
    ? REWARDS_DASH
    : summaryQuery.isLoading && summary == null
      ? '…'
      : summary != null
        ? String(summary.direct_referral_count)
        : REWARDS_DASH
  const contributionValue = formatApiStatLabel(
    sessionReady,
    summaryQuery.isLoading,
    summary?.available_contribution,
  )

  const recordRows =
    logsQuery.data?.items.map((item) => mapReferralAwardLogToRow(item, statusLabels)) ?? []
  const referralRows =
    directsQuery.data?.items.map((item) => mapReferralAwardDirectToRow(item)) ?? []

  return {
    referral,
    totalRewards,
    myPosition,
    referralCount,
    contributionValue,
    nextPayout: REWARDS_DASH,
    recordRows,
    recordsLoading: sessionReady && logsQuery.isLoading,
    referralRows,
    referralsLoading: sessionReady && directsQuery.isLoading,
  }
}
