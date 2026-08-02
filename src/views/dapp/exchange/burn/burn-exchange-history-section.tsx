import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { useBurnExchangeHistoryView } from '~/views/dapp/exchange/burn/use-burn-exchange-history-view'

export function BurnExchangeHistorySection() {
  const vm = useBurnExchangeHistoryView()

  return (
    <DappTableCard
      header={
        <DappPillTabs
          activeTone="coral"
          ariaLabel={vm.t.exchange.burn.history.tabsAriaLabel}
          className="flex items-center justify-start gap-2 [&_button]:h-6 [&_button]:min-h-6 [&_button]:py-0"
          items={vm.tabOptions.map((option) => ({
            active: option.value === vm.tab,
            label: option.label,
          }))}
          onSelect={(index) => {
            const next = vm.tabOptions[index]
            if (next) vm.setTab(next.value)
          }}
          size="md"
        />
      }
    >
      <ResponsiveTable
        colWidths={[...vm.colWidths]}
        headers={vm.headers}
        isLoading={vm.isLoading}
        rows={vm.rows}
      />
      {!vm.isLoading && vm.rows.length === 0 ? (
        <DappTableEmptyMessage embedded title={vm.emptyTitle} />
      ) : null}
    </DappTableCard>
  )
}
