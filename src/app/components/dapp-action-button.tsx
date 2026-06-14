import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { dappButtonClass } from '../../components/primitive-styles'
import { cn } from '~/lib/utils'

type DappActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

export function DappActionButton({
  children,
  className,
  type = 'button',
  variant = 'primary',
  ...props
}: DappActionButtonProps) {
  return (
    <button
      className={cn(
        dappButtonClass('action', variant === 'primary' ? 'primary' : 'secondary'),
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
