export function stripTokenAmountGrouping(value: string): string {
  return value.replace(/,/g, '')
}

function formatIntegerGrouping(digits: string): string {
  if (!digits) return '0'
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

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
  const normalizedWhole =
    wholePart === '' ? '0' : wholePart.replace(/^0+(?=\d)/, '') || '0'
  const groupedWhole = formatIntegerGrouping(normalizedWhole)

  if (hasTrailingDot && fractionPart === '') {
    return `${groupedWhole}.`
  }

  if (fractionPart === '') {
    return groupedWhole
  }

  return `${groupedWhole}.${fractionPart}`
}

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

export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  maxFractionDigits = 4,
): string {
  if (amount === 0n) return '0'

  const divisor = 10n ** BigInt(decimals)
  const whole = amount / divisor
  const fraction = amount % divisor
  const groupedWhole = formatIntegerGrouping(whole.toString())

  if (fraction === 0n) return groupedWhole

  const fractionText = fraction.toString().padStart(decimals, '0').replace(/0+$/, '')
  const trimmed = fractionText.slice(0, maxFractionDigits).replace(/0+$/, '')

  return trimmed ? `${groupedWhole}.${trimmed}` : groupedWhole
}

/** Parse a token amount to a plain number without grouping separators.
 *  Only use when downstream code needs a number (e.g. arithmetic / comparisons).
 *  Prefer `formatTokenAmount` for display.
 */
export function formatTokenAmountToNumber(amount: bigint, decimals: number): number {
  return Number(amount) / 10 ** decimals
}

export function slippagePercentToBps(percent: number): number {
  return Math.round(percent * 100)
}

export function sanitizeTokenAmountInput(
  value: string,
  maxFractionDigits: number,
): string {
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
  const normalizedWhole =
    wholePart === '' ? '0' : wholePart.replace(/^0+(?=\d)/, '')

  if (hasTrailingDot && fractionPart === '') {
    return `${normalizedWhole}.`
  }

  if (fractionPart === '') {
    return normalizedWhole
  }

  return `${normalizedWhole}.${fractionPart}`
}

export function capTokenAmountInput(
  value: string,
  maxAmount: bigint,
  decimals: number,
  maxFractionDigits = 6,
): string {
  const fractionLimit = Math.min(decimals, maxFractionDigits)
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

  return formatTokenAmount(maxAmount, decimals, maxFractionDigits)
}
