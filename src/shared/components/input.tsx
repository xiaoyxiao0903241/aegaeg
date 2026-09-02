import { forwardRef, type InputHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'

/**
 * 输入框 — 变体
 * default：表单；numeric：份额；amount：兑换 / 代币，大号右对齐。
 */
export const inputVariants = tv({
  base: [
    'w-full min-w-0 border border-border bg-card text-foreground outline-none',
    'placeholder:text-placeholder',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'focus:border-primary',
  ],
  variants: {
    variant: {
      default:
        'rounded-sm px-3.5 py-2.5 text-left text-(length:--type-copy-size) leading-normal font-normal tracking-normal',
      numeric:
        '[appearance:textfield] rounded-sm px-3.5 py-2.5 text-left text-(length:--type-copy-size) leading-normal font-semibold tracking-normal [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
      amount:
        'border-0 bg-transparent p-0 text-right text-(length:--type-figure-size) leading-(--type-figure-leading) font-semibold tracking-(--type-figure-tracking) caret-coral outline-0 focus:border-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type InputProps = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>

/**
 * 输入框
 *
 * 样式由 `inputVariants` 定义；变体见上方说明。
 *
 * @param variant default / numeric / amount
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, ...props }, ref) => (
    <input className={cn(inputVariants({ variant }), className)} ref={ref} {...props} />
  ),
)
Input.displayName = 'Input'
