import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { FaqList } from '~/shared/ui/faq-list'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'

const PLACEHOLDER = '—'

/** Hub right rail: overview grid + period table + FAQ (dynamic figures may be —). */
export function StakingHubContent() {
  const { messages: t } = useI18n()
  const [tableSeg, setTableSeg] = useState('stake')

  const overview = t.staking.hub.overview
  const table = t.staking.hub.periodTable

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{overview.title}</DappContentHeading>
        <div className="grid grid-cols-3 gap-3">
          {overview.metrics.map((metric) => (
            <div className="grid gap-1" key={metric.label}>
              <Text as="span" tone="muted-foreground" variant="detail">
                {metric.label}
              </Text>
              <Text as="strong" className="font-semibold" variant="copy">
                {PLACEHOLDER}
              </Text>
            </div>
          ))}
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{table.title}</DappContentHeading>
        <Segment
          aria-label={table.segmentAria}
          className="mb-3"
          onChange={setTableSeg}
          options={[
            { label: table.segs.stake, value: 'stake' },
            { label: table.segs.lpbond, value: 'lpbond' },
            { label: table.segs.burnbond, value: 'burnbond' },
          ]}
          tone="ink"
          value={tableSeg}
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                {table.columns.map((col) => (
                  <th className="border-b border-border pr-3 pb-2" key={col}>
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
                    <td className="py-2 pr-3">
                      <Text as="span" variant="detail">
                        {row.period}
                      </Text>
                    </td>
                    <td className="py-2 pr-3">
                      <Text as="span" variant="detail">
                        {PLACEHOLDER}
                      </Text>
                    </td>
                    <td className="py-2">
                      <Text as="span" variant="detail">
                        {PLACEHOLDER}
                      </Text>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.staking.hub.chart.title}</DappContentHeading>
        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border">
          <Text as="span" tone="muted-foreground" variant="copy">
            {PLACEHOLDER}
          </Text>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.staking.hub.faq.title}</DappContentHeading>
        <FaqList defaultOpenFirst={false} items={t.staking.hub.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
