import { forwardRef, type ReactNode } from 'react'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

/**
 * Composite：Figma `tbl` 层 — 数据表格。
 *
 * 结构：Card surface="elevated" + header + table + footer。
 * 内部处理单元格样式；call site 只传 columns/rows/empty。
 */
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

const TABLE_CELL = cn(
  'px-3 py-2.5 text-left whitespace-nowrap',
  'border-b-[0.5px] border-border',
  'max-dapp:px-2.5 max-dapp:py-2',
)

const TABLE_HEAD_CELL = cn(TABLE_CELL)

const TABLE_CLASS = cn('w-max min-w-full table-auto border-collapse')

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
  return (
    <Card as="article" surface="elevated" className={cn('flex flex-col overflow-hidden p-0', className)}>
      {header ? (
        <div className="border-b border-border/50 px-4 pt-3.5 pb-2.5 max-dapp:px-3.5">
          {typeof header === 'string' ? <Text variant="headline">{header}</Text> : header}
        </div>
      ) : null}
      <div ref={ref} className="min-w-0 overflow-x-auto px-4 py-1.5 max-dapp:px-3.5">
        {rows.length === 0 && !loading ? (
          empty
        ) : (
          <table className={TABLE_CLASS}>
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
                    className={cn(
                      TABLE_HEAD_CELL,
                      col.align === 'right' && 'text-right',
                    )}
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
                          className={cn(
                            TABLE_CELL,
                            rowIndex === loadingRows - 1 && 'border-b-0',
                            col.align === 'right' && 'text-right',
                          )}
                        >
                          <span className="block h-3.5 w-16 max-w-full animate-pulse rounded bg-muted" />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            TABLE_CELL,
                            rowIndex === rows.length - 1 && 'border-b-0',
                            col.align === 'right' && 'text-right',
                          )}
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
      {footer ? (
        <div className="relative z-10 rounded-b-[inherit] border-t border-border/50 bg-card px-4 py-3 max-dapp:px-3.5 max-dapp:py-2.5">
          {footer}
        </div>
      ) : null}
    </Card>
  )
})

DataTable.displayName = 'DataTable'
