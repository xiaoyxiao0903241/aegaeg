import { BPS_DENOM } from '~/core/exchange/bps'
import { formatTokenAmount } from '~/core/exchange/token-amount'

/**
 * 销毁贡献兑换的提交检查配置，来自手册 AgxContributionSwap 的 getConfig（前端不自造）。
 *
 * @see docs/onchain-manual/contracts/agxcontributionswap.md
 */
export type BurnContributionSwapConfig = {
  decimals: number
  rateBps: bigint
  isPaused: boolean
  minIn: bigint
  maxIn: bigint
  totalBurned: bigint
  totalContribution: bigint
  /** convert 中销毁占比（getSplitConfig.splitBps）；余下部分注入 LP。 */
  splitBps: bigint
}

/**
 * 将 splitBps（0–10000）格式化为整数/小数百分比字符串，供 FAQ 展示。
 *
 * @param splitBps 销毁占比（BPS）
 * @returns 百分比字符串
 */
export function formatBurnSplitPercent(splitBps: bigint): string {
  if (splitBps < 0n || splitBps > BPS_DENOM) {
    throw new Error(`BURN_SPLIT_BPS_OUT_OF_RANGE:${splitBps}`)
  }
  if (splitBps % 100n === 0n) return (splitBps / 100n).toString()
  const whole = splitBps / 100n
  const frac = (splitBps % 100n).toString().padStart(2, '0').replace(/0+$/, '')
  return `${whole.toString()}.${frac}`
}

export type BurnContributionSwapBlockReason = 'paused' | 'belowMin' | 'aboveMax' | 'zeroRate'

/**
 * 销毁贡献兑换提交前检查。
 *
 * 池暂停、费率为 0 或输入越出上下限时阻断，避免链上销毁必然失败；
 * 配置未加载时不做判断。
 *
 * @param args.amountIn 拟兑换的 AGX 数量
 * @param args.config 链上配置；未加载时 null/undefined
 * @returns 首个阻断原因；未阻断或配置未加载返回 null
 * @see docs/onchain-manual/contracts/agxcontributionswap.md
 */
export function evaluateBurnContributionSwap(args: {
  amountIn: bigint
  config: BurnContributionSwapConfig | null | undefined
}): BurnContributionSwapBlockReason | null {
  const { amountIn, config } = args
  if (!config) return null
  if (config.isPaused) return 'paused'
  if (config.rateBps === 0n) return 'zeroRate'
  if (amountIn === 0n) return null
  if (config.minIn > 0n && amountIn < config.minIn) return 'belowMin'
  if (config.maxIn > 0n && amountIn > config.maxIn) return 'aboveMax'
  return null
}

/**
 * 是否有阻断原因（reason 非 null）。
 *
 * @param reason 提交检查结果
 * @returns 有阻断原因返回 true
 */
export function burnContributionSwapBlocksSubmit(
  reason: BurnContributionSwapBlockReason | null | undefined,
): boolean {
  return reason != null
}

/**
 * 由链上 rateBps 生成「1 AGX = N 贡献点」文案。
 *
 * 贡献点 = AGX × rateBps / 10000；费率未配置（0）时显示占位。
 *
 * @param rateBps 兑换费率（BPS）
 * @param decimals AGX 精度
 * @param agxSymbol AGX 展示符号
 * @param pointsLabel 贡献点名称
 * @param fractionDigits 保留小数位
 * @returns 「1 符号 = N 贡献点」文案
 */
export function formatBurnContributionRateLabel({
  rateBps,
  decimals,
  agxSymbol,
  pointsLabel,
  fractionDigits = 2,
}: {
  rateBps: bigint
  decimals: number
  agxSymbol: string
  pointsLabel: string
  fractionDigits?: number
}): string {
  if (rateBps === 0n) {
    return `1 ${agxSymbol} = — ${pointsLabel}`
  }

  const oneAgx = 10n ** BigInt(decimals)
  const pointsPerAgx = (oneAgx * rateBps) / BPS_DENOM
  const formatted = formatTokenAmount(pointsPerAgx, decimals, fractionDigits)

  return `1 ${agxSymbol} = ${formatted} ${pointsLabel}`
}

/**
 * 由链上 rateBps 生成「1:N」比例文案（Hub/营销展示）。
 *
 * rateBps 为 10000 整数倍时精确输出 1:N；否则输出小数并去掉尾部零。
 *
 * @param rateBps 兑换费率（BPS）
 * @returns 「1:N」比例文案
 */
export function formatBurnContributionRatioColon(rateBps: bigint): string {
  if (rateBps === 0n) return '0'
  if (rateBps % BPS_DENOM === 0n) {
    return `1:${(rateBps / BPS_DENOM).toString()}`
  }
  const whole = rateBps / BPS_DENOM
  const frac = rateBps % BPS_DENOM
  const fracStr = frac.toString().padStart(4, '0').replace(/0+$/, '')
  return fracStr.length > 0 ? `1:${whole.toString()}.${fracStr}` : `1:${whole.toString()}`
}
