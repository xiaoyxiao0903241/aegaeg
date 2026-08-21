import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatCountdownParts } from '~/core/format-countdown'

/**
 * 预售购买相关的数学与状态判断（纯函数）。
 *
 * 阶段额度、用户剩余、份数与金额上限、倒计时、空投估算均以链上参数
 * 为准；链上数据缺失时按不可购买处理，避免带着空值提交。
 *
 * @see 手册 §6 预售 PreSale
 */

/** 链上预售阶段：额度、折扣、空投比例与起止时间（原始 bigint）。 */
export interface PresalePhaseOnChain {
  index: number
  minAmount: bigint
  maxAmount: bigint
  discountBps: bigint
  airdropValueRatio: bigint
  startTime: bigint
  endTime: bigint
  soldAmount: bigint
  userPurchaseLimit: bigint
}

/** 阶段剩余与用户剩余额度（getUserPhaseRemainingAmount 返回口径）。 */
export interface PresalePhaseRemaining {
  remainingPhaseAmount: bigint
  remainingUserAmount: bigint
  userPurchaseLimit: bigint
  userPhaseAmountCurrent: bigint
}

/** USD1 的十进制位数（18）。 */
const USD1_DECIMALS = 18

export { USD1_DECIMALS }

/**
 * 阶段剩余可购额度。
 *
 * 优先用链上剩余结构；缺失时由 maxAmount - soldAmount 推算，已售超 max
 * 时返回 0，不出现负数。
 *
 * @param phaseRemaining 链上剩余结构；null / undefined 时走推算
 * @param activePhase 当前阶段；供推算用
 * @returns 阶段剩余额度（wei）
 * @see 手册 §6.3 展示字段
 */
export function remainingPhaseAmount(
  phaseRemaining: PresalePhaseRemaining | null | undefined,
  activePhase: PresalePhaseOnChain | null | undefined,
): bigint {
  if (phaseRemaining) {
    return phaseRemaining.remainingPhaseAmount
  }

  if (!activePhase) return 0n
  if (activePhase.soldAmount >= activePhase.maxAmount) return 0n
  return activePhase.maxAmount - activePhase.soldAmount
}

/**
 * 用户本期剩余可购金额。
 *
 * `userPurchaseLimit == 0` 表示不限购，用户剩余等于阶段剩余；拿不到
 * `getUserPhaseRemainingAmount` 时无法扣减已购量，按 0 处理，
 * 不让用户超出真实额度下单。
 *
 * @param phaseRemaining 链上剩余结构
 * @param activePhase 当前阶段
 * @param fallbackMaxAmount 无任何数据时的兜底额度
 * @returns 用户剩余可购金额（wei）
 * @see 手册 §6.3 展示字段
 */
export function remainingUserAmount(
  phaseRemaining: PresalePhaseRemaining | null | undefined,
  activePhase: PresalePhaseOnChain | null | undefined,
  fallbackMaxAmount: bigint,
): bigint {
  if (phaseRemaining) {
    return phaseRemaining.userPurchaseLimit === 0n
      ? phaseRemaining.remainingPhaseAmount
      : phaseRemaining.remainingUserAmount
  }

  if (activePhase) {
    if (activePhase.userPurchaseLimit > 0n) return 0n
    return remainingPhaseAmount(null, activePhase)
  }

  return fallbackMaxAmount
}

/**
 * 单份（share）对应的链上阶段最小购买额。
 *
 * 预售金额按 100 USD1 一份计；阶段无最小额时返回 0。
 *
 * @param phase 链上阶段；null / undefined 视为无
 * @returns 单份金额（wei）
 * @see 手册 §6.4 用户写方法
 */
export function sharePriceWei(phase: PresalePhaseOnChain | null | undefined): bigint {
  if (phase?.minAmount && phase.minAmount > 0n) {
    return phase.minAmount
  }
  return 0n
}

/**
 * 可购份数上限 = min(阶段剩余, 用户剩余, 钱包余额可购)。
 *
 * 未连接钱包时不把余额纳入上限；单份价为 0 时返回 0。
 *
 * @param sharePriceWei 单份金额
 * @param remainingPhaseAmount 阶段剩余额度
 * @param remainingUserAmount 用户剩余额度
 * @param usd1Balance 钱包 USD1 余额
 * @param walletReady 是否已连接钱包
 * @returns 可购份数上限
 * @see 手册 §6.4 用户写方法
 */
export function genesisMaxShares({
  sharePriceWei,
  remainingPhaseAmount,
  remainingUserAmount,
  usd1Balance = 0n,
  walletReady = false,
}: {
  sharePriceWei: bigint
  remainingPhaseAmount: bigint
  remainingUserAmount: bigint
  usd1Balance?: bigint
  walletReady?: boolean
}): number {
  if (sharePriceWei === 0n) return 0

  const maxPurchasableWei =
    remainingPhaseAmount < remainingUserAmount ? remainingPhaseAmount : remainingUserAmount

  const caps = [Number(maxPurchasableWei / sharePriceWei)]

  if (walletReady) {
    caps.push(Number(usd1Balance / sharePriceWei))
  }

  return Math.max(0, Math.min(...caps))
}

/**
 * 将草稿份数夹取到合法范围（1..maxShares）。
 *
 * 空草稿（0）保持 0；无可购上限时强制归 0，防止无效份数进入提交。
 *
 * @param shares 草稿份数
 * @param maxShares 可购上限
 * @returns 夹取后的份数
 */
export function clampGenesisShares(shares: number, maxShares: number): number {
  if (maxShares <= 0 || shares <= 0) return 0
  return Math.min(Math.max(shares, 1), maxShares)
}

/** 数字份数的受控输入镜像：0 显示为空字符串。 */
export function formatGenesisSharesText(shares: number): string {
  return shares === 0 ? '' : String(shares)
}

/**
 * 预售购买提交是否放行（链上 + 草稿）。
 *
 * 需钱包已连接、有进行中阶段、已绑定推荐、未暂停，份数与金额均在
 * 范围内；绑定或暂停状态未知时按不满足处理，不放开提交。
 *
 * @see 手册 §6.4 用户写方法
 */
export function canPurchaseGenesis({
  walletReady,
  hasActivePhase,
  isBound,
  isPaused = false,
  maxShares,
  shares,
  purchaseAmount,
  minAmount,
  maxPurchasableWei,
}: {
  walletReady: boolean
  hasActivePhase: boolean
  /** 仅 true 可购买；false 或加载中不得开启提交。 */
  isBound: boolean
  /** 链上 paused()——为 true 时在弹钱包前阻断。 */
  isPaused?: boolean
  maxShares: number
  shares: number
  purchaseAmount: bigint
  minAmount: bigint
  maxPurchasableWei: bigint
}): boolean {
  return (
    walletReady &&
    hasActivePhase &&
    isBound &&
    !isPaused &&
    maxShares > 0 &&
    shares >= 1 &&
    shares <= maxShares &&
    purchaseAmount >= minAmount &&
    purchaseAmount <= maxPurchasableWei
  )
}

/** 预售购买 approve 后的二次校验（推荐绑定 / 暂停）。 */
export type GenesisPostApprove = { ok: true } | { ok: false; reason: 'not_bound' | 'unavailable' }

/**
 * 预售购买 approve 后的二次校验。
 *
 * 未绑定推荐，或暂停状态为真 / 未知时返回失败原因；全部满足返回 ok。
 *
 * @param isBound 是否已绑定推荐；undefined 视为未绑定
 * @param isPaused 是否暂停
 * @param isPausedUnknown 暂停状态是否未知
 * @returns 二次校验结果
 * @see 手册 §6.4 用户写方法
 */
export function evaluateGenesisPostApprove({
  isBound,
  isPaused,
  isPausedUnknown,
}: {
  isBound: boolean | undefined
  isPaused: boolean
  isPausedUnknown: boolean
}): GenesisPostApprove {
  if (isBound !== true) return { ok: false, reason: 'not_bound' }
  if (isPaused || isPausedUnknown) return { ok: false, reason: 'unavailable' }
  return { ok: true }
}

/**
 * 写前复核拟购金额是否仍在阶段 / 用户剩余内。
 *
 * @param args.purchaseAmount 拟购金额
 * @param args.remainingPhaseAmount 阶段剩余
 * @param args.remainingUserAmount 用户剩余
 * @returns 可覆盖返回 true
 * @see 手册 §6.3 展示字段
 */
export function evaluateGenesisPurchaseAmountLive(args: {
  purchaseAmount: bigint
  remainingPhaseAmount: bigint
  remainingUserAmount: bigint
}): boolean {
  if (args.purchaseAmount <= 0n) return false
  return (
    args.purchaseAmount <= args.remainingPhaseAmount &&
    args.purchaseAmount <= args.remainingUserAmount
  )
}

/**
 * 阶段是否进行中：当前时间在 [startTime, endTime] 闭区间内。
 *
 * @param phase 链上阶段
 * @param nowSeconds 当前时间（unix 秒）
 * @returns 进行中返回 true
 */
export function isPhaseActive(
  phase: PresalePhaseOnChain,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  const now = BigInt(nowSeconds)
  return now >= phase.startTime && now <= phase.endTime
}

/**
 * 查找当前进行中的阶段；无进行中阶段返回 null。
 *
 * @param phases 链上阶段列表
 * @param nowSeconds 当前时间（unix 秒）
 * @returns 进行中的阶段；无则 null
 */
export function findActivePresalePhase(
  phases: readonly PresalePhaseOnChain[],
  nowSeconds = Math.floor(Date.now() / 1000),
): PresalePhaseOnChain | null {
  return phases.find((phase) => isPhaseActive(phase, nowSeconds)) ?? null
}

export type PhaseCountdownMode = 'starts' | 'ends'

/**
 * 阶段倒计时的去重键：模式 + 目标时间。
 *
 * @param target 倒计时目标；null 表示无
 * @returns 键；无目标返回 null
 */
export function phaseCountdownKey(
  target: { mode: PhaseCountdownMode; targetTime: bigint } | null,
): string | null {
  if (!target) return null
  return `${target.mode}:${target.targetTime.toString()}`
}

/**
 * 倒计时目标是否已到期。
 *
 * @param targetTime 目标时间（unix 秒）
 * @param nowSeconds 当前时间（unix 秒）
 * @returns 已到期返回 true
 */
export function hasPhaseCountdownElapsed(
  targetTime: bigint,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  return nowSeconds >= Number(targetTime)
}

/**
 * 计算阶段倒计时目标：进行中显示结束时间，否则显示最近未来阶段的开始时间。
 *
 * 无任何阶段时返回 null。
 *
 * @param phases 链上阶段列表
 * @param nowSeconds 当前时间（unix 秒）
 * @returns 倒计时模式与目标时间；无目标返回 null
 */
export function phaseCountdownTarget(
  phases: readonly PresalePhaseOnChain[],
  nowSeconds = Math.floor(Date.now() / 1000),
): { mode: PhaseCountdownMode; targetTime: bigint } | null {
  const active = findActivePresalePhase(phases, nowSeconds)
  if (active) {
    return { mode: 'ends', targetTime: active.endTime }
  }

  const upcoming = phases
    .filter((phase) => Number(phase.startTime) > nowSeconds)
    .sort((left, right) => Number(left.startTime) - Number(right.startTime))[0]

  if (upcoming) {
    return { mode: 'starts', targetTime: upcoming.startTime }
  }

  return null
}

/**
 * 阶段时间戳格式化为 `月.日`（本地时区）。
 *
 * @param timestamp 时间戳（unix 秒）
 * @returns 格式化的日期文案
 */
export function formatPhaseDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}.${day}`
}

export type PhaseCountdownUnits = {
  days: string
  hours: string
  minutes: string
}

export const DEFAULT_PHASE_COUNTDOWN_UNITS: PhaseCountdownUnits = {
  days: 'd',
  hours: 'h',
  minutes: 'm',
}

/**
 * 阶段倒计时文本：`天数 时 分`。
 *
 * 分段规则与全站剩余时间相同：精确到分钟；不足 1 分钟仍显示 1 分。
 *
 * @param targetTime 目标时间（unix 秒）
 * @param nowSeconds 当前时间（unix 秒）
 * @param units 天数 / 小时 / 分钟单位文案
 * @returns 倒计时文本
 */
export function formatPhaseCountdown(
  targetTime: bigint,
  nowSeconds = Math.floor(Date.now() / 1000),
  units: PhaseCountdownUnits = DEFAULT_PHASE_COUNTDOWN_UNITS,
): string {
  const [days, hours, minutes] = formatCountdownParts(
    Number(targetTime) - nowSeconds,
    ['days', 'hours', 'minutes'],
    false,
  )
  return `${days?.text ?? '0'}${units.days} ${hours?.text ?? '00'}${units.hours} ${minutes?.text ?? '00'}${units.minutes}`
}

/**
 * 估算投入 USD1 可获得的 AGX 数量。
 *
 * 按折后 AGX 单价（参考价 ×（1 − 折扣率））换算；输入非正或折后单价
 * 非正返回 0。
 *
 * @param amountUsd1 投入金额（USD1）
 * @param discountBps 折扣（万分之一）
 * @param agxPriceUsd AGX 参考价（美元）
 * @returns 估算的 AGX 数量
 * @see 手册 §6.3 展示字段
 */
export function estimateAgxFromUsd1(
  amountUsd1: number,
  discountBps: number,
  agxPriceUsd: number,
): number {
  if (amountUsd1 <= 0 || agxPriceUsd <= 0) return 0

  const effectiveAgxPrice = agxPriceUsd * (1 - discountBps / 10_000)
  if (effectiveAgxPrice <= 0) return 0

  return amountUsd1 / effectiveAgxPrice
}

/**
 * 按阶段索引解析折扣（万分之一）。
 *
 * 阶段不存在或折扣非正返回 0；索引以 API / 合约的 0 基阶段为准。
 *
 * @param phaseId 阶段索引（0 基）
 * @param phases 阶段折扣列表
 * @returns 折扣 bps
 */
export function phaseDiscountBps(
  phaseId: number,
  phases: ReadonlyArray<Pick<PresalePhaseOnChain, 'discountBps'>> = [],
): number {
  if (!Number.isFinite(phaseId) || phaseId < 0) return 0

  const chainPhase = phases[phaseId]
  if (!chainPhase) return 0

  const bps = Number(chainPhase.discountBps)
  return Number.isFinite(bps) && bps > 0 ? bps : 0
}

/**
 * 空投门槛（wei）换算为 USD 数值。
 *
 * @param thresholdWei 门槛金额（USD1，18 位）
 * @returns USD 数值；非正返回 0
 */
export function presaleAirdropThresholdToUsd(thresholdWei: bigint): number {
  if (thresholdWei <= 0n) return 0
  return formatTokenAmountToNumber(thresholdWei, USD1_DECIMALS)
}

/**
 * 读取阶段的空投比例（airdropValueRatio，万分之一）。
 *
 * @param phase 链上阶段
 * @returns 空投 bps；未配置或为 0 返回 0
 */
export function getAirdropBpsForPhase(phase?: PresalePhaseOnChain): number {
  if (phase?.airdropValueRatio !== undefined && phase.airdropValueRatio > 0n) {
    return Number(phase.airdropValueRatio)
  }
  return 0
}

/**
 * 估算本次购买对贡献值的贡献（USD）。
 *
 * 公式等价于 `amountUsd1 / (1 - discount)`；仍要求 `agxPriceUsd > 0`
 * 作为报价门闸，参考价缺失或非正时按 0 处理，避免展示无效贡献值。
 *
 * @param amountUsd1 投入金额（USD1）
 * @param discountBps 折扣（万分之一）
 * @param agxPriceUsd AGX 参考价（美元）
 * @returns 贡献值（USD）
 */
export function estimateContributionValueUsd(
  amountUsd1: number,
  discountBps: number,
  agxPriceUsd: number,
): number {
  if (amountUsd1 <= 0 || agxPriceUsd <= 0) return 0
  const keep = 1 - discountBps / 10_000
  if (keep <= 0) return 0
  return amountUsd1 / keep
}

/**
 * 估算 X token 空投的 USD 价值 = 购买额 × 空投比例。
 *
 * @param amountUsd1 投入金额（USD1）
 * @param phase 链上阶段
 * @returns 空投价值（USD）；购买额非正返回 0
 * @see 手册 §6.3 展示字段
 */
export function estimateXTokenAirdropUsd(amountUsd1: number, phase?: PresalePhaseOnChain): number {
  if (amountUsd1 <= 0) return 0
  return amountUsd1 * (getAirdropBpsForPhase(phase) / 10_000)
}

/**
 * 当期购买可计入的空投价值：当期累计贡献达标才计入。
 *
 * 小于最低周期额或购买额非正时返回 0。
 *
 * @param periodContributedUsd 当期已贡献金额
 * @param payUsd1 本次购买金额
 * @param minPeriodUsd 最低周期额
 * @param phase 链上阶段
 * @returns 计入的空投价值（USD）
 */
export function xTokenAirdropUsdForPurchase(
  periodContributedUsd: number,
  payUsd1: number,
  minPeriodUsd: number,
  phase?: PresalePhaseOnChain,
): number {
  const periodTotalUsd = periodContributedUsd + payUsd1
  if (minPeriodUsd <= 0 || periodTotalUsd < minPeriodUsd || payUsd1 <= 0) return 0
  return estimateXTokenAirdropUsd(payUsd1, phase)
}
