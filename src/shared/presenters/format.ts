/** 表格空单元格 / 未知值的占位符（ASCII 连字符，不用破折号）。 */
export const TABLE_EMPTY = '-'

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
  return template.replace('{bonus}', bonus)
}

export type FormatNumberOptions = {
  digits?: number
  /** 默认 `false`（补足位数）。`true` 允许少于 `digits` 个尾随零。 */
  trimZeros?: boolean
  prefix?: string
  suffix?: string
}

/**
 * 人读数字（千分位 + 精度 + 前后缀）——展示唯一核心。
 * 非法值按 digits 回落 `0` / `0.00`。
 */
export function formatNumber(
  value: string | number | bigint,
  options: FormatNumberOptions = {},
): string {
  const digits = Math.max(0, Math.floor(options.digits ?? 0))
  const trimZeros = options.trimZeros === true
  const prefix = options.prefix ?? ''
  const suffix = options.suffix ?? ''
  const num = typeof value === 'bigint' ? Number(value) : Number(value)

  if (!Number.isFinite(num)) {
    const zero = digits > 0 && !trimZeros ? `0.${'0'.repeat(digits)}` : '0'
    return `${prefix}${zero}${suffix}`
  }

  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: trimZeros ? 0 : digits,
  }).format(num)

  return `${prefix}${formatted}${suffix}`
}

export type FormatCompactOptions = {
  /** K/M 缩放后的最大小数位（默认 2，且去掉尾随零）。 */
  digits?: number
  prefix?: string
  suffix?: string
}

/**
 * 紧凑数字：`129K` / `$8.41M`。
 * <1000 补足 digits；≥1e3 → K；≥1e6 → M。
 */
export function formatCompact(
  value: string | number | bigint,
  options: FormatCompactOptions = {},
): string {
  const digits = Math.max(0, Math.floor(options.digits ?? 2))
  const prefix = options.prefix ?? ''
  const suffix = options.suffix ?? ''
  const num = typeof value === 'bigint' ? Number(value) : Number(value)

  if (!Number.isFinite(num)) {
    const zero = digits > 0 ? `0.${'0'.repeat(digits)}` : '0'
    return `${prefix}${zero}${suffix}`
  }

  const abs = Math.abs(num)
  if (abs >= 1_000_000) {
    return `${prefix}${formatNumber(num / 1_000_000, { digits, trimZeros: true })}M${suffix}`
  }
  if (abs >= 1_000) {
    return `${prefix}${formatNumber(num / 1_000, { digits, trimZeros: true })}K${suffix}`
  }
  return `${prefix}${formatNumber(num, { digits, trimZeros: false })}${suffix}`
}

/**
 * 已是 USD 的金额 → `$…`；≥1000 时自动 K/M。
 * 空 / NaN → `$0.00`。
 */
export function formatUsd(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return formatNumber(0, { digits: 2, prefix: '$' })
  }
  if (Math.abs(value) < 1_000) {
    return formatNumber(value, { digits: 2, prefix: '$' })
  }
  return formatCompact(value, { digits: 2, prefix: '$' })
}

/**
 * 代币数量 × USD 单价 → `≈ $…`。
 * `compact: true` 时 ≥1000 用 K/M。
 * 缺失 / NaN / 无价格 → `≈ $0.00`。
 */
export function formatUsdApprox(
  amount: number,
  priceUsd: number | null,
  options: { compact?: boolean } = {},
): string {
  if (!Number.isFinite(amount) || priceUsd == null || priceUsd <= 0) {
    return formatNumber(0, { digits: 2, prefix: '≈ $' })
  }
  const usd = amount * priceUsd
  if (options.compact && Math.abs(usd) >= 1_000) {
    return formatCompact(usd, { digits: 2, prefix: '≈ $' })
  }
  return formatNumber(usd, { digits: 2, prefix: '≈ $' })
}

/**
 * 后端金额小数字符串 → number。
 * 空 / 空白 / 非有限数 → `null`；需要 0 兜底时写 `parseApiAmount(raw) ?? 0`。
 */
export function parseApiAmount(raw: string | null | undefined): number | null {
  if (raw == null) return null
  const trimmed = String(raw).trim()
  if (trimmed === '') return null
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : null
}

/**
 * 后端金额字符串 → 人读数字（千分位 + 前后缀）。
 * 空 / 非数字兜底 0。
 */
export function formatApiAmount(
  raw: string | null | undefined,
  options: { digits?: number; prefix?: string; suffix?: string } = {},
): string {
  const digits = options.digits ?? 2
  const n = parseApiAmount(raw) ?? 0
  return formatNumber(n, {
    digits,
    prefix: options.prefix,
    suffix: options.suffix,
  })
}

/** 涨跌百分比——`+412.4%`；空态 → `+0.0%`。 */
export function formatPercentChange(value: number | null | undefined, digits = 1): string {
  if (value == null || !Number.isFinite(value)) {
    return `+${formatNumber(0, { digits })}%`
  }
  const sign = value > 0 ? '+' : value < 0 ? '' : '+'
  return `${sign}${formatNumber(value, { digits, trimZeros: true })}%`
}

/** 把链上区块时间（unix 秒）格式化为 `MM-DD HH:mm`；0 返回 `—`。 */
export function formatBlockTime(timestamp: number): string {
  if (!timestamp) return '—'

  const date = new Date(timestamp * 1000)
  return formatDateTimeParts(date)
}

/** 把后端 ISO 时间格式化为 `MM-DD HH:mm`；空值或非法日期返回 `—`。 */
export function formatApiDateTime(iso: string | null): string {
  if (!iso) return '—'

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'

  return formatDateTimeParts(date)
}

function formatDateTimeParts(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${month}-${day} ${hours}:${minutes}`
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

/** 折扣 BPS → 百分比文本（如 `-1.5%`）；非法或非正返回 `0%`。 */
export function formatDiscountBps(discountBps: number): string {
  if (!Number.isFinite(discountBps) || discountBps <= 0) return '0%'
  return `-${discountBps / 100}%`
}
