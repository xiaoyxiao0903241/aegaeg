import type { ReactNode } from 'react'

import { cn } from '~/shared/lib/utils'

/**
 * CTA row under widget forms.
 * 1 child → full width; 2+ children → equal columns (Figma single bigBtn / dual CTAs).
 */
export function DappActionRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('grid shrink-0 grid-cols-1 gap-2 has-[>:nth-child(2)]:grid-cols-2', className)}
    >
      {children}
    </div>
  )
}
