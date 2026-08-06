import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { Card, type CardProps } from '~/shared/components/card'
import { cn, revealClass } from '~/shared/lib/utils'

const widgetPromoCard = tv({
  base: [
    revealClass(),
    'grid gap-1 px-4.5 py-4',
    'max-dapp:rounded-2xl max-dapp:px-4.5 max-dapp:py-4',
  ],
})

/**
 * 深色促销卡片
 *
 * 反色表面，用于活动 / 推广区块；带进场动画。
 */
export function WidgetPromoCard({
  children,
  className,
  ...props
}: Omit<CardProps, 'children' | 'tone'> & { children: ReactNode }) {
  return (
    <Card
      as="section"
      surface="inverse"
      className={cn(widgetPromoCard(), className)}
      data-reveal
      {...props}
    >
      {children}
    </Card>
  )
}
