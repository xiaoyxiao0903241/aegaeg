import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '~/shared/lib/utils'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

function tooltipArrowPadding(align?: 'start' | 'center' | 'end') {
  if (align === 'end' || align === 'start') return 18
  return 8
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, collisionPadding = 16, align, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      arrowPadding={tooltipArrowPadding(align)}
      avoidCollisions
      sticky="partial"
      className={cn(
        'z-9999 overflow-visible',
        'w-max max-w-[min(18rem,calc(100vw-2rem))] rounded-sm bg-dark px-3 py-2',
        'text-left text-xs font-medium leading-[1.45] whitespace-pre-line text-white',
        'shadow-tooltip',
        'animate-[aegis-tooltip-in_140ms_ease-out]',
        'data-[state=closed]:animate-[aegis-tooltip-out_100ms_ease-in]',
        'data-[side=bottom]:[&>svg]:-mt-px',
        'data-[side=top]:[&>svg]:-mb-px',
        'data-[side=bottom]:data-[align=end]:[&>svg]:-translate-x-3',
        'data-[side=top]:data-[align=end]:[&>svg]:-translate-x-3',
        'data-[side=bottom]:data-[align=start]:[&>svg]:translate-x-3',
        'data-[side=top]:data-[align=start]:[&>svg]:translate-x-3',
        className,
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className="fill-dark" height={6} width={12} />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
