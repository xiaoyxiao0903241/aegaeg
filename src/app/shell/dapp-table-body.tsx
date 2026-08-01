import { type ReactNode } from 'react'

import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'

/** ResponsiveTable + embedded empty — shared DApp table chrome. */
export function DappTableBody({
  colWidths,
  emptyTitle,
  headers,
  isLoading = false,
  rows,
}: {
  colWidths?: Array<string | undefined>
  emptyTitle: string
  headers: string[]
  isLoading?: boolean
  rows: ReactNode[][]
}) {
  return (
    <>
      <ResponsiveTable colWidths={colWidths} headers={headers} isLoading={isLoading} rows={rows} />
      {!isLoading && rows.length === 0 ? (
        <DappTableEmptyMessage embedded title={emptyTitle} />
      ) : null}
    </>
  )
}
