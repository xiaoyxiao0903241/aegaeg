import { Card } from '~/components/card'
import { StatusBadge } from '~/components/badge'
import { dappTableCardShellClass } from '~/app/components/dapp-table-shell'
import { cn } from '~/lib/utils'
import { TableRowSkeleton } from '~/app/components/dapp-skeleton'

const TABLE_CELL =
  'border-b-[0.5px] border-border py-2.5 text-left whitespace-nowrap font-normal tracking-[0] max-dapp:py-[9px] max-dapp:text-xs max-dapp:leading-normal max-dapp:tracking-[-0.24px]'

const TABLE_HEAD_CELL = cn(TABLE_CELL, 'text-muted-foreground group-data-[tab=rewards]/shell:text-faint')

const TABLE_CLASS =
  'w-full min-w-0 table-fixed border-collapse text-[13px] leading-[1.5] max-dapp:text-xs max-dapp:leading-normal'

const TABLE_WRAP_H5 =
  'max-dapp:overflow-x-visible max-dapp:px-3.5 max-dapp:py-1.5'

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
    ? cn(
        'overflow-x-auto max-w-full min-w-0',
        dappTableCardShellClass,
        TABLE_WRAP_H5,
        className,
      )
    : cn(
        'mt-3.5 overflow-x-auto max-w-full min-w-0 px-4 py-[5.75px]',
        dappTableCardShellClass,
        TABLE_WRAP_H5,
        compact && '[&_table]:min-w-full',
        className,
      )

  const table = (
    <table className={TABLE_CLASS}>
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
