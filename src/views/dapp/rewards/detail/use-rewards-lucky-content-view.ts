import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatShortAddress } from '~/shared/api/format-display'
import {
  useLuckyRewardMyRounds,
  useLuckyRewardSummary,
  useLuckyRewardWinners,
} from '~/hooks/use-api-data'
import {
  formatApiStatLabel,
  mapLuckyMyRoundToRow,
  mapLuckyWinnerToRow,
  REWARDS_DASH,
  REWARDS_LOADING,
} from '~/views/dapp/rewards/rewards-display'

export function useRewardsLuckyContentView() {
  const { messages: t } = useI18n()
  const lucky = t.rewards.lucky
  const { sessionReady } = useDappShell()

  const summaryQuery = useLuckyRewardSummary(sessionReady)
  const summary = summaryQuery.data
  const drawDate = summary?.date?.trim() || ''

  const winnersQuery = useLuckyRewardWinners(drawDate, sessionReady && drawDate.length > 0)
  const historyQuery = useLuckyRewardMyRounds({}, sessionReady)

  const todayPool = formatApiStatLabel(
    sessionReady,
    summaryQuery.isLoading,
    summary?.today_total_prize,
  )
  const eligibility = !sessionReady
    ? REWARDS_DASH
    : summaryQuery.isLoading && summary == null
      ? REWARDS_LOADING
      : REWARDS_DASH
  const cumulativeWins = !sessionReady
    ? REWARDS_DASH
    : summaryQuery.isLoading && summary == null
      ? REWARDS_LOADING
      : summary != null
        ? String(summary.win_count)
        : REWARDS_DASH

  const dateLabel = !sessionReady
    ? REWARDS_DASH
    : summaryQuery.isLoading && !drawDate
      ? REWARDS_LOADING
      : drawDate || REWARDS_DASH

  const winners = winnersQuery.data?.items ?? []
  const winnerRows = winners.map((item) => mapLuckyWinnerToRow(item))
  const drawHash = winnersQuery.data?.draw_tx_hash
  const resultsSummary = lucky.resultsSummary.replace(
    '{count}',
    sessionReady && winnersQuery.isLoading && winnersQuery.data == null
      ? REWARDS_LOADING
      : String(winners.length),
  )
  const verifyHash = lucky.verifyHash.replace(
    '{hash}',
    drawHash ? formatShortAddress(drawHash) : REWARDS_DASH,
  )

  const historyRows = historyQuery.data?.items.map((item) => mapLuckyMyRoundToRow(item)) ?? []

  return {
    lucky,
    todayPool,
    eligibility,
    cumulativeWins,
    dateLabel,
    resultsSummary,
    verifyHash,
    winnerRows,
    winnersLoading: sessionReady && Boolean(drawDate) && winnersQuery.isLoading,
    historyRows,
    historyLoading: sessionReady && historyQuery.isLoading,
  }
}
