import type { ButtonHTMLAttributes, ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { tv } from 'tailwind-variants'
import { DialogOverlay, DialogPortal, dialogChrome } from '~/shared/ui/dialog'

const dialogClose = tv({
  base: [
    'grid size-8 shrink-0 cursor-pointer place-items-center rounded-full',
    'border border-border bg-card text-foreground transition-[border-color,transform] duration-180 ease-out',
    'hover:-translate-y-px hover:border-foreground focus-visible:border-foreground focus-visible:outline-none',
  ],
})

export function AegisDialogClose({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <DialogPrimitive.Close
      className={dialogClose({ class: className })}
      type="button"
      {...props}
    />
  )
}

export function AegisSheetHandle() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto mb-3 mt-2 hidden h-1 w-10 shrink-0 rounded-full bg-border max-dapp:block"
    />
  )
}

export function AegisResponsiveDialog({
  children,
  className,
  onOpenChange,
  open,
  overlayClassName,
}: {
  children: ReactNode
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
