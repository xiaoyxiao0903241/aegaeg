import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatGroupedNumber } from '~/shared/api/format-display'

export function parseApiAmount(raw: string | undefined): number {
  if (raw == null || raw.trim() === '') return 0
  const n = Number(raw)
  return Number.isFinite(n) ? n : 0
}

export function formatAsideAgxLabel(amount: number): string {
  return formatGroupedNumber(amount, { digits: 2, suffix: ' AGX' })
}

export function formatAsideGagxLabel(amount: number): string {
  return formatGroupedNumber(amount, { digits: 2, suffix: ' gAGX' })
}

export function formatAsideXLabel(amount: number): string {
  return formatGroupedNumber(amount, { digits: 2, suffix: ' X' })
}

export function formatAsideRebasePct(rate1e18: bigint | null | undefined): string {
  const zero = `${formatGroupedNumber(0, { digits: 2 })}%`
  if (rate1e18 == null) return zero
  const pct = formatTokenAmountToNumber(rate1e18, 18)
  if (!Number.isFinite(pct)) return zero
  return `${formatGroupedNumber(pct, { digits: 2 })}%`
}
