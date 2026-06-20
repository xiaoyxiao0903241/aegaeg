import { Slot } from '@radix-ui/react-slot'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/lib/utils'

export const buttonDisabledClass = cn(
  'disabled:pointer-events-none disabled:cursor-not-allowed',
  'disabled:translate-y-0 disabled:shadow-none',
  'disabled:hover:translate-y-0 disabled:hover:shadow-none',
)

const disabledMutedClass =
  'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100'

const liftHoverClass = 'hover:-translate-y-px focus-visible:-translate-y-px'

/** variant = 语义色 | size = 尺寸 | shape = 轮廓；交叉组合走 compound */
export const buttonVariants = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center font-semibold tracking-normal whitespace-nowrap',
    'transition-[border-color,background-color,box-shadow,transform,opacity,color] duration-[180ms] ease-out',
    buttonDisabledClass,
  ],
  variants: {
    variant: {
      primary: [
        'border border-transparent bg-primary text-primary-foreground',
        `${liftHoverClass} hover:shadow-primary-hover focus-visible:shadow-primary-hover`,
        disabledMutedClass,
      ],
      secondary: [
        'gap-2 border border-border bg-card text-foreground',
        `${liftHoverClass} hover:shadow-card focus-visible:shadow-card`,
        'disabled:border-border disabled:bg-transparent disabled:text-muted-foreground disabled:opacity-100',
        'hover:border-coral-hover-border focus-visible:border-coral-hover-border',
      ],
      ghost: [
        'border border-border bg-card text-muted-foreground',
        'hover:border-primary hover:text-primary',
        disabledMutedClass,
      ],
      tab: 'border border-transparent bg-accent text-primary',
      link: [
        'min-h-0 w-auto justify-start border-0 bg-transparent p-0 text-left font-[inherit] text-sm leading-snug text-primary whitespace-normal max-dapp:text-xs',
        'disabled:text-muted-foreground disabled:opacity-100',
      ],
    },
    size: {
      lg: 'min-h-12 px-6 text-base leading-none max-dapp:px-5 max-dapp:text-sm',
      md: 'min-h-10 px-5 text-sm leading-snug max-dapp:text-xs',
      sm: 'min-h-11 text-sm leading-normal max-dapp:min-h-12 max-dapp:text-xs',
    },
    shape: {
      pill: 'rounded-full',
      chip: [
        'h-6 w-full rounded-sm px-0 py-1.5 text-xs',
        'max-dapp:h-auto max-dapp:min-h-0 max-dapp:py-1.5 max-dapp:text-xs',
      ],
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      size: 'lg',
      class:
        'border-0 visited:text-primary-foreground hover:text-primary-foreground focus-visible:text-primary-foreground',
    },
    {
      variant: ['secondary', 'ghost'],
      size: 'lg',
      class:
        'visited:text-foreground hover:text-foreground focus-visible:text-foreground',
    },
    {
      variant: ['ghost', 'tab'],
      shape: 'pill',
      size: 'md',
      class: '!min-h-0 w-auto px-4 py-2 tracking-tight',
    },
    { size: 'sm', shape: 'pill', class: 'w-full' },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'sm',
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
