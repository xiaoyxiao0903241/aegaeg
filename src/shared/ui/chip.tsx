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
      /** no layout border — solid/soft fill only; outlined owns 1px border */
      solid: 'border-0',
      soft: 'border-0',
      outlined: 'border bg-transparent',
    },
    size: {
      /** caption + py-1.5 → ~22px (dev Coming soon / compact badge) */
      sm: 'px-2 py-1.5 text-[length:var(--type-caption-size)] font-[var(--type-caption-weight)] leading-none tracking-[var(--type-caption-tracking)]',
      /**
       * Percent / segment row — match 4175 flash percent buttons:
       * text-xs · semibold · py-1.25 · bg-card · ~30×83
       * (not min-h-8 / copy 13px — that was a REGRESSION vs swap pct probe)
       */
      md: 'justify-center bg-card px-1.5 py-1.25 text-xs font-semibold leading-normal tracking-[-0.02em] max-dapp:py-1.5',
    },
    shape: {
      pill: 'rounded-full',
      /** 0.5625rem = 9px — swap percent SSOT (not radius-sm 14px) */
      rounded: 'rounded-[0.5625rem]',
    },
    tone: {
      default: '',
      primary: '',
      success: '',
    },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'default', class: 'bg-card text-foreground' },
    { variant: 'solid', tone: 'primary', class: 'bg-primary text-primary-foreground' },
    { variant: 'solid', tone: 'success', class: 'bg-success text-success-foreground' },
    { variant: 'soft', tone: 'default', class: 'bg-muted text-foreground' },
    { variant: 'soft', tone: 'primary', class: 'bg-accent text-primary' },
    { variant: 'soft', tone: 'success', class: 'bg-[rgba(43,171,106,0.12)] text-success' },
    {
      variant: 'outlined',
      tone: 'default',
      class:
        'border-border text-muted-foreground hover:-translate-y-px hover:border-primary hover:bg-card hover:text-primary',
    },
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
