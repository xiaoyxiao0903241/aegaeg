import { Slot } from '@radix-ui/react-slot'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'

export const buttonDisabledClass = cn(
  'disabled:pointer-events-none disabled:cursor-not-allowed',
  'disabled:translate-y-0 disabled:shadow-none',
  'disabled:hover:translate-y-0 disabled:hover:shadow-none',
)

const disabledMutedClass =
  'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100'

const liftHoverClass = 'hover:-translate-y-px focus-visible:-translate-y-px'

/**
 * Primitive：按钮。
 * SSOT：docs/foundation/api.md §3
 *
 * 公开轴：variant × size × shape = 4 × 3 × 2
 * 禁止：tab / chip / link 异位；Chip 负责小控件。
 */
export const buttonVariants = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center font-semibold tracking-normal whitespace-nowrap',
    'transition-[border-color,background-color,box-shadow,transform,opacity,color] duration-[180ms] ease-out',
    buttonDisabledClass,
  ],
  variants: {
    variant: {
      primary: [
        'border-0 bg-primary text-primary-foreground',
        `${liftHoverClass} hover:shadow-primary-hover focus-visible:shadow-primary-hover`,
        'visited:text-primary-foreground hover:text-primary-foreground focus-visible:text-primary-foreground',
        disabledMutedClass,
      ],
      secondary: [
        'gap-2 border border-border bg-card text-foreground',
        `${liftHoverClass} hover:shadow-card focus-visible:shadow-card`,
        'disabled:border-border disabled:bg-transparent disabled:text-muted-foreground disabled:opacity-100',
        'hover:border-coral-hover-border focus-visible:border-coral-hover-border',
      ],
      ghost: [
        'gap-2 border border-border bg-card text-muted-foreground',
        'hover:border-primary hover:text-primary',
        disabledMutedClass,
      ],
      link: [
        'min-h-0 w-auto justify-start border-0 bg-transparent p-0 text-left font-normal text-primary whitespace-normal',
        'disabled:text-muted-foreground disabled:opacity-100',
      ],
    },
    /** Size typography is display scale (not Text copy token) — lg=16 / md·sm=14 matches 4175 CTA. */
    size: {
      lg: 'min-h-12 px-6 text-base leading-none',
      md: 'min-h-10 px-5 text-sm leading-none',
      sm: 'min-h-9 px-4 text-sm leading-none',
    },
    shape: {
      pill: 'rounded-full',
      rounded: 'rounded-sm',
    },
  },
  compoundVariants: [
    {
      variant: ['secondary', 'ghost'],
      size: 'lg',
      class:
        'visited:text-foreground hover:text-foreground focus-visible:text-foreground',
    },
    {
      variant: 'link',
      size: ['sm', 'md', 'lg'],
      class: '!min-h-0 px-0',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    shape: 'pill',
  },
})

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shape }), className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button }
