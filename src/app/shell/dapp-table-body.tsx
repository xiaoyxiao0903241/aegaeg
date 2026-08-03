import type { ReactNode } from 'react'

import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'

/** ResponsiveTable + embedded empty — 空态无表头（见 ResponsiveTable）。 */
export function DappTableBody({
  colWidths,
  emptyTitle,
  emphasisColumns,
  headers,
  isLoading = false,
  linkColumns,
  positiveColumns,
  rows,
  statusColumns,
}: {
  colWidths?: Array<string | undefined>
  emptyTitle: string
  emphasisColumns?: number[]
  headers: string[]
  isLoading?: boolean
  linkColumns?: number[]
  positiveColumns?: number[]
  rows: ReactNode[][]
  statusColumns?: number[]
}) {
  return (
    <>
      <ResponsiveTable
        colWidths={colWidths}
        emphasisColumns={emphasisColumns}
        headers={headers}
        isLoading={isLoading}
        linkColumns={linkColumns}
        positiveColumns={positiveColumns}
        rows={rows}
        statusColumns={statusColumns}
      />
      {!isLoading && rows.length === 0 ? (
        <DappTableEmptyMessage embedded title={emptyTitle} />
      ) : null}
    </>
  )
}
