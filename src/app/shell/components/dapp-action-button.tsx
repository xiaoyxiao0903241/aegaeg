import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button } from '~/shared/ui/button'
import { ButtonLoadingIcon } from '~/shared/ui/button-loading-icon'
import { cn } from '~/shared/lib/utils'

/**
 * DApp primary CTA wrapper.
 * density → height SSOT: card 42 · external 44 · inverse (dark promo) 38.
 */
type DappActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  /** card = in outlined/elevated card; external = widget stack / page; inverse = dark promo */
  density?: 'card' | 'external' | 'inverse'
  loading?: boolean
  shape?: 'pill' | 'inline'
  variant?: 'primary' | 'secondary'
}

export function DappActionButton({
  children,
  className,
  density = 'card',
  disabled,
  loading = false,
  shape = 'pill',
  type = 'button',
  variant = 'primary',
  ...props
}: DappActionButtonProps) {
  const size = density === 'external' ? 'md' : 'sm'

  return (
    <Button
      aria-busy={loading || undefined}
      className={cn(
        'gap-2',
        density === 'inverse' && 'min-h-9.5 text-xs',
        shape === 'inline' &&
          cn(
            '!w-auto shrink-0 !min-h-[2.625rem] !rounded-sm !px-3.5 !text-xs !font-semibold',
            variant === 'secondary' &&
              '!border-transparent !bg-accent !text-primary hover:!-translate-y-0 hover:!shadow-none focus-visible:!-translate-y-0 focus-visible:!shadow-none',
          ),
        className,
      )}
      disabled={disabled || loading}
      size={size}
      type={type}
      variant={variant}
      {...props}
    >
      {loading ? <ButtonLoadingIcon /> : null}
      {children}
    </Button>
  )
}
