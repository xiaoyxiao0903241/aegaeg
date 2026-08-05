import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Info as InfoIcon } from 'lucide-react'
import * as React from 'react'
import {
  cloneElement,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  useState,
} from 'react'

import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { Text } from '~/shared/components/text'
import { cssRemVarPx } from '~/shared/lib/root-rem-px'
import { cn } from '~/shared/lib/utils'

export type TooltipPosition = 'top' | 'right' | 'bottom'

type TriggerChildProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void
  onPointerDown?: (event: PointerEvent<HTMLElement>) => void
}

export type TooltipProps = {
  children: ReactElement
  align?: 'start' | 'center' | 'end'
  className?: string
  content: string
  position?: TooltipPosition
}

const positionToSide: Record<TooltipPosition, 'top' | 'right' | 'bottom'> = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
}

/** 让箭头避开气泡圆角；位置由 Radix 计算，不要用 CSS 位移 */
function tooltipArrowPaddingPx(align?: 'start' | 'center' | 'end') {
  if (align === 'end' || align === 'start') {
    return cssRemVarPx('--app-tooltip-arrow-padding-edge', 1.125)
  }
  return cssRemVarPx('--app-tooltip-arrow-padding-center', 0.5)
}

/**
 * 气泡外观
 *
 * 文案用 Text `support` / `inverse`。
 */
const Bubble = React.forwardRef<
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
Bubble.displayName = 'TooltipBubble'

/**
 * 产品向 Tooltip：触发器 children + 文案 content。
 * 移动端纯 info 触发器（无自带 onClick）点按切换开合；桌面仍走悬停。
 */
function TooltipRoot({
  align = 'center',
  children,
  className,
  content,
  position = 'top',
}: TooltipProps) {
  const isMobileViewport = useMobileViewport()
  const [mobileOpen, setMobileOpen] = useState(false)
  const childProps = children.props as TriggerChildProps
  const childOnClick = childProps.onClick
  const isInfoOnly = childOnClick == null

  const trigger = cloneElement(children as ReactElement<TriggerChildProps>, {
    onPointerDown: (event) => {
      childProps.onPointerDown?.(event)
      if (isMobileViewport) {
        // 阻止触摸时焦点切换闪烁；info 图标走下方点击开合
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
    <TooltipPrimitive.Root {...mobileControlled}>
      <TooltipPrimitive.Trigger asChild>{trigger}</TooltipPrimitive.Trigger>
      <Bubble align={align} className={className} side={positionToSide[position]}>
        {content}
      </Bubble>
    </TooltipPrimitive.Root>
  )
}

type InfoProps = Pick<TooltipProps, 'align' | 'content' | 'position'> & {
  ariaLabel?: string
  /** 作用在 Info 触发按钮上（≠ 气泡 className） */
  className?: string
}

/** Info 图标触发器预设。 */
function Info({ align, ariaLabel, className, content, position }: InfoProps) {
  return (
    <TooltipRoot align={align} content={content} position={position}>
      <button
        aria-label={ariaLabel ?? content}
        className={cn(
          'duration-dapp-fast inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80',
          className,
        )}
        type="button"
      >
        <InfoIcon
          aria-hidden
          className="block size-3 shrink-0 text-foreground/40"
          strokeWidth={1.75}
        />
      </button>
    </TooltipRoot>
  )
}

export const Tooltip = Object.assign(TooltipRoot, {
  Provider: TooltipPrimitive.Provider,
  Info,
})
