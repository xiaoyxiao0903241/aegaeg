import { parseApiAmount } from '~/shared/presenters/format'

/** X0 挖矿流水项：累计产出只加 `REWARD`。 */
export type X0MiningRewardLogLike = {
  operation: string
  amount: string
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
