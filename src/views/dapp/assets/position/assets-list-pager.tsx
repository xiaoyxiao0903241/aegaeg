import { useI18n } from '~/i18n/use-i18n'
import { Button } from '~/shared/components/button'
import { Text } from '~/shared/components/text'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'

/** 左栏仓位列表分页：总数与每页条数 + 上一页 / 页码 / 下一页；不足一页时不渲染 */
export function AssetsListPager({
  page,
  pageCount,
  pageSize,
  total,
  onPageChange,
}: {
  /** 0-based */
  page: number
  pageCount: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}) {
  const { messages: t } = useI18n()
  const safePage = Math.min(Math.max(page, 0), Math.max(0, pageCount - 1))

  if (!shouldShowTablePagination(total, pageSize)) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
      <Text as="span" className="text-xs leading-4" tone="muted-foreground" variant="support">
        {t.common.paginationTotal.replace('{total}', String(total))} ·{' '}
        {t.common.paginationPerPage.replace('{size}', String(pageSize))}
      </Text>
      <div className="flex items-center gap-2">
        <Button
          className="size-auto min-h-0 px-2.5 py-1 text-xs font-medium"
          disabled={safePage <= 0}
          onClick={() => onPageChange(Math.max(0, safePage - 1))}
          shape="rounded"
          size="sm"
          type="button"
          variant="ghost"
        >
          {t.common.paginationPrev}
        </Button>
        <Text as="span" className="text-xs leading-none font-semibold" variant="support">
          {safePage + 1} / {Math.max(1, pageCount)}
        </Text>
        <Button
          className="size-auto min-h-0 px-2.5 py-1 text-xs font-medium"
          disabled={safePage >= pageCount - 1}
          onClick={() => onPageChange(Math.min(pageCount - 1, safePage + 1))}
          shape="rounded"
          size="sm"
          type="button"
          variant="ghost"
        >
          {t.common.paginationNext}
        </Button>
      </div>
    </div>
  )
}
