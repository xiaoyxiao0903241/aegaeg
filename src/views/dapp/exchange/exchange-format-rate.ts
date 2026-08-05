import { formatTokenAmount } from '~/core/exchange/token-amount'

function normalizeRateOutPerUnit(amountIn: bigint, amountOut: bigint, decimalsIn: number): bigint {
  const oneUnitIn = 10n ** BigInt(decimalsIn)
  return (amountOut * oneUnitIn) / amountIn
}

/**
 * 空行情占位
 *
 * 报价为 0 时返回 `'0'` 而非空串，避免空态与真实 0 值之间闪跳。
 *
 * @param quotedOut 链上报价
 */
export function emptySpotRateDash(quotedOut: bigint): '0' | null {
  return quotedOut === 0n ? '0' : null
}

function formatRateRatioFixed(
  normalizedOut: bigint,
  decimalsOut: number,
  fractionDigits = 4,
): string {
  return formatTokenAmount(normalizedOut, decimalsOut, {
    digits: fractionDigits,
    trimZeros: false,
  })
}

/** 去掉小数尾零：兑换率显示 `1 : 1` 而非 `1 : 1.0000`。 */
function trimTrailingZeros(value: string): string {
  if (!value.includes('.')) return value
  return value.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
}

/** 兑换率标签：`1 : 1` 冒号形式，最多 4 位小数。 */
export function formatExchangeRateColon({
  amountIn,
  amountOut,
  decimalsIn,
  decimalsOut,
}: {
  amountIn: bigint
  amountOut: bigint
  decimalsIn: number
  decimalsOut: number
}): string {
  if (amountIn === 0n || amountOut === 0n) {
    return '0'
  }

  const normalizedOut = normalizeRateOutPerUnit(amountIn, amountOut, decimalsIn)

  return `1 : ${trimTrailingZeros(formatRateRatioFixed(normalizedOut, decimalsOut))}`
}

/** 市价交易行情标签：`1 USD1 = 0.015385 AGX` 等号形式，最多 6 位小数。 */
export function formatExchangeRateApprox({
  amountIn,
  amountOut,
  decimalsIn,
  decimalsOut,
  symbolIn,
  symbolOut,
  fractionDigits = 3,
}: {
  amountIn: bigint
  amountOut: bigint
  decimalsIn: number
  decimalsOut: number
  symbolIn: string
  symbolOut: string
  fractionDigits?: number
}): string {
  if (amountIn === 0n || amountOut === 0n) {
    return '0'
  }

  const normalizedOut = normalizeRateOutPerUnit(amountIn, amountOut, decimalsIn)

  return `1 ${symbolIn} = ${formatRateRatioFixed(normalizedOut, decimalsOut, fractionDigits)} ${symbolOut}`
}
