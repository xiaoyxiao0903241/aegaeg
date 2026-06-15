import { formatTokenAmount } from './token-amount'

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
