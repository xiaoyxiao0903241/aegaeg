import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '~/shared/lib/utils'
import { Button } from '~/shared/ui/button'
import { ButtonLoadingIcon } from '~/shared/ui/button-loading-icon'

/**
 * DApp primary CTA wrapper.
 * density → height:
 *   inverse 38 · card 42 · external 44 · modal 46 · hero 48
 * Field-adjacent actions (MAX / Bind) → FieldActionChip.
 * Header / topbar Connect stays Button `sm` (36) — not this density map.
 * Home hero uses Button `size="lg"` (48) directly — same height as density="hero".
 */
type DappActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  /**
   * card = white-card CTA · external = widget stack · inverse = dark promo ·
   * modal = dialog footer · hero = community / page banner CTA (≡ Button lg)
   */
  density?: 'card' | 'external' | 'inverse' | 'modal' | 'hero'
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
  const size = density === 'hero' ? 'lg' : density === 'external' ? 'md' : 'sm'

  return (
    <Button
      aria-busy={loading || undefined}
      className={cn(
        'gap-2',
        density === 'card' && 'min-h-10.5',
        density === 'inverse' && 'min-h-9.5 text-xs',
        density === 'modal' && 'min-h-11.5',
        density === 'hero' && 'w-full',
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
