import { BPS_DENOM } from '~/core/exchange/bps'

/**
 * V2 AMM 相对中间价（无手续费储备比）的价格冲击（BPS）。
 *
 * 以 amountIn × reserveOut / reserveIn 为基准，比较实际换出量，
 * 差值隐含池手续费与规模冲击。
 *
 * @param amountIn 输入数量
 * @param amountOut 实际换出数量
 * @param reserveIn 输入代币池储备
 * @param reserveOut 输出代币池储备
 * @returns 价格冲击（BPS）；任一入参为 0 或冲击为 0 时返回 0
 */
export function calcV2PriceImpactBps({
  amountIn,
  amountOut,
  reserveIn,
  reserveOut,
}: {
  amountIn: bigint
  amountOut: bigint
  reserveIn: bigint
  reserveOut: bigint
}): number {
  if (amountIn === 0n || amountOut === 0n || reserveIn === 0n || reserveOut === 0n) return 0

  const midOut = (amountIn * reserveOut) / reserveIn
  if (midOut === 0n) return 0

  const diff = midOut > amountOut ? midOut - amountOut : 0n
  const bps = Number((diff * BPS_DENOM) / midOut)
  return Number.isFinite(bps) ? bps : 0
}

/** 价格冲击警告阈值（1%）。 */
export const HIGH_EXCHANGE_PRICE_IMPACT_BPS = 100
