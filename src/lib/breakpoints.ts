/** DApp / Home layout split — keep in sync with `theme.css` `--breakpoint-dapp`. */
export const BREAKPOINT_DAPP_PX = 821

/** Raw `@media` rules cannot use CSS variables — use this constant in comments / tooling only. */
export const BREAKPOINT_DAPP_MAX_PX = BREAKPOINT_DAPP_PX - 1

export const MOBILE_MAX_WIDTH_QUERY = `(max-width: ${BREAKPOINT_DAPP_MAX_PX}px)` as const

export const DESKTOP_MIN_WIDTH_QUERY = `(min-width: ${BREAKPOINT_DAPP_PX}px)` as const
