import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/lib/utils'

export const radioIndicatorVariants = tv({
  base: 'relative inline-flex flex-none items-center justify-center rounded-full border-2 border-border bg-card',
  variants: {
    size: {
      md: 'aspect-square w-4 max-dapp:size-4.5',
    },
    checked: {
      true: 'border-primary',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    checked: false,
  },
})

export type RadioIndicatorProps = {
  checked?: boolean
  className?: string
} & VariantProps<typeof radioIndicatorVariants>

/** 圆形单选指示器 — 视觉 SSOT；成组语义用 RadioGroup */
export function RadioIndicator({ checked = false, className, size }: RadioIndicatorProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(radioIndicatorVariants({ size, checked }), className)}
    >
      {checked ? <span className="absolute inset-0.5 rounded-full bg-primary" /> : null}
    </span>
  )
}

export function RadioGroup({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={cn('grid gap-2', className)} role="radiogroup" {...props}>
      {children}
    </div>
  )
}
