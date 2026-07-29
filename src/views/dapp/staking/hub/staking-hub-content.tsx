import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { FaqList } from '~/shared/ui/faq-list'
import { MetricCard } from '~/shared/ui/metric-card'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'

const PLACEHOLDER = '—'

/** Hub right rail: overview grid + period table + chart chrome + FAQ (dynamic figures may be —). */
export function StakingHubContent() {
  const { messages: t } = useI18n()
  const [tableSeg, setTableSeg] = useState('stake')
  const [chartMetric, setChartMetric] = useState('tvl')
  const [chartRange, setChartRange] = useState(t.staking.aside.chartRanges[3] ?? '全部')

  const overview = t.staking.hub.overview
  const table = t.staking.hub.periodTable
  const chart = t.staking.hub.chart

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{overview.title}</DappContentHeading>
        <div className="grid grid-cols-3 gap-2">
          {overview.metrics.map((metric) => (
            <MetricCard
              className="min-h-[75px] gap-1.5 p-4"
              key={metric.label}
              label={metric.label}
              value={PLACEHOLDER}
              valueClassName="text-base font-semibold tracking-normal"
            />
          ))}
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{table.title}</DappContentHeading>
        <Segment
          aria-label={table.segmentAria}
          className="mb-3 w-fit"
          onChange={setTableSeg}
          options={[
            { label: table.segs.stake, value: 'stake' },
            { label: table.segs.lpbond, value: 'lpbond' },
            { label: table.segs.burnbond, value: 'burnbond' },
          ]}
          tone="coral"
          value={tableSeg}
        />
        <DappTableCard>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  {table.columns.map((col) => (
                    <th className="border-b border-border pr-3 pb-3" key={col}>
                      <Text as="span" tone="muted-foreground" variant="detail">
                        {col}
                      </Text>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows
                  .filter((row) => tableSeg === 'stake' || row.id !== 'liquid')
                  .map((row) => (
                    <tr key={row.id}>
                      <td className="py-3 pr-3">
                        <Text as="span" variant="detail">
                          {row.period}
                        </Text>
                      </td>
                      <td className="py-3 pr-3">
                        <Text as="span" variant="detail">
                          {PLACEHOLDER}
                        </Text>
                      </td>
                      <td className="py-3 pr-3">
                        <Text as="span" variant="detail">
                          {PLACEHOLDER}
                        </Text>
                      </td>
                      <td className="py-3">
                        <Text as="span" className="text-success" variant="detail">
                          {PLACEHOLDER}
                        </Text>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{chart.title}</DappContentHeading>
        <Segment
          aria-label={chart.metricAria}
          className="mb-3 w-fit"
          onChange={setChartMetric}
          options={[
            { label: chart.metricTabs.tvl, value: 'tvl' },
            { label: chart.metricTabs.mcap, value: 'mcap' },
          ]}
          tone="ink"
          value={chartMetric}
        />
        <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Text as="strong" className="text-xl font-semibold" variant="copy">
              {PLACEHOLDER}
            </Text>
            <Segment
              aria-label={t.staking.aside.chartRangeAria}
              onChange={setChartRange}
              options={t.staking.aside.chartRanges.map((label) => ({ label, value: label }))}
              tone="ink"
              value={chartRange}
            />
          </div>
          <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border">
            <Text as="span" tone="muted-foreground" variant="copy">
              {PLACEHOLDER}
            </Text>
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.staking.hub.faq.title}</DappContentHeading>
        <FaqList items={t.staking.hub.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
