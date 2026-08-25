import {
  type ButtonHTMLAttributes,
  createContext,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
  use,
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { cn } from '~/shared/lib/utils'

/** 点击外部或按 Escape 时关闭已展开的菜单 */
function useDismissOnOutside(
  open: boolean,
  rootRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
) {
  const dismiss = useEffectEvent(onDismiss)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return
      dismiss()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') dismiss()
    }

    document.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, panelRef, rootRef])
}

/**
 * DApp 列表菜单（兑换 TokenPicker / 资产排序 / SelectMenu 共用）
 *
 * 面板 portal 到 body，避免被卡片 overflow 裁切；
 * 按视口剩余空间上下翻转。选项 / 文案 / 图标由调用方组装进 Item。
 */

const MENU_GAP_PX = 6
const VIEWPORT_PADDING_PX = 8
const MENU_MIN_WIDTH_PX = 176

type MenuPlacement = 'above' | 'below'

type MenuCtx = {
  open: boolean
  setOpen: (open: boolean) => void
  menuId: string
  triggerRef: RefObject<HTMLButtonElement | null>
  panelRef: RefObject<HTMLDivElement | null>
}

const Ctx = createContext<MenuCtx | null>(null)

function useMenuCtx(): MenuCtx {
  const ctx = use(Ctx)
  if (!ctx) throw new Error('DropdownMenu.* must be used within DropdownMenu')
  return ctx
}

function placementForPanel(triggerRect: DOMRect, panelHeight: number): MenuPlacement {
  const needed = panelHeight + MENU_GAP_PX
  const spaceBelow = window.innerHeight - triggerRect.bottom - VIEWPORT_PADDING_PX
  const spaceAbove = triggerRect.top - VIEWPORT_PADDING_PX
  if (spaceBelow >= needed) return 'below'
  if (spaceAbove >= needed) return 'above'
  return spaceBelow >= spaceAbove ? 'below' : 'above'
}

/** 把面板钉在触发钮旁，并夹进视口。 */
function styleForPortaledPanel(
  triggerRect: DOMRect,
  panelWidth: number,
  panelHeight: number,
  placement: MenuPlacement,
  align: 'start' | 'end',
  matchTriggerWidth: boolean,
): CSSProperties {
  let top =
    placement === 'below'
      ? triggerRect.bottom + MENU_GAP_PX
      : triggerRect.top - MENU_GAP_PX - panelHeight
  top = Math.max(
    VIEWPORT_PADDING_PX,
    Math.min(top, window.innerHeight - VIEWPORT_PADDING_PX - panelHeight),
  )

  let left = align === 'end' ? triggerRect.right - panelWidth : triggerRect.left
  left = Math.max(
    VIEWPORT_PADDING_PX,
    Math.min(left, window.innerWidth - VIEWPORT_PADDING_PX - panelWidth),
  )

  return {
    top,
    left,
    width: matchTriggerWidth ? triggerRect.width : undefined,
    minWidth: matchTriggerWidth ? triggerRect.width : MENU_MIN_WIDTH_PX,
  }
}

/**
 * 列表菜单根节点
 *
 * 管理开合状态，支持受控（传 `open`）与非受控两种用法。
 */
export function DropdownMenu({
  className,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: {
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const controlled = openProp !== undefined
  const open = controlled ? openProp : uncontrolled

  function setOpen(next: boolean) {
    if (!controlled) setUncontrolled(next)
    onOpenChange?.(next)
  }

  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  useDismissOnOutside(open, rootRef, panelRef, () => setOpen(false))

  return (
    <div
      className={cn('relative inline-flex', className)}
      data-open={open ? '' : undefined}
      ref={rootRef}
    >
      <Ctx value={{ open, setOpen, menuId, triggerRef, panelRef }}>{children}</Ctx>
    </div>
  )
}

/** 列表菜单触发按钮：切换面板开合并带无障碍状态 */
export function DropdownMenuTrigger({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen, menuId, triggerRef } = useMenuCtx()
  return (
    <button
      {...props}
      aria-controls={menuId}
      aria-expanded={open}
      aria-haspopup="listbox"
      className={className}
      onClick={(event) => {
        props.onClick?.(event)
        if (event.defaultPrevented) return
        setOpen(!open)
      }}
      ref={triggerRef}
      type={props.type ?? 'button'}
    >
      {children}
    </button>
  )
}

/** 列表菜单面板：挂到 body，按视口剩余空间向上或向下展开 */
export function DropdownMenuPanel({
  align = 'start',
  className,
  children,
  matchTriggerWidth = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  align?: 'start' | 'end'
  /** 面板宽度对齐触发钮（领取弹窗 field） */
  matchTriggerWidth?: boolean
}) {
  const { open, menuId, triggerRef, panelRef } = useMenuCtx()
  const [coords, setCoords] = useState<CSSProperties>({})

  const updatePosition = useEffectEvent(() => {
    const trigger = triggerRef.current
    const panel = panelRef.current
    if (!trigger) return
    const triggerRect = trigger.getBoundingClientRect()
    const panelWidth = matchTriggerWidth
      ? triggerRect.width
      : Math.max(panel?.offsetWidth ?? 0, triggerRect.width, MENU_MIN_WIDTH_PX)
    const panelHeight = panel?.offsetHeight ?? 0
    const placement = placementForPanel(triggerRect, panelHeight)
    setCoords(
      styleForPortaledPanel(
        triggerRect,
        panelWidth,
        panelHeight,
        placement,
        align,
        matchTriggerWidth,
      ),
    )
  })

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
  }, [children, open])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => updatePosition(), 0)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      {...props}
      className={cn(
        // 弹窗把页面锁成不可点；面板在 body 上，不自己可点就会点穿到领取按钮
        'pointer-events-auto fixed z-130 grid min-w-44 gap-0.5',
        'rounded-sm border border-border bg-card p-1.5 shadow-menu',
        className,
      )}
      data-dropdown-menu-panel=""
      id={menuId}
      ref={panelRef}
      role="listbox"
      style={coords}
    >
      {children}
    </div>,
    document.body,
  )
}

/** 列表菜单项：点击后选中并关闭面板 */
export function DropdownMenuItem({
  selected = false,
  tone = 'accent',
  className,
  children,
  onSelect,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean
  /** accent = 强调；muted = 弱化 */
  tone?: 'accent' | 'muted'
  onSelect?: () => void
}) {
  const { setOpen } = useMenuCtx()
  const weightClass = tone === 'muted' ? 'font-medium' : 'font-semibold'
  return (
    <button
      {...props}
      aria-selected={selected}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-control border-0 px-2.5 py-2 text-left',
        'transition-colors duration-150 ease-out focus-visible:outline-none',
        props.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
        !props.disabled &&
          (selected
            ? cn('bg-accent text-foreground', weightClass)
            : 'bg-transparent font-normal text-foreground hover:bg-background focus-visible:bg-background'),
        props.disabled && selected && cn('bg-accent', weightClass),
        className,
      )}
      onClick={(event) => {
        props.onClick?.(event)
        if (event.defaultPrevented || props.disabled) return
        onSelect?.()
        setOpen(false)
      }}
      role="option"
      type={props.type ?? 'button'}
    >
      {children}
    </button>
  )
}
