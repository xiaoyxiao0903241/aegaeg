/** DApp 与首页布局分界——须与 theme.css 的 `--breakpoint-dapp` 保持一致。 */
export const BREAKPOINT_DAPP_PX = 821

/**
 * 响应式断点基准——CSS @media 字面量须与以下保持同步：
 * - `tokens/theme.css`——site-fluid 与移动端排版
 * - `legacy-breakpoints.css`——@custom-variant
 */
export const BREAKPOINT_DESIGN_BASE_PX = 1920

/** site-fluid 连续缩放的上限宽度（CSS px，达到缩放上限时的宽度）。 */
export const BREAKPOINT_FLUID_MAX_WIDTH_PX = 3840

export const BREAKPOINT_FLUID_MIN_ROOT_PX = 16

export const BREAKPOINT_FLUID_MAX_ROOT_PX = 48

/** `--fluid-scale` 在 `BREAKPOINT_FLUID_MAX_WIDTH_PX` 处取值（设计根字号的 3 倍）。 */
export const BREAKPOINT_FLUID_MAX_SCALE = 3

/**
 * site-fluid 端点（两者之间在 theme.css 中连续插值）。
 * 保留为两行表格，供文档 / knip / 单元测试契约使用。
 */
export const BREAKPOINT_ULTRA_WIDE_SCALE = [
  { minWidthPx: BREAKPOINT_DESIGN_BASE_PX, rootFontSizePx: BREAKPOINT_FLUID_MIN_ROOT_PX },
  { minWidthPx: BREAKPOINT_FLUID_MAX_WIDTH_PX, rootFontSizePx: BREAKPOINT_FLUID_MAX_ROOT_PX },
] as const

export const BREAKPOINT_TABLET_MAX_PX = 1100

export const BREAKPOINT_NARROW_MAX_PX = 520

/** 原生 `@media` 规则无法使用 CSS 变量——仅用于注释与工具链中的常量。 */
export const BREAKPOINT_DAPP_MAX_PX = BREAKPOINT_DAPP_PX - 1

export const MOBILE_MAX_WIDTH_QUERY = `(max-width: ${BREAKPOINT_DAPP_MAX_PX}px)` as const
