import { forwardRef, type ReactNode, type Ref } from 'react'
import { Card } from '~/components/card'
import { StatusBadge } from '~/components/badge'
import { dappTableCardShellClass } from '~/app/components/dapp-table-shell'
import { cn } from '~/lib/utils'
import { TableRowSkeleton } from '~/app/components/dapp-skeleton'

const TABLE_CELL =
  'min-w-[88px] border-b-[0.5px] border-border px-3 py-2.5 text-left whitespace-nowrap font-normal tracking-normal text-sm max-dapp:px-2.5 max-dapp:py-2 max-dapp:text-xs max-dapp:leading-normal'

const TABLE_HEAD_CELL = cn(TABLE_CELL, 'text-muted-foreground group-data-[tab=rewards]/shell:text-faint')

// Unified across all tables: every column has a min-width + padding (TABLE_CELL),
// the table sizes to content (w-max) but fills the container (min-w-full), and
// the wrapper's overflow-x-auto lets it scroll horizontally when it overflows.
const TABLE_CLASS =
  'w-max min-w-full table-auto border-collapse text-sm leading-normal max-dapp:text-xs'

const TABLE_WRAP_PADDING =
  'dapp:px-5 dapp:py-1.5 max-dapp:px-3.5 max-dapp:py-1.5'

const HIGHLIGHTED_ROW =
  'bg-accent [&_td]:font-normal [&_td]:text-foreground [&_td:first-child]:text-primary [&_td.text-success]:text-success'

export const ResponsiveTable = forwardRef<HTMLDivElement, {
  className?: string
  /** Per-column width hints (e.g. '140px'); `undefined` leaves a column auto. */
  colWidths?: Array<string | undefined>
  compact?: boolean
  emphasisColumns?: number[]
  headers: string[]
  highlightedRows?: number[]
  isLoading?: boolean
  linkColumns?: number[]
  loadingRowCount?: number
  plain?: boolean
  positiveColumns?: number[]
  rows: ReactNode[][]
  statusColumns?: number[]
}>(function ResponsiveTable(
  {
    className = '',
    colWidths,
    compact = false,
    emphasisColumns = [],
    headers,
    highlightedRows = [],
    isLoading = false,
    linkColumns = [],
    loadingRowCount = 3,
    plain = false,
    positiveColumns = [],
    rows,
    statusColumns = [],
  },
  ref,
) {
  const wrapClass = plain
    ? cn(
        'overflow-x-auto max-w-full min-w-0 max-dapp:scrollbar-x-track',
        dappTableCardShellClass,
        TABLE_WRAP_PADDING,
        className,
      )
    : cn(
        'overflow-x-auto max-w-full min-w-0 max-dapp:scrollbar-x-track',
        dappTableCardShellClass,
        TABLE_WRAP_PADDING,
        compact && '[&_table]:min-w-full',
        className,
      )

  const table = (
    <table className={TABLE_CLASS}>
      {colWidths ? (
        <colgroup>
          {headers.map((header, index) => (
            <col
              key={header}
              style={colWidths[index] ? { width: colWidths[index] } : undefined}
            />
          ))}
        </colgroup>
      ) : null}
      <thead>
        <tr>
          {headers.map((header) => (
            <th className={TABLE_HEAD_CELL} key={header}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading
          ? Array.from({ length: loadingRowCount }, (_, rowIndex) => (
              <TableRowSkeleton
                columns={headers.length}
                isLast={rowIndex === loadingRowCount - 1}
                key={`loading-${rowIndex}`}
              />
            ))
          : rows.map((row, rowIndex) => (
              <tr
                className={highlightedRows.includes(rowIndex) ? HIGHLIGHTED_ROW : ''}
                key={`${row[0]}-${rowIndex}`}
              >
                {row.map((cell, index) => (
                  <td
                    className={cn(
                      TABLE_CELL,
                      rowIndex === rows.length - 1 && 'border-b-0',
                      'tracking-normal text-foreground',
                      linkColumns.includes(index) && 'text-primary',
                      emphasisColumns.includes(index) && 'font-bold text-foreground',
                      positiveColumns.includes(index) &&
                        cn(
                          'font-bold text-success',
                          'group-data-[tab=rewards]/shell:font-normal group-data-[tab=genesis]/shell:font-normal',
                        ),
                    )}
                    key={`${rowIndex}-${index}`}
                  >
                    {statusColumns.includes(index) ? (
                      <StatusBadge>{cell}</StatusBadge>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
      </tbody>
    </table>
  )

  if (plain) {
    return (
      <div ref={ref} className={wrapClass}>
        {table}
      </div>
    )
  }

  return (
    <Card ref={ref} as="div" surface="elevated" className={wrapClass}>
      {table}
    </Card>
  )
})
