import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { tv } from 'tailwind-variants'

import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { StatusBadge } from '~/shared/components/badge'
import { Card, cardVariants } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { revealClass } from '~/shared/lib/reveal'
import { cssRemVarPx } from '~/shared/lib/root-rem-px'
import { DAPP_TABLE_PAGE_SIZE, shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { cn } from '~/shared/lib/utils'

/**
 * DApp 表 — 组合式：
 * `Table` · `Header`（卡内顶槽）· `Body` · `Cell` · `Footer` · `Pagination`
 * · `Empty` / `Auth` / `Shell`。
 * Header ≠ 列名 thead；区块标题仍在卡外 `DappContentHeading`。
 * @see docs/foundation/component-usage.md
 */

const tableShell = tv({
  slots: {
    shell: 'overflow-hidden rounded-2xl border-0 p-0',
    header: 'border-b border-border/50 px-4 pt-3.5 pb-2.5 max-dapp:px-3.5',
    content: 'px-4 py-1.5 max-dapp:px-3.5',
    contentBelowHeader: 'px-4 pt-0 pb-1.5 max-dapp:px-3.5',
    footer:
      'relative z-10 overflow-visible rounded-b-2xl border-t border-border/50 bg-card dapp:px-4 dapp:py-3 max-dapp:px-3.5 max-dapp:py-2.5',
  },
})

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
      true: 'font-bold text-success group-data-[tab=genesis]/shell:font-normal group-data-[tab=rewards]/shell:font-normal',
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
      true: 'font-bold text-success group-data-[tab=genesis]/shell:font-normal group-data-[tab=rewards]/shell:font-normal',
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

type TableRootProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
}

function isSlot(child: ReactNode, slot: unknown): child is ReactElement {
  return isValidElement(child) && child.type === slot
}

function TableRoot({ children, className, contentClassName }: TableRootProps) {
  const styles = tableShell()
  const list = Children.toArray(children)
  let header: ReactNode = null
  let footer: ReactNode = null
  const body: ReactNode[] = []

  for (const child of list) {
    if (isSlot(child, Header)) header = child
    else if (isSlot(child, Footer)) footer = child
    else body.push(child)
  }

  return (
    <Card
      as="article"
      surface="elevated"
      className={cn(styles.shell(), 'flex max-w-full min-w-0 flex-col', className)}
    >
      {header}
      <div
        className={cn(
          'min-w-0 overflow-x-auto max-dapp:scrollbar-x-track',
          header ? styles.contentBelowHeader() : styles.content(),
          footer && 'pb-0',
          contentClassName,
        )}
      >
        {body}
      </div>
      {footer}
    </Card>
  )
}

/** 卡内顶槽（pill / 进度等）；≠ 列名 thead。 */
function Header({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(tableShell().header(), className)}>{children}</div>
}

/** 卡内底槽（分页 / 脚注）。 */
function Footer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(tableShell().footer(), className)}>{children}</div>
}

/** 空态 / Auth 自建壳（与 Card elevated 平行）。 */
function Shell({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(cardVariants({ surface: 'elevated' }), tableShell().shell(), className)}
      {...props}
    />
  )
}

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

/** 单元格 chrome；手写表 / Body 内部共用。 */
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

/** 网格 + 可选空态。 */
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

  if (showEmpty) {
    return empty != null ? <Empty embedded body={emptyBody} title={empty} /> : null
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
                  className={highlightedRows.includes(rowIndex) ? highlightedRow : ''}
                  key={`${row[0]}-${rowIndex}`}
                >
                  {row.map((cell, index) => (
                    <Cell
                      accent={highlightedRows.includes(rowIndex) && index === 0}
                      emphasis={emphasisColumns.includes(index)}
                      key={`${rowIndex}-${index}`}
                      last={rowIndex === rows.length - 1}
                      link={linkColumns.includes(index)}
                      positive={positiveColumns.includes(index)}
                      status={statusColumns.includes(index)}
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

/** 表/列表空态：稿 muted 40%。 */
function Empty({
  body,
  className,
  embedded = false,
  title,
}: {
  body?: string
  className?: string
  embedded?: boolean
  title: string
}) {
  const message = (
    <>
      <Text as="p" className="m-0 text-foreground/40" variant="copy">
        {title}
      </Text>
      {body ? (
        <Text as="p" className="mt-2 mb-0 text-foreground/40" variant="support">
          {body}
        </Text>
      ) : null}
    </>
  )

  if (embedded) {
    return <div className={cn('px-5 py-11 text-center max-dapp:py-8', className)}>{message}</div>
  }

  return (
    <Shell
      className={cn(
        revealClass(),
        'p-(--dapp-table-empty-padding) text-center',
        'max-dapp:p-(--dapp-table-empty-padding-h5)',
        className,
      )}
      data-reveal
    >
      {message}
    </Shell>
  )
}

function EmptyState({
  className,
  embedded = false,
  rows = 3,
  showSkeleton = true,
  children,
}: {
  className?: string
  embedded?: boolean
  rows?: number
  showSkeleton?: boolean
  children?: ReactNode
}) {
  const skeleton = showSkeleton ? (
    <div aria-hidden="true" className="flex w-full flex-col gap-3 max-dapp:gap-2.5">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <EmptySkeletonRow key={rowIndex} />
      ))}
    </div>
  ) : null

  if (embedded) {
    return (
      <div
        className={cn(
          'flex flex-col items-center py-4 max-dapp:py-3',
          children && (showSkeleton ? 'gap-4.5' : 'gap-3'),
          className,
        )}
      >
        {skeleton}
        {children}
      </div>
    )
  }

  return (
    <Shell
      aria-hidden={children ? undefined : true}
      className={cn(
        revealClass(),
        'flex flex-col items-center px-6 py-7.5',
        'max-dapp:px-4 max-dapp:py-5.5',
        children && 'gap-4.5',
        className,
      )}
      data-reveal
    >
      {skeleton}
      {children}
    </Shell>
  )
}

function EmptySkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex w-full items-center gap-3.5 max-dapp:gap-2.5', className)}>
      <span className="w-30 shrink-0 rounded-sm bg-border max-dapp:h-3 max-dapp:w-18" />
      <span className="flex min-w-0 flex-1 items-center">
        <span className="w-2.5 rounded-sm bg-border max-dapp:h-3 max-dapp:w-2" />
      </span>
      <span className="w-22 shrink-0 rounded-sm bg-border max-dapp:h-3 max-dapp:w-14" />
      <span className="w-18 shrink-0 rounded-sm bg-border max-dapp:h-3 max-dapp:w-10" />
    </div>
  )
}

/**
 * 未连接空态。title/body/连接 CTA 均由 call site 传入（shared 不嵌 locale）。
 * @example
 * <Table.Auth title={t…} body={t…}>
 *   <WalletConnectChip variant="primary" />
 * </Table.Auth>
 */
function Auth({
  body,
  children,
  className,
  embedded = false,
  showSkeleton = true,
  title,
}: {
  body: string
  children: ReactNode
  className?: string
  embedded?: boolean
  showSkeleton?: boolean
  title: string
}) {
  return (
    <EmptyState className={cn(className)} embedded={embedded} showSkeleton={showSkeleton}>
      <div className="grid w-full gap-1.5 text-center">
        <Text as="p" variant="headline" className="m-0 text-sm leading-[1.2] tracking-[-0.02em]">
          {title}
        </Text>
        <Text as="p" variant="support" tone="muted-foreground" className="m-0">
          {body}
        </Text>
      </div>
      {children}
    </EmptyState>
  )
}

/* ── Pagination（贴 Footer；无外顶距） ─────────────────────────── */

const PAGE_MENU_VISIBLE_ITEMS = 5
const PAGINATION_BTN_RADIUS = 'rounded-tight'

function pageMenuItemHeightPx(): number {
  return cssRemVarPx('--dapp-pagination-menu-item-height', 2)
}
function pageMenuGapPx(): number {
  return cssRemVarPx('--dapp-pagination-menu-gap', 0.375)
}
function pageMenuViewportPaddingPx(): number {
  return cssRemVarPx('--dapp-pagination-menu-viewport-padding', 0.5)
}
function pageMenuMaxHeightPx(): number {
  return pageMenuItemHeightPx() * PAGE_MENU_VISIBLE_ITEMS
}

type MenuPlacement = 'above' | 'below'

function placementForMenu(triggerRect: DOMRect, menuHeight: number): MenuPlacement {
  const viewportPadding = pageMenuViewportPaddingPx()
  const gap = pageMenuGapPx()
  const spaceBelow = window.innerHeight - triggerRect.bottom - viewportPadding
  const spaceAbove = triggerRect.top - viewportPadding
  const needed = menuHeight + gap

  if (spaceBelow >= needed) return 'below'
  if (spaceAbove >= needed) return 'above'
  return spaceBelow >= spaceAbove ? 'below' : 'above'
}

function styleForMenu(
  triggerRect: DOMRect,
  placement: MenuPlacement,
  menuHeight: number,
): CSSProperties {
  const viewportPadding = pageMenuViewportPaddingPx()
  const gap = pageMenuGapPx()
  const maxHeight = Math.min(menuHeight, window.innerHeight - viewportPadding * 2)
  const width = triggerRect.width

  let top = placement === 'below' ? triggerRect.bottom + gap : triggerRect.top - gap - maxHeight
  top = Math.max(viewportPadding, Math.min(top, window.innerHeight - viewportPadding - maxHeight))

  const left = Math.max(
    viewportPadding,
    Math.min(triggerRect.right - width, window.innerWidth - width - viewportPadding),
  )

  return { position: 'fixed', top, left, width, maxHeight, zIndex: 9999 }
}

type PaginationProps = {
  className?: string
  summary?: ReactNode
  onPageChange: (page: number) => void
  page: number
  pageSize?: number
  total: number
}

function Pagination({
  className,
  summary,
  onPageChange,
  page,
  pageSize = DAPP_TABLE_PAGE_SIZE,
  total,
}: PaginationProps) {
  const { messages: t } = useI18n()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const canPrev = safePage > 1
  const canNext = safePage < totalPages
  const menuHeight = Math.min(totalPages * pageMenuItemHeightPx(), pageMenuMaxHeightPx())

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const placement = placementForMenu(rect, menuHeight)
    setMenuStyle(styleForMenu(rect, placement, menuHeight))
  }, [menuHeight])

  useEffect(() => {
    if (total <= 0) return
    if (page > totalPages) onPageChange(totalPages)
  }, [onPageChange, page, total, totalPages])

  useLayoutEffect(() => {
    if (!menuOpen) return
    updateMenuPosition()
  }, [menuOpen, menuHeight, totalPages, updateMenuPosition])

  useEffect(() => {
    if (!menuOpen) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setMenuOpen(false)
    }

    const handleScrollOrResize = () => updateMenuPosition()
    const timer = window.setTimeout(() => {
      document.addEventListener('click', handleClick)
    }, 0)
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [menuOpen, updateMenuPosition])

  const showPagination = shouldShowTablePagination(total, pageSize)
  if (!showPagination && summary == null) return null

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      ref={rootRef}
    >
      <div className="flex min-w-0 flex-row flex-nowrap items-center gap-4">
        <Text
          as="p"
          variant="support"
          tone="muted-foreground"
          className="m-0 shrink-0 leading-none whitespace-nowrap"
        >
          {t.common.paginationTotal.replace(
            '{total}',
            formatGroupedNumber(total, { digits: 0, trimZeros: true }),
          )}
        </Text>
        {summary ? (
          <Text
            as="p"
            variant="support"
            tone="muted-foreground"
            className="m-0 min-w-0 leading-none whitespace-nowrap"
          >
            {summary}
          </Text>
        ) : null}
      </div>

      {showPagination ? (
        <div className="flex flex-wrap items-center gap-4 sm:justify-end">
          <Text
            as="span"
            variant="support"
            tone="muted-foreground"
            className="leading-none whitespace-nowrap"
          >
            {t.common.paginationPerPage.replace(
              '{size}',
              formatGroupedNumber(pageSize, { digits: 0, trimZeros: true }),
            )}
          </Text>

          <div className="flex items-center gap-1">
            <button
              aria-label={t.common.paginationPrev}
              className={cn(
                'inline-flex size-6 cursor-pointer items-center justify-center bg-pill-muted-bg text-coral transition-colors',
                PAGINATION_BTN_RADIUS,
                canPrev ? 'hover:bg-border/80' : 'cursor-default opacity-40',
              )}
              disabled={!canPrev}
              onClick={() => onPageChange(safePage - 1)}
              type="button"
            >
              <ChevronLeft aria-hidden className="size-(--app-icon-xs) shrink-0" strokeWidth={2} />
            </button>

            <div className="relative">
              <button
                aria-controls={listId}
                aria-expanded={menuOpen}
                aria-haspopup="listbox"
                className={cn(
                  // 稿 page-indicator 61×24（与两侧 chevron `size-6` 同高）
                  'inline-flex h-6 min-w-15.25 cursor-pointer items-center justify-center gap-0.5 px-3 text-xs font-semibold text-coral transition-colors',
                  PAGINATION_BTN_RADIUS,
                  'bg-accent',
                )}
                onClick={() => setMenuOpen((value) => !value)}
                ref={triggerRef}
                type="button"
              >
                <Text as="span" variant="support" className="leading-none font-semibold text-coral">
                  {safePage} / {totalPages}
                </Text>
                {menuOpen ? (
                  <ChevronUp
                    aria-hidden
                    className="size-(--app-icon-xs) shrink-0 transition-transform duration-220 ease-[cubic-bezier(.2,.8,.2,1)]"
                    strokeWidth={2}
                  />
                ) : (
                  <ChevronDown
                    aria-hidden
                    className="size-(--app-icon-xs) shrink-0 transition-transform duration-220 ease-[cubic-bezier(.2,.8,.2,1)]"
                    strokeWidth={2}
                  />
                )}
              </button>

              {menuOpen
                ? createPortal(
                    <ul
                      className={cn(
                        'm-0 list-none overflow-y-auto border border-border bg-card p-0 text-xs shadow-dropdown',
                        PAGINATION_BTN_RADIUS,
                      )}
                      data-dapp-pagination-menu
                      id={listId}
                      ref={menuRef}
                      role="listbox"
                      style={menuStyle}
                    >
                      {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1
                        const active = pageNumber === safePage
                        return (
                          <li
                            className="m-0 p-0"
                            key={pageNumber}
                            role="option"
                            aria-selected={active}
                          >
                            <button
                              className={cn(
                                'flex h-(--dapp-pagination-menu-item-height) w-full cursor-pointer items-center justify-center text-center text-xs transition-colors',
                                active
                                  ? 'bg-accent font-semibold text-coral'
                                  : 'bg-card text-foreground',
                              )}
                              onClick={() => {
                                if (pageNumber !== page) onPageChange(pageNumber)
                                setMenuOpen(false)
                              }}
                              type="button"
                            >
                              {pageNumber}
                            </button>
                          </li>
                        )
                      })}
                    </ul>,
                    document.body,
                  )
                : null}
            </div>

            <button
              aria-label={t.common.paginationNext}
              className={cn(
                'inline-flex size-6 cursor-pointer items-center justify-center bg-pill-muted-bg text-coral transition-colors',
                PAGINATION_BTN_RADIUS,
                canNext ? 'hover:bg-border/80' : 'cursor-default opacity-40',
              )}
              disabled={!canNext}
              onClick={() => onPageChange(safePage + 1)}
              type="button"
            >
              <ChevronRight aria-hidden className="size-(--app-icon-xs) shrink-0" strokeWidth={2} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export const Table = Object.assign(TableRoot, {
  Header,
  Body,
  Cell,
  Footer,
  Pagination,
  Empty,
  Auth,
  Shell,
})
