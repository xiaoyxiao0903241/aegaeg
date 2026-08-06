import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'

/**
 * 债券「已售」USD 数值：`terms.totalDeposit`（AGX 债务）× 现价。
 * 债务或价格缺失时返回 null（UI 显示 `$0.00`）。
 *
 * @see 手册 BondDepository `terms.totalDeposit`
 */
export function bondSoldUsd(
  totalDeposit: bigint | null | undefined,
  priceUsd: number | null | undefined,
  decimals: number,
): number | null {
  if (totalDeposit == null || priceUsd == null || !Number.isFinite(priceUsd) || priceUsd < 0) {
    return null
  }
  return formatTokenAmountToNumber(totalDeposit, decimals) * priceUsd
}
