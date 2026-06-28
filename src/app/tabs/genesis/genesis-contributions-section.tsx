import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'
import { useSalesLogs } from '~/hooks/use-api-data'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import {
  calcProgressPercent,
  formatUsd,
  mapSalesLogToDesktopRow,
} from '~/lib/api/format-display'
import { bscscanTx } from '~/config/explorer'
import { DappSection } from '~/app/components/dapp-section'
import { ProgressMeter } from '~/app/components/progress-meter'
import { DappTableAuthPrompt } from '~/app/components/dapp-table-auth-prompt'
import { DappTableEmptyMessage } from '~/app/components/dapp-table-empty-message'
import { DappTablePagination } from '~/app/components/dapp-table-pagination'
import { DappTableCard } from '~/app/components/dapp-table-card'
import { ResponsiveTable } from '~/app/components/responsive-table'
import {
  genesisContributionsColWidths,
} from '~/app/components/dapp-table-shell'
import { dappTableViewState, tablePageQuery } from '~/lib/table-pagination'
import { useDappShell } from '~/app/dapp-shell-context'
import { useAuth } from '~/providers/auth-provider'
import { formatTokenAmountToNumber } from '~/lib/swap/token-amount'

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
    salesLogs?.items.map((item) => {
      const row = mapSalesLogToDesktopRow(item, genesis.agxPriceUsd)
      const txLabel = row[4]
      if (!item.tx_hash || txLabel === '-') return row

      return [
        ...row.slice(0, 4),
        <a
          className="text-primary underline"
          href={bscscanTx(item.tx_hash)}
          key={item.tx_hash}
          rel="noopener noreferrer"
          target="_blank"
        >
          {txLabel}
        </a>,
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
    sessionReady && !salesLoading && desktopRows.length === 0 && genesis.userTotal > 0n
  const contributionsTable = dappTableViewState({
    sessionReady,
    isLoading: isLoggingIn || salesLoading,
    isLoggingIn,
    rowCount: desktopRows.length,
  })

  return (
    <DappSection title={t.genesis.myContributions}>
      <div className={cn(revealClass(), 'flex flex-col gap-3')} data-reveal>
        {showSalesSyncHint ? (
          <p className="m-0 text-xs leading-normal text-muted-foreground">
            {t.genesis.contributionsSyncPending}
          </p>
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
              <div className="grid gap-2.5">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold leading-[1.2] tracking-[-0.26px] text-foreground">
                  <span>{t.genesis.totalContributed}</span>
                  <strong className="mt-0 text-right font-semibold">{contributedLabel}</strong>
                </div>
                <ProgressMeter label={t.genesis.totalContributed} value={contributionProgress} />
              </div>
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
              isLoading={contributionsTable.showSkeleton}
              loadingRowCount={4}
              positiveColumns={[2]}
              rows={desktopRows}
            />
          )}
        </DappTableCard>
      </div>
    </DappSection>
  )
}
