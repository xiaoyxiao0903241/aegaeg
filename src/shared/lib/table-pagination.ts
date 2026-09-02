import { DAPP_TABLE_PAGE_SIZE } from '~/shared/lib/constants'

export { DAPP_TABLE_PAGE_SIZE }

/** 是否显示翻页器（上一页 / 页码 / 下一页）。一页也要 Footer 总数，不据此藏整栏。 */
export function shouldShowTablePagination(
  total: number,
  pageSize: number = DAPP_TABLE_PAGE_SIZE,
): boolean {
  return total > pageSize
}

/** 生成表格分页查询参数（默认每页 5 条）。 */
export function tablePageQuery(page: number) {
  return { page, page_size: DAPP_TABLE_PAGE_SIZE }
}

/** 需登录的 DApp 表格视图状态：登录校验、空结果、骨架屏加载。 */
export function dappTableViewState({
  isLoading,
  isLoggingIn,
  rowCount,
  sessionReady,
}: {
  isLoading: boolean
  isLoggingIn: boolean
  rowCount: number
  sessionReady: boolean
}) {
  return {
    queryEmpty: sessionReady && !isLoading && rowCount === 0,
    requiresAuth: !sessionReady && !isLoggingIn,
    showSkeleton: sessionReady && isLoading && rowCount === 0,
  }
}
