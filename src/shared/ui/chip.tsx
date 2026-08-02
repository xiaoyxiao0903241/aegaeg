import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

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
      // Figma htab / tokTabs（Trade `4433:484`）h30：py-1.5 + text-base/leading-none → 28（Δ≤2）
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
      variant: 'outlined',
      tone: 'default',
      class: 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary',
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
    // Enabled: soft coral (bg-accent / text-coral). Disabled: muted chrome, full opacity.
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

/** Genesis MAX / Community Bind — field-adjacent soft coral chip (h-11). */
export type FieldActionChipProps = Omit<ChipProps, 'variant' | 'size' | 'shape' | 'tone'>

export const FieldActionChip = forwardRef<HTMLButtonElement, FieldActionChipProps>(
  ({ className, ...props }, ref) => (
    <button type="button" className={fieldActionChip({ class: className })} ref={ref} {...props} />
  ),
)
FieldActionChip.displayName = 'FieldActionChip'

/**
 * Figma `maxB` 4454:648 inside inputBox：
 * 合成 h27 = py-1.5（6）+ text-xs/leading-3.75（12/15）+ py-1.5；圆角 `rounded-chip`（--radius-chip）；
 * bg accent · text coral-emphasis — 非 FieldActionChip h-11。禁任意 *[Npx]。
 */
const amountMaxChip = tv({
  base: [
    'inline-flex h-6.75 min-w-0 shrink-0 cursor-pointer items-center justify-center',
    'rounded-chip bg-accent px-3 text-xs leading-3.75 font-semibold text-coral-emphasis',
    'transition-[border-color,background-color,color,box-shadow,transform] duration-160 ease-out',
    'origin-center hover:scale-[1.008] focus-visible:scale-[1.008] active:scale-[0.992] active:duration-75',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
  ],
})

export type AmountMaxChipProps = Omit<ChipProps, 'variant' | 'size' | 'shape' | 'tone'>

export const AmountMaxChip = forwardRef<HTMLButtonElement, AmountMaxChipProps>(
  ({ className, ...props }, ref) => (
    <button type="button" className={amountMaxChip({ class: className })} ref={ref} {...props} />
  ),
)
AmountMaxChip.displayName = 'AmountMaxChip'
