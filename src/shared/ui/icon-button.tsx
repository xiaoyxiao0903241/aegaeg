import { type ButtonHTMLAttributes, forwardRef } from 'react'

import { cn } from '~/shared/lib/utils'
import { Button } from '~/shared/ui/button'

export const IconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, type = 'button', ...props }, ref) => (
    <Button
      className={cn('grid size-10 min-h-10 shrink-0 rounded-sm p-0 max-dapp:hidden', className)}
      data-dapp-pc-detail-toggle
      ref={ref}
      shape="rounded"
      type={type}
      variant="secondary"
      {...props}
    />
  ),
)
IconButton.displayName = 'IconButton'
