import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

/**
 * 标签胶囊
 *
 * 用作筛选、切换等轻量操作；样式由变体 / 尺寸 / 形状 / 语义色组合。
 */
export const chipVariants = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center whitespace-nowrap',
    'transition-[border-color,background-color,color,box-shadow,transform] duration-160 ease-out',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
    'origin-center hover:scale-[1.008] focus-visible:scale-[1.008] active:scale-[0.992] active:duration-75',
  ],
  variants: {
    variant: {
      solid: 'border-0',
      soft: 'border border-transparent',
      outlined: 'border bg-transparent',
    },
    size: {
      sm: 'px-2 py-1.5 text-(length:--type-caption-size) leading-none font-(--type-caption-weight) tracking-(--type-caption-tracking)',
      md: 'justify-center px-1.5 py-1.25 text-xs/normal font-semibold tracking-[-0.02em] max-dapp:py-1.5',
      lg: 'justify-center px-4 py-1.5 text-base leading-none font-semibold tracking-[-0.02em]',
    },
    shape: {
      pill: 'rounded-full',
      rounded: 'rounded-chip',
    },
    tone: {
      default: '',
      primary: '',
      coral: '',
      success: '',
    },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'default', class: 'bg-card text-foreground' },
    { variant: 'solid', tone: 'primary', class: 'bg-primary text-primary-foreground' },
    { variant: 'solid', tone: 'coral', class: 'bg-coral text-primary-foreground' },
    { variant: 'solid', tone: 'success', class: 'bg-success text-primary-foreground' },
    { variant: 'soft', tone: 'default', class: 'bg-muted text-foreground' },
    { variant: 'soft', tone: 'primary', class: 'bg-accent text-primary' },
    { variant: 'soft', tone: 'coral', class: 'bg-accent text-coral' },
    { variant: 'soft', tone: 'success', class: 'bg-success-soft text-success' },
    {
      // 未选中态用次要文字色；避免弱化文字被当作已选态
      variant: 'outlined',
      tone: 'default',
      class: 'border-border bg-card text-foreground/40 hover:border-primary hover:text-primary',
    },
    {
      variant: 'outlined',
      tone: 'primary',
      class: 'border-primary bg-card text-primary hover:bg-accent',
    },
    {
      variant: 'outlined',
      tone: 'coral',
      class: 'border-coral bg-card text-coral hover:bg-accent',
    },
    {
      variant: 'outlined',
      tone: 'success',
      class: 'border-success bg-card text-success hover:bg-success-soft',
    },
  ],
  defaultVariants: {
    variant: 'outlined',
    size: 'md',
    shape: 'rounded',
    tone: 'default',
  },
})

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof chipVariants>

/**
 * 标签胶囊
 *
 * 用作筛选、切换等轻量操作；样式由 `chipVariants` 组合。
 *
 * @param variant solid（实底） / soft（浅底） / outlined（描边）
 * @param tone default / primary / coral / success
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, size, shape, tone, ...props }, ref) => (
    <button
      type="button"
      className={chipVariants({ variant, size, shape, tone, class: className })}
      ref={ref}
      {...props}
    />
  ),
)
Chip.displayName = 'Chip'

const fieldActionChip = tv({
  extend: chipVariants,
  base: [
    // 可用：浅珊瑚（accent 底 / coral 字）；禁用：灰底、不透明
    'h-11 min-w-16 shrink-0 gap-1.5 rounded-control px-3.75 text-xs font-semibold',
    'bg-accent text-coral',
    'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
  ],
  defaultVariants: {
    variant: 'soft',
    size: 'md',
    shape: 'rounded',
    tone: 'coral',
  },
})

export type FieldActionChipProps = Omit<ChipProps, 'variant' | 'size' | 'shape' | 'tone'>

/** 输入框旁的软珊瑚操作胶囊（Genesis MAX / 社区绑定） */
export const FieldActionChip = forwardRef<HTMLButtonElement, FieldActionChipProps>(
  ({ className, ...props }, ref) => (
    <button type="button" className={fieldActionChip({ class: className })} ref={ref} {...props} />
  ),
)
FieldActionChip.displayName = 'FieldActionChip'

/** 「最大」胶囊的样式槽位 */
const amountMaxChip = tv({
  extend: chipVariants,
  base: [
    'h-6.75 min-w-0 shrink-0 gap-0 rounded-chip px-3 text-xs/3.75 font-semibold',
    'bg-accent text-coral-emphasis',
    'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
  ],
  defaultVariants: {
    variant: 'soft',
    size: 'md',
    shape: 'rounded',
    tone: 'coral',
  },
})

export type AmountMaxChipProps = Omit<ChipProps, 'variant' | 'size' | 'shape' | 'tone'>

/**
 * 金额输入框内的「最大」胶囊
 *
 * 浅珊瑚底 + 珊瑚字；比 FieldActionChip 矮，不另设任意尺寸。
 */
export const AmountMaxChip = forwardRef<HTMLButtonElement, AmountMaxChipProps>(
  ({ className, ...props }, ref) => (
    <button type="button" className={amountMaxChip({ class: className })} ref={ref} {...props} />
  ),
)
AmountMaxChip.displayName = 'AmountMaxChip'
