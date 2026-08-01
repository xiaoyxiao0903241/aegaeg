import { useDappShell } from '~/app/use-dapp-shell'
import {
  useReferralAwardDirectReferrals,
  useReferralAwardLogs,
  useReferralAwardSummary,
} from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import {
  bindApiLabelFormatters,
  formatApiDecimalAmount,
  mapReferralAwardDirectToRow,
  mapReferralAwardLogToRow,
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
  const label = bindApiLabelFormatters(sessionReady, summaryQuery.isLoading)
  const totalRewards = label.stat(summary?.total_referral_reward)
  const myPosition = label.stat(summary?.active_stake_balance)
  const referralCount = label.count(summary?.direct_referral_count)
  const contributionValue = label.stat(summary?.available_contribution)

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
    nextPayout: formatApiDecimalAmount(null),
    recordRows,
    recordsLoading: sessionReady && logsQuery.isLoading,
    referralRows,
    referralsLoading: sessionReady && directsQuery.isLoading,
  }
}
