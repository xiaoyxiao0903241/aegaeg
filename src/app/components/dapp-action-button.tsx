import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ButtonLoadingIcon } from '../../components/button-loading-icon'
import { dappButtonClass } from '../../components/primitive-styles'
import { cn } from '~/lib/utils'

type DappActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  loading?: boolean
  shape?: 'pill' | 'inline'
  variant?: 'primary' | 'secondary'
}

export function DappActionButton({
  children,
  className,
  disabled,
  loading = false,
  shape = 'pill',
  type = 'button',
  variant = 'primary',
  ...props
}: DappActionButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      className={cn(
        dappButtonClass('action', variant === 'primary' ? 'primary' : 'secondary'),
        'gap-2',
        shape === 'inline' &&
          cn(
            '!w-auto shrink-0 !min-h-11 !rounded-[11px] !px-[15px] !text-[12px] !font-semibold !tracking-[-0.24px]',
            variant === 'secondary' &&
              '!border-transparent !bg-accent !text-primary hover:!-translate-y-0 hover:!shadow-none focus-visible:!-translate-y-0 focus-visible:!shadow-none',
          ),
        className,
      )}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? <ButtonLoadingIcon /> : null}
      {children}
    </button>
  )
}
