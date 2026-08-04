import {
  cloneElement,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  useState,
} from 'react'

import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/shared/components/tooltip'

export type AnchoredTooltipPosition = 'top' | 'right' | 'bottom'

type TooltipTriggerChildProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void
  onPointerDown?: (event: PointerEvent<HTMLElement>) => void
}

export interface AnchoredTooltipProps {
  children: ReactElement
  align?: 'start' | 'center' | 'end'
  className?: string
  content: string
  position?: AnchoredTooltipPosition
}

const positionToSide: Record<AnchoredTooltipPosition, 'top' | 'right' | 'bottom'> = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
}

export function AnchoredTooltip({
  align = 'center',
  children,
  className,
  content,
  position = 'top',
}: AnchoredTooltipProps) {
  const isMobileViewport = useMobileViewport()
  const [mobileOpen, setMobileOpen] = useState(false)
  const childProps = children.props as TooltipTriggerChildProps
  const childOnClick = childProps.onClick
  const isInfoOnly = childOnClick == null

  const trigger = cloneElement(children as ReactElement<TooltipTriggerChildProps>, {
    onPointerDown: (event) => {
      childProps.onPointerDown?.(event)
      if (isMobileViewport) {
        // Block focus-toggle flash on touch; info icons open via click below.
        event.preventDefault()
      }
    },
    onClick: (event) => {
      childOnClick?.(event)
      if (isMobileViewport && isInfoOnly) {
        setMobileOpen((open) => !open)
      }
    },
  })

  const mobileControlled =
    isMobileViewport && isInfoOnly ? { open: mobileOpen, onOpenChange: setMobileOpen } : {}

  return (
    <Tooltip {...mobileControlled}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent align={align} className={className} side={positionToSide[position]}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
