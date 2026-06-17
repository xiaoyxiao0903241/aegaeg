import type { CSSProperties, ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '~/lib/utils'

export type AnchoredTooltipPosition = 'top' | 'right' | 'bottom'

export interface AnchoredTooltipProps {
  children: ReactElement
  content: string
  position?: AnchoredTooltipPosition
}

const tooltipBaseClass = cn(
  'pointer-events-none fixed z-[9999] w-max max-w-60 rounded-[10px] bg-dark px-3 py-2',
  'text-center text-xs font-medium leading-[1.45] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]',
  'after:absolute after:size-0 after:border-solid after:content-[""]',
)

const tooltipArrowClass: Record<AnchoredTooltipPosition, string> = {
  top: 'after:left-1/2 after:bottom-[-5px] after:-translate-x-1/2 after:border-[5px_5px_0] after:border-dark after:border-x-transparent after:border-b-transparent',
  bottom:
    'after:left-1/2 after:top-[-5px] after:-translate-x-1/2 after:border-[0_5px_5px] after:border-transparent after:border-b-dark',
  right:
    'after:left-[-5px] after:top-1/2 after:-translate-y-1/2 after:border-[5px_5px_5px_0] after:border-transparent after:border-r-dark',
}

export function AnchoredTooltip({
  children,
  content,
  position = 'top',
}: AnchoredTooltipProps) {
  const [visible, setVisible] = useState(false)
  const [style, setStyle] = useState<CSSProperties>({})
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number | null>(null)

  const updatePosition = useCallback(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const element = wrapper.firstElementChild as HTMLElement | null
    if (!element) return

    const rect = element.getBoundingClientRect()
    const offset = 8

    if (position === 'right') {
      setStyle({
        position: 'fixed',
        left: rect.right + offset,
        top: rect.top + rect.height / 2,
        transform: 'translateY(-50%)',
      })
    } else if (position === 'bottom') {
      setStyle({
        position: 'fixed',
        left: rect.left + rect.width / 2,
        top: rect.bottom + offset,
        transform: 'translateX(-50%)',
      })
    } else {
      setStyle({
        position: 'fixed',
        left: rect.left + rect.width / 2,
        top: rect.top - offset,
        transform: 'translate(-50%, -100%)',
      })
    }
  }, [position])

  const show = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    updatePosition()
    setVisible(true)
    rafRef.current = requestAnimationFrame(() => {
      updatePosition()
    })
  }, [updatePosition])

  const hide = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setVisible(false)
  }, [])

  useEffect(() => {
    if (!visible) return

    updatePosition()
    const handleScroll = () => updatePosition()
    const handleResize = () => updatePosition()

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [visible, updatePosition])

  return (
    <span
      ref={wrapperRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      style={{ display: 'contents' }}
    >
      {children}
      {visible &&
        createPortal(
          <div
            className={cn(tooltipBaseClass, tooltipArrowClass[position])}
            role="tooltip"
            style={style}
          >
            {content}
          </div>,
          document.body,
        )}
    </span>
  )
}
