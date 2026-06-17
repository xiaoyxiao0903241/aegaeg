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
    'inline-flex cursor-pointer items-center justify-center font-semibold tracking-[0] whitespace-nowrap',
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
        'gap-[7px] border border-border bg-card text-foreground',
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
        'min-h-0 w-auto justify-start border-0 bg-transparent p-0 text-left font-[inherit] text-[13px] leading-[1.3] text-primary whitespace-normal',
        'disabled:text-muted-foreground disabled:opacity-100',
      ],
    },
    size: {
      lg: 'min-h-12 px-[26px] text-[15px] leading-none',
      md: 'min-h-10 px-5 text-[13px] leading-[1.3]',
      sm: 'min-h-[44px] text-[14px] leading-normal max-[820px]:min-h-[46px]',
    },
    shape: {
      pill: 'rounded-full',
      chip: [
        'h-[25px] w-full rounded-[9px] px-0 py-[5px] text-xs',
        'max-[820px]:h-auto max-[820px]:min-h-0 max-[820px]:py-1.5 max-[820px]:text-[11px]',
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
      class: '!min-h-0 w-auto px-4 py-[7px] tracking-[-0.13px]',
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
