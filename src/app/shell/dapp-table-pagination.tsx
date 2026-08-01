import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { cssRemVarPx } from '~/shared/lib/root-rem-px'
import { DAPP_TABLE_PAGE_SIZE, shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { cn } from '~/shared/lib/utils'
import { ChevronIcon } from '~/shared/ui/chevron-icon'
import { Text } from '~/shared/ui/text'

const PAGE_MENU_VISIBLE_ITEMS = 5

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

/** Pagination control radius (6px; project `rounded-sm` is larger). */
const PAGINATION_BTN_RADIUS = 'rounded-[6px]'

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
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
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

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        !embedded && 'mt-4',
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
                'inline-flex size-8 cursor-pointer items-center justify-center bg-pill-muted-bg text-coral transition-colors',
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
                  'inline-flex h-8 w-20 cursor-pointer items-center justify-center gap-0.5 px-3 text-xs font-semibold text-coral transition-colors',
                  PAGINATION_BTN_RADIUS,
                  'bg-accent',
                )}
                onClick={() => {
                  setMenuOpen((value) => !value)
                }}
                ref={triggerRef}
                type="button"
              >
                <Text as="span" variant="support" className="leading-none font-semibold text-coral">
                  {safePage} / {totalPages}
                </Text>
                {/* Closed → down; open → up. Base asset points up. */}
                <ChevronIcon
                  className={cn(
                    'transition-transform duration-220 ease-[cubic-bezier(.2,.8,.2,1)]',
                    menuOpen ? 'rotate-0' : 'rotate-180',
                  )}
                  direction="up"
                />
              </button>

              {menuOpen
                ? createPortal(
                    <ul
                      className="m-0 list-none overflow-y-auto rounded-[6px] border border-border bg-card p-0 text-xs shadow-dropdown"
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
                                if (pageNumber !== page) {
                                  onPageChange(pageNumber)
                                }
                                setMenuOpen(false)
                              }}
                              type="button"
                            >
                              <Text
                                as="span"
                                variant="support"
                                tone={active ? undefined : 'foreground'}
                                className={cn(
                                  'leading-none',
                                  active ? 'font-semibold text-coral' : 'font-normal',
                                )}
                              >
                                {pageNumber}
                              </Text>
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
                'inline-flex size-8 cursor-pointer items-center justify-center bg-pill-muted-bg text-coral transition-colors',
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
        </div>
      ) : null}
    </div>
  )
}
