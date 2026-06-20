import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button } from '~/components/button'
import { ButtonLoadingIcon } from '~/components/button-loading-icon'
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
    <Button
      aria-busy={loading || undefined}
      className={cn(
        'gap-2',
        shape === 'inline' &&
          cn(
            '!w-auto shrink-0 !min-h-11 !rounded-sm !px-3.5 !text-xs !font-semibold !tracking-[-0.24px]',
            variant === 'secondary' &&
              '!border-transparent !bg-accent !text-primary hover:!-translate-y-0 hover:!shadow-none focus-visible:!-translate-y-0 focus-visible:!shadow-none',
          ),
        className,
      )}
      disabled={disabled || loading}
      size="sm"
      type={type}
      variant={variant}
      {...props}
    >
      {loading ? <ButtonLoadingIcon /> : null}
      {children}
    </Button>
  )
}
