function stripTokenAmountGrouping(value: string): string {
  return value.replace(/,/g, '')
}

function formatIntegerGrouping(digits: string): string {
  if (!digits) return '0'
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/** 去除未分组金额字符串尾部的零（保留编辑中残留的尾部小数点）。 */
export function stripTrailingAmountZeros(value: string): string {
  const raw = stripTokenAmountGrouping(value)
  if (!raw || raw.endsWith('.')) return raw
  const dot = raw.indexOf('.')
  if (dot === -1) return raw
  const whole = raw.slice(0, dot)
  const frac = raw.slice(dot + 1).replace(/0+$/, '')
  return frac ? `${whole}.${frac}` : whole
}

/**
 * 将金额输入草稿规范为分组展示：整数千分位逗号，保留编辑中的尾部小数点。
 *
 * @param value 输入草稿（可能含逗号）
 * @returns 规范化的展示字符串
 */
export function formatTokenAmountInputDisplay(value: string): string {
  const raw = stripTokenAmountGrouping(value)
  if (!raw) return ''

  const dotIndex = raw.indexOf('.')
  if (dotIndex === -1) {
    if (raw === '0') return '0'
    return formatIntegerGrouping(raw.replace(/^0+(?=\d)/, ''))
  }

  const wholePart = raw.slice(0, dotIndex)
  const fractionPart = raw.slice(dotIndex + 1)
  const hasTrailingDot = raw.endsWith('.')
  const normalizedWhole = wholePart === '' ? '0' : wholePart.replace(/^0+(?=\d)/, '') || '0'
  const groupedWhole = formatIntegerGrouping(normalizedWhole)

  if (hasTrailingDot && fractionPart === '') {
    return `${groupedWhole}.`
  }

  if (fractionPart === '') {
    return groupedWhole
  }

  return `${groupedWhole}.${fractionPart}`
}

/**
 * 解析金额字符串为最小单位数值（wei）。
 *
 * 仅接受数字与单个小数点；小数位超出精度部分截断。
 *
 * @param value 金额字符串（可含逗号）
 * @param decimals 代币精度
 * @returns 最小单位数值；非法输入返回 0n
 */
export function parseTokenAmount(value: string, decimals: number): bigint {
  const trimmed = stripTokenAmountGrouping(value.trim())
  if (!trimmed) return 0n

  if (!/^\d+(\.\d*)?$/.test(trimmed)) return 0n

  const [wholePart, fractionPart = ''] = trimmed.split('.')
  const normalizedFraction = fractionPart.slice(0, decimals).padEnd(decimals, '0')
  const combined = `${wholePart}${normalizedFraction}`.replace(/^0+(?=\d)/, '')

  if (!combined) return 0n

  try {
    return BigInt(combined)
  } catch {
    return 0n
  }
}

export type FormatTokenAmountOptions = {
  /** 保留的小数位（缺省 4）。 */
  digits?: number
  /**
   * 数字第三参默认 `false`（按 `digits` 补零，与 `formatNumber` 一致）。
   * 对象缺省 `true`：去掉尾部零（输入草稿 / 紧凑展示）。
   */
  trimZeros?: boolean
  /**
   * `true`（默认）：正数但低于展示位时输出 `<0.01` / `<0.0001` 等。
   * 输入草稿 / 须可 parse 的路径传 `false`。
   */
  dust?: boolean
}

function tokenAmountOptions(
  maxFractionDigitsOrOptions: number | FormatTokenAmountOptions = 4,
): Required<FormatTokenAmountOptions> {
  if (typeof maxFractionDigitsOrOptions === 'number') {
    return { digits: maxFractionDigitsOrOptions, trimZeros: false, dust: true }
  }
  return {
    digits: maxFractionDigitsOrOptions.digits ?? 4,
    trimZeros: maxFractionDigitsOrOptions.trimZeros !== false,
    dust: maxFractionDigitsOrOptions.dust !== false,
  }
}

/** 展示位对应的最小可见 wei：`10^(decimals - digits)`；digits≥decimals 时为 1。 */
export function tokenDisplayFloorWei(decimals: number, digits: number): bigint {
  const d = Math.max(0, Math.floor(decimals))
  const frac = Math.max(0, Math.floor(digits))
  if (frac <= 0) return 10n ** BigInt(d)
  if (frac >= d) return 1n
  return 10n ** BigInt(d - frac)
}

/** `digits=2` → `0.01`；`digits=4` → `0.0001`。 */
function tokenDustFloorLabel(digits: number): string {
  const d = Math.max(1, Math.floor(digits))
  return d === 1 ? '0.1' : `0.${'0'.repeat(d - 1)}1`
}

/**
 * 链上最小单位数量 → 千分位分组的人类可读字符串。
 *
 * 第三个参数为最大小数位（数字参默认**补足**位数）或 `{ digits, trimZeros, dust }`。
 * 默认：正数低于展示位时返回 `<0.01`（随 digits）；真 0 随 digits 为 `0.00` 等。
 *
 * @param amount 最小单位数量
 * @param decimals 代币精度
 * @param maxFractionDigitsOrOptions 最大小数位或配置对象；缺省 4
 * @returns 分组后的金额字符串
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  maxFractionDigitsOrOptions: number | FormatTokenAmountOptions = 4,
): string {
  const { digits: rawDigits, trimZeros, dust } = tokenAmountOptions(maxFractionDigitsOrOptions)
  const digits = Math.max(0, Math.floor(rawDigits))
  const divisor = 10n ** BigInt(decimals)
  const whole = amount / divisor
  const fraction = amount % divisor
  const groupedWhole = formatIntegerGrouping(whole.toString())

  if (dust && amount > 0n && digits >= 1 && amount < tokenDisplayFloorWei(decimals, digits)) {
    return `<${tokenDustFloorLabel(digits)}`
  }

  if (!trimZeros) {
    if (digits === 0) return groupedWhole
    const fractionText = fraction
      .toString()
      .padStart(decimals, '0')
      .slice(0, digits)
      .padEnd(digits, '0')
    return `${groupedWhole}.${fractionText}`
  }

  if (amount === 0n) return '0'
  if (fraction === 0n) return groupedWhole

  const fractionText = fraction.toString().padStart(decimals, '0').replace(/0+$/, '')
  const trimmed = fractionText.slice(0, digits).replace(/0+$/, '')
  return trimmed ? `${groupedWhole}.${trimmed}` : groupedWhole
}

/**
 * 金额输入草稿（wei → 字符串）：不分组、去掉尾部零。
 *
 * 小数位取 `min(decimals, maxFractionDigits)`（调用方传想要的上限）。
 * 永不输出 `<…`（须可 parse）。
 *
 * @param amount 最小单位数量
 * @param decimals 代币精度
 * @param maxFractionDigits 最大小数位，缺省为 decimals
 * @returns 输入草稿字符串
 */
export function formatTokenAmountDraft(
  amount: bigint,
  decimals: number,
  maxFractionDigits: number = decimals,
): string {
  const digits = Math.min(decimals, Math.max(0, Math.floor(maxFractionDigits)))
  return stripTrailingAmountZeros(
    stripTokenAmountGrouping(formatTokenAmount(amount, decimals, { digits, dust: false })),
  )
}

/**
 * 最小单位数量 → 不带分组符的普通数字。
 *
 * 仅当下游需要数字运算/比较时使用；展示请优先用 formatTokenAmount。
 *
 * @param amount 最小单位数量
 * @param decimals 代币精度
 * @returns 换算后的普通数字
 */
export function formatTokenAmountToNumber(amount: bigint, decimals: number): number {
  return Number(amount) / 10 ** decimals
}

/** 可接受的最高滑点（%）：保证 BPS 严格低于 10_000 硬上限。 */
export const MAX_SLIPPAGE_PERCENT = 99

/**
 * 将滑点百分比收敛到 [0, MAX_SLIPPAGE_PERCENT]。
 *
 * @param percent 滑点百分比
 * @returns 收敛后的百分比
 */
export function clampSlippagePercent(percent: number): number {
  if (!Number.isFinite(percent) || percent < 0) return 0
  return Math.min(percent, MAX_SLIPPAGE_PERCENT)
}

/**
 * 滑点百分比 → BPS（×100）。
 *
 * @param percent 滑点百分比
 * @returns BPS 值
 */
export function slippagePercentToBps(percent: number): number {
  return Math.round(percent * 100)
}

/**
 * 清洗金额输入：仅保留数字与单个小数点，并限制小数位。
 *
 * @param value 原始输入
 * @param maxFractionDigits 允许的最大小数位
 * @returns 清洗后的字符串；空输入返回 ''
 */
export function sanitizeTokenAmountInput(value: string, maxFractionDigits: number): string {
  if (!value) {
    return ''
  }

  let cleaned = ''
  let hasDot = false

  for (const char of stripTokenAmountGrouping(value)) {
    if (char >= '0' && char <= '9') {
      cleaned += char
      continue
    }

    if (char === '.' && !hasDot) {
      cleaned += char
      hasDot = true
    }
  }

  if (!cleaned) {
    return ''
  }

  if (cleaned === '.') {
    return '0.'
  }

  const dotIndex = cleaned.indexOf('.')
  if (dotIndex === -1) {
    return cleaned.replace(/^0+(?=\d)/, '')
  }

  const wholePart = cleaned.slice(0, dotIndex)
  const fractionPart = cleaned.slice(dotIndex + 1).slice(0, maxFractionDigits)
  const hasTrailingDot = cleaned.endsWith('.')
  const normalizedWhole = wholePart === '' ? '0' : wholePart.replace(/^0+(?=\d)/, '')

  if (hasTrailingDot && fractionPart === '') {
    return `${normalizedWhole}.`
  }

  if (fractionPart === '') {
    return normalizedWhole
  }

  return `${normalizedWhole}.${fractionPart}`
}

/**
 * 将金额输入限制在最大数量内。
 *
 * @param value 当前输入
 * @param maxAmount 允许的最大数量（最小单位）
 * @param decimals 代币精度
 * @param maxFractionDigits 最大小数位
 * @returns 受限后的输入字符串；超限时回退为最大数量的草稿
 */
export function capTokenAmountInput(
  value: string,
  maxAmount: bigint,
  decimals: number,
  maxFractionDigits = 6,
): string {
  const fractionLimit = Math.min(decimals, maxFractionDigits)
  // 此处不去尾零——否则输入 `1.10` 会被破坏
  const sanitized = sanitizeTokenAmountInput(value, fractionLimit)

  if (!sanitized) {
    return ''
  }

  const parsed = parseTokenAmount(sanitized, decimals)
  if (parsed <= maxAmount) {
    return sanitized
  }

  if (maxAmount === 0n) {
    return ''
  }

  return formatTokenAmountDraft(maxAmount, decimals, maxFractionDigits)
}

/**
 * 受控卖出金额的余额重新封顶策略。
 *
 * 会话未就绪或余额仍在加载时不改写草稿，避免误清空用户输入。
 *
 * @param amount 当前金额草稿
 * @param sessionReady 会话是否就绪
 * @param balancesLoaded 余额是否已加载
 * @param balance 可用的最大数量
 * @param decimals 代币精度
 * @param maxFractionDigits 最大小数位
 * @returns 封顶后的金额草稿
 */
export function cappedTokenAmountRaw({
  amount,
  sessionReady,
  balancesLoaded,
  balance,
  decimals,
  maxFractionDigits = 6,
}: {
  amount: string
  sessionReady: boolean
  balancesLoaded: boolean
  balance: bigint
  decimals: number
  maxFractionDigits?: number
}): string {
  if (!sessionReady || !balancesLoaded || !amount) {
    return amount
  }
  return capTokenAmountInput(amount, balance, decimals, maxFractionDigits)
}
