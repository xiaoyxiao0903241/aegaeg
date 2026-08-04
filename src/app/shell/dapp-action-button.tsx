import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { Button } from '~/shared/components/button'
import { cn } from '~/shared/lib/utils'

/**
 * DApp primary CTA wrapper.
 * density → height:
 *   inverse 38 · card 42 · external 52 · modal 46 · hero 48
 * external = Button lg + py-4 + text-base/leading-5 合成（稿 bigBtn 52；禁 h-[52px]）
 * Field-adjacent actions (MAX / Bind) → FieldActionChip.
 * Header / topbar Connect stays Button `sm` (36) — not this density map.
 * Home hero uses Button `size="lg"` (48) directly — same height as density="hero".
 */
type DappActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  /**
   * card = white-card CTA · external = widget stack bigBtn · inverse = dark promo ·
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
  const size = density === 'hero' || density === 'external' ? 'lg' : 'sm'

  return (
    <Button
      aria-busy={loading || undefined}
      className={cn(
        'gap-2',
        density === 'card' && 'min-h-10.5',
        density === 'inverse' && 'min-h-9.5 text-xs',
        density === 'modal' && 'min-h-11.5',
        density === 'external' && 'min-h-0 py-4 text-base leading-5',
        density === 'hero' && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      size={size}
      type={type}
      variant={variant}
      {...props}
    >
      {loading ? (
        <Loader2 aria-hidden className="size-4 shrink-0 animate-spin" strokeWidth={2} />
      ) : null}
      {children}
    </Button>
  )
}
