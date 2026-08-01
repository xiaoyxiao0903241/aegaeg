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
          className="flex items-center justify-start gap-2"
          items={vm.tabOptions.map((option) => ({
            active: option.value === vm.tab,
            label: option.label,
          }))}
          onSelect={(index) => {
            const next = vm.tabOptions[index]
            if (next) vm.setTab(next.value)
          }}
        />
      }
    >
      <ResponsiveTable colWidths={[...vm.colWidths]} headers={vm.headers} rows={vm.rows} />
      {vm.rows.length === 0 ? (
        <DappTableEmptyMessage embedded title={vm.isLoading ? '…' : vm.emptyTitle} />
      ) : null}
    </DappTableCard>
  )
}
