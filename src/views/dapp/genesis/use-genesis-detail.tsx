import { useState } from 'react'

import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { calcProgressPercent } from '~/core/math/calc-progress-percent'
import { isGenesisProgramEnded } from '~/core/presale/is-genesis-program-ended'
import { useSalesLogs } from '~/hooks/use-api-data'
import { useAuth } from '~/hooks/use-auth'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { dappTableViewState, tablePageQuery } from '~/shared/lib/table-pagination'
import { formatNumber } from '~/shared/presenters/format'
import type { GenesisSessionState } from '~/views/dapp/genesis/genesis-session-host'
import { mapSalesLogToDesktopRow } from '~/views/dapp/genesis/shared'

/**
 * 我的贡献区块数据组装
 *
 * 汇总销售记录分页、本季与累计贡献进度、同步提示与空态判断；
 * 未登录时由表格状态驱动展示登录引导。
 */
export function useGenesisDetail(genesis: GenesisSessionState) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappHost()
  const { isLoggingIn } = useAuth()
  const [contributionsPage, setContributionsPage] = useState(1)
  const { data: salesLogs, isLoading: salesLoading } = useSalesLogs(
    tablePageQuery(contributionsPage),
    sessionReady,
  )

  const seasonContributedUsd = formatTokenAmountToNumber(genesis.userPhaseAmountCurrent, 18)
  const seasonMaxContributionUsd = formatTokenAmountToNumber(genesis.seasonContributionMaxWei, 18)
  const cumulativeContributedUsd = formatTokenAmountToNumber(genesis.userTotal, 18)
  const contributionProgress = calcProgressPercent(
    String(seasonContributedUsd),
    seasonMaxContributionUsd,
  )
  const contributedLabel = `${formatNumber(seasonContributedUsd, { prefix: '$' })} / ${formatNumber(seasonMaxContributionUsd, { prefix: '$' })}`

  const desktopRows = genesis.isPhasesLoading
    ? []
    : (salesLogs?.items.map((item) =>
        mapSalesLogToDesktopRow(item, {
          agxPriceUsd: genesis.agxPriceUsd,
          phases: genesis.phases,
        }),
      ) ?? [])

  const tableHeaders = [
    t.tables.time,
    t.tables.paid,
    t.tables.discount,
    t.tables.estimatedAgx,
    t.tables.tx,
  ]
  const contributionsTotal = salesLogs?.total ?? 0
  const showSalesSyncHint =
    sessionReady &&
    !salesLoading &&
    !genesis.isPhasesLoading &&
    desktopRows.length === 0 &&
    genesis.userTotal > 0n
  const contributionsTable = dappTableViewState({
    sessionReady,
    isLoading: isLoggingIn || salesLoading || genesis.isPhasesLoading,
    isLoggingIn,
    rowCount: desktopRows.length,
  })
  const showContributionsSkeleton =
    contributionsTable.showSkeleton || (sessionReady && genesis.isPhasesLoading)

  const programEnded = isGenesisProgramEnded({
    isLoading: genesis.isLoading,
    activePhase: genesis.activePhase,
    seasonOptions: genesis.seasonOptions,
  })
  const emptyTitle = programEnded
    ? t.genesis.contributionsEmptyEnded.title
    : t.genesis.contributionsEmpty.title
  const emptyBody = programEnded ? t.genesis.contributionsEmptyEnded.body : undefined

  return {
    t,
    sessionReady,
    contributionsPage,
    setContributionsPage,
    contributedLabel,
    contributionProgress,
    cumulativeContributedUsd,
    desktopRows,
    tableHeaders,
    contributionsTotal,
    showSalesSyncHint,
    contributionsTable,
    showContributionsSkeleton,
    programEnded,
    emptyTitle,
    emptyBody,
  }
}
