import { keepPreviousData } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { formatUnits } from 'viem'

import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import {
  useLuckyRewardMyRounds,
  useLuckyRewardSummary,
  useLuckyRewardWinners,
} from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { formatShortAddress } from '~/shared/api/format-display'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { SelectMenuOption } from '~/shared/components/select-menu'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { DAPP_TABLE_PAGE_SIZE, tablePageQuery } from '~/shared/lib/table-pagination'
import {
  formatApiCountLabel,
  formatApiStatLabel,
  mapLuckyMyRoundToRow,
  mapLuckyWinnerToRow,
  NON_NUMERIC_EMPTY,
} from '~/views/dapp/rewards/rewards-display'
import { readLuckyRoundDisplaySnapshot } from '~/web3/rewards/rewards-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals
/** 开奖结果日期 pill：近 5 个 UTC 自然日（含锚点） */
const DRAW_DATE_OPTION_COUNT = 5

function formatIsoDateUtc(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseIsoDateUtc(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  return Number.isNaN(date.getTime()) ? null : date
}

function utcToday(): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

/** 自锚点日起倒推 count 天（含当日），供 SelectMenu。 */
function buildRecentDrawDateOptions(
  anchorIso: string,
  count = DRAW_DATE_OPTION_COUNT,
): SelectMenuOption[] {
  const anchor = parseIsoDateUtc(anchorIso) ?? utcToday()
  const options: SelectMenuOption[] = []
  for (let i = 0; i < count; i++) {
    const day = new Date(anchor)
    day.setUTCDate(anchor.getUTCDate() - i)
    const value = formatIsoDateUtc(day)
    options.push({ value, label: value })
  }
  return options
}

function formatCountdown(endTimeSec: bigint, nowSec: number): string | null {
  const end = Number(endTimeSec)
  if (!Number.isFinite(end) || end <= 0) return null
  const remain = Math.max(0, end - nowSec)
  const h = Math.floor(remain / 3600)
  const m = Math.floor((remain % 3600) / 60)
  const s = remain % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
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
 *
 * @see docs/backend-api/api.md #lucky-reward/summary
 */
export function useRewardsLuckyContentView() {
  const { messages: t } = useI18n()
  const lucky = t.rewards.lucky
  const { walletReady, sessionReady } = useDappShell()
  const account = useActiveAccount()

  const summaryQuery = useLuckyRewardSummary(sessionReady)
  const summary = summaryQuery.data
  const summaryDate = summary?.date?.trim() || ''

  const [selectedDate, setSelectedDate] = useState('')
  const [winnersPage, setWinnersPage] = useState(1)
  const [historyPage, setHistoryPage] = useState(1)
  useEffect(() => {
    if (!summaryDate) return
    setSelectedDate((prev) => prev || summaryDate)
  }, [summaryDate])

  useEffect(() => {
    setWinnersPage(1)
  }, [selectedDate])

  const dateOptions = buildRecentDrawDateOptions(
    summaryDate || selectedDate || formatIsoDateUtc(utcToday()),
  )
  const drawDate =
    selectedDate && dateOptions.some((option) => option.value === selectedDate)
      ? selectedDate
      : (dateOptions[0]?.value ?? '')

  const winnersQuery = useLuckyRewardWinners(drawDate, sessionReady && drawDate.length > 0)
  const historyQuery = useLuckyRewardMyRounds(tablePageQuery(historyPage), sessionReady)

  const roundQuery = useChainQuery({
    queryKey: queryKeys.chain.rewardsLuckyRoundDisplay,
    queryFn: (address) => readLuckyRoundDisplaySnapshot(address as Address),
    enabled: Boolean(account?.address) && walletReady,
    placeholderData: keepPreviousData,
    freshness: 'balances',
    refetchInterval: 15_000,
  })

  const [nowSec, setNowSec] = useState(() => Math.floor(Date.now() / 1000))
  useEffect(() => {
    const id = window.setInterval(() => setNowSec(Math.floor(Date.now() / 1000)), 1000)
    return () => window.clearInterval(id)
  }, [])

  const todayPool = formatApiStatLabel(
    sessionReady,
    summaryQuery.isLoading,
    summary?.today_total_prize,
  )
  const countdown =
    walletReady && roundQuery.data != null
      ? formatCountdown(roundQuery.data.endTimeSec, nowSec)
      : null
  const todayPoolHint =
    countdown != null
      ? lucky.countdownHint?.replace('{time}', countdown)
      : walletReady
        ? lucky.countdownHint?.replace('{time}', NON_NUMERIC_EMPTY)
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
      : lucky.maxStakeHint?.replace('{amount}', formatUsd1Label(roundQuery.data?.roundPurchaseUsd1))

  const cumulativeWins = formatApiCountLabel(
    sessionReady,
    summaryQuery.isLoading,
    summary?.win_count,
  )

  const winners = winnersQuery.data?.items ?? []
  const winnersTotal = winners.length
  const winnersPageStart = (winnersPage - 1) * DAPP_TABLE_PAGE_SIZE
  const pagedWinners = winners.slice(winnersPageStart, winnersPageStart + DAPP_TABLE_PAGE_SIZE)
  const winnerRows = pagedWinners.map((item) => mapLuckyWinnerToRow(item))
  const winnersLoading = sessionReady && Boolean(drawDate) && winnersQuery.isLoading
  /** 无中奖行时不展示表顶的日期 / 摘要 / 哈希控件 */
  const showResultsChrome = !winnersLoading && winnersTotal > 0
  const drawHash = winnersQuery.data?.draw_tx_hash
  const resultsSummary = lucky.resultsSummary.replace('{count}', String(winnersTotal))
  const verifyHash = lucky.verifyHash.replace(
    '{hash}',
    drawHash ? formatShortAddress(drawHash) : NON_NUMERIC_EMPTY,
  )

  const historyRows = historyQuery.data?.items.map((item) => mapLuckyMyRoundToRow(item)) ?? []

  return {
    lucky,
    todayPool,
    todayPoolHint,
    eligibility,
    eligibilityHint,
    cumulativeWins,
    dateOptions,
    drawDate,
    onDrawDateChange: setSelectedDate,
    showResultsChrome,
    resultsSummary,
    verifyHash,
    winnerRows,
    winnersLoading,
    winnersPage,
    setWinnersPage,
    winnersTotal,
    historyRows,
    historyLoading: sessionReady && historyQuery.isLoading,
    historyPage,
    setHistoryPage,
    historyTotal: historyQuery.data?.total ?? 0,
  }
}
