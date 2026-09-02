/**
 * 可领未读红点（导航与 Hub 入口卡共用）。
 *
 * 绝对定位在容器右上角；容器需 `relative`。
 */
export function ClaimableDot() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-0 right-0 z-1 size-2.5 rounded-full bg-destructive"
    />
  )
}
