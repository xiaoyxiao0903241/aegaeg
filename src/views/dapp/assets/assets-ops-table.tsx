/**
 * 资产操作记录表
 *
 * 可加载态；可选分页页脚。
 */
import type { ComponentProps, ReactNode } from 'react'

import { Table } from '~/shared/components/table'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'

export function AssetsOpsTable({
  empty,
  headers,
  isLoading,
  rows,
  pagination,
}: {
  empty: string
  headers: ReadonlyArray<string>
  isLoading: boolean
  rows: ComponentProps<typeof Table.Body>['rows']
  pagination?: {
    page: number
    total: number
    onPageChange: (page: number) => void
    summary?: ReactNode
  }
}) {
  return (
    <Table>
      <Table.Body
        colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
        empty={empty}
        headers={[...headers]}
        isLoading={isLoading}
        rows={rows}
      />
      {pagination && shouldShowTablePagination(pagination.total) ? (
        <Table.Footer>
          <Table.Pagination
            onPageChange={pagination.onPageChange}
            page={pagination.page}
            summary={pagination.summary}
            total={pagination.total}
          />
        </Table.Footer>
      ) : null}
    </Table>
  )
}
