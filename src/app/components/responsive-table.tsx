import { Card } from '~/components/card'
import { StatusBadge } from '~/components/badge'
import { cn } from '~/lib/utils'
import { TableRowSkeleton } from '~/app/components/dapp-skeleton'

const TABLE_CELL =
  'border-b-[0.5px] border-border py-2.5 text-left whitespace-nowrap font-normal'

const HIGHLIGHTED_ROW =
  'bg-accent [&_td]:font-normal [&_td]:text-foreground [&_td:first-child]:text-primary [&_td.text-success]:text-success'

export function ResponsiveTable({
  className = '',
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
}: {
  className?: string
  compact?: boolean
  emphasisColumns?: number[]
  headers: string[]
  highlightedRows?: number[]
  isLoading?: boolean
  linkColumns?: number[]
  loadingRowCount?: number
  plain?: boolean
  positiveColumns?: number[]
  rows: string[][]
  statusColumns?: number[]
}) {
  const wrapClass = plain
    ? cn('overflow-x-auto', className)
    : cn(
        'mt-3.5 overflow-x-auto max-w-full min-w-0 px-4 py-[5.75px]',
        compact && '[&_table]:min-w-full',
        className,
      )

  const table = (
    <table className="w-full min-w-0 border-collapse text-[13px] leading-[1.5] max-dapp:min-w-max">
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              className={cn(
                TABLE_CELL,
                'tracking-[0] text-muted-foreground group-data-[tab=rewards]/shell:text-faint',
              )}
              key={header}
            >
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
                      'tracking-[0] text-foreground',
                      linkColumns.includes(index) && 'text-primary',
                      emphasisColumns.includes(index) && 'font-bold text-foreground',
                      positiveColumns.includes(index) &&
                        cn(
                          'font-bold text-success',
                          'group-data-[tab=rewards]/shell:font-normal group-data-[tab=genesis]/shell:font-normal',
                        ),
                    )}
                    key={`${cell}-${index}`}
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
    return <div className={wrapClass}>{table}</div>
  }

  return (
    <Card as="div" surface="elevated" className={wrapClass}>
      {table}
    </Card>
  )
}
