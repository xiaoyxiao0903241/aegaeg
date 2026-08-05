import type { ReactNode } from 'react'

import { cn } from '~/shared/lib/utils'

/**
 * PC 左右内容面板的外层容器：子元素负责滚动，
 * 上下边缘各放一个固定淡出遮罩，滚动时内容渐隐渐显。
 */
export function ScrollFadeHost({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'dapp-scroll-fade-host max-dapp:contents',
        'dapp:relative dapp:h-full dapp:max-h-full dapp:min-h-0 dapp:min-w-0',
        className,
      )}
    >
      {children}
      <div aria-hidden className="dapp-scroll-fade-edge dapp-scroll-fade-edge-top" />
      <div aria-hidden className="dapp-scroll-fade-edge dapp-scroll-fade-edge-bottom" />
    </div>
  )
}
