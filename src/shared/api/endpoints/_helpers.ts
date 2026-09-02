import { apiRequest } from '~/shared/api/request'
import type { Paginated, PaginationParams } from '~/shared/api/types'

/** POST 分页列表默认 page/page_size。 */
export function paginationBody(params: PaginationParams = {}) {
  return {
    page: params.page ?? 1,
    page_size: params.page_size ?? 20,
  }
}

/** POST 分页列表，附带一个可选的过滤字段。 */
export function postFilteredPage<TItem>(
  path: string,
  token: string,
  params: PaginationParams,
  filterKey: string,
  filterValue: unknown,
): Promise<Paginated<TItem>> {
  return apiRequest<Paginated<TItem>>(path, {
    method: 'POST',
    token,
    body: {
      ...paginationBody(params),
      ...(filterValue !== undefined ? { [filterKey]: filterValue } : {}),
    },
  })
}
