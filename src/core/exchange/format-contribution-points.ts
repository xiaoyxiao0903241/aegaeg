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
 * @param amount 最小单位数量
 * @param decimals 与 AGX 相同的精度
 * @returns 千分位分组、固定 4 位的展示字符串
 * @see docs/backend-api/api.md #agx-contribution/summary
 */
export function formatContributionPoints(amount: bigint, decimals: number): string {
  return formatRoundedWei(amount, decimals, 'floor')
}

/**
 * 累计消耗贡献点数展示：向上进到 4 位小数。
 *
 * @param amount 最小单位数量
 * @param decimals 与 AGX 相同的精度
 * @returns 千分位分组、固定 4 位的展示字符串
 * @see docs/backend-api/api.md #agx-contribution/summary
 */
export function formatContributionConsumedTotal(amount: bigint, decimals: number): string {
  return formatRoundedWei(amount, decimals, 'ceil')
}

/**
 * 后端贡献点数字符串 → 向下舍 4 位。空 / 非法 → `0.0000`。
 *
 * @param raw 十进制金额字符串
 */
export function formatApiContributionPoints(raw: string | null | undefined): string {
  return formatScaled(decimalToScaled(raw))
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

function formatRoundedWei(amount: bigint, decimals: number, mode: 'floor' | 'ceil'): string {
  return formatTokenAmount(roundWei(amount, decimals, mode), decimals, {
    digits: CONTRIBUTION_DISPLAY_DIGITS,
    trimZeros: false,
    dust: false,
  })
}

function decimalToScaled(raw: string | null | undefined): bigint {
  if (raw == null) return 0n
  const trimmed = String(raw).trim().replace(/,/g, '')
  if (!trimmed || trimmed.startsWith('-')) return 0n
  if (!/^\d+(\.\d*)?$/.test(trimmed)) return 0n
  const digits = CONTRIBUTION_DISPLAY_DIGITS
  const [wholePart, fractionPart = ''] = trimmed.split('.')
  const head = fractionPart.slice(0, digits)
  const combined = `${wholePart || '0'}${head.padEnd(digits, '0')}`.replace(/^0+(?=\d)/, '') || '0'
  return BigInt(combined)
}

function formatScaled(scaled: bigint): string {
  return formatTokenAmount(scaled, CONTRIBUTION_DISPLAY_DIGITS, {
    digits: CONTRIBUTION_DISPLAY_DIGITS,
    trimZeros: false,
    dust: false,
  })
}
