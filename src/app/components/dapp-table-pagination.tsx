import { useEffect, useId, useRef, useState } from 'react'
import { ChevronIcon } from '~/components/chevron-icon'
import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { DAPP_TABLE_PAGE_SIZE, shouldShowTablePagination } from '~/lib/table-pagination'

const PAGE_MENU_ITEM_HEIGHT_PX = 32
const PAGE_MENU_VISIBLE_ITEMS = 5
const PAGE_MENU_MAX_HEIGHT = PAGE_MENU_ITEM_HEIGHT_PX * PAGE_MENU_VISIBLE_ITEMS

/** Figma pagination controls ~6px; project `rounded-md` token is 16px — use explicit radius. */
const PAGINATION_BTN_RADIUS = 'rounded-sm'

type DappTablePaginationProps = {
  className?: string
  onPageChange: (page: number) => void
  page: number
  pageSize?: number
  total: number
}

export function DappTablePagination({
  className,
  onPageChange,
  page,
  pageSize = DAPP_TABLE_PAGE_SIZE,
  total,
}: DappTablePaginationProps) {
  const { messages: t } = useI18n()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const canPrev = safePage > 1
  const canNext = safePage < totalPages

  // Only clamp when total is known — avoid resetting page while the next page is loading.
  useEffect(() => {
    if (total <= 0) return
    if (page > totalPages) {
      onPageChange(totalPages)
    }
  }, [onPageChange, page, total, totalPages])

  useEffect(() => {
    if (!menuOpen) return

    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    const timer = window.setTimeout(() => {
      document.addEventListener('click', handleClick)
    }, 0)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('click', handleClick)
    }
  }, [menuOpen])

  if (!shouldShowTablePagination(total, pageSize)) return null

  return (
    <div
      className={cn(
        'mt-4 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      ref={rootRef}
    >
      <p>{t.common.paginationTotal.replace('{total}', String(total))}</p>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <span className="whitespace-nowrap">
          {t.common.paginationPerPage.replace('{size}', String(pageSize))}
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
            onClick={() => setMenuOpen((value) => !value)}
            type="button"
          >
            {safePage} / {totalPages}
            <ChevronIcon direction="up" />
          </button>

          {menuOpen ? (
            <ul
              className={cn(
                'absolute bottom-full right-0 z-20 m-0 mb-1.5 min-w-full list-none overflow-y-auto rounded-sm border border-border bg-card p-0 shadow-[0_4px_16px_oklch(0_0_0/8%)]',
              )}
              id={listId}
              role="listbox"
              style={{ maxHeight: PAGE_MENU_MAX_HEIGHT }}
            >
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1
                const active = pageNumber === safePage

                return (
                  <li className="m-0 p-0" key={pageNumber} role="option" aria-selected={active}>
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
            </ul>
          ) : null}
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
    </div>
  )
}
