import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '~/shared/lib/utils'

/**
 * Detail-column block rhythm — PC 34 / H5 24.
 * Prefer this over raw `<section className="mt-…">`.
 * `DappDetailPage` zeros first-child margin.
 */
export function DappDetailBlock({
  children,
  className,
  ...props
}: {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn('mt-8.5 max-dapp:mt-6', className)} {...props}>
      {children}
    </section>
  )
}
