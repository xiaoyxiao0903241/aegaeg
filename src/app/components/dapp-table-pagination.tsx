import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronIcon } from '~/components/chevron-icon'
import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { formatCount } from '~/lib/api/format-display'
import { DAPP_TABLE_PAGE_SIZE, shouldShowTablePagination } from '~/lib/table-pagination'

const PAGE_MENU_ITEM_HEIGHT_PX = 32
const PAGE_MENU_VISIBLE_ITEMS = 5
const PAGE_MENU_MAX_HEIGHT = PAGE_MENU_ITEM_HEIGHT_PX * PAGE_MENU_VISIBLE_ITEMS
const PAGE_MENU_GAP_PX = 6
const VIEWPORT_EDGE_PADDING_PX = 8

/** Figma pagination controls ~6px; project `rounded-md` token is 16px — use explicit radius. */
const PAGINATION_BTN_RADIUS = 'rounded-sm'

type MenuPlacement = 'above' | 'below'

type DappTablePaginationProps = {
  className?: string
  /** Inside `DappTableCard` footer — drops outer top margin. */
  embedded?: boolean
  /** Left-side summary beside row count — shown even when pagination is hidden. */
  summary?: ReactNode
  onPageChange: (page: number) => void
  page: number
  pageSize?: number
  total: number
}

function resolveMenuPlacement(
  triggerRect: DOMRect,
  menuHeight: number,
): MenuPlacement {
  const spaceBelow = window.innerHeight - triggerRect.bottom - VIEWPORT_EDGE_PADDING_PX
  const spaceAbove = triggerRect.top - VIEWPORT_EDGE_PADDING_PX
  const needed = menuHeight + PAGE_MENU_GAP_PX

  if (spaceBelow >= needed) return 'below'
  if (spaceAbove >= needed) return 'above'
  return spaceBelow >= spaceAbove ? 'below' : 'above'
}

function resolveMenuStyle(
  triggerRect: DOMRect,
  placement: MenuPlacement,
  menuHeight: number,
): CSSProperties {
  const maxHeight = Math.min(
    menuHeight,
    window.innerHeight - VIEWPORT_EDGE_PADDING_PX * 2,
  )
  const width = triggerRect.width

  let top =
    placement === 'below'
      ? triggerRect.bottom + PAGE_MENU_GAP_PX
      : triggerRect.top - PAGE_MENU_GAP_PX - maxHeight

  top = Math.max(
    VIEWPORT_EDGE_PADDING_PX,
    Math.min(top, window.innerHeight - VIEWPORT_EDGE_PADDING_PX - maxHeight),
  )

  const left = Math.max(
    VIEWPORT_EDGE_PADDING_PX,
    Math.min(
      triggerRect.right - width,
      window.innerWidth - width - VIEWPORT_EDGE_PADDING_PX,
    ),
  )

  return {
    position: 'fixed',
    top,
    left,
    width,
    maxHeight,
    zIndex: 9999,
  }
}

export function DappTablePagination({
  className,
  embedded = false,
  summary,
  onPageChange,
  page,
  pageSize = DAPP_TABLE_PAGE_SIZE,
  total,
}: DappTablePaginationProps) {
  const { messages: t } = useI18n()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPlacement, setMenuPlacement] = useState<MenuPlacement>('above')
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const canPrev = safePage > 1
  const canNext = safePage < totalPages
  const menuHeight = Math.min(
    totalPages * PAGE_MENU_ITEM_HEIGHT_PX,
    PAGE_MENU_MAX_HEIGHT,
  )

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const placement = resolveMenuPlacement(rect, menuHeight)
    setMenuPlacement(placement)
    setMenuStyle(resolveMenuStyle(rect, placement, menuHeight))
  }, [menuHeight])

  // Only clamp when total is known — avoid resetting page while the next page is loading.
  useEffect(() => {
    if (total <= 0) return
    if (page > totalPages) {
      onPageChange(totalPages)
    }
  }, [onPageChange, page, total, totalPages])

  useLayoutEffect(() => {
    if (!menuOpen) return
    updateMenuPosition()
  }, [menuOpen, menuHeight, totalPages, updateMenuPosition])

  useEffect(() => {
    if (!menuOpen) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
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

  const chevronRotated = (menuPlacement === 'below') !== menuOpen

  return (
    <div
      className={cn(
        'flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between',
        !embedded && 'mt-4',
        className,
      )}
      ref={rootRef}
    >
      <div className="flex min-w-0 flex-row flex-nowrap items-center gap-4">
        <p className="m-0 shrink-0 whitespace-nowrap">
          {t.common.paginationTotal.replace('{total}', formatCount(total))}
        </p>
        {summary ? <p className="m-0 min-w-0 whitespace-nowrap">{summary}</p> : null}
      </div>

      {showPagination ? (
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <span className="whitespace-nowrap">
            {t.common.paginationPerPage.replace('{size}', formatCount(pageSize))}
          </span>

          <button
            aria-label={t.common.paginationPrev}
            className={cn(
              'inline-flex size-8 cursor-pointer items-center justify-center bg-pill-muted-bg text-primary transition-colors',
              PAGINATION_BTN_RADIUS,
              canPrev ? 'hover:bg-border/80' : 'cursor-default opacity-40',
            )}
            disabled={!canPrev}
            onClick={() => onPageChange(safePage - 1)}
            type="button"
          >
            <ChevronIcon direction="left" />
          </button>

          <div className="relative">
            <button
              aria-controls={listId}
              aria-expanded={menuOpen}
              aria-haspopup="listbox"
              className={cn(
                'inline-flex min-w-22 cursor-pointer items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors',
                PAGINATION_BTN_RADIUS,
                'bg-accent text-primary',
              )}
              onClick={() => {
                setMenuOpen((value) => !value)
              }}
              ref={triggerRef}
              type="button"
            >
              {safePage} / {totalPages}
              <ChevronIcon
                className={chevronRotated ? 'rotate-180' : undefined}
                direction="up"
              />
            </button>

            {menuOpen
              ? createPortal(
                  <ul
                    className="m-0 list-none overflow-y-auto rounded-sm border border-border bg-card p-0 shadow-[0_4px_16px_oklch(0_0_0/8%)]"
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
                              'flex w-full cursor-pointer items-center justify-center text-center text-xs transition-colors',
                              active
                                ? 'bg-accent font-semibold text-primary'
                                : 'bg-card text-foreground',
                            )}
                            onClick={() => {
                              if (pageNumber !== page) {
                                onPageChange(pageNumber)
                              }
                              setMenuOpen(false)
                            }}
                            style={{ height: PAGE_MENU_ITEM_HEIGHT_PX }}
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
              'inline-flex size-8 cursor-pointer items-center justify-center bg-pill-muted-bg text-primary transition-colors',
              PAGINATION_BTN_RADIUS,
              canNext ? 'hover:bg-border/80' : 'cursor-default opacity-40',
            )}
            disabled={!canNext}
            onClick={() => onPageChange(safePage + 1)}
            type="button"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      ) : null}
    </div>
  )
}
