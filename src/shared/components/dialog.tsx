import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import * as React from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '~/shared/components/text'

const DialogPortal = DialogPrimitive.Portal

/**
 * 弹窗各部位样式槽位
 *
 * `panel`（ResponsiveDialog）：定位/动画（`.aegis-responsive-panel`）+ 默认浅色卡片外壳。
 * 钱包等异形外壳用 `className` 覆盖宽高、圆角、padding；勿在业务袋再抽平行外观常量。
 */
export const dialogChrome = tv({
  slots: {
    overlay: 'aegis-modal-overlay fixed inset-0 z-50 backdrop-blur-sm',
    content: 'aegis-modal-content fixed top-1/2 left-1/2 z-50 focus:outline-none',
    panel: [
      'aegis-responsive-panel focus:outline-none',
      'border-0 bg-card text-foreground',
      'w-full max-w-md max-dapp:w-full',
      'max-dapp:rounded-t-lg max-dapp:px-4 max-dapp:pt-3 max-dapp:pb-[max(1.25rem,env(safe-area-inset-bottom))]',
      'dapp:rounded-lg dapp:px-4 dapp:py-5',
      'dapp:shadow-modal-panel',
    ],
    header: 'flex flex-col space-y-1.5 text-center sm:text-left',
    footer: 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
  },
})

/** 弹窗遮罩：半透明黑 + 背景模糊 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const styles = dialogChrome()
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={styles.overlay({ class: ['bg-black/80', className] })}
      {...props}
    />
  )
})
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/** 弹窗内容：居中面板 + 右上角关闭按钮 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const styles = dialogChrome()
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        aria-describedby={undefined}
        className={styles.content({
          class: [
            'grid w-full max-w-lg gap-4 border border-border bg-background p-6 shadow-lg sm:rounded-lg',
            className,
          ],
        })}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="size-4" />
          <Text variant="copy" className="sr-only">
            Close
          </Text>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

/** 弹窗头部（标题区） */
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const styles = dialogChrome()
  return <div className={styles.header({ class: className })} {...props} />
}
DialogHeader.displayName = 'DialogHeader'

/** 弹窗底部操作区 */
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const styles = dialogChrome()
  return <div className={styles.footer({ class: className })} {...props} />
}
DialogFooter.displayName = 'DialogFooter'

/** 弹窗标题 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} asChild {...props}>
    <Text as="h2" variant="section" className={className}>
      {children}
    </Text>
  </DialogPrimitive.Title>
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/** 弹窗描述 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} asChild {...props}>
    <Text as="p" variant="copy" tone="muted-foreground" className={className}>
      {children}
    </Text>
  </DialogPrimitive.Description>
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
}

/**
 * 通用关闭按钮：浅灰圆底 X。
 * 钱包弹窗、资产领取/赎回、滑点等共用；深色外壳可在调用处用 className 覆盖。
 */
export const dialogClose = tv({
  base: [
    'grid size-(--dapp-wallet-modal-close-size) shrink-0 cursor-pointer place-items-center rounded-full',
    'border-0 bg-muted text-foreground/55 transition-[background-color,color,transform] duration-180 ease-out',
    'hover:-translate-y-px hover:bg-muted hover:text-foreground',
    'focus-visible:ring-0 focus-visible:outline-none',
  ],
})

/** 弹窗关闭按钮：浅灰圆底 + X */
export function DialogClose({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <DialogPrimitive.Close className={dialogClose({ class: className })} type="button" {...props} />
  )
}

/** 移动端抽屉顶部把手 */
export function SheetHandle() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto mt-2 mb-3 hidden h-1 w-10 shrink-0 rounded-full bg-border max-dapp:block"
    />
  )
}

const PORTALED_MENU_SELECTOR = '[data-dropdown-menu-panel]'

/** 点到挂在 body 上的菜单（含选项文字）时不关弹窗。 */
export function isPortaledMenuEventTarget(target: EventTarget | null): boolean {
  if (target == null) return false
  const node = target as unknown as {
    closest?: (selector: string) => unknown
    parentElement?: { closest?: (selector: string) => unknown } | null
  }
  if (typeof node.closest === 'function') return node.closest(PORTALED_MENU_SELECTOR) != null
  if (typeof node.parentElement?.closest === 'function') {
    return node.parentElement.closest(PORTALED_MENU_SELECTOR) != null
  }
  return false
}

function preventDismissOnPortaledMenu(event: {
  preventDefault: () => void
  target: EventTarget | null
  detail?: { originalEvent?: { target: EventTarget | null } }
}) {
  const target = event.detail?.originalEvent?.target ?? event.target
  if (isPortaledMenuEventTarget(target)) event.preventDefault()
}

/**
 * 响应式弹窗 / 抽屉：默认浅色卡片壳（领取、赎回、滑点等）。
 *
 * @param className 覆盖宽高/圆角/padding（钱包连接、详情等异形壳）
 * @param overlayClassName 遮罩强度（dim / strong / blur）
 */
export function ResponsiveDialog({
  children,
  className,
  onOpenChange,
  open,
  overlayClassName,
}: {
  children: React.ReactNode
  className?: string
  onOpenChange: (open: boolean) => void
  open: boolean
  overlayClassName?: string
}) {
  const styles = dialogChrome()

  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange} open={open}>
      <DialogPortal>
        <DialogOverlay className={overlayClassName} />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={styles.panel({ class: className })}
          onInteractOutside={preventDismissOnPortaledMenu}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  )
}
