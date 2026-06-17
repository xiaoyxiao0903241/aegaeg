import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '~/lib/utils'

export const AmountInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      className={cn(
        'w-full min-w-0 border-0 bg-transparent text-right text-[22px] font-semibold leading-[1.2] tracking-[-0.44px] text-foreground outline-0',
        'placeholder:text-placeholder disabled:cursor-not-allowed disabled:opacity-[.58]',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
AmountInput.displayName = 'AmountInput'
