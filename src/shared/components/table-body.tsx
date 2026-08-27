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
      true: 'text-claim underline [&_a]:text-claim [&_a]:underline',
      false: '',
    },
    emphasis: {
      true: 'font-bold text-foreground',
      false: '',
    },
    muted: {
      true: 'text-muted-foreground tabular-nums',
      false: '',
    },
    primary: {
      true: 'font-semibold text-primary',
      false: '',
    },
    end: {
      true: 'text-right',
      false: '',
    },
  },
  defaultVariants: {
    last: false,
    link: false,
    emphasis: false,
    muted: false,
    primary: false,
    end: false,
  },
})

const cellTextTv = tv({
  base: '',
  variants: {
    link: { true: 'text-claim underline', false: '' },
    emphasis: { true: 'font-bold', false: '' },
    muted: { true: 'text-muted-foreground tabular-nums', false: '' },
    primary: { true: 'font-semibold text-primary', false: '' },
  },
  defaultVariants: { link: false, emphasis: false, muted: false, primary: false },
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
  'bg-(--rewards-tier-current-bg) [&_td]:font-normal [&_td]:text-foreground [&_td.text-claim]:text-claim'
type CellProps = {
  /** 高亮行首列珊瑚字。 */
  accent?: boolean
  as?: 'td' | 'th'
  children?: ReactNode
  className?: string
  emphasis?: boolean
  end?: boolean
  /** 列头：弱字阶（`as="th"` 时默认）。 */
  head?: boolean
  last?: boolean
  link?: boolean
  muted?: boolean
  primary?: boolean
  status?: boolean
}

/** 单元格样式；手写表 / Body 内部共用 */
function Cell({
  accent = false,
  as = 'td',
  children,
  className,
  emphasis = false,
  end = false,
  head = false,
  last = false,
  link = false,
  muted = false,
  primary = false,
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
          muted: toneOnCell && muted,
          primary: toneOnCell && primary,
          end,
        }),
        className,
      )}
    >
      {status ? (
        <StatusBadge>{children}</StatusBadge>
      ) : isHead && isPlain ? (
        <Text as="span" className="text-foreground/40" variant="copy">
          {children}
        </Text>
      ) : isHead ? (
        children
      ) : isPlain ? (
        <Text
          as="span"
          variant="copy"
          className={cellTextTv({
            link,
            emphasis,
            muted,
            primary,
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
  compact?: boolean
  /** 空态标题；缺省且 rows 空时不渲染空态。 */
  empty?: string
  emptyBody?: string
  emphasisColumns?: number[]
  /** 右对齐（奖金 / 比例等）。 */
  endColumns?: number[]
  headers: ReactNode[]
  highlightedRows?: number[]
  isLoading?: boolean
  /** 链上地址 / 哈希列：蓝 + 下划线。 */
  linkColumns?: number[]
  loadingRowCount?: number
  /** 弱时间 / 次级数字：`muted-foreground` + 等宽数字。 */
  mutedColumns?: number[]
  /** 珊瑚强调（非链接）：`primary`。 */
  primaryColumns?: number[]
  rows: ReactNode[][]
  statusColumns?: number[]
}

/**
 * 表格网格
 *
 * 渲染列头与行，支持加载骨架、列语义样式与空态。
 * 列宽跟 nowrap 内容走；表 min-w-full 铺满容器，不锁死最大宽。
 *
 * @param headers 列头（文案或可点节点）
 * @param rows 单元格二维数组
 * @param isLoading 为 true 时显示骨架行
 * @param empty 空态标题；缺省且 rows 空时不渲染空态
 */
function Body({
  className = '',
  compact = false,
  empty,
  emptyBody,
  emphasisColumns = [],
  endColumns = [],
  headers,
  highlightedRows = [],
  isLoading = false,
  linkColumns = [],
  loadingRowCount = 3,
  mutedColumns = [],
  primaryColumns = [],
  rows,
  statusColumns = [],
}: BodyProps) {
  const showEmpty = !isLoading && rows.length === 0
  const highlightedRowSet = new Set(highlightedRows)
  const emphasisColumnSet = new Set(emphasisColumns)
  const endColumnSet = new Set(endColumns)
  const linkColumnSet = new Set(linkColumns)
  const mutedColumnSet = new Set(mutedColumns)
  const primaryColumnSet = new Set(primaryColumns)
  const statusColumnSet = new Set(statusColumns)

  if (showEmpty) {
    return empty != null ? <TableEmpty embedded body={emptyBody} title={empty} /> : null
  }

  return (
    <div className={gridRoot({ compact, class: className })}>
      <table className="w-max min-w-full table-auto border-collapse [&_a]:text-claim">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <Cell as="th" end={endColumnSet.has(index)} head key={index}>
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
                      end={endColumnSet.has(index)}
                      key={`${rowIndex}-${index}`}
                      last={rowIndex === rows.length - 1}
                      link={linkColumnSet.has(index)}
                      muted={mutedColumnSet.has(index)}
                      primary={primaryColumnSet.has(index)}
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
