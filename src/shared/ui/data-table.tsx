import { forwardRef, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

export type DataTableColumn<T> = {
  accessor?: (row: T, index: number) => ReactNode
  align?: 'left' | 'right'
  header: ReactNode
  key: string
  width?: string
}

export type DataTableProps<T> = {
  className?: string
  columns: DataTableColumn<T>[]
  empty?: ReactNode
  footer?: ReactNode
  header?: ReactNode
  loading?: boolean
  loadingRows?: number
  rows: T[]
}

const dataTable = tv({
  slots: {
    root: 'flex flex-col overflow-hidden p-0',
    header: 'border-b border-border/50 px-4 pt-3.5 pb-2.5 max-dapp:px-3.5',
    scroll: 'min-w-0 overflow-x-auto px-4 py-1.5 max-dapp:px-3.5',
    table: 'w-max min-w-full table-auto border-collapse',
    cell: [
      'px-3 py-2.5 text-left whitespace-nowrap',
      'border-b-[0.5px] border-border',
      'max-dapp:px-2.5 max-dapp:py-2',
    ],
    footer:
      'relative z-10 rounded-b-[inherit] border-t border-border/50 bg-card px-4 py-3 max-dapp:px-3.5 max-dapp:py-2.5',
    loadingBar: 'block h-3.5 w-16 max-w-full animate-pulse rounded bg-muted',
  },
  variants: {
    align: {
      left: { cell: 'text-left' },
      right: { cell: 'text-right' },
    },
    lastRow: {
      true: { cell: 'border-b-0' },
      false: { cell: '' },
    },
  },
  defaultVariants: {
    align: 'left',
    lastRow: false,
  },
})

function renderDataTableCell(value: ReactNode) {
  if (typeof value === 'string' || typeof value === 'number') {
    return (
      <Text as="span" variant="copy">
        {value}
      </Text>
    )
  }
  return value
}

export const DataTable = forwardRef(function DataTable<T extends Record<string, ReactNode>>(
  {
    className,
    columns,
    empty,
    footer,
    header,
    loading = false,
    loadingRows = 3,
    rows,
  }: DataTableProps<T>,
  ref: React.Ref<HTMLDivElement>,
) {
  const styles = dataTable()

  return (
    <Card as="article" surface="elevated" className={styles.root({ class: className })}>
      {header ? (
        <div className={styles.header()}>
          {typeof header === 'string' ? <Text variant="headline">{header}</Text> : header}
        </div>
      ) : null}
      <div ref={ref} className={styles.scroll()}>
        {rows.length === 0 && !loading ? (
          empty
        ) : (
          <table className={styles.table()}>
            <colgroup>
              {columns.map((col) => (
                <col key={col.key} style={col.width ? { width: col.width } : undefined} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={dataTable({ align: col.align ?? 'left' }).cell()}
                  >
                    {typeof col.header === 'string' || typeof col.header === 'number' ? (
                      <Text as="span" variant="copy" tone="muted-foreground">
                        {col.header}
                      </Text>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: loadingRows }, (_, rowIndex) => (
                    <tr key={`loading-${rowIndex}`}>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={dataTable({
                            align: col.align ?? 'left',
                            lastRow: rowIndex === loadingRows - 1,
                          }).cell()}
                        >
                          <span className={styles.loadingBar()} />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={dataTable({
                            align: col.align ?? 'left',
                            lastRow: rowIndex === rows.length - 1,
                          }).cell()}
                        >
                          {renderDataTableCell(
                            col.accessor ? col.accessor(row, rowIndex) : row[col.key],
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </div>
      {footer ? <div className={styles.footer()}>{footer}</div> : null}
    </Card>
  )
})

DataTable.displayName = 'DataTable'
