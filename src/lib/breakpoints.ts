/** DApp / Home layout split — keep in sync with `theme.css` `--breakpoint-dapp`. */
export const BREAKPOINT_DAPP_PX = 821

/** 设计基准宽（根字号 16px）；PC 缩放阶梯从此起算。 */
export const BREAKPOINT_DESIGN_BASE_PX = 1920

/** 根字号阶梯 1920→3840 — 与 `breakpoint-scale.css` 同步。 */
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

/** @deprecated 用 `BREAKPOINT_DESIGN_BASE_PX` */
export const BREAKPOINT_ULTRA_WIDE_PX = BREAKPOINT_DESIGN_BASE_PX

/** Raw `@media` rules cannot use CSS variables — use this constant in comments / tooling only. */
export const BREAKPOINT_DAPP_MAX_PX = BREAKPOINT_DAPP_PX - 1

export const MOBILE_MAX_WIDTH_QUERY = `(max-width: ${BREAKPOINT_DAPP_MAX_PX}px)` as const

export const DESKTOP_MIN_WIDTH_QUERY = `(min-width: ${BREAKPOINT_DAPP_PX}px)` as const

export const ULTRA_WIDE_MIN_WIDTH_QUERY = `(min-width: ${BREAKPOINT_DESIGN_BASE_PX}px)` as const

export const ULTRA_WIDE_XL_MIN_WIDTH_QUERY =
  `(min-width: ${BREAKPOINT_ULTRA_WIDE_SCALE[BREAKPOINT_ULTRA_WIDE_SCALE.length - 1].minWidthPx}px)` as const
