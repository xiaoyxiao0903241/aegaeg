/**
 * 闪电兑换（USDT→USD1）的提交检查配置，来自手册 Usd1Swap 的 getConfig（前端不自造）。
 *
 * @see docs/onchain-manual/contracts/usd1swap.md
 */
export type FlashUsd1SwapConfig = {
  /** Usd1Swap.getConfig().usdtToken — 余额 / 授权 / approve 必须用此地址，禁写死 env USDT。 */
  usdtToken: `0x${string}`
  rateBps: bigint
  usdtDec: number
  usd1Dec: number
  isPaused: boolean
  minIn: bigint
  maxIn: bigint
  reserve: bigint
}

export type FlashUsd1SwapBlockReason =
  'paused' | 'belowMin' | 'aboveMax' | 'insufficientReserve' | 'zeroRate' | 'zeroUsdtToken'

import { ZERO_ADDRESS } from '~/core/constants'

/**
 * 闪电兑换（USDT→USD1）提交前检查。
 *
 * 输入币地址为零、池暂停、费率为 0、输入越出上下限或报价超过储备时阻断——
 * 任一情形下链上兑换都会失败或拿到劣于预期的结果；配置未加载时不做判断。
 *
 * @param args.amountIn 拟兑换的 USDT 数量
 * @param args.quotedOut 实时报价的 USD1 数量
 * @param args.config 链上配置；未加载时 null/undefined
 * @returns 首个阻断原因；未阻断或配置未加载返回 null
 * @see docs/onchain-manual/contracts/usd1swap.md
 */
export function evaluateFlashUsd1Swap(args: {
  amountIn: bigint
  quotedOut: bigint
  config: FlashUsd1SwapConfig | null | undefined
}): FlashUsd1SwapBlockReason | null {
  const { amountIn, quotedOut, config } = args
  if (!config) return null
  if (!config.usdtToken || config.usdtToken.toLowerCase() === ZERO_ADDRESS) {
    return 'zeroUsdtToken'
  }
  if (config.isPaused) return 'paused'
  if (config.rateBps === 0n) return 'zeroRate'
  if (config.minIn > 0n && amountIn < config.minIn) return 'belowMin'
  if (config.maxIn > 0n && amountIn > config.maxIn) return 'aboveMax'
  if (quotedOut > config.reserve) return 'insufficientReserve'
  return null
}
