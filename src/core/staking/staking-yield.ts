import type { StakePeriod } from '~/core/staking/staking-period'

/** 计算器产品：质押 / LP 债 / 燃烧债 / X 挖矿。 */
export type CalcProduct = 'stake' | 'lpbond' | 'burnbond' | 'xmine'

/** 计算器滑块与预估曲线的最大天数范围（仅计算器用，非产品锁定期限）。 */
export const CALC_MAX_DAYS = 540

/** 计算器滑杆默认落点（天）。 */
export const CALC_DEFAULT_DAYS = 100

/** 计算器成本计价基准价（USD / AGX）；投入按此计价，不跟用户到期价走。 */
export const CALC_AGX_COST_USD = 65

/** X 挖矿价格轨迹起点（USD）；算法常量，非链上参数。 */
export const CALC_X_START_USD = 0.02

export type CalcYieldCurvePoint = {
  day: number
  /** 第 day 天的收益总额（卖出总值 − 总投入），可为负。 */
  profitUsd: number
}

export type CalcDaySnapshot = {
  /** 折算后的 AGX 本金（债券为折扣后份额）。 */
  principalAgx: number
  /** 总投入（质押/挖矿 = 数量 × $65；债券 = 实付 USD1）。 */
  costUsd: number
  releasedAgx: number
  /** 净收益数量（AGX 或 X），不扣 1/6。 */
  rewards: number
  releasedUsd: number
  rewardsUsd: number
  sellUsd: number
  profitUsd: number
  ratePct: number
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
 * 价格不变时持有至到期的周期收益率。
 *
 * 质押：((1+rp)^(epochs×T) + rp×epochs×T×bonus) − 1，bonus 为 LOCKED_*_BONUS_BPS。
 * 债券：((1+rp)^(epochs×T) / disc) − 1，disc 为 discountRateBP/10000。
 * 活期 T=1。利率或日频缺省返回 null。
 *
 * @param epochRebasePct 单 epoch rebase（百分比）
 * @param epochsPerDay 每日 epoch 数
 * @param period 产品周期
 * @param product 质押或债券
 * @param discountRateBP 债券成交价率 BPS；省略用手册档位，显式 null 则不算
 * @returns 周期收益率（百分比）；输入无效返回 null
 * @see docs/onchain-manual/contracts/rewardmanager.md
 * @see docs/onchain-manual/contracts/bonddepository.md
 */
export function scenarioPeriodYieldPct(
  epochRebasePct: number | null | undefined,
  epochsPerDay: number | null | undefined,
  period: StakePeriod,
  product: 'stake' | 'bond',
  discountRateBP?: bigint | number | null,
): number | null {
  if (epochRebasePct == null || !Number.isFinite(epochRebasePct) || epochRebasePct < 0) return null
  if (epochsPerDay == null || !(epochsPerDay > 0) || !Number.isFinite(epochsPerDay)) return null
  const days = calcLockDays(period) ?? 1
  const n = epochsPerDay * days
  const rp = epochRebasePct / 100
  const compound = (1 + rp) ** n
  if (product === 'bond') {
    const raw =
      discountRateBP === undefined ? handbookBondDiscountRateBP(period) : Number(discountRateBP)
    if (raw == null || !(raw > 0) || !Number.isFinite(raw)) return null
    return (compound / (raw / 10_000) - 1) * 100
  }
  return (compound + rp * n * (lockedBonusBps(period) / 10_000) - 1) * 100
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
 * 计算器锁仓天数；活期无锁仓，返回 null。
 *
 * @param period 产品周期
 * @returns 180 / 360 / 540；非定期返回 null
 */
export function calcLockDays(period: StakePeriod): number | null {
  if (period === '180') return 180
  if (period === '360') return 360
  if (period === '540') return 540
  return null
}

/**
 * 第 d 天已释放本金。
 *
 * 活期 d≥1 即全额；锁仓按 d/T 线性，上限 1。
 *
 * @param amount AGX 本金
 * @param days 测算天数
 * @param lockDays 锁仓天数；null 为活期
 * @returns 已释放数量
 */
export function releasedPrincipal(amount: number, days: number, lockDays: number | null): number {
  if (!(amount > 0) || !(days >= 1)) return 0
  if (lockDays == null) return amount
  return amount * Math.min(days / lockDays, 1)
}

/**
 * X 挖矿逐日路径：AGX 按成本基准价，X 价从起点拟合到到期价。
 * 当日产出 = 本金 × AGX 基准价 × 日利率 / 当日 X 价。
 */
function xminePath(args: {
  amount: number
  horizonDays: number
  pdX: number
  maxDay: number
  dailyValueRate: number
}): { px: number[]; cumX: number[] } {
  const d0 = Math.max(1, args.horizonDays)
  const startX = CALC_X_START_USD
  const g = (Math.max(args.pdX, 1e-12) / startX) ** (1 / d0)
  const px = [startX]
  const cumX = [0]
  let cum = 0
  const agxUsd = CALC_AGX_COST_USD
  for (let t = 1; t <= args.maxDay; t += 1) {
    const pxT = startX * g ** t
    cum += (args.amount * agxUsd * args.dailyValueRate) / Math.max(pxT, 1e-12)
    px.push(pxT)
    cumX.push(cum)
  }
  return { px, cumX }
}

function emptySnap(costUsd: number): CalcDaySnapshot {
  return {
    principalAgx: 0,
    costUsd: Math.max(0, costUsd),
    releasedAgx: 0,
    rewards: 0,
    releasedUsd: 0,
    rewardsUsd: 0,
    sellUsd: 0,
    profitUsd: -Math.max(0, costUsd),
    ratePct: costUsd > 0 ? -100 : 0,
  }
}

/**
 * 第 d 天测算：复利按 epoch、加成按单利毛 Rebase、本金线性释放。
 *
 * 加成取 LOCKED_*_BONUS_BPS；债券 A = 购买额 / (成本价 × discountRateBP/10000)。
 * 成本按基准价 $65，卖出按用户到期价。利率或日频缺省时收益为 0。
 * X 挖矿按当日 AGX 价值 × 链上日利率折成 X。
 *
 * @param args.product 产品
 * @param args.period 周期
 * @param args.amount 质押 AGX / 挖矿 gAGX / 债券购买 USD1
 * @param args.days 测算天数
 * @param args.pd 到期 AGX 价（挖矿则为到期 X 价）
 * @param args.epochRebasePct 链上单 epoch rebase（百分比）；缺则收益为 0
 * @param args.epochsPerDay 链上每日 epoch 数；缺则收益为 0
 * @param args.xmineDailyPct 链上 X 挖矿日利率（百分比）；缺则挖矿收益为 0
 * @param args.horizonDays 挖矿价格轨迹拟合天数；缺省与 days 相同
 * @returns 本金 / 释放 / 收益 / 卖出 / 收益率
 * @see docs/onchain-manual/contracts/rewardmanager.md
 * @see docs/onchain-manual/contracts/bonddepository.md
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export function computeCalcDay(args: {
  product: CalcProduct
  period: StakePeriod
  amount: number
  days: number
  pd: number
  epochRebasePct: number | null
  epochsPerDay: number | null
  xmineDailyPct?: number | null
  horizonDays?: number
}): CalcDaySnapshot {
  const days = Math.min(Math.max(0, Math.round(args.days)), CALC_MAX_DAYS)
  const pd = args.pd
  const isBond = args.product === 'lpbond' || args.product === 'burnbond'
  const lock = calcLockDays(args.period)

  if (args.product === 'xmine') {
    const A = args.amount
    const costUsd = A > 0 ? A * CALC_AGX_COST_USD : 0
    if (!(A > 0) || !(days >= 1) || !(pd > 0)) return emptySnap(costUsd)
    const dailyPct = args.xmineDailyPct
    const dailyValueRate =
      dailyPct != null && Number.isFinite(dailyPct) && dailyPct >= 0 ? dailyPct / 100 : 0
    const horizon = args.horizonDays ?? days
    const path = xminePath({
      amount: A,
      horizonDays: horizon,
      pdX: pd,
      maxDay: days,
      dailyValueRate,
    })
    const releasedAgx = releasedPrincipal(A, days, lock)
    const rewards = path.cumX[days] ?? 0
    const releasedUsd = releasedAgx * CALC_AGX_COST_USD
    const rewardsUsd = rewards * (path.px[days] ?? pd)
    const sellUsd = releasedUsd + rewardsUsd
    const profitUsd = sellUsd - costUsd
    return {
      principalAgx: A,
      costUsd,
      releasedAgx,
      rewards,
      releasedUsd,
      rewardsUsd,
      sellUsd,
      profitUsd,
      ratePct: costUsd > 0 ? (profitUsd / costUsd) * 100 : 0,
    }
  }

  let principalAgx: number
  let costUsd: number
  if (isBond) {
    const discountBP = handbookBondDiscountRateBP(args.period)
    costUsd = args.amount > 0 ? args.amount : 0
    if (!(args.amount > 0) || discountBP == null || !(discountBP > 0)) return emptySnap(costUsd)
    principalAgx = args.amount / (CALC_AGX_COST_USD * (discountBP / 10_000))
  } else {
    principalAgx = args.amount > 0 ? args.amount : 0
    costUsd = principalAgx * CALC_AGX_COST_USD
  }

  if (!(principalAgx > 0) || !(days >= 1) || !(pd > 0)) return emptySnap(costUsd)

  const releasedAgx = releasedPrincipal(principalAgx, days, lock)
  let rewards = 0
  const rp = args.epochRebasePct
  const perDay = args.epochsPerDay
  if (
    rp != null &&
    Number.isFinite(rp) &&
    rp >= 0 &&
    perDay != null &&
    perDay > 0 &&
    Number.isFinite(perDay)
  ) {
    const n = perDay * days
    const r = rp / 100
    const compounded = principalAgx * ((1 + r) ** n - 1)
    const bonusRate = isBond ? 0 : lockedBonusBps(args.period) / 10_000
    const simple = principalAgx * r * n
    rewards = compounded + simple * bonusRate
  }

  const releasedUsd = releasedAgx * pd
  const rewardsUsd = rewards * pd
  const sellUsd = releasedUsd + rewardsUsd
  const profitUsd = sellUsd - costUsd
  return {
    principalAgx,
    costUsd,
    releasedAgx,
    rewards,
    releasedUsd,
    rewardsUsd,
    sellUsd,
    profitUsd,
    ratePct: costUsd > 0 ? (profitUsd / costUsd) * 100 : 0,
  }
}

/**
 * 收益总额首次转正的天数；测满仍为负则 null。
 *
 * @param args 与 computeCalcDay 相同，不含 days
 * @returns 回本日；始终为负返回 null
 */
export function findBreakEvenDay(
  args: Omit<Parameters<typeof computeCalcDay>[0], 'days'> & { maxDays?: number },
): number | null {
  const maxDays = args.maxDays ?? CALC_MAX_DAYS
  for (let d = 1; d <= maxDays; d += 1) {
    if (computeCalcDay({ ...args, days: d }).profitUsd >= 0) return d
  }
  return null
}

/**
 * 计算器预估曲线：第 1..maxDays 天的收益总额（USD，可为负）。
 *
 * 挖矿价格轨迹按 `horizonDays`（缺省为 maxDays）拟合到到期价，再沿轨迹逐日取值。
 *
 * @param args.product 产品类型
 * @param args.period 产品周期
 * @param args.principal 本金（stake/xmine 为代币量；债券为 USD1）
 * @param args.price 到期 AGX 价（挖矿则为到期 X 价）
 * @param args.epochRebasePct 实时 epoch 收益率（百分比）；null 表示按零收益计算
 * @param args.epochsPerDay 链上每日 epoch 数；缺 → 零利息曲线
 * @param args.xmineDailyPct 链上 X 挖矿日利率（%）；缺 → 挖矿零收益
 * @param args.maxDays 曲线最大天数；缺省为 CALC_MAX_DAYS
 * @param args.horizonDays 挖矿轨迹拟合天数；缺省 maxDays
 * @returns 逐日收益总额点数组
 */
export function buildCalcYieldCurvePoints(args: {
  product: CalcProduct
  period: StakePeriod
  principal: number
  price: number
  epochRebasePct: number | null
  epochsPerDay?: number | null
  xmineDailyPct?: number | null
  maxDays?: number
  horizonDays?: number
}): CalcYieldCurvePoint[] {
  const maxDays = args.maxDays ?? CALC_MAX_DAYS
  const horizon = args.horizonDays ?? maxDays
  const points: CalcYieldCurvePoint[] = []
  for (let day = 1; day <= maxDays; day += 1) {
    const snap = computeCalcDay({
      product: args.product,
      period: args.period,
      amount: args.principal,
      days: day,
      pd: args.price,
      epochRebasePct: args.epochRebasePct,
      epochsPerDay: args.epochsPerDay ?? null,
      xmineDailyPct: args.xmineDailyPct,
      horizonDays: horizon,
    })
    points.push({ day, profitUsd: snap.profitUsd })
  }
  return points
}
