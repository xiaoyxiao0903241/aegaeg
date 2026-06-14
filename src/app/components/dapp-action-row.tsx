import type { ReactNode } from 'react'
import { dappLayout } from '../../components/primitive-styles'
import { cn } from '~/lib/utils'

export function DappActionRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn(dappLayout.actionRow, className)}>{children}</div>
}
