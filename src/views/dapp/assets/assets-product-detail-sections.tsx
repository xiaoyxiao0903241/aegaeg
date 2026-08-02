import type { ComponentProps } from 'react'

import { tokenCarouselIcons } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Card } from '~/shared/ui/card'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { FaqList, type FaqListItem } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'

export type AssetsDetailMetricCell = {
  value: string
  approx?: string
  icon?: 'agx' | 'gagx' | 'x'
}

/** Metrics grid + ops table + FAQ — shared by Assets position / Xmine detail panes. */
export function AssetsProductDetailSections({
  statsTitle,
  metrics,
  values,
  metricsGridClassName = 'grid grid-cols-2 gap-3',
  opsTitle,
  opsEmpty,
  opsColumns,
  opsRows,
  opsLoading,
  faqTitle,
  faqItems,
}: {
  statsTitle: string
  metrics: ReadonlyArray<{ label: string }>
  values: ReadonlyArray<AssetsDetailMetricCell | undefined>
  metricsGridClassName?: string
  opsTitle: string
  opsEmpty: string
  opsColumns: ReadonlyArray<string>
  opsRows: ComponentProps<typeof ResponsiveTable>['rows']
  opsLoading: boolean
  faqTitle: string
  faqItems: ReadonlyArray<FaqListItem>
}) {
  return (
    <>
      <DappDetailBlock>
        <DappContentHeading>{statsTitle}</DappContentHeading>
        <div className={metricsGridClassName}>
          {metrics.map((metric, index) => {
            const cell = values[index]
            const iconSrc =
              cell?.icon === 'agx'
                ? tokenCarouselIcons.agxIcon
                : cell?.icon === 'gagx'
                  ? tokenCarouselIcons.gagxIcon
                  : cell?.icon === 'x'
                    ? tokenCarouselIcons.xIcon
                    : null
            return (
              // Figma 仓位数据 stat 94：min-h-23.5 + support leading（禁 h-[94px]）
              <Card
                as="div"
                className="grid min-h-23.5 gap-1 rounded-2xl p-4"
                key={metric.label}
                surface="elevated"
              >
                <Text
                  as="span"
                  className="leading-4 font-medium"
                  tone="muted-foreground"
                  variant="support"
                >
                  {metric.label}
                </Text>
                <div className="flex items-center gap-1.5">
                  {iconSrc ? (
                    <DappIcon alt="" className="rounded-control" size="lg" src={iconSrc} />
                  ) : null}
                  <Text as="strong" className="text-sm leading-5 font-semibold" variant="copy">
                    <DappCountValue text={cell?.value ?? '0.00'} />
                  </Text>
                </div>
                {cell?.approx != null ? (
                  <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
                    <DappCountValue text={cell.approx} />
                  </Text>
                ) : null}
              </Card>
            )
          })}
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{opsTitle}</DappContentHeading>
        <DappTableCard>
          <ResponsiveTable
            colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
            headers={[...opsColumns]}
            rows={opsRows}
          />
          {opsRows.length === 0 ? (
            <DappTableEmptyMessage embedded title={opsLoading ? '…' : opsEmpty} />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{faqTitle}</DappContentHeading>
        <FaqList items={[...faqItems]} variant="dapp" />
      </DappDetailBlock>
    </>
  )
}
