import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { flashExchangeAssets } from '~/shared/assets/dapp'
import { Icon } from '~/shared/components/icon'
import { cn } from '~/shared/lib/utils'

export { OneWayFlowIndicator as ExchangeOneWayFlowIndicator } from '~/views/dapp/shared/one-way-flow-indicator'

// —— exchange-flow-button ——

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

/** 方向切换 / 翻转按钮。 */
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

/** 翻转钮内箭头：随 rotation 旋转。 */
export function ExchangeFlipGlyph({ rotation }: { rotation: number }) {
  return (
    <span
      className="duration-dapp-emphasis grid place-items-center transition-transform ease-dapp"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <span className="grid size-4 place-items-center">
        <span className="-rotate-90">
          <Icon alt="" size="base" src={flashExchangeAssets.flowDivider} />
        </span>
      </span>
    </span>
  )
}
