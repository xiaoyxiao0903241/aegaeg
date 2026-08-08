/**
 * DApp 表网格 — Cell / Body
 */

import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { StatusBadge } from '~/shared/components/badge'
import { TableEmpty } from '~/shared/components/table-empty'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

const cellTv = tv({
  base: [
    'min-w-(--dapp-table-cell-min-width)',
    'border-b border-border',
    'px-3 py-2.5 text-left font-normal whitespace-nowrap max-dapp:px-2.5 max-dapp:py-2',
  ],
  variants: {
    last: {
      true: 'border-b-0',
      false: '',
    },
    link: {
      true: 'text-primary',
      false: '',
    },
    emphasis: {
      true: 'font-bold text-foreground',
      false: '',
    },
    positive: {
      true: 'font-bold text-success group-data-[tab=genesis]/host:font-normal group-data-[tab=rewards]/host:font-normal',
      false: '',
    },
  },
  defaultVariants: {
    last: false,
    link: false,
    emphasis: false,
    positive: false,
  },
})

const cellTextTv = tv({
  base: '',
  variants: {
    link: { true: 'text-primary', false: '' },
    emphasis: { true: 'font-bold', false: '' },
    positive: {
      true: 'font-bold text-success group-data-[tab=genesis]/host:font-normal group-data-[tab=rewards]/host:font-normal',
      false: '',
    },
  },
  defaultVariants: { link: false, emphasis: false, positive: false },
})

const gridRoot = tv({
  base: '',
  variants: {
    compact: {
      true: '[&_table]:min-w-full',
      false: '',
    },
  },
  defaultVariants: { compact: false },
})

const highlightedRow =
  'bg-(--rewards-tier-current-bg) [&_td]:font-normal [&_td]:text-foreground [&_td.text-success]:text-success'
type CellProps = {
  /** 高亮行首列珊瑚字。 */
  accent?: boolean
  as?: 'td' | 'th'
  children?: ReactNode
  className?: string
  emphasis?: boolean
  /** 列头：弱字阶（`as="th"` 时默认）。 */
  head?: boolean
  last?: boolean
  link?: boolean
  positive?: boolean
  status?: boolean
}

/** 单元格样式；手写表 / Body 内部共用 */
function Cell({
  accent = false,
  as = 'td',
  children,
  className,
  emphasis = false,
  head = false,
  last = false,
  link = false,
  positive = false,
  status = false,
}: CellProps) {
  const isHead = as === 'th' || head
  const Tag = as === 'th' || isHead ? 'th' : 'td'
  // 纯文案走 Text；节点 cell 的强调挂在 td 上（与旧网格行为一致）
  const isPlain = typeof children === 'string' || typeof children === 'number'
  const toneOnCell = !status && !isPlain && !isHead

  return (
    <Tag
      className={cn(
        cellTv({
          last,
          link: toneOnCell && link,
          emphasis: toneOnCell && emphasis,
          positive: toneOnCell && positive,
        }),
        className,
      )}
    >
      {status ? (
        <StatusBadge>{children}</StatusBadge>
      ) : isHead ? (
        <Text as="span" className="text-foreground/40" variant="copy">
          {children}
        </Text>
      ) : isPlain ? (
        <Text
          as="span"
          variant="copy"
          className={cellTextTv({
            link,
            emphasis,
            positive,
            class: accent ? 'text-coral' : undefined,
          })}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Tag>
  )
}

type BodyProps = {
  className?: string
  colWidths?: Array<string | undefined>
  compact?: boolean
  /** 空态标题；缺省且 rows 空时不渲染空态。 */
  empty?: string
  emptyBody?: string
  emphasisColumns?: number[]
  headers: string[]
  highlightedRows?: number[]
  isLoading?: boolean
  linkColumns?: number[]
  loadingRowCount?: number
  positiveColumns?: number[]
  rows: ReactNode[][]
  statusColumns?: number[]
}

/**
 * 表格网格
 *
 * 渲染列头与行，支持加载骨架、列语义样式与空态。
 *
 * @param headers 列头文案
 * @param rows 单元格二维数组
 * @param isLoading 为 true 时显示骨架行
 * @param empty 空态标题；缺省且 rows 空时不渲染空态
 */
function Body({
  className = '',
  colWidths,
  compact = false,
  empty,
  emptyBody,
  emphasisColumns = [],
  headers,
  highlightedRows = [],
  isLoading = false,
  linkColumns = [],
  loadingRowCount = 3,
  positiveColumns = [],
  rows,
  statusColumns = [],
}: BodyProps) {
  const showEmpty = !isLoading && rows.length === 0
  const highlightedRowSet = new Set(highlightedRows)
  const emphasisColumnSet = new Set(emphasisColumns)
  const linkColumnSet = new Set(linkColumns)
  const positiveColumnSet = new Set(positiveColumns)
  const statusColumnSet = new Set(statusColumns)

  if (showEmpty) {
    return empty != null ? <TableEmpty embedded body={emptyBody} title={empty} /> : null
  }

  return (
    <div className={gridRoot({ compact, class: className })}>
      <table className="w-max min-w-full table-auto border-collapse">
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
              <Cell as="th" head key={header}>
                {header}
              </Cell>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: loadingRowCount }, (_, rowIndex) => (
                <RowSkeleton
                  columns={headers.length}
                  isLast={rowIndex === loadingRowCount - 1}
                  key={`loading-${rowIndex}`}
                />
              ))
            : rows.map((row, rowIndex) => (
                <tr
                  className={highlightedRowSet.has(rowIndex) ? highlightedRow : ''}
                  key={`${row[0]}-${rowIndex}`}
                >
                  {row.map((cell, index) => (
                    <Cell
                      accent={highlightedRowSet.has(rowIndex) && index === 0}
                      emphasis={emphasisColumnSet.has(index)}
                      key={`${rowIndex}-${index}`}
                      last={rowIndex === rows.length - 1}
                      link={linkColumnSet.has(index)}
                      positive={positiveColumnSet.has(index)}
                      status={statusColumnSet.has(index)}
                    >
                      {cell}
                    </Cell>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}

function RowSkeleton({ columns, isLast }: { columns: number; isLast: boolean }) {
  return (
    <tr>
      {Array.from({ length: columns }, (_, index) => (
        <td className={cellTv({ last: isLast })} key={index}>
          <span
            aria-hidden
            className="block h-3.5 w-full max-w-22 rounded-md bg-skeleton motion-safe:animate-[dapp-skeleton-pulse_1.4s_ease-in-out_infinite]"
          />
        </td>
      ))}
    </tr>
  )
}

export { Body, Cell }
