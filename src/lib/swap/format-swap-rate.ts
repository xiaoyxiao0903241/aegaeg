import { formatTokenAmount } from '~/lib/swap/token-amount'

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

  return `${whole}.${fractionText}`
}

/** Swap widget rate label — `1 : 1.0010` (Figma colon format, 4 fraction digits). */
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

  const oneUnitIn = 10n ** BigInt(decimalsIn)
  const normalizedOut = (amountOut * oneUnitIn) / amountIn

  return `1 : ${formatRateRatioFixed(normalizedOut, decimalsOut)}`
}

export function formatSwapRate({
  amountIn,
  amountOut,
  decimalsIn,
  decimalsOut,
  symbolIn,
  symbolOut,
}: {
  amountIn: bigint
  amountOut: bigint
  decimalsIn: number
  decimalsOut: number
  symbolIn: string
  symbolOut: string
}): string {
  if (amountIn === 0n || amountOut === 0n) {
    return `1 ${symbolIn} = — ${symbolOut}`
  }

  const oneUnitIn = 10n ** BigInt(decimalsIn)
  const normalizedOut = (amountOut * oneUnitIn) / amountIn
  const formattedOut = formatTokenAmount(normalizedOut, decimalsOut, 6)

  return `1 ${symbolIn} = ${formattedOut} ${symbolOut}`
}

/** Connected Swap meta — `1 USDT ≈ 1.001 USD1` (Figma approx format, 3 fraction digits). */
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

  const oneUnitIn = 10n ** BigInt(decimalsIn)
  const normalizedOut = (amountOut * oneUnitIn) / amountIn

  return `1 ${symbolIn} ≈ ${formatRateRatioFixed(normalizedOut, decimalsOut, fractionDigits)} ${symbolOut}`
}
