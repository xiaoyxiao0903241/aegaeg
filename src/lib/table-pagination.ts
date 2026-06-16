export const DAPP_TABLE_PAGE_SIZE = 5

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
