import { BPS_DENOM, BPS_DENOM_NUMBER } from '~/core/exchange/bps'

/** 兑换报价数学：滑点下限 + 交易截止时间。 */

/**
 * 按滑点计算可接受的最低换出数量。
 *
 * 高滑点下整除可能把微小报价截成 0，因此保留 1 wei 下限，
 * 保证链上滑点约束不会形同虚设。
 *
 * @param quotedOut 实时报价的换出数量
 * @param slippageBps 滑点（BPS，0–9999）
 * @returns 最低可接受数量；报价 ≤ 0 返回 0n
 */
export function calcAmountOutMin(quotedOut: bigint, slippageBps: number): bigint {
  if (slippageBps < 0 || slippageBps >= BPS_DENOM_NUMBER) {
    throw new Error(`Invalid slippage bps: ${slippageBps}`)
  }

  if (quotedOut <= 0n) return 0n

  const floored = (quotedOut * BigInt(BPS_DENOM_NUMBER - slippageBps)) / BPS_DENOM
  // 高滑点下整除可能把微小报价截为 0，保留 1 wei 下限，避免链上滑点约束失效
  return floored > 0n ? floored : 1n
}

/**
 * 按滑点加码应付输入：报价 × (1 + 滑点)。
 *
 * 涡轮合约只收 USD1 数量；前端把报价加码后提交，多付部分由合约退回。
 *
 * @param quotedIn 实时报价的应付数量
 * @param slippageBps 滑点（BPS，0–9999）
 * @returns 加码后的应付；报价 ≤ 0 返回 0n
 */
export function calcAmountInMax(quotedIn: bigint, slippageBps: number): bigint {
  if (slippageBps < 0 || slippageBps >= BPS_DENOM_NUMBER) {
    throw new Error(`Invalid slippage bps: ${slippageBps}`)
  }
  if (quotedIn <= 0n) return 0n
  return (quotedIn * BigInt(BPS_DENOM_NUMBER + slippageBps)) / BPS_DENOM
}

/**
 * 计算交易截止时间戳（unix 秒）。
 *
 * @param deadlineSeconds 从当前时刻起的有效期（秒）
 * @param nowSeconds 当前时间戳（unix 秒），缺省取当前时间
 * @returns 截止时间戳
 */
export function exchangeDeadline(
  deadlineSeconds: number,
  nowSeconds = Math.floor(Date.now() / 1000),
): number {
  return nowSeconds + deadlineSeconds
}
