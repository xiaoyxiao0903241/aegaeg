import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'
import { Table } from '~/shared/components/table'
import { useBurnExchangeHistoryView } from '~/views/dapp/exchange/burn/use-burn-exchange-history-view'

export function BurnExchangeHistorySection() {
  const vm = useBurnExchangeHistoryView()

  return (
    <Table>
      <Table.Header>
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
      </Table.Header>
      <Table.Body
        colWidths={[...vm.colWidths]}
        empty={vm.emptyTitle}
        headers={vm.headers}
        isLoading={vm.isLoading}
        rows={vm.rows}
      />
    </Table>
  )
}
