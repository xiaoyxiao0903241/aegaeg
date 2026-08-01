/** Empty / unknown placeholder for table cells (ASCII hyphen, not em dash). */
export const TABLE_EMPTY = '-'

export function formatPresaleRank(rank: number): string {
  if (!Number.isFinite(rank) || rank <= 0) return 'S0'
  return `S${rank}`
}

/** Community member table — missing rank or S0 shows `-`, otherwise S1–S10. */
export function formatTableGenesisRank(rank: number | undefined | null): string {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return TABLE_EMPTY
  return `S${Math.trunc(rank)}`
}

/** Maps API presale_rank (S1=1 …) to 0-based row indices in the tier table. */
export function getPresaleRankHighlightedRows(
  rank: number | undefined,
  rowCount: number,
): number[] {
  if (rank == null || !Number.isFinite(rank) || rank <= 0 || rowCount <= 0) return []
  const index = Math.min(Math.trunc(rank) - 1, rowCount - 1)
  return index >= 0 ? [index] : []
}

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

export type FormatGroupedNumberOptions = {
  digits?: number
  /** Default `false` (pad). `true` allows fewer than `digits` trailing zeros. */
  trimZeros?: boolean
  prefix?: string
  suffix?: string
}

/** Human-readable grouped number — single display core for fiat/count shells. */
export function formatGroupedNumber(
  value: string | number | bigint,
  options: FormatGroupedNumberOptions = {},
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

/**
 * Token amount × USD price → `≈ $x.xx`.
 * Missing / NaN / no price → `≈ $0.00` (empty-state SSOT; no em dash).
 */
export function formatApproxUsd(amount: number, priceUsd: number | null): string {
  if (!Number.isFinite(amount) || priceUsd == null || priceUsd <= 0) {
    return formatGroupedNumber(0, { digits: 2, prefix: '≈ $' })
  }
  return formatGroupedNumber(amount * priceUsd, { digits: 2, prefix: '≈ $' })
}

export type FormatCompactNumberOptions = {
  /** Max fraction digits after K/M scale (default 2, trimmed). */
  digits?: number
  prefix?: string
  suffix?: string
}

/**
 * Compact display for hub tiles / chart shells — Figma `129K` / `$8.41M`.
 * Below 1000 stays grouped **and pads** `digits`（空态 `0.00`）；≥1e3 → K；≥1e6 → M.
 * Empty/NaN → `0`/`0.00` (+ prefix/suffix，视 digits).
 */
export function formatCompactNumber(
  value: string | number | bigint,
  options: FormatCompactNumberOptions = {},
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
    return `${prefix}${formatGroupedNumber(num / 1_000_000, { digits, trimZeros: true })}M${suffix}`
  }
  if (abs >= 1_000) {
    return `${prefix}${formatGroupedNumber(num / 1_000, { digits, trimZeros: true })}K${suffix}`
  }
  // <1k：补足 digits（空态 `0.00 AGX` / `$65.00`）；K/M 档仍 trim。
  return `${prefix}${formatGroupedNumber(num, { digits, trimZeros: false })}${suffix}`
}

/** Chart / tile USD with compact M/K — empty → `$0.00` (pad, no unit). */
export function formatCompactUsd(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return formatGroupedNumber(0, { digits: 2, prefix: '$' })
  }
  if (Math.abs(value) < 1_000) {
    return formatGroupedNumber(value, { digits: 2, prefix: '$' })
  }
  return formatCompactNumber(value, { digits: 2, prefix: '$' })
}

/** `≈ $…` compact twin of {@link formatApproxUsd} for hub TVL/treasury subs. */
export function formatApproxCompactUsd(amount: number, priceUsd: number | null): string {
  if (!Number.isFinite(amount) || priceUsd == null || priceUsd <= 0) {
    return formatGroupedNumber(0, { digits: 2, prefix: '≈ $' })
  }
  const usd = amount * priceUsd
  if (Math.abs(usd) < 1_000) {
    return formatGroupedNumber(usd, { digits: 2, prefix: '≈ $' })
  }
  return formatCompactNumber(usd, { digits: 2, prefix: '≈ $' })
}

/** Signed percent for chart delta — Figma `+412.4%`; empty → `+0.0%`. */
export function formatSignedPercent(value: number | null | undefined, digits = 1): string {
  if (value == null || !Number.isFinite(value)) {
    return `+${formatGroupedNumber(0, { digits })}%`
  }
  const sign = value > 0 ? '+' : value < 0 ? '' : '+'
  return `${sign}${formatGroupedNumber(value, { digits, trimZeros: true })}%`
}

export function formatBlockTime(timestamp: number): string {
  if (!timestamp) return '—'

  const date = new Date(timestamp * 1000)
  return formatDateTimeParts(date)
}

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

export function formatRegisterDate(iso: string | null): string {
  if (!iso) return TABLE_EMPTY
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return TABLE_EMPTY

  return date.toISOString().slice(0, 10)
}

/** Community member table address — 4+…+4. Default wallet/tx shorten is 6+…+4. */
export function formatShortAddress(
  address: string,
  options: { head?: number; tail?: number } = {},
): string {
  const head = options.head ?? 6
  const tail = options.tail ?? 4
  if (address.length < head + tail + 1) return address
  return `${address.slice(0, head)}…${address.slice(-tail)}`
}

export function formatDiscountBps(discountBps: number): string {
  if (!Number.isFinite(discountBps) || discountBps <= 0) return '0%'
  return `-${discountBps / 100}%`
}
