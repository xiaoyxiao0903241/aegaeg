import { LIVE_DATA_PLACEHOLDER } from '~/core/constants'
import { formatTokenAmount } from '~/core/exchange/token-amount'

/** 贡献点数展示固定 4 位小数。 */
const CONTRIBUTION_DISPLAY_DIGITS = 4

/**
 * 贡献点数展示舍入
 *
 * 余额、累计获得、单笔消耗、领取需扣除等一律向下舍到 4 位；
 * 仅「累计消耗贡献点数」向上进到 4 位。粉尘不走 `<0.0001`：
 * 下舍为 `0.0000`，上进至少 `0.0001`。
 *
 * @param amount 最小单位数量；缺数 → `--`
 * @param decimals 与 AGX 相同的精度
 * @returns 千分位分组、固定 4 位的展示字符串
 * @see docs/backend-api/api.md #agx-contribution/summary
 */
export function formatContributionPoints(
  amount: bigint | null | undefined,
  decimals: number,
): string {
  return formatRoundedWei(amount, decimals, 'floor')
}

/**
 * 累计消耗贡献点数展示：向上进到 4 位小数。
 *
 * @param amount 最小单位数量；缺数 → `--`
 * @param decimals 与 AGX 相同的精度
 * @returns 千分位分组、固定 4 位的展示字符串
 * @see docs/backend-api/api.md #agx-contribution/summary
 */
export function formatContributionConsumedTotal(
  amount: bigint | null | undefined,
  decimals: number,
): string {
  return formatRoundedWei(amount, decimals, 'ceil')
}

function roundWei(amount: bigint, decimals: number, mode: 'floor' | 'ceil'): bigint {
  if (amount <= 0n) return 0n
  const digits = CONTRIBUTION_DISPLAY_DIGITS
  if (digits >= decimals) return amount
  const unit = 10n ** BigInt(decimals - digits)
  if (mode === 'floor') return (amount / unit) * unit
  const rem = amount % unit
  return rem === 0n ? amount : (amount / unit + 1n) * unit
}

function formatRoundedWei(
  amount: bigint | null | undefined,
  decimals: number,
  mode: 'floor' | 'ceil',
): string {
  if (amount == null) return LIVE_DATA_PLACEHOLDER
  return formatTokenAmount(roundWei(amount, decimals, mode), decimals, {
    digits: CONTRIBUTION_DISPLAY_DIGITS,
    trimZeros: false,
    dust: false,
  })
}
