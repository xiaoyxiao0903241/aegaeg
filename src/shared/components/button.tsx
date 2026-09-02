import { Slot } from '@radix-ui/react-slot'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

/**
 * 按钮样式变体
 *
 * 变体 / 尺寸 / 形状组合见 `Button`。
 */
export const buttonVariants = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center font-semibold tracking-normal whitespace-nowrap',
    'transition-[border-color,background-color,box-shadow,transform,opacity,color] duration-160 ease-out',
    'origin-center hover:scale-[1.008] focus-visible:scale-[1.008]',
    'active:scale-[0.992] active:duration-75',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'disabled:scale-100 disabled:shadow-none',
    'disabled:hover:scale-100 disabled:hover:shadow-none',
    'disabled:active:scale-100 disabled:active:shadow-none',
  ],
  variants: {
    variant: {
      primary: [
        'border border-transparent bg-primary text-primary-foreground',
        'hover:shadow-primary-hover focus-visible:shadow-primary-hover',
        'visited:text-primary-foreground hover:text-primary-foreground focus-visible:text-primary-foreground',
        'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
      ],
      secondary: [
        'gap-2 border border-border bg-card text-foreground',
        'hover:shadow-card focus-visible:shadow-card',
        // 禁用态与 primary 同口径（muted 底 + muted 字），避免成对 CTA 一实一空
        'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
        'hover:border-coral-hover-border focus-visible:border-coral-hover-border',
      ],
      ghost: [
        'gap-2 border border-border bg-card text-muted-foreground',
        'hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary',
        'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
      ],
      link: [
        'min-h-0 w-auto justify-start border-0 bg-transparent p-0 text-left font-normal whitespace-normal text-primary',
        'hover:scale-100 focus-visible:scale-100 active:scale-100',
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

/**
 * 按钮
 *
 * 样式由 `buttonVariants` 定义；`asChild` 为 true 时把样式转交给子元素
 * （如路由链接），自身不渲染标签。
 *
 * @param variant primary（主操作） / secondary（次操作） / ghost（弱化） / link（文本链接）
 * @param size sm / md / lg
 * @param shape pill（胶囊） / rounded（圆角）
 * @param asChild 为 true 时渲染为子元素
 */
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
