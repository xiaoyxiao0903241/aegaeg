import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

export function DappActionRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'mt-3.5 grid shrink-0 grid-cols-2 gap-[9px] max-dapp:mt-3',
        className,
      )}
    >
      {children}
    </div>
  )
}
