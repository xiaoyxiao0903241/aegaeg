import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button } from '~/shared/ui/button'
import { ButtonLoadingIcon } from '~/shared/ui/button-loading-icon'
import { cn } from '~/shared/lib/utils'

/**
 * DApp primary CTA wrapper.
 * density → height SSOT: card 42 · external 44 · inverse (dark promo) 38.
 * Field-adjacent actions (MAX / Bind) → Chip soft coral + `fieldActionChipClass`, not this.
 */
type DappActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  /** card = in outlined/elevated card; external = widget stack / page; inverse = dark promo */
  density?: 'card' | 'external' | 'inverse'
  loading?: boolean
  variant?: 'primary' | 'secondary'
}

export function DappActionButton({
  children,
  className,
  density = 'card',
  disabled,
  loading = false,
  type = 'button',
  variant = 'primary',
  ...props
}: DappActionButtonProps) {
  const size = density === 'external' ? 'md' : 'sm'

  return (
    <Button
      aria-busy={loading || undefined}
      className={cn('gap-2', density === 'inverse' && 'min-h-9.5 text-xs', className)}
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
