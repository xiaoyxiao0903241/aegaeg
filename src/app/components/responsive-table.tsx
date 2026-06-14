import { dappCardClass, dappLayout } from '../../components/primitive-styles'
import { cn } from '~/lib/utils'

export function ResponsiveTable({
  className = '',
  compact = false,
  emphasisColumns = [],
  headers,
  highlightedRows = [],
  linkColumns = [],
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
  linkColumns?: number[]
  plain?: boolean
  positiveColumns?: number[]
  rows: string[][]
  statusColumns?: number[]
}) {
  const cellBase = dappLayout.tableCell
  const wrapClass = plain
    ? cn('overflow-x-auto', className)
    : dappCardClass('table', {
        className: cn(compact && dappLayout.tableWrapCompact, className),
      })

  return (
    <div className={wrapClass}>
      <table className="w-full min-w-0 border-collapse text-[13px] leading-[1.5] max-[820px]:min-w-max">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                className={cn(
                  cellBase,
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
          {rows.map((row, rowIndex) => (
            <tr
              className={highlightedRows.includes(rowIndex) ? dappLayout.tableHighlightedRow : ''}
              key={`${row[0]}-${rowIndex}`}
            >
              {row.map((cell, index) => (
                <td
                  className={cn(
                    cellBase,
                    rowIndex === rows.length - 1 && 'border-b-0',
                    'tracking-[0] text-foreground',
                    linkColumns.includes(index) && dappLayout.tableAddressCell,
                    emphasisColumns.includes(index) && dappLayout.tableEmphasisCell,
                    positiveColumns.includes(index) &&
                      cn(
                        dappLayout.tablePositiveCell,
                        'group-data-[tab=rewards]/shell:font-normal group-data-[tab=genesis]/shell:font-normal',
                      ),
                  )}
                  key={`${cell}-${index}`}
                >
                  {statusColumns.includes(index) ? (
                    <span className={dappLayout.tableStatusBadge}>{cell}</span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
