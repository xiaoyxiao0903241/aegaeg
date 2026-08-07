import { parseApiAmount } from '~/shared/presenters/format'

/** X0 挖矿流水项：累计产出只加 `REWARD`。 */
export type X0MiningRewardLogLike = {
  operation: string
  amount: string
}

export type X0MiningRewardPageLike = {
  total: number
  items: ReadonlyArray<X0MiningRewardLogLike>
}

/**
 * 用户侧 X 挖矿「累计产出」：对 REWARD 流水 amount 求和。
 * 非法 amount 跳过，不计入非 0 的异常值。
 *
 * @see docs/backend-api/api.md #x0-mining/logs
 */
export function sumX0MiningRewardAmount(items: ReadonlyArray<X0MiningRewardLogLike>): number {
  return items.reduce((sum, item) => {
    if (item.operation !== 'REWARD') return sum
    return sum + (parseApiAmount(item.amount) ?? 0)
  }, 0)
}

const DEFAULT_PAGE_SIZE = 100
/** 防异常 total / 死循环：最多翻页数 */
const MAX_PAGES = 100

/**
 * 翻页累加用户 REWARD 产出，直到本页不足 page_size 或已覆盖 `total`。
 *
 * @param args.pageSize 每页条数；默认 100
 * @param args.fetchPage `(page, pageSize) => { total, items }`
 */
export async function sumX0MiningRewardAmountAcrossPages(args: {
  pageSize?: number
  fetchPage: (page: number, pageSize: number) => Promise<X0MiningRewardPageLike>
}): Promise<number> {
  const pageSize = args.pageSize ?? DEFAULT_PAGE_SIZE
  if (!(pageSize > 0)) return 0

  let page = 1
  let accumulatedItems = 0
  let sum = 0
  let total = Number.POSITIVE_INFINITY

  while (page <= MAX_PAGES) {
    const result = await args.fetchPage(page, pageSize)
    if (Number.isFinite(result.total) && result.total >= 0) {
      total = result.total
    }
    const items = result.items ?? []
    sum += sumX0MiningRewardAmount(items)
    accumulatedItems += items.length

    if (items.length < pageSize) break
    if (accumulatedItems >= total) break
    page += 1
  }

  return sum
}
