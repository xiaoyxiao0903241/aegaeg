import {
  cloneElement,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
} from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/tooltip'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'

export type AnchoredTooltipPosition = 'top' | 'right' | 'bottom'

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
  const childOnClick = children.props.onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined
  const isInfoOnly = childOnClick == null

  const trigger = cloneElement(children, {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      children.props.onPointerDown?.(event)
      if (isMobileViewport) {
        // Block focus-toggle flash on touch; info icons open via click below.
        event.preventDefault()
      }
    },
    onClick: (event: MouseEvent<HTMLElement>) => {
      childOnClick?.(event)
      if (isMobileViewport && isInfoOnly) {
        setMobileOpen((open) => !open)
      }
    },
  })

  const mobileControlled =
    isMobileViewport && isInfoOnly
      ? { open: mobileOpen, onOpenChange: setMobileOpen }
      : {}

  return (
    <Tooltip {...mobileControlled}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent align={align} className={className} side={positionToSide[position]}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
