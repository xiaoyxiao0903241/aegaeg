import { Slot } from '@radix-ui/react-slot'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const buttonVariants = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center font-semibold tracking-normal whitespace-nowrap',
    'transition-[border-color,background-color,box-shadow,transform,opacity,color] duration-160 ease-out',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'disabled:scale-100 disabled:shadow-none',
    'disabled:hover:scale-100 disabled:hover:shadow-none',
    'disabled:active:scale-100 disabled:active:shadow-none',
  ],
  variants: {
    variant: {
      primary: [
        'border border-transparent bg-primary text-primary-foreground',
        'origin-center hover:scale-[1.008] focus-visible:scale-[1.008]',
        'active:scale-[0.992] active:duration-75',
        'hover:shadow-primary-hover focus-visible:shadow-primary-hover',
        'visited:text-primary-foreground hover:text-primary-foreground focus-visible:text-primary-foreground',
        'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
      ],
      secondary: [
        'gap-2 border border-border bg-card text-foreground',
        'origin-center hover:scale-[1.008] focus-visible:scale-[1.008]',
        'active:scale-[0.992] active:duration-75',
        'hover:shadow-card focus-visible:shadow-card',
        'disabled:border-border disabled:bg-transparent disabled:text-muted-foreground disabled:opacity-100',
        'hover:border-coral-hover-border focus-visible:border-coral-hover-border',
      ],
      ghost: [
        'gap-2 border border-border bg-card text-muted-foreground',
        'origin-center hover:scale-[1.008] focus-visible:scale-[1.008]',
        'active:scale-[0.992] active:duration-75',
        'hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary',
        'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
      ],
      link: [
        'min-h-0 w-auto justify-start border-0 bg-transparent p-0 text-left font-normal whitespace-normal text-primary',
        'disabled:text-muted-foreground disabled:opacity-100',
      ],
    },
    size: {
      lg: 'min-h-12 px-6 text-base leading-none max-dapp:px-5 max-dapp:text-sm',
      md: 'min-h-11 px-5 text-sm/snug max-dapp:text-xs',
      sm: 'min-h-9 px-4.5 text-sm leading-none max-dapp:text-xs',
    },
    shape: {
      pill: 'rounded-full',
      rounded: 'rounded-sm',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      size: 'lg',
      class: 'border-0',
    },
    {
      variant: ['secondary', 'ghost'],
      size: 'lg',
      class: 'visited:text-foreground hover:text-foreground focus-visible:text-foreground',
    },
    {
      variant: 'link',
      size: ['sm', 'md', 'lg'],
      class: 'min-h-0! px-0',
    },
    {
      size: ['sm', 'md'],
      shape: 'pill',
      class: 'w-full',
    },
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
        className={buttonVariants({ variant, size, shape, class: className })}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button }
