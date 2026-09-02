type ViewportBox = {
  left: number
  top: number
  width: number
  height: number
}

/**
 * 把锚点浮层收进视口：优先贴触发器右侧、下方不够则翻到上方，
 * 宽高超出时缩小，避免 H5 小屏和键盘挤出屏幕。
 */
export function clampAnchoredPopover(args: {
  trigger: { top: number; right: number; bottom: number }
  panelWidth: number
  panelHeight: number
  gap: number
  padding: number
  viewport: ViewportBox
}): { top: number; left: number; width: number; maxHeight: number } {
  const { trigger, gap, padding, viewport } = args
  const maxWidth = Math.max(0, viewport.width - padding * 2)
  const width = Math.min(args.panelWidth, maxWidth)
  const maxHeight = Math.max(0, viewport.height - padding * 2)
  const height = Math.min(args.panelHeight, maxHeight)

  const spaceBelow = viewport.top + viewport.height - padding - trigger.bottom
  const spaceAbove = trigger.top - viewport.top - padding
  const placeBelow = spaceBelow >= height + gap || spaceBelow >= spaceAbove

  let top = placeBelow ? trigger.bottom + gap : trigger.top - gap - height
  const minTop = viewport.top + padding
  const maxTop = viewport.top + viewport.height - padding - height
  top = Math.min(Math.max(minTop, top), Math.max(minTop, maxTop))

  let left = trigger.right - width
  const minLeft = viewport.left + padding
  const maxLeft = viewport.left + viewport.width - padding - width
  left = Math.min(Math.max(minLeft, left), Math.max(minLeft, maxLeft))

  return { top, left, width, maxHeight }
}
