import { type ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from '~/shared/lib/utils'

/**
 * 高度 + 透明度缓动显隐。
 *
 * 复用 `dapp-collapsible-*`（grid 0fr→1fr）；关闭结束后卸载，避免 flex `gap` 残留空档。
 *
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
  const [mounted, setMounted] = useState(open)
  const [expanded, setExpanded] = useState(open)
  const openRef = useRef(open)
  openRef.current = open

  useEffect(() => {
    if (open) {
      setMounted(true)
      return
    }
    setExpanded(false)
  }, [open])

  useEffect(() => {
    if (!mounted || !open) return
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (openRef.current) setExpanded(true)
      })
    })
    return () => cancelAnimationFrame(id)
  }, [mounted, open])

  if (!mounted) return null

  return (
    <div
      aria-hidden={!expanded}
      className={cn('dapp-collapsible-body', className)}
      data-open={expanded ? 'true' : 'false'}
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.propertyName !== 'grid-template-rows') return
        if (!openRef.current) setMounted(false)
      }}
    >
      <div className="dapp-collapsible-inner">{children}</div>
    </div>
  )
}
