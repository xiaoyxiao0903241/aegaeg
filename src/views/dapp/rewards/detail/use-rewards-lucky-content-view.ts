import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatShortAddress } from '~/shared/api/format-display'
import {
  useLuckyRewardMyRounds,
  useLuckyRewardSummary,
  useLuckyRewardWinners,
} from '~/hooks/use-api-data'
import {
  formatApiDecimalAmount,
  formatApiStatLabel,
  mapLuckyMyRoundToRow,
  mapLuckyWinnerToRow,
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
  // Eligibility copy is static zero until handbook wires a live field.
  const eligibility = formatApiDecimalAmount(null)
  const cumulativeWins = summary != null ? String(summary.win_count) : formatApiDecimalAmount(null)

  const dateLabel = drawDate || formatApiDecimalAmount(null)

  const winners = winnersQuery.data?.items ?? []
  const winnerRows = winners.map((item) => mapLuckyWinnerToRow(item))
  const drawHash = winnersQuery.data?.draw_tx_hash
  const resultsSummary = lucky.resultsSummary.replace('{count}', String(winners.length))
  const verifyHash = lucky.verifyHash.replace(
    '{hash}',
    drawHash ? formatShortAddress(drawHash) : formatApiDecimalAmount(null),
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
