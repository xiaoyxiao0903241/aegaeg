/** DApp / Home layout split — keep in sync with `theme.css` `--breakpoint-dapp`. */
export const BREAKPOINT_DAPP_PX = 821

/**
 * Responsive breakpoints — CSS @media literals must stay in sync with:
 * - `tokens/theme.css` — site-fluid + H5 typography
 * - `legacy-breakpoints.css` — @custom-variant
 */
export const BREAKPOINT_DESIGN_BASE_PX = 1920

/** site-fluid continuous clamp — min width (CSS px) at scale 1 / 16px root. */
export const BREAKPOINT_FLUID_MIN_WIDTH_PX = BREAKPOINT_DESIGN_BASE_PX

/** site-fluid continuous clamp — max width (CSS px) at scale cap. */
export const BREAKPOINT_FLUID_MAX_WIDTH_PX = 3840

export const BREAKPOINT_FLUID_MIN_ROOT_PX = 16

export const BREAKPOINT_FLUID_MAX_ROOT_PX = 48

/** `--fluid-scale` at `BREAKPOINT_FLUID_MAX_WIDTH_PX` (3× design root). */
export const BREAKPOINT_FLUID_MAX_SCALE = 3

/**
 * site-fluid endpoints only (continuous clamp between these in theme.css).
 * Kept as a 2-row table for docs / knip / unit contract.
 */
export const BREAKPOINT_ULTRA_WIDE_SCALE = [
  { minWidthPx: BREAKPOINT_FLUID_MIN_WIDTH_PX, rootFontSizePx: BREAKPOINT_FLUID_MIN_ROOT_PX },
  { minWidthPx: BREAKPOINT_FLUID_MAX_WIDTH_PX, rootFontSizePx: BREAKPOINT_FLUID_MAX_ROOT_PX },
] as const

export const BREAKPOINT_TABLET_MAX_PX = 1100

export const BREAKPOINT_NARROW_MAX_PX = 520

/** Raw `@media` rules cannot use CSS variables — use this constant in comments / tooling only. */
export const BREAKPOINT_DAPP_MAX_PX = BREAKPOINT_DAPP_PX - 1

export const MOBILE_MAX_WIDTH_QUERY = `(max-width: ${BREAKPOINT_DAPP_MAX_PX}px)` as const
