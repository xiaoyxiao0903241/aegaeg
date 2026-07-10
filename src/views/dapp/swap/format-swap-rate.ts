import { formatTokenAmount } from '~/core/swap/token-amount'

function normalizeRateOutPerUnit(
  amountIn: bigint,
  amountOut: bigint,
  decimalsIn: number,
): bigint {
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

/** Swap widget rate label — `1 : 1.0010` (4 fraction digits). */
export function formatSwapRateColon({
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

  return `1 : ${formatRateRatioFixed(normalizedOut, decimalsOut)}`
}

export function formatSwapRate({
  amountIn,
  amountOut,
  decimalsIn,
  decimalsOut,
  symbolIn,
  symbolOut,
  fractionDigits = 6,
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
    return `1 ${symbolIn} = — ${symbolOut}`
  }

  const normalizedOut = normalizeRateOutPerUnit(amountIn, amountOut, decimalsIn)
  const formattedOut =
    fractionDigits === 6
      ? formatTokenAmount(normalizedOut, decimalsOut, 6)
      : formatRateRatioFixed(normalizedOut, decimalsOut, fractionDigits)

  return `1 ${symbolIn} = ${formattedOut} ${symbolOut}`
}

/** Connected Swap meta — `1 USDT ≈ 1.001 USD1` (3 fraction digits). */
export function formatSwapRateApprox({
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
    return `1 ${symbolIn} ≈ — ${symbolOut}`
  }

  const normalizedOut = normalizeRateOutPerUnit(amountIn, amountOut, decimalsIn)

  return `1 ${symbolIn} ≈ ${formatRateRatioFixed(normalizedOut, decimalsOut, fractionDigits)} ${symbolOut}`
}
