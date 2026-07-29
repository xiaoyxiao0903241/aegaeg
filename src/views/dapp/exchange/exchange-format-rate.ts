function normalizeRateOutPerUnit(amountIn: bigint, amountOut: bigint, decimalsIn: number): bigint {
  const oneUnitIn = 10n ** BigInt(decimalsIn)
  return (amountOut * oneUnitIn) / amountIn
}

/**
 * Spot / exchange label empty gate: quoting → ''; settled zero → '—'; non-zero → null (format).
 */
export function resolveEmptySpotRatePlaceholder(
  quotedOut: bigint,
  isQuoting: boolean,
): '' | '—' | null {
  if (quotedOut !== 0n) return null
  return isQuoting ? '' : '—'
}

function formatRateRatioFixed(
  normalizedOut: bigint,
  decimalsOut: number,
  fractionDigits = 4,
): string {
  const divisor = 10n ** BigInt(decimalsOut)
  const whole = normalizedOut / divisor
  const fraction = normalizedOut % divisor
  const fractionText = fraction
    .toString()
    .padStart(decimalsOut, '0')
    .slice(0, fractionDigits)
    .padEnd(fractionDigits, '0')
  const groupedWhole = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return `${groupedWhole}.${fractionText}`
}

/** Trim trailing zeros — Figma flash meta/overview uses `1 : 1`, not `1 : 1.0000`. */
function trimTrailingZeros(value: string): string {
  if (!value.includes('.')) return value
  return value.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
}

/** Exchange widget rate label — `1 : 1` / `1 : 1.001` (up to 4 fraction digits). */
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
    return '—'
  }

  const normalizedOut = normalizeRateOutPerUnit(amountIn, amountOut, decimalsIn)

  return `1 : ${trimTrailingZeros(formatRateRatioFixed(normalizedOut, decimalsOut))}`
}

/** Market-trade spot / meta — Figma PC `1 USD1 = 0.015385 AGX` (`=` · up to 6 fraction digits). */
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
    return '—'
  }

  const normalizedOut = normalizeRateOutPerUnit(amountIn, amountOut, decimalsIn)

  return `1 ${symbolIn} = ${formatRateRatioFixed(normalizedOut, decimalsOut, fractionDigits)} ${symbolOut}`
}
