import { LIVE_DATA_PLACEHOLDER } from '~/core/constants'
import { interpolate } from '~/i18n/interpolate'

export { LIVE_DATA_PLACEHOLDER }

/**
 * 把已打印的数填进文案。任一值为 `--` 则整句是 `--`，避免 `-- 次`、`累计质押 -- AGX`。
 *
 * `次` / `times` 等随语言走文案模板，不要写进打印机。
 *
 * @param template 含 `{name}` 的文案
 * @param values 已打印的片段
 */
export function interpolateLive(
  template: string,
  values: Readonly<Record<string, string>>,
): string {
  for (const value of Object.values(values)) {
    if (value === LIVE_DATA_PLACEHOLDER) return LIVE_DATA_PLACEHOLDER
  }
  return interpolate(template, values)
}

/**
 * 主值 + 旁注。主值没数 → `--`；旁注没数则只出主值（不要 `42.50 gAGX --`）。
 */
export function joinLiveLabels(primary: string, note: string): string {
  if (primary === LIVE_DATA_PLACEHOLDER) return LIVE_DATA_PLACEHOLDER
  if (note === LIVE_DATA_PLACEHOLDER) return primary
  return `${primary} ${note}`
}

/** 表格非金额空单元格占位（ASCII 连字符）。金额缺数走 `LIVE_DATA_PLACEHOLDER`。 */
export const TABLE_EMPTY = '-'

const numberFormatters = new Map<string, Intl.NumberFormat>()

function numberFormatter(digits: number, trimZeros: boolean): Intl.NumberFormat {
  const key = `${digits}:${trimZeros ? '1' : '0'}`
  const cached = numberFormatters.get(key)
  if (cached) return cached
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: trimZeros ? 0 : digits,
  })
  numberFormatters.set(key, formatter)
  return formatter
}

/** 把预售等级数字格式化为 `S<等级>`；非法或非正数返回 S0。 */
export function formatPresaleRank(rank: number): string {
  if (!Number.isFinite(rank) || rank <= 0) return 'S0'
  return `S${rank}`
}

/** 社区成员表格——缺失等级或 S0 显示 `-`，否则 S1–S10。 */
export function formatTableGenesisRank(rank: number | undefined | null): string {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return TABLE_EMPTY
  return `S${Math.trunc(rank)}`
}

export type MakingRankBoostSource = {
  is_boost_rank?: boolean | null
  boost_rank?: number | null
}

function positiveRank(rank: number | null | undefined): number | null {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return null
  return Math.trunc(rank)
}

/**
 * 展示用档位：加赠时用托底 `boost_rank`，否则用真实 `making_rank`。
 *
 * @param makingRank 真实 `making_rank`
 * @param boost 接口加赠字段
 * @returns 托底或真实档；皆无则 `null`
 */
export function makingRankDisplayRank(
  makingRank: number | null | undefined,
  boost?: MakingRankBoostSource | null,
): number | null {
  if (boost?.is_boost_rank === true) {
    const floor = positiveRank(boost.boost_rank)
    if (floor != null) return floor
  }
  return positiveRank(makingRank)
}

/** 共建级别 → `A#`；非法或非正返回 emptyLabel。加赠时展示托底档且固定 `(+1)`。 */
export function formatMakingRankLabel(
  rank: number | null | undefined,
  emptyLabel: string,
  boost?: MakingRankBoostSource | null,
): string {
  const n = makingRankDisplayRank(rank, boost)
  if (n == null) return emptyLabel
  return `A${n}${formatMakingRankBoostSuffix(boost)}`
}

/**
 * 加赠后缀。仅 `is_boost_rank` 且托底档 `boost_rank>0` 时返回固定 `(+1)`。
 *
 * @param boost 接口加赠字段
 * @returns `(+1)` 或 `''`
 */
export function formatMakingRankBoostSuffix(boost?: MakingRankBoostSource | null): string {
  if (boost?.is_boost_rank !== true) return ''
  if (positiveRank(boost.boost_rank) == null) return ''
  return '(+1)'
}

/** 把 API 的 presale_rank（S1=1 …）映射为等级表中 0 基行号。 */
export function getPresaleRankHighlightedRows(
  rank: number | undefined,
  rowCount: number,
): number[] {
  if (rank == null || !Number.isFinite(rank) || rank <= 0 || rowCount <= 0) return []
  const index = Math.min(Math.trunc(rank) - 1, rowCount - 1)
  return index >= 0 ? [index] : []
}

/** 按等级取股东提示模板，替换 `{bonus}` 占位；非法等级回退到默认文案。 */
export function formatShareholderHintForRank(
  rank: number,
  template: string,
  fallback: string,
  tierRows: readonly (readonly string[])[],
): string {
  if (!Number.isFinite(rank) || rank <= 0 || rank > tierRows.length) return fallback
  const row = tierRows[rank - 1]
  const bonus = row?.[3]
  if (!bonus || !template) return fallback
  return interpolate(template, { bonus })
}

export type DecimalFraction = 'fixed' | 'natural'

export type FormatDecimalOptions = {
  digits?: number
  /**
   * `fixed`：补足 `digits` 位；`natural`：去掉尾随零（最多 `digits` 位）。
   * 未传时：普通打印 `fixed`；compact 的 K/M 为 `natural`，未缩放为 `fixed`。
   */
  fraction?: DecimalFraction
  prefix?: string
  suffix?: string
  /** `true`：≥1000 → K，≥100 万 → M。默认不切。 */
  compact?: boolean
}

function toFiniteNumber(value: string | number | bigint | null | undefined): number | null {
  if (value == null) return null
  if (typeof value === 'bigint') {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  return parseApiAmount(value)
}

/**
 * 用 `toFixed` 看展示位上的数，专门处理 `999.99999999` → 进位成 1000。
 * 真正打印仍交给 `Intl`，避免二次舍入把 `8.385` 打成 `8.38`。
 */
function displayMagnitude(num: number, digits: number): number {
  if (!Number.isFinite(num)) return num
  if (digits <= 0) return Math.round(num)
  return Number(num.toFixed(digits))
}

function formatFixed(num: number, digits: number, natural: boolean): string {
  return numberFormatter(digits, natural).format(num)
}

function trimsFractionZeros(fraction: DecimalFraction | undefined, unit: '' | 'K' | 'M'): boolean {
  if (fraction === 'natural') return true
  if (fraction === 'fixed') return false
  return unit === 'K' || unit === 'M'
}

/**
 * compact 缩放：与旧 `formatCompact` 同阈值。
 * 先按展示位看会不会进位过档（999.996 → 1K），打印值仍用未二次舍入的缩放结果。
 */
function compactScale(num: number, digits: number): { value: number; unit: '' | 'K' | 'M' } {
  const abs = Math.abs(num)
  let value = num
  let unit: '' | 'K' | 'M' = ''
  if (abs >= 1_000_000) {
    value = num / 1_000_000
    unit = 'M'
  } else if (abs >= 1_000) {
    value = num / 1_000
    unit = 'K'
  }
  if (unit === 'K' && Math.abs(displayMagnitude(value, digits)) >= 1_000) {
    value = num / 1_000_000
    unit = 'M'
  } else if (unit === '' && Math.abs(displayMagnitude(value, digits)) >= 1_000) {
    value = num / 1_000
    unit = 'K'
    if (Math.abs(displayMagnitude(value, digits)) >= 1_000) {
      value = num / 1_000_000
      unit = 'M'
    }
  }
  return { value, unit }
}

/**
 * 人读小数：千分位、小数位、前后缀。
 *
 * 没数 → `--`（不加前后缀）。有数（含 0）→ `prefix + 数字 + suffix`。
 * `compact` 时到 1000 / 100 万切 K / M；K/M 默认自然位，未缩放默认固定位。
 *
 * @param value 数字、bigint，或后端十进制字符串
 * @param options 小数位、固定/自然位、前后缀、是否紧凑
 */
export function formatDecimal(
  value: string | number | bigint | null | undefined,
  options: FormatDecimalOptions = {},
): string {
  const compact = options.compact === true
  const digits = Math.max(0, Math.floor(options.digits ?? (compact ? 2 : 0)))
  const prefix = options.prefix ?? ''
  const suffix = options.suffix ?? ''
  const num = toFiniteNumber(value)
  if (num == null) return LIVE_DATA_PLACEHOLDER

  if (compact) {
    const { value: scaled, unit } = compactScale(num, digits)
    return `${prefix}${formatFixed(scaled, digits, trimsFractionZeros(options.fraction, unit))}${unit}${suffix}`
  }

  return `${prefix}${formatFixed(num, digits, options.fraction === 'natural')}${suffix}`
}

/**
 * 数量 × 单价 → USD。缺数量、缺价、非有限、负价 → `null`；单价 0 是真零。
 *
 * @param amount 代币数量
 * @param priceUsd USD 单价
 */
export function toUsd(
  amount: number | null | undefined,
  priceUsd: number | null | undefined,
): number | null {
  if (amount == null || !Number.isFinite(amount)) return null
  if (priceUsd == null || !Number.isFinite(priceUsd) || priceUsd < 0) return null
  return amount * priceUsd
}

/**
 * 后端金额小数字符串 → number。
 * 空 / 空白 / 非有限数 → `null`。
 */
export function parseApiAmount(raw: string | null | undefined): number | null {
  if (raw == null) return null
  const trimmed = String(raw).trim()
  if (trimmed === '') return null
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : null
}

/**
 * 后端金额字符串 → `formatDecimal`（默认 2 位小数）。
 */
export function formatApiAmount(
  raw: string | null | undefined,
  options: { digits?: number; prefix?: string; suffix?: string } = {},
): string {
  return formatDecimal(raw, {
    digits: options.digits ?? 2,
    prefix: options.prefix,
    suffix: options.suffix,
  })
}

const CONTRIBUTION_DISPLAY_DIGITS = 4

/** 截到 `digits` 位小数（向下舍，不四舍五入）；去逗号。非法 → `null`。 */
function floorApiDecimal(raw: string | null | undefined, digits: number): string | null {
  if (raw == null) return null
  const trimmed = String(raw).trim().replace(/,/g, '')
  if (!trimmed || trimmed.startsWith('-')) return null
  if (!/^\d+(\.\d*)?$/.test(trimmed)) return null
  const [wholePart, fractionPart = ''] = trimmed.split('.')
  return `${wholePart || '0'}.${fractionPart.slice(0, digits)}`
}

/**
 * 后端贡献点数字符串 → 向下舍 4 位再 `formatDecimal`。空 / 非法 → `--`。
 *
 * @param raw 十进制金额字符串
 */
export function formatApiContributionPoints(raw: string | null | undefined): string {
  return formatDecimal(floorApiDecimal(raw, CONTRIBUTION_DISPLAY_DIGITS), {
    digits: CONTRIBUTION_DISPLAY_DIGITS,
  })
}

/** 涨跌百分比——`+412.4%`；空态 → `--`。 */
export function formatPercentChange(value: number | null | undefined, digits = 1): string {
  if (value == null || !Number.isFinite(value)) return LIVE_DATA_PLACEHOLDER
  const sign = value > 0 ? '+' : value < 0 ? '' : '+'
  return formatDecimal(value, { digits, fraction: 'natural', prefix: sign, suffix: '%' })
}

/** 把链上区块时间（unix 秒）格式化为 `YYYY-MM-DD HH:mm`；0 返回 `—`。 */
export function formatBlockTime(timestamp: number): string {
  if (!timestamp) return '—'

  const date = new Date(timestamp * 1000)
  return formatDateTimeParts(date)
}

/** 把后端 ISO 时间格式化为 `YYYY-MM-DD HH:mm`；空值或非法日期返回 `—`。 */
export function formatApiDateTime(iso: string | null): string {
  if (!iso) return '—'

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'

  return formatDateTimeParts(date)
}

function formatDateTimeParts(date: Date): string {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/** 把 ISO 时间格式化为 `YYYY-MM-DD`；空值或非法日期返回 `-`。 */
export function formatRegisterDate(iso: string | null): string {
  if (!iso) return TABLE_EMPTY
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return TABLE_EMPTY

  return date.toISOString().slice(0, 10)
}

/** 社区成员表格地址缩略——4+…+4；默认钱包/交易缩略为 6+…+4。 */
export function formatShortAddress(
  address: string,
  options: { head?: number; tail?: number } = {},
): string {
  const head = options.head ?? 6
  const tail = options.tail ?? 4
  if (address.length < head + tail + 1) return address
  return `${address.slice(0, head)}…${address.slice(-tail)}`
}

/** 折扣 BPS → 百分比文本。默认带负号（横幅）；表内绿列用 `{ signed: false }`。 */
export function formatDiscountBps(discountBps: number, options: { signed?: boolean } = {}): string {
  if (!Number.isFinite(discountBps)) return LIVE_DATA_PLACEHOLDER
  if (discountBps <= 0) return formatDecimal(0, { suffix: '%' })
  return formatDecimal(discountBps / 100, {
    digits: 2,
    fraction: 'natural',
    prefix: options.signed === false ? '' : '-',
    suffix: '%',
  })
}
