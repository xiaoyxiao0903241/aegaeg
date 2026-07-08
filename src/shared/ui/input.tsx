import { forwardRef, type InputHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'

/**
 * Primitive：输入框。
 * SSOT：docs/foundation/api.md §6
 *
 * 公开轴：variant × size
 * - default：普通表单输入
 * - numeric：数字输入（shares）
 * - amount：金额输入（swap / token），大号右对齐
 */
export const inputVariants = tv({
  base: [
    'w-full min-w-0 border border-border bg-card text-foreground outline-none',
    'placeholder:text-muted-foreground',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'focus:border-primary',
  ],
  variants: {
    variant: {
      default:
        'rounded-sm px-3.5 py-2.5 text-left text-[length:var(--type-copy-size)] font-normal leading-normal tracking-normal',
      numeric:
        'rounded-sm px-3.5 py-2.5 text-left text-[length:var(--type-copy-size)] font-semibold leading-normal tracking-normal [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
      amount:
        // Match 4175 dappAmountClass: figure size + leading-normal (22→33) + tracking -0.44px
        'border-0 bg-transparent text-right text-[length:var(--type-figure-size)] font-semibold leading-normal tracking-[-0.44px] outline-0 placeholder:text-muted-foreground',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    {
      variant: ['default', 'numeric'],
      size: 'sm',
      class: 'px-3 py-2 text-[length:var(--type-copy-size)]',
    },
    {
      variant: ['default', 'numeric'],
      size: 'lg',
      class: 'px-4 py-3 text-[length:var(--type-detail-size)]',
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export type InputProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, ...props }, ref) => (
    <input
      className={cn(inputVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
