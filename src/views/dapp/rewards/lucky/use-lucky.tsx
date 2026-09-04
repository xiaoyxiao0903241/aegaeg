import { keepPreviousData } from '@tanstack/react-query'
import { type ReactNode } from 'react'

import { formatCountdownClock } from '~/core/format-countdown'
import { luckyWinnersDateList, luckyWinnersSelectedDate } from '~/core/rewards/lucky-winners-date'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import {
  useLuckyRewardMyRounds,
  useLuckyRewardSummary,
  useLuckyRewardWinners,
} from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { Text } from '~/shared/components/text'
import type { Address } from '~/shared/config/contracts'
import { bscscanTx } from '~/shared/config/explorer'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import {
  formatShortAddress,
  interpolateLive,
  joinLiveLabels,
  LIVE_DATA_PLACEHOLDER,
} from '~/shared/presenters/format'
import { useLuckySessionStore } from '~/stores/rewards-session-store'
import { useWallClockSec } from '~/stores/wall-clock-store'
import {
  formatApiCountLabel,
  formatApiGagxApproxUsd,
  formatApiStatLabel,
  formatLuckyUsd1Amount,
  mapLuckyMyRoundToRow,
  mapLuckyWinnerToRow,
  NON_NUMERIC_EMPTY,
} from '~/views/dapp/rewards/shared'
import {
  collectLuckyWinnerUsers,
  readLuckyMyRoundStakes,
  readLuckyRoundDisplaySnapshot,
  readLuckyWinnerRoundStakes,
} from '~/web3/rewards/rewards-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

function parseLuckyRoundId(raw: unknown): bigint | null {
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw <= 0) return null
  return BigInt(raw)
}

/**
 * 幸运奖详情视图模型
 *
 * 聚合今日奖池汇总、开奖名单与我的参与记录，
 * 另从链上读取本轮开奖快照与中奖地址本轮累计 USD1。
 * 日期 / 记录分页在 `useLuckySessionStore`；`selectedDate === null` 时不传 date，用 winners 返回的最新开奖日。
 *
 * @see docs/backend-api/api.md #lucky-reward/summary
 */
export function useLucky() {
  const { messages: t } = useI18n()
  const lucky = t.rewards.lucky
  const { walletReady, sessionReady } = useDappHost()
  const account = useActiveAccount()
  const agxPriceUsd = useAgxPriceUsd()

  const summaryQuery = useLuckyRewardSummary(sessionReady)
  const summary = summaryQuery.data

  const { selectedDate, setSelectedDate, historyPage, setHistoryPage } = useLuckySessionStore()

  const winnersQuery = useLuckyRewardWinners(selectedDate, sessionReady)
  const historyQuery = useLuckyRewardMyRounds(tablePageQuery(historyPage), sessionReady)
  const historyItems = historyQuery.data?.items ?? []
  const historyRoundIds = [
    ...new Set(
      historyItems
        .map((item) => parseLuckyRoundId(item.round_id))
        .filter((id): id is bigint => id != null),
    ),
  ]
  const myStakesQuery = useChainQuery({
    queryKey: queryKeys.chain.rewardsLuckyMyRoundStakes(historyRoundIds.map(String)),
    queryFn: (address) => readLuckyMyRoundStakes(address, historyRoundIds),
    enabled: sessionReady && historyRoundIds.length > 0,
    freshness: 'balances',
  })

  const winners = winnersQuery.data?.items ?? []
  const roundId = parseLuckyRoundId(winnersQuery.data?.round_id)
  const stakeUsers = collectLuckyWinnerUsers(winners.map((item) => item.address))
  const stakesQuery = useChainQuery({
    scope: 'public',
    queryKey: queryKeys.chain.rewardsLuckyWinnerStakes(
      roundId == null ? 0 : Number(roundId),
      stakeUsers,
    ),
    queryFn: () =>
      roundId == null
        ? Promise.resolve(new Map<string, bigint>())
        : readLuckyWinnerRoundStakes(roundId, stakeUsers),
    enabled: sessionReady && roundId != null && stakeUsers.length > 0,
    freshness: 'balances',
  })

  const drawDate = luckyWinnersSelectedDate(selectedDate, winnersQuery.data?.date)
  const drawDates = luckyWinnersDateList(winnersQuery.data?.dates)

  const roundQuery = useChainQuery({
    queryKey: queryKeys.chain.rewardsLuckyRoundDisplay,
    queryFn: (address) => readLuckyRoundDisplaySnapshot(address as Address),
    enabled: Boolean(account?.address) && walletReady,
    placeholderData: keepPreviousData,
    freshness: 'balances',
    refetchInterval: 15_000,
  })

  const needsCountdown = Boolean(account?.address) && walletReady
  const nowSec = useWallClockSec(needsCountdown)

  const todayPool = formatApiStatLabel(summary?.today_total_prize, {
    digits: 2,
    prefix: '$',
  })
  const clock =
    roundQuery.data == null ? null : formatCountdownClock(roundQuery.data.endTimeSec, nowSec)
  const todayPoolHint =
    lucky.countdownHint == null
      ? undefined
      : clock == null
        ? LIVE_DATA_PLACEHOLDER
        : interpolate(lucky.countdownHint, { time: clock })

  const eligibilityPending = walletReady && roundQuery.isLoading && roundQuery.data == null
  const eligibilityFailed =
    walletReady && !eligibilityPending && (roundQuery.isError || roundQuery.data == null)
  const eligibility = !walletReady
    ? NON_NUMERIC_EMPTY
    : eligibilityPending || eligibilityFailed
      ? NON_NUMERIC_EMPTY
      : roundQuery.data?.eligible
        ? (lucky.eligibilityYes ?? NON_NUMERIC_EMPTY)
        : (lucky.eligibilityNo ?? NON_NUMERIC_EMPTY)
  const eligibilityHint =
    !walletReady || eligibilityPending || eligibilityFailed
      ? undefined
      : lucky.maxStakeHint != null
        ? interpolateLive(lucky.maxStakeHint, {
            amount: formatLuckyUsd1Amount(roundQuery.data?.roundPurchaseUsd1),
          })
        : undefined

  const winCount = formatApiCountLabel(summary?.win_count)
  const cumulativeWins = interpolateLive(lucky.winsCount, { count: winCount })
  const totalRewardAmount = summary?.total_reward_amount
  const cumulativeWinsHint = joinLiveLabels(
    formatApiStatLabel(totalRewardAmount, {
      suffix: ' gAGX',
    }),
    formatApiGagxApproxUsd(totalRewardAmount, agxPriceUsd),
  )

  const selfAddress = account?.address ?? null
  const winnersTotal = winners.length
  const winnerRows = winners.map((item) =>
    mapLuckyWinnerToRow(item, {
      selfAddress,
      meLabel: lucky.meBadge,
      stakeAmountUsd1: stakesQuery.data?.get(item.address.toLowerCase()) ?? null,
    }),
  )
  const highlightedWinnerRows = winners.flatMap((item, index) =>
    selfAddress != null &&
    selfAddress.length > 0 &&
    item.address.toLowerCase() === selfAddress.toLowerCase()
      ? [index]
      : [],
  )
  const winnersLoading = sessionReady && (winnersQuery.isLoading || stakesQuery.isLoading)
  const drawHash = winnersQuery.data?.draw_tx_hash
  const resultsSummary = interpolate(lucky.resultsSummary, { count: winnersTotal })
  const verifyChrome: ReactNode =
    winnersTotal > 0 && drawHash ? (
      <Text
        as="a"
        className="duration-dapp-base inline-flex items-center gap-1 font-semibold no-underline transition-opacity hover:opacity-70"
        href={bscscanTx(drawHash)}
        rel="noopener noreferrer"
        target="_blank"
        tone="claim"
        variant="copy"
      >
        {lucky.verifyHash} {formatShortAddress(drawHash)}
        <svg aria-hidden className="size-[9px] shrink-0" fill="none" viewBox="0 0 10 10">
          <path
            d="M2 8L8 2M3.5 2H8v4.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </Text>
    ) : null

  const historyRows = historyItems.map((item) => {
    const rid = parseLuckyRoundId(item.round_id)
    return mapLuckyMyRoundToRow(item, {
      won: lucky.resultWon,
      lost: lucky.resultLost,
      stakeAmountUsd1: rid == null ? null : (myStakesQuery.data?.get(rid) ?? null),
    })
  })

  return {
    lucky,
    todayPool,
    todayPoolHint,
    eligibility,
    eligibilityHint,
    cumulativeWins,
    cumulativeWinsHint,
    drawDates,
    drawDate,
    onDrawDateChange: setSelectedDate,
    resultsSummary,
    verifyChrome,
    winnerRows,
    highlightedWinnerRows,
    winnersLoading,
    winnersTotal,
    historyRows,
    historyLoading: sessionReady && (historyQuery.isLoading || myStakesQuery.isLoading),
    historyPage,
    setHistoryPage,
    historyTotal: historyQuery.data?.total ?? 0,
  }
}
