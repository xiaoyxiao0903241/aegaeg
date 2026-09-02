/**
 * DApp 表分页 — Table.Pagination（贴 Footer）
 */

import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { useI18n } from '~/i18n/use-i18n'
import { CollapseChevron } from '~/shared/components/collapse-chevron'
import { Text } from '~/shared/components/text'
import { cssRemVarPx } from '~/shared/lib/root-rem-px'
import { DAPP_TABLE_PAGE_SIZE, shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { cn } from '~/shared/lib/utils'
import { formatNumber } from '~/shared/presenters/format'

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

/** 按触发按钮与视口剩余空间决定页码菜单向上或向下展开 */
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

/** 生成固定定位的页码菜单样式，并约束在视口内 */
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

/**
 * 表格分页条
 *
 * 展示总数、每页条数与页码菜单；一页也渲染总数，仅多页时显示翻页器。
 * 页码超出范围时自动回调到有效页。
 *
 * @param page 当前页（1 起）
 * @param pageSize 每页条数
 * @param total 数据总数
 * @param onPageChange 页码变化时回调
 * @param summary 可选附加说明
 */
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

  // 滚动/resize 只调最新定位逻辑，不因 callback 身份重订阅。
  const onMenuReposition = useEffectEvent(() => {
    updateMenuPosition()
  })

  useEffect(() => {
    if (total <= 0) return
    if (page > totalPages) onPageChange(totalPages)
  }, [onPageChange, page, total, totalPages])

  useLayoutEffect(() => {
    if (!menuOpen) return
    onMenuReposition()
  }, [menuOpen, menuHeight, totalPages])

  useEffect(() => {
    if (!menuOpen) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setMenuOpen(false)
    }

    const handleScrollOrResize = () => onMenuReposition()
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
  }, [menuOpen])

  const showPager = shouldShowTablePagination(total, pageSize)

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
            formatNumber(total, { digits: 0, trimZeros: true }),
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

      {showPager ? (
        <div className="flex flex-wrap items-center gap-4 sm:justify-end">
          <Text
            as="span"
            variant="support"
            tone="muted-foreground"
            className="leading-none whitespace-nowrap"
          >
            {t.common.paginationPerPage.replace(
              '{size}',
              formatNumber(pageSize, { digits: 0, trimZeros: true }),
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
                  // 页码指示器与两侧 chevron 等高
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
                <CollapseChevron open={menuOpen} size="md" />
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

export { Pagination }
