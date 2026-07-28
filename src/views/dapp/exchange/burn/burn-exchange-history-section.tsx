import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'

type BurnHistoryTab = 'burn' | 'consume'

export function BurnExchangeHistorySection() {
  const { messages: t } = useI18n()
  const [tab, setTab] = useState<BurnHistoryTab>('burn')

  const tabOptions: Array<{ label: string; value: BurnHistoryTab }> = [
    { label: t.exchange.burn.history.tabs.burn, value: 'burn' },
    { label: t.exchange.burn.history.tabs.consume, value: 'consume' },
  ]

  const headers =
    tab === 'burn' ? t.exchange.burn.history.burnColumns : t.exchange.burn.history.consumeColumns

  const pillTabs = (
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
  )

  return (
    <DappTableCard header={pillTabs}>
      <ResponsiveTable
        colWidths={tab === 'burn' ? ['210px', '170px', '190px', '1fr'] : ['210px', '190px', '1fr']}
        compact
        headers={headers}
        rows={[]}
      />
      <DappTableEmptyMessage embedded title={t.exchange.burn.history.empty} />
    </DappTableCard>
  )
}
