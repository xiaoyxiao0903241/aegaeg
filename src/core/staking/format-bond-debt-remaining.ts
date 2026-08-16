import { formatTokenAmount } from '~/core/exchange/token-amount'

export type BondDebtRemainingDisplay = { kind: 'unlimited' } | { kind: 'amount'; label: string }

/**
 * 债券债务剩余容量展示口径。
 *
 * `maxDebt === 0` 表示不启用上限；否则剩余为 AGX 债务口径
 * `max(0, maxDebt - totalDeposit)`。
 */
export function formatBondDebtRemainingDisplay(
  maxDebt: bigint,
  totalDeposit: bigint,
  decimals: number,
  digits = 2,
): BondDebtRemainingDisplay {
  if (maxDebt === 0n) return { kind: 'unlimited' }
  const remaining = maxDebt > totalDeposit ? maxDebt - totalDeposit : 0n
  return {
    kind: 'amount',
    label: formatTokenAmount(remaining, decimals, digits),
  }
}
