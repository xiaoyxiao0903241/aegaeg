import type { ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

/**
 * 左栏描边卡片。
 *
 * 白底描边、无阴影，内部纵向堆叠；滚动进入视口时带进场动画。
 */
export function DappSideCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card
      as="section"
      surface="outlined"
      className={cn(revealClass(), 'flex flex-col gap-2', className)}
      data-reveal
    >
      {children}
    </Card>
  )
}
