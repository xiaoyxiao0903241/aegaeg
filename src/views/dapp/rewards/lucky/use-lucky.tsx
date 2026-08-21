import { keepPreviousData } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { formatUnits } from 'viem'

import { formatTokenAmount } from '~/core/exchange/token-amount'
import { formatCountdownParts } from '~/core/format-countdown'
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
import type { SelectMenuOption } from '~/shared/components/select-menu'
import { Text } from '~/shared/components/text'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { bscscanTx } from '~/shared/config/explorer'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { formatShortAddress } from '~/shared/presenters/format'
import { useLuckySessionStore } from '~/stores/rewards-session-store'
import { useWallClockSec } from '~/stores/wall-clock-store'
import {
  formatApiCountLabel,
  formatApiGagxApproxUsd,
  formatApiStatLabel,
  mapLuckyMyRoundToRow,
  mapLuckyWinnerToRow,
  NON_NUMERIC_EMPTY,
} from '~/views/dapp/rewards/shared'
import { readLuckyRoundDisplaySnapshot } from '~/web3/rewards/rewards-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

function formatCountdown(endTimeSec: bigint, nowSec: number): string | null {
  const end = Number(endTimeSec)
  if (!Number.isFinite(end) || end <= 0) return null
  const [hours, minutes] = formatCountdownParts(
    Math.max(0, end - nowSec),
    ['hours', 'minutes'],
    false,
  )
  return `${hours?.text ?? '00'}:${minutes?.text ?? '00'}`
}

function formatUsd1Label(raw: bigint | null | undefined): string {
  if (raw == null) return NON_NUMERIC_EMPTY
  const n = Number(formatUnits(raw, USD1_DECIMALS))
  if (!Number.isFinite(n)) return NON_NUMERIC_EMPTY
  return `$${formatTokenAmount(raw, USD1_DECIMALS, 2)}`
}

/**
 * 幸运奖详情视图模型
 *
 * 聚合今日奖池汇总、开奖名单与我的参与记录，
 * 另从链上读取本轮开奖快照计算参与资格与倒计时。
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

  const drawDate = luckyWinnersSelectedDate(selectedDate, winnersQuery.data?.date)
  const dateOptions: SelectMenuOption[] = luckyWinnersDateList(
    winnersQuery.data?.dates,
    drawDate,
  ).map((value) => ({ value, label: value }))

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

  const todayPool = formatApiStatLabel(
    sessionReady,
    summaryQuery.isLoading,
    summary?.today_total_prize,
    { digits: 2, prefix: '$' },
  )
  const countdown =
    walletReady && roundQuery.data != null && roundQuery.data.accepting
      ? formatCountdown(roundQuery.data.endTimeSec, nowSec)
      : null
  const todayPoolHint =
    countdown != null
      ? lucky.countdownHint != null
        ? interpolate(lucky.countdownHint, { time: countdown })
        : undefined
      : walletReady
        ? lucky.countdownHint != null
          ? interpolate(lucky.countdownHint, { time: NON_NUMERIC_EMPTY })
          : undefined
        : undefined

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
        ? interpolate(lucky.maxStakeHint, {
            amount: formatUsd1Label(roundQuery.data?.roundPurchaseUsd1),
          })
        : undefined

  const winCount = formatApiCountLabel(sessionReady, summaryQuery.isLoading, summary?.win_count)
  const cumulativeWins = interpolate(lucky.winsCount, { count: winCount })
  const totalRewardAmount = summary?.total_reward_amount
  const cumulativeWinsHint = interpolate(lucky.winsAmountHint, {
    amount: formatApiStatLabel(sessionReady, summaryQuery.isLoading, totalRewardAmount),
    approx: formatApiGagxApproxUsd(
      sessionReady,
      summaryQuery.isLoading,
      totalRewardAmount,
      agxPriceUsd,
    ),
  })

  const selfAddress = account?.address ?? null
  const winners = winnersQuery.data?.items ?? []
  const winnersTotal = winners.length
  const winnerRows = winners.map((item) =>
    mapLuckyWinnerToRow(item, { selfAddress, meLabel: lucky.meBadge }),
  )
  const highlightedWinnerRows = winners.flatMap((item, index) =>
    selfAddress != null &&
    selfAddress.length > 0 &&
    item.address.toLowerCase() === selfAddress.toLowerCase()
      ? [index]
      : [],
  )
  const winnersLoading = sessionReady && winnersQuery.isLoading
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
        tone="claim-restake"
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

  const historyRows =
    historyQuery.data?.items.map((item) =>
      mapLuckyMyRoundToRow(item, { won: lucky.resultWon, lost: lucky.resultLost }),
    ) ?? []

  return {
    lucky,
    todayPool,
    todayPoolHint,
    eligibility,
    eligibilityHint,
    cumulativeWins,
    cumulativeWinsHint,
    dateOptions,
    drawDate,
    onDrawDateChange: setSelectedDate,
    resultsSummary,
    verifyChrome,
    winnerRows,
    highlightedWinnerRows,
    winnersLoading,
    winnersTotal,
    historyRows,
    historyLoading: sessionReady && historyQuery.isLoading,
    historyPage,
    setHistoryPage,
    historyTotal: historyQuery.data?.total ?? 0,
  }
}
