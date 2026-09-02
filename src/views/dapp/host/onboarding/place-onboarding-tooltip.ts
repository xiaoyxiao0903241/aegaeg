/** 视口内轴对齐矩形（viewport 坐标）。 */
export type ViewRect = {
  top: number
  left: number
  width: number
  height: number
}

export type ViewSize = {
  width: number
  height: number
}

export type TooltipSide = 'right' | 'left' | 'bottom' | 'top'

export type PlaceOnboardingTooltipInput = {
  target: ViewRect
  tooltip: ViewSize
  viewport: ViewSize
  /** 目标与气泡间距 */
  gap?: number
  /** 视口内边距 */
  margin?: number
  preferredSides?: readonly TooltipSide[]
}

export type PlaceOnboardingTooltipResult = {
  top: number
  left: number
  side: TooltipSide
}

const DEFAULT_SIDES: readonly TooltipSide[] = ['right', 'left', 'bottom', 'top']

function clamp(n: number, min: number, max: number): number {
  if (max < min) return min
  return Math.min(Math.max(n, min), max)
}

function candidateForSide(
  side: TooltipSide,
  target: ViewRect,
  tooltip: ViewSize,
  gap: number,
): { top: number; left: number } {
  const midY = target.top + target.height / 2 - tooltip.height / 2
  const midX = target.left + target.width / 2 - tooltip.width / 2

  switch (side) {
    case 'right':
      return { left: target.left + target.width + gap, top: midY }
    case 'left':
      return { left: target.left - gap - tooltip.width, top: midY }
    case 'bottom':
      return { left: midX, top: target.top + target.height + gap }
    case 'top':
      return { left: midX, top: target.top - gap - tooltip.height }
  }
}

function overflowArea(
  left: number,
  top: number,
  tooltip: ViewSize,
  viewport: ViewSize,
  margin: number,
): number {
  const minLeft = margin
  const minTop = margin
  const maxLeft = viewport.width - margin - tooltip.width
  const maxTop = viewport.height - margin - tooltip.height

  const dx = left < minLeft ? minLeft - left : left > maxLeft ? left - maxLeft : 0
  const dy = top < minTop ? minTop - top : top > maxTop ? top - maxTop : 0
  return dx * dx + dy * dy
}

/**
 * 为引导气泡计算视口内坐标：按偏好侧尝试，溢出则翻转，最后 clamp。
 *
 * @returns 气泡左上角与最终采用的侧
 */
export function placeOnboardingTooltip(
  input: PlaceOnboardingTooltipInput,
): PlaceOnboardingTooltipResult {
  const gap = input.gap ?? 12
  const margin = input.margin ?? 16
  const sides = input.preferredSides ?? DEFAULT_SIDES
  const { target, tooltip, viewport } = input

  const maxLeft = Math.max(margin, viewport.width - margin - tooltip.width)
  const maxTop = Math.max(margin, viewport.height - margin - tooltip.height)

  let best: PlaceOnboardingTooltipResult | null = null
  let bestScore = Number.POSITIVE_INFINITY

  for (const side of sides) {
    const raw = candidateForSide(side, target, tooltip, gap)
    const score = overflowArea(raw.left, raw.top, tooltip, viewport, margin)
    const left = clamp(raw.left, margin, maxLeft)
    const top = clamp(raw.top, margin, maxTop)
    // 无溢出优先；同分保留更靠前的 preferredSides
    if (score < bestScore) {
      bestScore = score
      best = { left, top, side }
      if (score === 0) break
    }
  }

  return best ?? { left: margin, top: margin, side: 'right' }
}
