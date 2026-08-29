import { parseTokenAmount } from '~/core/exchange/token-amount'

/**
 * `/x0-mining/summary` 金额字段 → 最小单位。
 *
 * 已释放、挖矿总产出都是接口原样，不与链上 pending 相加。
 * 缺字段或非法返回 null（展示 —）。
 *
 * @param raw `total_redeemed_amount` 或 `claimed_x_reward`
 * @param decimals 对应代币精度
 * @see docs/backend-api/api.md #x0-mining/summary
 */
export function xmineSummaryAmountWei(
  raw: string | null | undefined,
  decimals: number,
): bigint | null {
  if (raw == null) return null
  const trimmed = raw.trim()
  if (trimmed === '' || !/^\d+(\.\d*)?$/.test(trimmed.replace(/,/g, ''))) return null
  return parseTokenAmount(trimmed, decimals)
}
