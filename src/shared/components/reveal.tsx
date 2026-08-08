import { type ReactNode, useLayoutEffect, useState } from 'react'

import { cn } from '~/shared/lib/utils'

/**
 * 高度 + 透明度缓动显隐。
 *
 * 复用 `dapp-collapsible-*`（grid 0fr→1fr）；关闭结束后卸载，避免 flex `gap` 残留空档。
 *
 * 兼容旧浏览器：进入动画用「先挂载收起 → 双 rAF 再展开」，不依赖 `@starting-style`。
 * `open` 变化在 render 期按 prev 比较调整（React / react-doctor 推荐；禁 effect 镜像 props、禁 render 写 ref）。
 *
 * @see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 * @param open 是否展开
 * @param children 内容（关闭过渡期内仍挂载）
 */
export function Reveal({
  open,
  children,
  className,
}: {
  open: boolean
  children: ReactNode
  className?: string
}) {
  // 故意不 seed `useState(open)`：doctor `no-derived-useState`；首帧靠下方 prev 比较同步。
  const [prevOpen, setPrevOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (open !== prevOpen) {
    setPrevOpen(open)
    setExpanded(false)
    if (open) setMounted(true)
  }

  // 进入动画：挂载为 0fr 后再打开，让 CSS transition 有起点（非 props→state 镜像）
  useLayoutEffect(() => {
    if (!open || !mounted || expanded) return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        setExpanded(true)
      })
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [open, mounted, expanded])

  if (!mounted) return null

  return (
    <div
      aria-hidden={!expanded}
      className={cn('dapp-collapsible-body', className)}
      data-open={expanded ? 'true' : 'false'}
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.propertyName !== 'grid-template-rows') return
        if (!open) setMounted(false)
      }}
    >
      <div className="dapp-collapsible-inner">{children}</div>
    </div>
  )
}
