import type { ComponentProps, ReactNode } from 'react'

import { tokenCarouselIcons } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { DappTablePagination } from '~/app/shell/dapp-table-pagination'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Tile } from '~/app/shell/tile'
import { CountValue } from '~/shared/components/count-value'
import { FaqList, type FaqListItem } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'

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
  /** 等列 OverviewGrid；`upper3-lower2` = LP/Burn 上三下二 span（OverviewGrid 列变体） */
  metricsLayout = 2,
  opsTitle,
  opsEmpty,
  opsColumns,
  opsRows,
  opsLoading,
  opsPagination,
  faqTitle,
  faqItems,
}: {
  statsTitle: string
  metrics: ReadonlyArray<{ label: string }>
  values: ReadonlyArray<AssetsDetailMetricCell | undefined>
  metricsLayout?: 2 | 3 | 'upper3-lower2'
  opsTitle: string
  opsEmpty: string
  opsColumns: ReadonlyArray<string>
  opsRows: ComponentProps<typeof ResponsiveTable>['rows']
  opsLoading: boolean
  /** 右栏操作记录分页（稿 DappTablePagination）；缺省不渲染 */
  opsPagination?: {
    page: number
    total: number
    onPageChange: (page: number) => void
    summary?: ReactNode
  }
  faqTitle: string
  faqItems: ReadonlyArray<FaqListItem>
}) {
  const tiles = metrics.map((metric, index) => {
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
      <Tile
        key={metric.label}
        label={metric.label}
        note={cell?.approx != null ? <CountValue text={cell.approx} /> : undefined}
      >
        <div className="flex items-center gap-1.5">
          {iconSrc ? <Icon alt="" className="rounded-control" size="lg" src={iconSrc} /> : null}
          <Text as="strong" className="text-base leading-5 font-semibold" variant="copy">
            <CountValue text={cell?.value ?? '0.00'} />
          </Text>
        </div>
      </Tile>
    )
  })

  return (
    <>
      <DappDetailBlock>
        <DappContentHeading>{statsTitle}</DappContentHeading>
        <OverviewGrid columns={metricsLayout === 'upper3-lower2' ? 'upper3-lower2' : metricsLayout}>
          {tiles}
        </OverviewGrid>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{opsTitle}</DappContentHeading>
        <DappTableCard
          footer={
            opsPagination && shouldShowTablePagination(opsPagination.total) ? (
              <DappTablePagination
                embedded
                onPageChange={opsPagination.onPageChange}
                page={opsPagination.page}
                summary={opsPagination.summary}
                total={opsPagination.total}
              />
            ) : undefined
          }
        >
          <ResponsiveTable
            colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
            headers={[...opsColumns]}
            isLoading={opsLoading}
            rows={opsRows}
          />
          {!opsLoading && opsRows.length === 0 ? (
            <DappTableEmptyMessage embedded title={opsEmpty} />
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
