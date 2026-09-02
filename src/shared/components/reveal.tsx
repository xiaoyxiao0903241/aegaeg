import { type ReactNode, useLayoutEffect, useState } from 'react'

import { cn } from '~/shared/lib/utils'

/**
 * 高度 + 透明度缓动显隐。
 *
 * 复用折叠网格动画；关闭结束后卸载，避免 flex `gap` 残留空档。
 * 默认进入时先挂载为收起再展开，让过渡有起点。
 * `open` 变化在 render 期按上一值比较调整（避免 effect 镜像 props）。
 *
 * @see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 * @param open 是否展开
 * @param appear 为 false 时：首次若已 open 则直接展开（默认可见的卡不要进页先收再展）
 * @param children 内容（关闭过渡期内仍挂载）
 */
export function Reveal({
  open,
  appear = true,
  children,
  className,
}: {
  open: boolean
  appear?: boolean
  children: ReactNode
  className?: string
}) {
  // appear 时不 seed `open`：doctor `no-derived-useState`；首帧靠下方 prev 比较同步。
  // appear=false 只拍首次 props，之后仍走 prev 比较，不是每轮镜像。
  const [prevOpen, setPrevOpen] = useState(() => (appear ? false : open))
  const [mounted, setMounted] = useState(() => !appear && open)
  const [expanded, setExpanded] = useState(() => !appear && open)

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
