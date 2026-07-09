import { forwardRef, type ButtonHTMLAttributes } from 'react'
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
      sm: 'px-2 py-1.5 text-[length:var(--type-caption-size)] font-[var(--type-caption-weight)] leading-none tracking-[var(--type-caption-tracking)]',
      md: 'justify-center px-1.5 py-1.25 text-xs font-semibold leading-normal tracking-[-0.02em] max-dapp:py-1.5',
      lg: 'justify-center px-4 py-2 text-sm font-semibold leading-snug tracking-[-0.02em]',
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
    { variant: 'solid', tone: 'success', class: 'bg-success text-success-foreground' },
    { variant: 'soft', tone: 'default', class: 'bg-muted text-foreground' },
    { variant: 'soft', tone: 'primary', class: 'bg-accent text-primary' },
    { variant: 'soft', tone: 'coral', class: 'bg-accent text-coral' },
    { variant: 'soft', tone: 'success', class: 'bg-success-soft text-success' },
    {
      variant: 'outlined',
      tone: 'default',
      class: 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary',
    },
    { variant: 'outlined', tone: 'primary', class: 'border-primary bg-card text-primary hover:bg-accent' },
    { variant: 'outlined', tone: 'coral', class: 'border-coral bg-card text-coral hover:bg-accent' },
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

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof chipVariants>

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
    'h-11 min-w-16 shrink-0 gap-1.5 rounded-control px-[0.9375rem] text-xs font-semibold',
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

export type FieldActionChipProps = Omit<
  ChipProps,
  'variant' | 'size' | 'shape' | 'tone'
>

/** Genesis MAX / Community Bind — field-adjacent soft coral chip. */
export const FieldActionChip = forwardRef<HTMLButtonElement, FieldActionChipProps>(
  ({ className, ...props }, ref) => (
    <button
      type="button"
      className={fieldActionChip({ class: className })}
      ref={ref}
      {...props}
    />
  ),
)
FieldActionChip.displayName = 'FieldActionChip'
