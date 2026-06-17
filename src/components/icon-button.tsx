import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Button } from '~/components/button'
import { cn } from '~/lib/utils'

export const IconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, type = 'button', ...props }, ref) => (
    <Button
      className={cn('grid size-[42px] shrink-0 rounded-[13px] p-0 max-[820px]:hidden', className)}
      ref={ref}
      type={type}
      variant="secondary"
      {...props}
    />
  ),
)
IconButton.displayName = 'IconButton'
