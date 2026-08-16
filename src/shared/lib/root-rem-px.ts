const DESIGN_ROOT_PX = 16

/**
 * 把 rem 换算为布局像素，供 JS API（Radix 尺寸、测量）使用。
 *
 * 使用设计根字号（16）× `--fluid-scale`，而非实时的 `html` 字号。
 * 浏览器缩放会放大 `getComputedStyle(...).fontSize`；若把该值写入
 * SVG/布局属性会二次放大并撑破界面（如 tooltip 箭头）。
 */
function rootRemPx(rem: number): number {
  if (typeof document === 'undefined') return rem * DESIGN_ROOT_PX
  const fluid = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--fluid-scale').trim(),
  )
  const scale = Number.isFinite(fluid) && fluid > 0 ? fluid : 1
  return rem * DESIGN_ROOT_PX * scale
}

/** 读取 rem/px 单位的 CSS 自定义属性，返回布局像素（抗浏览器缩放）。 */
export function cssRemVarPx(name: string, fallbackRem: number): number {
  if (typeof document === 'undefined') return rootRemPx(fallbackRem)
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (raw.endsWith('rem')) return rootRemPx(parseFloat(raw))
  if (raw.endsWith('px')) return parseFloat(raw)
  return rootRemPx(fallbackRem)
}
