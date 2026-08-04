import type { ComponentProps, ReactNode } from 'react'

import { tokenCarouselIcons } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { CountValue } from '~/shared/components/count-value'
import { FaqList, type FaqListItem } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { Table } from '~/shared/components/table'
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
  opsRows: ComponentProps<typeof Table.Body>['rows']
  opsLoading: boolean
  /** 右栏操作记录分页（稿 Table.Pagination）；缺省不渲染 */
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
      <Tile key={metric.label}>
        <Tile.Label>{metric.label}</Tile.Label>
        <div className="flex items-center gap-1.5">
          {iconSrc ? <Icon alt="" className="rounded-control" size="lg" src={iconSrc} /> : null}
          <Text as="strong" className="text-base leading-5 font-semibold" variant="copy">
            <CountValue text={cell?.value ?? '0.00'} />
          </Text>
        </div>
        {cell?.approx != null ? (
          <Tile.Note>
            <CountValue text={cell.approx} />
          </Tile.Note>
        ) : null}
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
        <Table>
          <Table.Body
            colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
            empty={opsEmpty}
            headers={[...opsColumns]}
            isLoading={opsLoading}
            rows={opsRows}
          />
          {opsPagination && shouldShowTablePagination(opsPagination.total) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={opsPagination.onPageChange}
                page={opsPagination.page}
                summary={opsPagination.summary}
                total={opsPagination.total}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{faqTitle}</DappContentHeading>
        <FaqList items={[...faqItems]} variant="dapp" />
      </DappDetailBlock>
    </>
  )
}
