import type { StakePeriod } from '~/core/staking/staking-period'

/** 计算器产品：质押 / LP 债 / 燃烧债 / X 挖矿。 */
export type CalcProduct = 'stake' | 'lpbond' | 'burnbond' | 'xmine'

/** 计算器滑块与预估曲线的最大天数范围（仅计算器用，非产品锁定期限）。 */
export const CALC_MAX_DAYS = 720

export type CalcYieldCurvePoint = {
  day: number
  interestUsd: number
}

/**
 * 定期池锁定收益加成（BPS）。
 *
 * 数值来自手册 RewardManager 的 LOCKED_*_BONUS_BPS 常量；
 * 活期无锁定加成，返回 0。
 *
 * @param period 产品周期
 * @returns 锁定加成 BPS；非定期返回 0
 * @see docs/onchain-manual/contracts/rewardmanager.md
 */
export function lockedBonusBps(period: StakePeriod): number {
  if (period === '180') return 1000
  if (period === '360') return 1500
  if (period === '540') return 2000
  return 0
}

/**
 * sAGX.rebases(epoch).rebase（1e18 精度）→ 展示用百分比。
 *
 * 链上存的是分数（1e18 = 100%），不是已经乘过 100 的百分数。
 * 例如 `0.0025 × 1e18` → `0.25`（展示 `0.25%`）。
 *
 * @param rate1e18 链上 rebase 比率（1e18 精度）；未知时 null/undefined
 * @returns 百分比数值；未知返回 null
 * @see docs/onchain-manual/contracts/sagx.md
 */
export function epochRebasePctFrom1e18(rate1e18: bigint | null | undefined): number | null {
  if (rate1e18 == null) return null
  const pct = (Number(rate1e18) / 1e18) * 100
  return Number.isFinite(pct) ? pct : null
}

/** 一天秒数；与 epoch.length × 秒/块 一起推 epochsPerDay。 */
export const SECONDS_PER_DAY = 86_400

/**
 * 由 epoch 区块长度与出块秒数推算每日 epoch 数。
 *
 * @param epochLengthBlocks StakingPool.epoch().length
 * @param secondsPerBlock 实测或兜底出块秒数
 * @returns 每日 epoch 数；入参非法返回 null
 */
export function epochsPerDayFromLength(
  epochLengthBlocks: bigint | number | null | undefined,
  secondsPerBlock: number,
): number | null {
  if (epochLengthBlocks == null) return null
  const blocks = Number(epochLengthBlocks)
  if (!(blocks > 0) || !Number.isFinite(blocks)) return null
  if (!(secondsPerBlock > 0) || !Number.isFinite(secondsPerBlock)) return null
  const epochSec = blocks * secondsPerBlock
  if (!(epochSec > 0)) return null
  const perDay = SECONDS_PER_DAY / epochSec
  return Number.isFinite(perDay) && perDay > 0 ? perDay : null
}

/** 链未就绪时 Epoch 文案占位。 */
export const EPOCH_SCHEDULE_EMPTY = '—'

export type EpochScheduleLabels = {
  /** 单 epoch 区块数（千分位） */
  blocks: string
  /** 单 epoch 约小时数（最多一位小数） */
  hours: string
  /** 每日 epoch 次数（最多一位小数） */
  timesPerDay: string
}

const EMPTY_EPOCH_SCHEDULE: EpochScheduleLabels = {
  blocks: EPOCH_SCHEDULE_EMPTY,
  hours: EPOCH_SCHEDULE_EMPTY,
  timesPerDay: EPOCH_SCHEDULE_EMPTY,
}

/**
 * 正数 → 文案：四舍五入到一位小数；整数不带 `.0`。
 */
function formatScheduleCount(n: number): string {
  if (!Number.isFinite(n) || !(n > 0)) return EPOCH_SCHEDULE_EMPTY
  const one = Math.round(n * 10) / 10
  if (!(one > 0) || !Number.isFinite(one)) return EPOCH_SCHEDULE_EMPTY
  return String(one)
}

/** 区块数千分位（en-US 逗号，跨 locale 数字段一致）。 */
function formatBlockCount(blocks: number): string {
  const whole = Math.round(blocks)
  if (!(whole > 0) || !Number.isFinite(whole)) return EPOCH_SCHEDULE_EMPTY
  return String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 由 epoch 区块长度与出块秒数生成 FAQ/引导插值（块数 / 小时 / 每日次数）。
 *
 * 墙钟必须用 length × 实测秒/块。按手册旧值 14400 块或 3 秒/块硬算，
 * 在当前 BSC（length=96000、约 0.45 秒/块）会得到 80 小时 / 0.3 次。
 * 入参非法时三项均为 `—`，不回填默认次数。
 *
 * @param epochLengthBlocks StakingPool.epoch().length
 * @param secondsPerBlock 出块秒数（实测或兜底）
 * @returns 插值标签
 * @see docs/onchain-manual/contracts/stakingpool.md
 */
export function formatEpochScheduleLabels(
  epochLengthBlocks: bigint | number | null | undefined,
  secondsPerBlock: number | null | undefined,
): EpochScheduleLabels {
  if (epochLengthBlocks == null || secondsPerBlock == null) return EMPTY_EPOCH_SCHEDULE
  const epochsPerDay = epochsPerDayFromLength(epochLengthBlocks, secondsPerBlock)
  if (epochsPerDay == null) return EMPTY_EPOCH_SCHEDULE
  const blocks = Number(epochLengthBlocks)
  return {
    blocks: formatBlockCount(blocks),
    hours: formatScheduleCount((blocks * secondsPerBlock) / 3_600),
    timesPerDay: formatScheduleCount(epochsPerDay),
  }
}

/**
 * 单 epoch 收益率 → 基础日收益率。
 *
 * 基础日收益率 = epochsPerDay × 单 epoch Rebase%。日频只信链上推算；缺省不造默认。
 *
 * @param epochPct 单 epoch 收益率（百分比）；未知或负数时 null
 * @param epochsPerDay 每日 epoch 数（链上推算）；缺 / ≤0 / 非有限 → null
 * @returns 基础日收益率；输入无效返回 null
 */
export function baseDailyPctFromEpoch(
  epochPct: number | null | undefined,
  epochsPerDay: number | null | undefined,
): number | null {
  if (epochPct == null || !Number.isFinite(epochPct) || epochPct < 0) return null
  if (epochsPerDay == null || !(epochsPerDay > 0) || !Number.isFinite(epochsPerDay)) return null
  return epochPct * epochsPerDay
}

/**
 * 本金按日利率复利计算的利息。
 *
 * @param principal 本金
 * @param dailyPct 日收益率（百分比，如 0.82 表示 0.82%/日）
 * @param days 复利天数
 * @returns 复利利息；任一入参非法返回 0
 */
export function compoundInterest(principal: number, dailyPct: number, days: number): number {
  if (!(principal > 0) || !(dailyPct >= 0) || !(days > 0)) return 0
  const r = dailyPct / 100
  return principal * ((1 + r) ** days - 1)
}

/**
 * 定期池锁定加成利息。
 *
 * FAQ：未领取期间加成不参与复利。
 * 每 epoch：本金 × (epochPct/100) × (bps/10000)；再 × 天数 × 每日 epoch 数。
 *
 * @param principal 本金
 * @param epochPct 单 epoch 收益率（百分比）
 * @param bonusBps 锁定加成（BPS）
 * @param days 天数
 * @param epochsPerDay 每日 epoch 数（链上推算）；缺 / ≤0 / 非有限 → 0
 * @returns 锁定加成利息；任一入参非法返回 0
 */
export function lockedBonusInterest(
  principal: number,
  epochPct: number,
  bonusBps: number,
  days: number,
  epochsPerDay: number | null | undefined,
): number {
  if (!(principal > 0) || !(epochPct >= 0) || !(bonusBps > 0) || !(days > 0)) return 0
  if (epochsPerDay == null || !(epochsPerDay > 0) || !Number.isFinite(epochsPerDay)) return 0
  const perEpoch = principal * (epochPct / 100) * (bonusBps / 10_000)
  return perEpoch * days * epochsPerDay
}

/**
 * 仅按基础日复利计算的周期收益率百分比。
 *
 * 锁定加成单独列出，不并入本值。
 *
 * @param baseDailyPct 基础日收益率（百分比）
 * @param periodDays 周期天数
 * @returns 周期收益率（百分比）；入参非法返回 0
 */
export function periodYieldPct(baseDailyPct: number, periodDays: number): number {
  if (!(baseDailyPct >= 0) || !(periodDays > 0)) return 0
  const r = baseDailyPct / 100
  return ((1 + r) ** periodDays - 1) * 100
}

/**
 * 质押/债券周期行展示用的期限天数。
 *
 * 活期无固定期限，展示为 1 天（对应“周期收益率”口径）。
 *
 * @param period 产品周期（'180' | '360' | '540' 或其他）
 * @returns 期限天数；非定期返回 1
 */
export function stakePeriodDays(period: StakePeriod): number {
  if (period === '180') return 180
  if (period === '360') return 360
  if (period === '540') return 540
  return 1
}

/**
 * BondDepository / BurnBondDepository 手册默认 `discountRateBP`（成交价率）。
 *
 * 180→8500、360→8000、540→7500；非定期（如活期）返回 null，避免用错误折扣率估算。
 *
 * @param period 产品周期
 * @returns 手册成交价率（BPS）；非定期返回 null
 * @see docs/onchain-manual/contracts/bonddepository.md
 */
export function handbookBondDiscountRateBP(period: StakePeriod): number | null {
  if (period === '180') return 8500
  if (period === '360') return 8000
  if (period === '540') return 7500
  return null
}

/**
 * 按日线性利息（非复利）：本金 ×（日收益率 / 100）× 天数。
 * 对齐 XStakingPool：本金 × yieldRateBP × 天数 / 10000（日收益率% = yieldRateBP/100）。
 *
 * @param principal 本金
 * @param dailyPct 日收益率（百分比，如 0.82 表示 0.82%/日）
 * @param days 天数
 * @returns 线性利息；任一入参非法返回 0
 */
export function linearInterest(principal: number, dailyPct: number, days: number): number {
  if (!(principal > 0) || !(dailyPct >= 0) || !(days > 0)) return 0
  return principal * (dailyPct / 100) * days
}

/**
 * 计算器用的本地代币利息。
 *
 * 质押：rebase 复利 + 定期锁定加成。
 * 债券：USD1 经 discountRateBP 折成 AGX 后再按 rebase 复利；返回利息为 USD（AGX 利息 × 现价）。
 * Xmine：按日线性（非复利）。
 *
 * @param args.product 产品类型（stake / lpbond / burnbond / xmine）
 * @param args.period 产品周期
 * @param args.principal 本金（stake/xmine 为代币量；债券为 USD1）
 * @param args.days 天数
 * @param args.epochRebasePct 实时 epoch 收益率（百分比）；null 表示按零收益计算
 * @param args.xmineDailyPct XMine 日收益率（百分比）；仅 xmine 使用
 * @param args.agxPriceUsd AGX 现价（USD）；债券必填
 * @param args.discountRateBP 债券成交价率 BPS；缺省用手册档位
 * @param args.epochsPerDay 每日 epoch 数（链上推算）；缺 → 与无 rebase 同路零利息
 * @returns 利息与本金合计；本金或天数为 0 时利息为 0
 */
export function calcLocalInterest(args: {
  product: CalcProduct
  period: StakePeriod
  principal: number
  days: number
  epochRebasePct: number | null
  xmineDailyPct?: number | null
  agxPriceUsd?: number | null
  discountRateBP?: number | null
  epochsPerDay?: number | null
}): { interest: number; total: number } {
  const { product, period, principal, days, epochRebasePct, xmineDailyPct, epochsPerDay } = args

  if (!(principal > 0) || !(days > 0)) {
    return { interest: 0, total: Math.max(0, principal) }
  }

  if (product === 'xmine') {
    const daily = xmineDailyPct
    if (daily == null || !(daily >= 0)) return { interest: 0, total: principal }
    const interest = linearInterest(principal, daily, days)
    return { interest, total: principal + interest }
  }

  if (epochRebasePct == null) {
    return { interest: 0, total: principal }
  }

  const baseDaily = baseDailyPctFromEpoch(epochRebasePct, epochsPerDay)
  if (baseDaily == null) return { interest: 0, total: principal }

  const isBond = product === 'lpbond' || product === 'burnbond'
  if (isBond) {
    const price = args.agxPriceUsd
    // 显式传入（含 0）优先生效；未传才回落手册档位
    const discountBP =
      args.discountRateBP !== undefined && args.discountRateBP !== null
        ? args.discountRateBP
        : handbookBondDiscountRateBP(period)
    // 缺价或折扣非法 → 零利息，避免把 USD1 当 AGX 直接复利
    if (price == null || !(price > 0) || discountBP == null || !(discountBP > 0)) {
      return { interest: 0, total: principal }
    }
    // payout ≈ value/agxPrice × 10000/discountRateBP
    const agxPrincipal = (principal / price) * (10_000 / discountBP)
    const interestAgx = compoundInterest(agxPrincipal, baseDaily, days)
    const interestUsd = interestAgx * price
    return { interest: interestUsd, total: principal + interestUsd }
  }

  const compound = compoundInterest(principal, baseDaily, days)
  // 仅定期质押有锁定加成；债券已在上方分支处理。
  const bonus = lockedBonusInterest(
    principal,
    epochRebasePct,
    lockedBonusBps(period),
    days,
    epochsPerDay,
  )
  const interest = compound + bonus
  return { interest, total: principal + interest }
}

/**
 * 计算器预估曲线：第 1..maxDays 天的累计利息（USD）。
 *
 * 债券利息已是 USD（折扣→AGX 后再 × 现价）；质押/xmine 利息为代币量 × 现价。
 *
 * @param args.product 产品类型
 * @param args.period 产品周期
 * @param args.principal 本金（stake/xmine 为代币量；债券为 USD1）
 * @param args.price 现价（质押折算 USD / 债券折 AGX 用）
 * @param args.epochRebasePct 实时 epoch 收益率（百分比）；null 表示按零收益计算
 * @param args.xmineDailyPct XMine 日收益率（%）；仅 xmine 使用
 * @param args.discountRateBP 债券成交价率 BPS；缺省用手册档位
 * @param args.epochsPerDay 每日 epoch 数（链上推算）；缺 → 零利息曲线
 * @param args.maxDays 曲线最大天数；缺省为 CALC_MAX_DAYS
 * @returns 逐日累计利息（USD）点数组
 */
export function buildCalcYieldCurvePoints(args: {
  product: CalcProduct
  period: StakePeriod
  principal: number
  price: number
  epochRebasePct: number | null
  xmineDailyPct?: number | null
  discountRateBP?: number | null
  epochsPerDay?: number | null
  maxDays?: number
}): CalcYieldCurvePoint[] {
  const maxDays = args.maxDays ?? CALC_MAX_DAYS
  const isBondUsd1 = args.product === 'lpbond' || args.product === 'burnbond'
  const price = Math.max(0, args.price)
  const points: CalcYieldCurvePoint[] = []
  for (let day = 1; day <= maxDays; day += 1) {
    const { interest } = calcLocalInterest({
      product: args.product,
      period: args.period,
      principal: args.principal,
      days: day,
      epochRebasePct: args.epochRebasePct,
      xmineDailyPct: args.xmineDailyPct,
      agxPriceUsd: isBondUsd1 ? price : null,
      discountRateBP: args.discountRateBP,
      epochsPerDay: args.epochsPerDay,
    })
    // 债券利息已是 USD；质押/xmine 利息为代币量 × 现价。
    points.push({
      day,
      interestUsd: isBondUsd1 ? interest : interest * price,
    })
  }
  return points
}
