import { forwardRef, type InputHTMLAttributes } from 'react'
import { Input } from '~/shared/ui/input'
import { cn } from '~/shared/lib/utils'

export const AmountInput = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>>(
  ({ className, ...props }, ref) => (
    <Input
      variant="amount"
      className={cn(className)}
      ref={ref}
      {...props}
    />
  ),
)
AmountInput.displayName = 'AmountInput'
