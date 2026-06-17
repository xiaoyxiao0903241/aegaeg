import type { ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '~/lib/utils'
import { DialogOverlay, DialogPortal, modalOverlayClass, responsivePanelClass } from '~/components/dialog'

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
  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange} open={open}>
      <DialogPortal>
        <DialogOverlay className={cn(modalOverlayClass, overlayClassName)} />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(responsivePanelClass, className)}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  )
}
