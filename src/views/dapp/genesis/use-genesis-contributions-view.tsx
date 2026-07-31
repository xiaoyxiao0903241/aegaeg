import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { useSalesLogs } from '~/hooks/use-api-data'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { calcProgressPercent } from '~/core/math/calc-progress-percent'
import { mapSalesLogToDesktopRow } from '~/views/dapp/genesis/sales-log-display'
import { bscscanTx } from '~/shared/config/explorer'
import { dappTableViewState, tablePageQuery } from '~/shared/lib/table-pagination'
import { useDappShell } from '~/app/use-dapp-shell'
import { useAuth } from '~/hooks/use-auth'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { Text } from '~/shared/ui/text'

export function useGenesisContributionsView(genesis: GenesisWidgetState) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
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
  const contributedLabel = `${formatGroupedNumber(seasonContributedUsd, { prefix: '$' })} / ${formatGroupedNumber(seasonMaxContributionUsd, { prefix: '$' })}`

  const desktopRows = genesis.isPhasesLoading
    ? []
    : (salesLogs?.items.map((item) => {
        const row = mapSalesLogToDesktopRow(item, {
          agxPriceUsd: genesis.agxPriceUsd,
          phases: genesis.phases,
        })
        const txLabel = row[4]
        if (!item.tx_hash || txLabel === '-') return row

        return [
          ...row.slice(0, 4),
          <Text
            as="a"
            className="underline"
            href={bscscanTx(item.tx_hash)}
            key={item.tx_hash}
            rel="noopener noreferrer"
            target="_blank"
            tone="primary"
            variant="copy"
          >
            {txLabel}
          </Text>,
        ]
      }) ?? [])

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
  }
}
