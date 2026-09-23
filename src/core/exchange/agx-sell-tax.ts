/**
 * AGX 卖出税相关辅助函数（sellRatio / extraSellBP / 价格熔断 / 单区块额度）。
 *
 * @see docs/onchain-manual/contracts/agx.md
 */

import { BPS_DENOM, BPS_DENOM_NUMBER } from '~/core/exchange/bps'

/**
 * 非白名单地址向 AGX 池转账时的实际卖出税（BPS）。
 *
 * 价格熔断激活时用防御税率 extraSellBP，否则用基础 sellRatio。
 * 税率越界直接抛错，避免以非法 BPS 继续交易。
 *
 * @param args.crashFuseActive 价格熔断是否激活
 * @param args.sellRatio 基础卖出税率（BPS）
 * @param args.extraSellBP 防御税率（BPS）
 * @returns 有效卖出税（BPS）
 * @see docs/onchain-manual/contracts/agx.md
 */
export function agxSellTaxBps(args: {
  crashFuseActive: boolean
  sellRatio: bigint
  extraSellBP: bigint
}): number {
  const raw = args.crashFuseActive ? args.extraSellBP : args.sellRatio
  if (raw < 0n || raw >= BPS_DENOM) {
    throw new Error(`AGX_SELL_TAX_BPS_OUT_OF_RANGE:${raw}`)
  }
  return Number(raw)
}

function assertAgxSellTaxBps(raw: bigint): number {
  if (raw < 0n || raw >= BPS_DENOM) {
    throw new Error(`AGX_SELL_TAX_BPS_OUT_OF_RANGE:${raw}`)
  }
  return Number(raw)
}

type AgxSellTaxInput = {
  crashFuseActive: boolean
  sellRatio: bigint
  extraSellBP: bigint
  amountIn: bigint
  blockSellLimit: bigint
  grossSoldInBlock: bigint
  blockSellQuotaBlock: bigint
  currentBlock: bigint
  /** 当前池子里的 AGX 储备。缺省时沿用合约已冻结的 blockSellLimit。 */
  agxReserve?: bigint | null
  /** 本区块已冻结的跌幅阈值。同块收紧额度时用。 */
  blockSellThresholdBps?: bigint
  /** 当前配置的跌幅阈值。新区块首笔冻结时用。 */
  crashThresholdBps?: bigint
  pendingCrashThresholdBps?: bigint
  crashThresholdEffectiveBlock?: bigint
  crashThresholdUpdatePending?: boolean
}

/** 低税额度 = 储备 × floor(跌幅阈值 / 2) / 10000。 */
function agxLowTaxSellLimit(agxReserve: bigint, thresholdBps: bigint): bigint {
  if (agxReserve <= 0n || thresholdBps <= 0n) return 0n
  return (agxReserve * (thresholdBps / 2n)) / BPS_DENOM
}

function thresholdForNewBlock(args: AgxSellTaxInput): bigint {
  const pendingDue =
    args.crashThresholdUpdatePending === true &&
    args.currentBlock >= (args.crashThresholdEffectiveBlock ?? 0n)
  if (pendingDue) return args.pendingCrashThresholdBps ?? 0n
  return args.crashThresholdBps ?? 0n
}

/**
 * 这一笔会被拿去比较的低税额度。
 *
 * 观测块不是当前块：按当前储备重新冻结，不用上一块留下的额度。
 * 同一区块：按当前储备重算后只收紧、不放大。
 * 没有储备读数时沿用已冻结额度。
 */
function resolveAgxBlockSellLimit(args: AgxSellTaxInput): bigint {
  const sameBlock = args.blockSellQuotaBlock === args.currentBlock
  if (args.agxReserve == null) return args.blockSellLimit

  const threshold = sameBlock ? (args.blockSellThresholdBps ?? 0n) : thresholdForNewBlock(args)
  const live = agxLowTaxSellLimit(args.agxReserve, threshold)
  if (!sameBlock) return live
  return live < args.blockSellLimit ? live : args.blockSellLimit
}

/**
 * 本笔是否按防御税率计费。
 *
 * 持续熔断开着，或本笔毛量撑破这一笔的低税额度时为 true。
 * 额度观测块不是当前块时，已卖出量按 0 算。
 */
function usesAgxDefenseSellTax(args: AgxSellTaxInput): boolean {
  const grossSoldInBlock =
    args.blockSellQuotaBlock === args.currentBlock ? args.grossSoldInBlock : 0n
  const limit = resolveAgxBlockSellLimit(args)
  const nextGross = grossSoldInBlock + args.amountIn
  const overBlockLimit = nextGross > limit || (limit === 0n && args.amountIn > 0n)
  return overBlockLimit || args.crashFuseActive
}

/**
 * 有效卖出税（BPS）。
 *
 * 防御路径用 extraSellBP，否则用基础 sellRatio。
 *
 * @see docs/onchain-manual/contracts/agx.md § 单区块额度
 */
export function effectiveAgxSellTaxBps(args: AgxSellTaxInput): number {
  const raw = usesAgxDefenseSellTax(args) ? args.extraSellBP : args.sellRatio
  return assertAgxSellTaxBps(raw)
}

/**
 * 信息区要展示的熔断税（BPS）。
 *
 * 本笔按防御税率计费时返回 extraSellBP，只收基础卖出税时返回 null。
 * 买入不调用。
 *
 * @param args 与有效卖出税相同的链上读数和本笔数量
 * @returns 熔断税 BPS；无熔断税时 null
 * @see docs/onchain-manual/contracts/agx.md
 */
export function agxFuseTaxDisplayBps(args: AgxSellTaxInput): number | null {
  if (!usesAgxDefenseSellTax(args)) return null
  return assertAgxSellTaxBps(args.extraSellBP)
}

/**
 * 毛卖出量 → 扣除卖出税后实际进入池子的数量。
 *
 * AGX / X 共用同一 BPS 扣税算法。
 *
 * @param amountIn 毛卖出量
 * @param taxBps 卖出税（BPS）
 * @returns 税后进入池子的数量；金额 ≤ 0 或税率为 0 时原样返回
 */
export function applyAgxSellTaxToAmountIn(amountIn: bigint, taxBps: number): bigint {
  if (taxBps < 0 || taxBps >= BPS_DENOM_NUMBER) {
    throw new Error(`Invalid AGX sell tax bps: ${taxBps}`)
  }
  if (amountIn <= 0n || taxBps === 0) return amountIn
  return (amountIn * BigInt(BPS_DENOM_NUMBER - taxBps)) / BPS_DENOM
}

/**
 * 判断交易路径是否向池子卖出 AGX（走代币转账税）。
 *
 * @param tokenIn 输入代币地址
 * @param agx AGX 合约地址
 * @returns 输入为 AGX 时返回 true
 */
export function isAgxSellPath(tokenIn: `0x${string}`, agx: `0x${string}`): boolean {
  return tokenIn.toLowerCase() === agx.toLowerCase()
}
