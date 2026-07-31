import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { useAgxContributionBurnLogs, useAgxContributionConsumeLogs } from '~/hooks/use-api-data'
import {
  mapAgxContributionBurnLogToRow,
  mapAgxContributionConsumeLogToRow,
} from '~/shared/api/map-flow-log-rows'

type BurnHistoryTab = 'burn' | 'consume'

export function BurnExchangeHistorySection() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const [tab, setTab] = useState<BurnHistoryTab>('burn')
  const burnLogs = useAgxContributionBurnLogs({}, sessionReady && tab === 'burn')
  const consumeLogs = useAgxContributionConsumeLogs({}, sessionReady && tab === 'consume')

  const tabOptions: Array<{ label: string; value: BurnHistoryTab }> = [
    { label: t.exchange.burn.history.tabs.burn, value: 'burn' },
    { label: t.exchange.burn.history.tabs.consume, value: 'consume' },
  ]

  const rows =
    tab === 'burn'
      ? (burnLogs.data?.items.map(mapAgxContributionBurnLogToRow) ?? [])
      : (consumeLogs.data?.items.map(mapAgxContributionConsumeLogToRow) ?? [])
  const isLoading = sessionReady && (tab === 'burn' ? burnLogs.isLoading : consumeLogs.isLoading)
  const emptyTitle =
    tab === 'burn' ? t.exchange.burn.history.emptyBurn : t.exchange.burn.history.emptyConsume

  return (
    <DappTableCard
      header={
        <DappPillTabs
          activeTone="coral"
          ariaLabel={t.exchange.burn.history.tabsAriaLabel}
          className="flex items-center justify-start gap-2"
          items={tabOptions.map((option) => ({
            active: option.value === tab,
            label: option.label,
          }))}
          onSelect={(index) => {
            const next = tabOptions[index]
            if (next) setTab(next.value)
          }}
        />
      }
    >
      <ResponsiveTable
        colWidths={tab === 'burn' ? ['200px', '150px', '180px', '1fr'] : ['200px', '180px', '1fr']}
        headers={
          tab === 'burn'
            ? [...t.exchange.burn.history.burnColumns]
            : [...t.exchange.burn.history.consumeColumns]
        }
        rows={rows}
      />
      {rows.length === 0 ? (
        <DappTableEmptyMessage embedded title={isLoading ? '…' : emptyTitle} />
      ) : null}
    </DappTableCard>
  )
}
