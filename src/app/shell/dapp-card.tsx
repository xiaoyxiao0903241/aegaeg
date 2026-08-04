import type { ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

/** Left-column outlined card (`p-3.5` / `rounded-md`); stack gap defaults to `gap-2`. */
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
