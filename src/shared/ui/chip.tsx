import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'

/**
 * Primitive：小控件（percent buttons、badges、tabs、tags）。
 * SSOT：docs/foundation/api.md §4
 *
 * 公开轴：variant × size × shape × tone
 */
export const chipVariants = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center whitespace-nowrap',
    'transition-[border-color,background-color,color,box-shadow,transform] duration-180 ease-out',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
  ],
  variants: {
    variant: {
      solid: 'border border-transparent',
      soft: 'border border-transparent',
      outlined: 'border bg-transparent',
    },
    size: {
      sm: 'min-h-6 px-2 text-[length:var(--type-caption-size)] font-semibold leading-normal tracking-[var(--type-caption-tracking)]',
      md: 'min-h-8 px-3 text-[length:var(--type-copy-size)] font-semibold leading-normal tracking-[var(--type-copy-tracking)]',
    },
    shape: {
      pill: 'rounded-full',
      rounded: 'rounded-sm',
    },
    tone: {
      default: '',
      primary: '',
      success: '',
    },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'default', class: 'bg-card text-foreground border-border' },
    { variant: 'solid', tone: 'primary', class: 'bg-primary text-primary-foreground' },
    { variant: 'solid', tone: 'success', class: 'bg-success text-success-foreground' },
    { variant: 'soft', tone: 'default', class: 'bg-muted text-foreground' },
    { variant: 'soft', tone: 'primary', class: 'bg-accent text-primary' },
    { variant: 'soft', tone: 'success', class: 'bg-[rgba(43,171,106,0.12)] text-success' },
    { variant: 'outlined', tone: 'default', class: 'border-border text-muted-foreground hover:bg-muted hover:text-foreground' },
    { variant: 'outlined', tone: 'primary', class: 'border-primary text-primary hover:bg-accent' },
    { variant: 'outlined', tone: 'success', class: 'border-success text-success hover:bg-[rgba(43,171,106,0.12)]' },
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
      className={cn(chipVariants({ variant, size, shape, tone }), className)}
      ref={ref}
      {...props}
    />
  ),
)
Chip.displayName = 'Chip'
