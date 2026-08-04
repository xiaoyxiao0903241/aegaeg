import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import * as React from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '~/shared/components/text'

const DialogPortal = DialogPrimitive.Portal

export const dialogChrome = tv({
  slots: {
    overlay: 'aegis-modal-overlay fixed inset-0 z-50 backdrop-blur-sm',
    content: 'aegis-modal-content fixed top-1/2 left-1/2 z-50 focus:outline-none',
    panel: 'aegis-responsive-panel focus:outline-none',
    header: 'flex flex-col space-y-1.5 text-center sm:text-left',
    footer: 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
  },
})

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

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const styles = dialogChrome()
  return <div className={styles.header({ class: className })} {...props} />
}
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const styles = dialogChrome()
  return <div className={styles.footer({ class: className })} {...props} />
}
DialogFooter.displayName = 'DialogFooter'

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

/** Shared close control — wallet modal, slippage, H5 drawer, etc. */
export const dialogClose = tv({
  base: [
    // Figma wm-x 4040:5236 — 34px circle, white surface
    'grid size-(--dapp-wallet-modal-close-size) shrink-0 cursor-pointer place-items-center rounded-full',
    'border border-border bg-card text-foreground transition-[border-color,transform] duration-180 ease-out',
    'hover:-translate-y-px hover:border-primary focus-visible:border-primary focus-visible:outline-none',
  ],
})

export function DialogClose({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <DialogPrimitive.Close className={dialogClose({ class: className })} type="button" {...props} />
  )
}

export function SheetHandle() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto mt-2 mb-3 hidden h-1 w-10 shrink-0 rounded-full bg-border max-dapp:block"
    />
  )
}

/** Responsive modal/sheet shell — panel chrome via `dialogChrome().panel`. */
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
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  )
}
