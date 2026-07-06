import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card, type CardProps } from '~/shared/ui/card'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

const widgetPromoCard = tv({
  base: [
    revealClass(),
    'grid gap-1 px-4.5 py-4',
    'max-dapp:gap-1.5 max-dapp:rounded-2xl max-dapp:px-4.5 max-dapp:py-4',
  ],
})

export function WidgetPromoCard({
  children,
  className,
  ...props
}: Omit<CardProps, 'children' | 'tone'> & { children: ReactNode }) {
  return (
    <Card
      as="section"
      tone="dark"
      className={cn(widgetPromoCard(), className)}
      data-reveal
      {...props}
    >
      {children}
    </Card>
  )
}
