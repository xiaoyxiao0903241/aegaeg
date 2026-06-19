export const DAPP_TABLE_PAGE_SIZE = 5

export function shouldShowTablePagination(
  total: number,
  pageSize: number = DAPP_TABLE_PAGE_SIZE,
): boolean {
  return total > pageSize
}

export function tablePageQuery(page: number) {
  return { page, page_size: DAPP_TABLE_PAGE_SIZE }
}

/** Authenticated DApp tables: sign-in gate, empty query, and skeleton loading. */
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

export function paginateStaticRows<T>(
  rows: readonly T[],
  page: number,
  pageSize: number,
  total?: number,
): { rows: T[]; total: number } {
  const resolvedTotal = total ?? rows.length
  if (resolvedTotal <= 0) {
    return { rows: [], total: 0 }
  }

  const start = (page - 1) * pageSize
  const paged: T[] = []

  for (let index = start; index < start + pageSize && index < resolvedTotal; index += 1) {
    if (rows.length === 0) break
    paged.push(rows[index % rows.length])
  }

  return { rows: paged, total: resolvedTotal }
}
