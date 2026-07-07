/** DApp / Home layout split — keep in sync with `theme.css` `--breakpoint-dapp`. */
export const BREAKPOINT_DAPP_PX = 821

/**
 * 响应式断点 SSOT（CSS @media 字面量须与此文件注释/常量保持同步）：
 * - `legacy-breakpoints.css` — @custom-variant
 * - `breakpoint-scale.css` — 1920→3840 根字号阶梯
 * - `mobile-type-scale.css` — `BREAKPOINT_DAPP_MAX_PX`
 */
export const BREAKPOINT_DESIGN_BASE_PX = 1920

export const BREAKPOINT_ULTRA_WIDE_SCALE = [
  { minWidthPx: 1920, rootFontSizePx: 16 },
  { minWidthPx: 2080, rootFontSizePx: 18 },
  { minWidthPx: 2240, rootFontSizePx: 20 },
  { minWidthPx: 2400, rootFontSizePx: 22 },
  { minWidthPx: 2560, rootFontSizePx: 24 },
  { minWidthPx: 2720, rootFontSizePx: 26 },
  { minWidthPx: 2880, rootFontSizePx: 28 },
  { minWidthPx: 3040, rootFontSizePx: 30 },
  { minWidthPx: 3200, rootFontSizePx: 32 },
  { minWidthPx: 3360, rootFontSizePx: 34 },
  { minWidthPx: 3520, rootFontSizePx: 36 },
  { minWidthPx: 3680, rootFontSizePx: 40 },
  { minWidthPx: 3840, rootFontSizePx: 48 },
] as const

export const BREAKPOINT_TABLET_MAX_PX = 1100

export const BREAKPOINT_NARROW_MAX_PX = 520

/** Raw `@media` rules cannot use CSS variables — use this constant in comments / tooling only. */
export const BREAKPOINT_DAPP_MAX_PX = BREAKPOINT_DAPP_PX - 1

export const MOBILE_MAX_WIDTH_QUERY = `(max-width: ${BREAKPOINT_DAPP_MAX_PX}px)` as const
