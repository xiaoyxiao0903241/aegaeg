const DESIGN_ROOT_PX = 16

/**
 * Convert rem → layout px for JS APIs (Radix sizes, measurements).
 *
 * Uses design root (16) × `--fluid-scale`, NOT live `html` font-size.
 * Browser zoom can inflate `getComputedStyle(...).fontSize`; writing that
 * into SVG/layout attributes double-applies zoom and blows up chrome (e.g. tooltip arrows).
 */
export function rootRemPx(rem: number): number {
  if (typeof document === 'undefined') return rem * DESIGN_ROOT_PX
  const fluid = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--fluid-scale').trim(),
  )
  const scale = Number.isFinite(fluid) && fluid > 0 ? fluid : 1
  return rem * DESIGN_ROOT_PX * scale
}

/** Read a CSS custom property in rem/px and return layout pixels (zoom-safe). */
export function cssRemVarPx(name: string, fallbackRem: number): number {
  if (typeof document === 'undefined') return rootRemPx(fallbackRem)
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (raw.endsWith('rem')) return rootRemPx(parseFloat(raw))
  if (raw.endsWith('px')) return parseFloat(raw)
  return rootRemPx(fallbackRem)
}
