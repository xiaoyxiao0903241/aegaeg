import {
  type ButtonHTMLAttributes,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  use,
  useId,
  useRef,
  useState,
} from 'react'

import { cn } from '~/shared/lib/utils'
import { useDismissOnOutside } from '~/shared/ui/use-dismiss-on-outside'

/**
 * DApp listbox 菜单 chrome（兑换 TokenPicker / 资产排序 / 奖励档位共用）.
 * trigger↔panel 间距：HTML 原型 `calc(100% + 6px)` → `0.375rem`（禁 0.5rem 撑开）.
 * 只吃 chrome；options / 文案 / 图标由 call site 组进 Item children.
 */

type MenuCtx = {
  open: boolean
  setOpen: (open: boolean) => void
  menuId: string
}

const Ctx = createContext<MenuCtx | null>(null)

function useMenuCtx(): MenuCtx {
  const ctx = use(Ctx)
  if (!ctx) throw new Error('DropdownMenu.* must be used within DropdownMenu')
  return ctx
}

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
  const menuId = useId()
  useDismissOnOutside(open, rootRef, () => setOpen(false))

  return (
    <div
      className={cn('relative inline-flex', open && 'z-50', className)}
      data-open={open ? '' : undefined}
      ref={rootRef}
    >
      <Ctx value={{ open, setOpen, menuId }}>{children}</Ctx>
    </div>
  )
}

export function DropdownMenuTrigger({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen, menuId } = useMenuCtx()
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
      type={props.type ?? 'button'}
    >
      {children}
    </button>
  )
}

export function DropdownMenuPanel({
  align = 'start',
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'end' }) {
  const { open, menuId } = useMenuCtx()
  if (!open) return null
  return (
    <div
      {...props}
      className={cn(
        'absolute top-[calc(100%+0.375rem)] z-50 grid min-w-44 gap-0.5',
        'rounded-sm border border-border bg-card p-1.5 shadow-menu',
        align === 'end' ? 'right-0' : 'left-0',
        className,
      )}
      id={menuId}
      role="listbox"
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({
  selected = false,
  tone = 'accent',
  className,
  children,
  onSelect,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean
  /** accent = primary-soft（兑换/排序）；muted = background（奖励档位）. */
  tone?: 'accent' | 'muted'
  onSelect?: () => void
}) {
  const { setOpen } = useMenuCtx()
  const activeClass =
    tone === 'muted'
      ? 'bg-background font-medium text-foreground'
      : 'bg-primary-soft font-semibold text-foreground'
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
            ? activeClass
            : 'bg-transparent font-normal text-foreground hover:bg-background focus-visible:bg-background'),
        props.disabled && selected && (tone === 'muted' ? 'bg-background' : 'bg-primary-soft'),
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
