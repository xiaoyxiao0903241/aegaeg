import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cssRemVarPx } from '~/shared/lib/root-rem-px'
import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

/** Keep arrow clear of bubble corners; Radix positions the tip — do not CSS-translate it. */
function tooltipArrowPaddingPx(align?: 'start' | 'center' | 'end') {
  if (align === 'end' || align === 'start') {
    return cssRemVarPx('--app-tooltip-arrow-padding-edge', 1.125)
  }
  return cssRemVarPx('--app-tooltip-arrow-padding-center', 0.5)
}

/**
 * Figma 76:17 bubble — radius `rounded-chip`, padding/arrow/offset from `--app-tooltip-*`.
 * Copy uses Text `support` / `inverse` (type-support tokens).
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset, collisionPadding, align, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset ?? cssRemVarPx('--app-tooltip-offset', 0.5)}
      collisionPadding={collisionPadding ?? cssRemVarPx('--app-tooltip-collision-padding', 1)}
      arrowPadding={tooltipArrowPaddingPx(align)}
      avoidCollisions
      sticky="partial"
      className={cn(
        'z-9999 overflow-visible',
        'w-max max-w-[min(var(--app-tooltip-max-width),calc(100vw-2*var(--app-tooltip-collision-padding)))] rounded-chip bg-dark p-(--app-tooltip-padding)',
        'text-left shadow-tooltip',
        'animate-[aegis-tooltip-in_140ms_ease-out]',
        'data-[state=closed]:animate-[aegis-tooltip-out_100ms_ease-in]',
        className,
      )}
      {...props}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text as="span" className="whitespace-pre-line" tone="inverse" variant="support">
          {children}
        </Text>
      ) : (
        children
      )}
      <TooltipPrimitive.Arrow
        className="h-(--app-tooltip-arrow-height) w-(--app-tooltip-arrow-width) fill-dark"
        height={cssRemVarPx('--app-tooltip-arrow-height', 0.4375)}
        width={cssRemVarPx('--app-tooltip-arrow-width', 0.875)}
      />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
