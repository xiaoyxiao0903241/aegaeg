import { type ReactNode } from 'react'
import { StatusBadge } from '~/shared/ui/badge'
import { Text, type TextTone } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'
import { TableRowSkeleton } from '~/app/shell/components/dapp-skeleton'
import { dappTableCell } from '~/app/shell/components/dapp-table-card'

const tableCell = dappTableCell()
const TABLE_CELL =
  `${tableCell.minWidth()} ${tableCell.border()} tabular-nums px-3 py-2.5 text-left whitespace-nowrap max-dapp:px-2.5 max-dapp:py-2`

const TABLE_CLASS = 'w-max min-w-full table-auto border-collapse'

const HIGHLIGHTED_ROW = 'bg-accent'

const POSITIVE_WEIGHT_CLASS =
  'group-data-[tab=rewards]/shell:font-normal group-data-[tab=genesis]/shell:font-normal'

function getCellTextConfig(
  columnIndex: number,
  highlighted: boolean,
  linkColumns: number[],
  emphasisColumns: number[],
  positiveColumns: number[],
): {
  className?: string
  tone: TextTone
  weight?: 'bold'
} {
  const isLink = linkColumns.includes(columnIndex)
  const isEmphasis = emphasisColumns.includes(columnIndex)
  const isPositive = positiveColumns.includes(columnIndex)
  const isFirst = columnIndex === 0

  if (highlighted) {
    if (isPositive) {
      return {
        tone: 'success',
        weight: 'bold',
        className: POSITIVE_WEIGHT_CLASS,
      }
    }
    if (isFirst) {
      return { tone: 'accent' }
    }
    return { tone: 'primary' }
  }

  if (isPositive) {
    return {
      tone: 'success',
      weight: 'bold',
      className: POSITIVE_WEIGHT_CLASS,
    }
  }
  if (isLink) {
    return { tone: 'accent' }
  }
  if (isEmphasis) {
    return { tone: 'primary', weight: 'bold' }
  }
  return { tone: 'primary' }
}

function wrapTableCellContent(
  cell: ReactNode,
  textConfig: ReturnType<typeof getCellTextConfig>,
): ReactNode {
  if (cell == null || cell === false) {
    return cell
  }

  if (typeof cell === 'string' || typeof cell === 'number') {
    return (
      <Text
        as="span"
        variant="body"
        tone={textConfig.tone}
        weight={textConfig.weight}
        tabular
        className={textConfig.className}
      >
        {cell}
      </Text>
    )
  }

  return cell
}

export function ResponsiveTable({
  className = '',
  /** Per-column width hints (e.g. '8.25rem'); `undefined` leaves a column auto. */
  colWidths,
  compact = false,
  emphasisColumns = [],
  headCellClassName,
  headers,
  highlightedRows = [],
  isLoading = false,
  linkColumns = [],
  loadingRowCount = 3,
  positiveColumns = [],
  rows,
  statusColumns = [],
}: {
  className?: string
  colWidths?: Array<string | undefined>
  compact?: boolean
  emphasisColumns?: number[]
  headCellClassName?: string
  headers: string[]
  highlightedRows?: number[]
  isLoading?: boolean
  linkColumns?: number[]
  loadingRowCount?: number
  positiveColumns?: number[]
  rows: ReactNode[][]
  statusColumns?: number[]
}) {
  return (
    <div className={cn(compact && '[&_table]:min-w-full', className)}>
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
              <th className={cn(TABLE_CELL, headCellClassName)} key={header}>
                <Text variant="label" tone="secondary">
                  {header}
                </Text>
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
            : rows.map((row, rowIndex) => {
                const highlighted = highlightedRows.includes(rowIndex)

                return (
                  <tr
                    className={highlighted ? HIGHLIGHTED_ROW : ''}
                    key={`${row[0]}-${rowIndex}`}
                  >
                    {row.map((cell, index) => {
                      const textConfig = getCellTextConfig(
                        index,
                        highlighted,
                        linkColumns,
                        emphasisColumns,
                        positiveColumns,
                      )

                      return (
                        <td
                          className={cn(
                            TABLE_CELL,
                            rowIndex === rows.length - 1 && 'border-b-0',
                          )}
                          key={`${rowIndex}-${index}`}
                        >
                          {statusColumns.includes(index) ? (
                            <StatusBadge>{cell}</StatusBadge>
                          ) : (
                            wrapTableCellContent(cell, textConfig)
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
        </tbody>
      </table>
    </div>
  )
}
