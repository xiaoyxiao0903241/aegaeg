import {
  type ButtonHTMLAttributes,
  createContext,
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

import { cn } from '~/shared/lib/utils'

/** 点击外部或按 Escape 时关闭已展开的菜单 */
function useDismissOnOutside(
  open: boolean,
  rootRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
) {
  const dismiss = useEffectEvent(onDismiss)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (rootRef.current && !rootRef.current.contains(target)) dismiss()
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
  }, [open, rootRef])
}

/**
 * DApp 列表菜单（兑换 TokenPicker / 资产排序 / SelectMenu 共用）
 *
 * 面板按视口剩余空间上下翻转；只提供容器与交互，
 * 选项 / 文案 / 图标由调用方组装进 Item。
 */

const MENU_GAP_PX = 6
const VIEWPORT_PADDING_PX = 8

type MenuPlacement = 'above' | 'below'

type MenuCtx = {
  open: boolean
  setOpen: (open: boolean) => void
  menuId: string
  triggerRef: RefObject<HTMLButtonElement | null>
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
  const menuId = useId()
  useDismissOnOutside(open, rootRef, () => setOpen(false))

  return (
    <div
      className={cn('relative inline-flex', open && 'z-50', className)}
      data-open={open ? '' : undefined}
      ref={rootRef}
    >
      <Ctx value={{ open, setOpen, menuId, triggerRef }}>{children}</Ctx>
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

/** 列表菜单面板：按视口剩余空间决定向上或向下展开 */
export function DropdownMenuPanel({
  align = 'start',
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'end' }) {
  const { open, menuId, triggerRef } = useMenuCtx()
  const panelRef = useRef<HTMLDivElement>(null)
  const [placement, setPlacement] = useState<MenuPlacement>('below')

  useLayoutEffect(() => {
    if (!open) return

    function updatePlacement() {
      const trigger = triggerRef.current
      const panel = panelRef.current
      if (!trigger || !panel) return
      setPlacement(placementForPanel(trigger.getBoundingClientRect(), panel.offsetHeight))
    }

    updatePlacement()
  }, [open, children, triggerRef])

  useEffect(() => {
    if (!open) return

    function updatePlacement() {
      const trigger = triggerRef.current
      const panel = panelRef.current
      if (!trigger || !panel) return
      setPlacement(placementForPanel(trigger.getBoundingClientRect(), panel.offsetHeight))
    }

    const timer = window.setTimeout(updatePlacement, 0)
    window.addEventListener('resize', updatePlacement)
    window.addEventListener('scroll', updatePlacement, true)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', updatePlacement)
      window.removeEventListener('scroll', updatePlacement, true)
    }
  }, [open, triggerRef])

  if (!open) return null
  return (
    <div
      {...props}
      className={cn(
        'absolute z-50 grid min-w-44 gap-0.5',
        placement === 'below' ? 'top-[calc(100%+0.375rem)]' : 'bottom-[calc(100%+0.375rem)]',
        'rounded-sm border border-border bg-card p-1.5 shadow-menu',
        align === 'end' ? 'right-0' : 'left-0',
        className,
      )}
      id={menuId}
      ref={panelRef}
      role="listbox"
    >
      {children}
    </div>
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
