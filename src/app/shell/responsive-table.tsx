import { type ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { TableRowSkeleton } from '~/app/shell/dapp-skeleton'
import { dappTableCell } from '~/app/shell/dapp-table-card'
import { StatusBadge } from '~/shared/ui/badge'
import { Text } from '~/shared/ui/text'

const tableCell = dappTableCell()

const responsiveTable = tv({
  slots: {
    root: '',
    table: 'w-max min-w-full table-auto border-collapse',
    cell: [
      tableCell.minWidth(),
      tableCell.border(),
      // font-normal resets UA `th { font-weight: bold }` so Text copy weight wins
      'px-3 py-2.5 text-left font-normal whitespace-nowrap max-dapp:px-2.5 max-dapp:py-2',
    ],
    headCell: '',
    // Size/weight from Text `copy` — do not cover with text-xs (H5 utility ≠ copy token)
    text: '',
  },
  variants: {
    compact: {
      true: { root: '[&_table]:min-w-full' },
      false: { root: '' },
    },
    lastRow: {
      true: { cell: 'border-b-0' },
      false: { cell: '' },
    },
    highlighted: {
      true: {
        cell: '',
      },
      false: {},
    },
    link: {
      true: { cell: 'text-primary', text: 'text-primary' },
      false: {},
    },
    emphasis: {
      true: { cell: 'font-bold text-foreground', text: 'font-bold' },
      false: {},
    },
    positive: {
      true: {
        cell: 'font-bold text-success group-data-[tab=genesis]/shell:font-normal group-data-[tab=rewards]/shell:font-normal',
        text: 'font-bold text-success group-data-[tab=genesis]/shell:font-normal group-data-[tab=rewards]/shell:font-normal',
      },
      false: {},
    },
  },
  defaultVariants: {
    compact: false,
    lastRow: false,
    link: false,
    emphasis: false,
    positive: false,
  },
})

const highlightedRow =
  'bg-accent [&_td]:font-normal [&_td]:text-foreground [&_td.text-success]:text-success'

export function ResponsiveTable({
  className = '',
  colWidths,
  compact = false,
  emphasisColumns = [],
  headers,
  highlightedRows = [],
  isLoading = false,
  /** 资产仓位等稿：空态仍留表头；默认 false（空态仅 DappTableEmptyMessage） */
  keepHeaderWhenEmpty = false,
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
  headers: string[]
  highlightedRows?: number[]
  isLoading?: boolean
  keepHeaderWhenEmpty?: boolean
  linkColumns?: number[]
  loadingRowCount?: number
  positiveColumns?: number[]
  rows: ReactNode[][]
  statusColumns?: number[]
}) {
  const styles = responsiveTable({ compact })
  // 默认：空态只显示 DappTableEmptyMessage，不留表头；loading 仍出表头 + skeleton。
  if (!isLoading && rows.length === 0 && !keepHeaderWhenEmpty) return null

  const showBody = isLoading || rows.length > 0

  return (
    <div className={styles.root({ class: className })}>
      <table className={styles.table()}>
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
              <th className={styles.cell()} key={header}>
                <Text as="span" className="text-foreground/40" variant="copy">
                  {header}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        {showBody ? (
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
                    className={highlightedRows.includes(rowIndex) ? highlightedRow : ''}
                    key={`${row[0]}-${rowIndex}`}
                  >
                    {row.map((cell, index) => {
                      const isStatus = statusColumns.includes(index)
                      const isPlain = typeof cell === 'string' || typeof cell === 'number'
                      const cellStyles = responsiveTable({
                        lastRow: rowIndex === rows.length - 1,
                        link: !isStatus && isPlain === false && linkColumns.includes(index),
                        emphasis: !isStatus && isPlain === false && emphasisColumns.includes(index),
                        positive: !isStatus && isPlain === false && positiveColumns.includes(index),
                      })
                      return (
                        <td className={cellStyles.cell()} key={`${rowIndex}-${index}`}>
                          {isStatus ? (
                            <StatusBadge>{cell}</StatusBadge>
                          ) : isPlain ? (
                            <Text
                              as="span"
                              variant="copy"
                              className={responsiveTable({
                                link: linkColumns.includes(index),
                                emphasis: emphasisColumns.includes(index),
                                positive: positiveColumns.includes(index),
                              }).text({
                                class:
                                  highlightedRows.includes(rowIndex) && index === 0
                                    ? 'text-coral'
                                    : undefined,
                              })}
                            >
                              {cell}
                            </Text>
                          ) : (
                            cell
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
          </tbody>
        ) : null}
      </table>
    </div>
  )
}
