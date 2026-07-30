import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { burnExchangeAssets } from '~/app/assets'
import { cn } from '~/shared/lib/utils'

export const exchangeFlipCard = tv({
  variants: {
    flipping: {
      true: 'animate-[exchange-card-flip_var(--motion-dapp-emphasis)_var(--motion-dapp-ease)_both]',
      false: '',
    },
  },
  defaultVariants: {
    flipping: false,
  },
})

const exchangeFlowButton = tv({
  base: cn(
    'grid size-8.5 shrink-0 place-items-center rounded-control border border-border bg-card p-0',
    'text-sm leading-none tracking-[-0.02em] text-foreground shadow-none',
  ),
  variants: {
    interactive: {
      true: cn(
        'origin-center',
        'duration-dapp-fast transition-[border-color,background-color,box-shadow,transform,opacity] ease-out',
        'enabled:cursor-pointer enabled:hover:scale-[1.02] enabled:hover:border-primary',
        'enabled:focus-visible:scale-[1.02] enabled:focus-visible:border-primary',
        'enabled:active:scale-[0.985] enabled:active:border-primary enabled:active:duration-75',
        'disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-60',
      ),
      false: '',
    },
  },
  defaultVariants: {
    interactive: false,
  },
})

type ExchangeFlowButtonProps = {
  'aria-hidden'?: boolean
  'aria-label'?: string
  children: ReactNode
  className?: string
  disabled?: boolean
  interactive?: boolean
  onClick?: () => void
}

/** Trade flip / Flash divider — 34×34 control chrome. Children = glyph only. */
export function ExchangeFlowButton({
  children,
  className,
  disabled,
  interactive = false,
  onClick,
  ...aria
}: ExchangeFlowButtonProps) {
  if (interactive) {
    return (
      <button
        {...aria}
        className={cn(exchangeFlowButton({ interactive: true }), className)}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    )
  }

  return (
    <div {...aria} className={cn(exchangeFlowButton({ interactive: false }), className)}>
      {children}
    </div>
  )
}

/**
 * Figma burn `4434:429` chevCircle — full 34×34 asset (border + single chevron).
 * Do **not** wrap in `ExchangeFlowButton` (asset already includes chrome).
 */
export function ExchangeOneWayFlowIndicator({ className }: { className?: string }) {
  return (
    <img
      alt=""
      aria-hidden
      className={cn('size-8.5 shrink-0', className)}
      src={burnExchangeAssets.flowDown}
    />
  )
}
