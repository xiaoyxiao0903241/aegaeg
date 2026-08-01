import { useDappShell } from '~/app/use-dapp-shell'
import {
  useParticipationAwardInviter,
  useParticipationAwardLogs,
  useParticipationAwardSummary,
} from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import {
  formatApiDecimalAmount,
  formatApiStatLabel,
  mapParticipationAwardInviterToRow,
  mapParticipationAwardLogToRow,
  type RewardLogStatusLabels,
} from '~/views/dapp/rewards/rewards-display'

export function useRewardsParticipateContentView() {
  const { messages: t } = useI18n()
  const participate = t.rewards.participate
  const { sessionReady } = useDappShell()
  const statusLabels = t.rewards.logStatus as RewardLogStatusLabels

  const summaryQuery = useParticipationAwardSummary(sessionReady)
  const logsQuery = useParticipationAwardLogs({}, sessionReady)
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
    logsQuery.data?.items.map((item) => mapParticipationAwardLogToRow(item, statusLabels)) ?? []
  const inviter = inviterQuery.data?.inviter
  const inviterRows = inviter != null ? [mapParticipationAwardInviterToRow(inviter)] : []

  return {
    participate,
    totalRewards,
    myPosition,
    contributionValue,
    nextPayout: formatApiDecimalAmount(null),
    recordRows,
    recordsLoading: sessionReady && logsQuery.isLoading,
    inviterRows,
    inviterLoading: sessionReady && inviterQuery.isLoading,
  }
}
