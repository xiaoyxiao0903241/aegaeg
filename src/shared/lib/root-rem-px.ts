/** Convert rem to px using current `html` root font-size (site-fluid). */
export function rootRemPx(rem: number): number {
  if (typeof document === 'undefined') return rem * 16
  const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize)
  return rem * (Number.isFinite(rootPx) ? rootPx : 16)
}

/** Read a CSS custom property in rem/px and return computed pixels. */
export function cssRemVarPx(name: string, fallbackRem: number): number {
  if (typeof document === 'undefined') return rootRemPx(fallbackRem)
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (raw.endsWith('rem')) return rootRemPx(parseFloat(raw))
  if (raw.endsWith('px')) return parseFloat(raw)
  return rootRemPx(fallbackRem)
}
