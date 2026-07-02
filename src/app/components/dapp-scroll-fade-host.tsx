import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

/** PC 左右 panel 外层：内层子元素负责 scroll，overlay 固定在上/下缘。 */
export function DappScrollFadeHost({
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
