import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { useSalesLogs } from '~/hooks/use-api-data'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import {
  calcProgressPercent,
  formatUsd,
} from '~/shared/api/format-display'
import { mapSalesLogToDesktopRow } from '~/views/dapp/presale-display'
import { bscscanTx } from '~/shared/config/explorer'
import { DappSection } from '~/app/shell/components/dapp-section'
import { DappTableAuthPrompt } from '~/app/shell/components/dapp-table-auth-prompt'
import { DappTableEmptyMessage } from '~/app/shell/components/dapp-table-empty-message'
import { DappTablePagination } from '~/app/shell/components/dapp-table-pagination'
import { DappTableCard } from '~/app/shell/components/dapp-table-card'
import { ResponsiveTable } from '~/app/shell/components/responsive-table'
import {
  genesisContributionsColWidths,
} from '~/app/shell/components/dapp-table-columns'
import { dappTableViewState, tablePageQuery } from '~/shared/lib/table-pagination'
import { useDappShell } from '~/app/dapp-shell-context'
import { useAuth } from '~/app/bootstrap/auth-provider'
import { formatTokenAmountToNumber } from '~/core/swap/token-amount'
import {
  GenesisContributionsProgressHeader,
  GenesisContributionsReveal,
  GenesisContributionsSyncHint,
} from '~/views/dapp/genesis/genesis-contributions-primitives'
import { Text } from '~/shared/ui/text'

export function GenesisContributionsSection() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const { isLoggingIn } = useAuth()
  const genesis = useGenesisWidgetContext()
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
  const contributedLabel = `${formatUsd(seasonContributedUsd)} / ${formatUsd(seasonMaxContributionUsd)}`

  const desktopRows =
    genesis.isPhasesLoading
      ? []
      : salesLogs?.items.map((item) => {
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
              tone="accent"
              variant="body"
            >
              {txLabel}
            </Text>,
          ]
        }) ?? []

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

  return (
    <DappSection title={t.genesis.myContributions}>
      <GenesisContributionsReveal>
        {showSalesSyncHint ? (
          <GenesisContributionsSyncHint>{t.genesis.contributionsSyncPending}</GenesisContributionsSyncHint>
        ) : null}
        <DappTableCard
          footer={
            sessionReady && !contributionsTable.requiresAuth ? (
              <DappTablePagination
                embedded
                onPageChange={setContributionsPage}
                page={contributionsPage}
                summary={`${t.genesis.cumulativeContributed}${formatUsd(cumulativeContributedUsd)}`}
                total={contributionsTotal}
              />
            ) : undefined
          }
          header={
            sessionReady && !contributionsTable.requiresAuth ? (
              <GenesisContributionsProgressHeader
                contributedLabel={contributedLabel}
                label={t.genesis.totalContributed}
                progress={contributionProgress}
              />
            ) : undefined
          }
        >
          {contributionsTable.requiresAuth ? (
            <DappTableAuthPrompt body={t.dapp.connect.recordsBodyGenesis} embedded />
          ) : contributionsTable.queryEmpty && !showSalesSyncHint ? (
            <>
              <ResponsiveTable
                colWidths={[...genesisContributionsColWidths]}
                compact
                headers={tableHeaders}
                positiveColumns={[2]}
                rows={[]}
              />
              <DappTableEmptyMessage embedded title={t.genesis.contributionsEmpty.title} />
            </>
          ) : (
            <ResponsiveTable
              colWidths={[...genesisContributionsColWidths]}
              compact
              headers={tableHeaders}
              isLoading={showContributionsSkeleton}
              loadingRowCount={4}
              positiveColumns={[2]}
              rows={desktopRows}
            />
          )}
        </DappTableCard>
      </GenesisContributionsReveal>
    </DappSection>
  )
}
