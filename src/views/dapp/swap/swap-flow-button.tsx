import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'

export const swapFlipCard = tv({
  variants: {
    flipping: {
      true: 'animate-[swap-card-flip_var(--motion-dapp-emphasis)_var(--motion-dapp-ease)_both]',
      false: '',
    },
  },
  defaultVariants: {
    flipping: false,
  },
})

const swapFlowButton = tv({
  base: cn(
    'grid size-8.5 shrink-0 place-items-center rounded-control border border-border bg-card p-0',
    'text-sm leading-none tracking-[-0.02em] text-foreground shadow-none',
  ),
  variants: {
    interactive: {
      true: cn(
        'origin-center',
        'transition-[border-color,background-color,box-shadow,transform,opacity] duration-dapp-fast ease-out',
        'enabled:cursor-pointer enabled:hover:scale-[1.02] enabled:hover:border-primary',
        'enabled:focus-visible:scale-[1.02] enabled:focus-visible:border-primary',
        'enabled:active:scale-[0.985] enabled:active:duration-75 enabled:active:border-primary',
        'disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-60',
      ),
      false: '',
    },
  },
  defaultVariants: {
    interactive: false,
  },
})

type SwapFlowButtonProps = {
  'aria-hidden'?: boolean
  'aria-label'?: string
  children: ReactNode
  className?: string
  disabled?: boolean
  interactive?: boolean
  onClick?: () => void
}

/** Trade flip / Flash divider — 34×34 control chrome. */
export function SwapFlowButton({
  children,
  className,
  disabled,
  interactive = false,
  onClick,
  ...aria
}: SwapFlowButtonProps) {
  if (interactive) {
    return (
      <button
        {...aria}
        className={cn(swapFlowButton({ interactive: true }), className)}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    )
  }

  return (
    <div {...aria} className={cn(swapFlowButton({ interactive: false }), className)}>
      {children}
    </div>
  )
}
