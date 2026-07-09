import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'

/**
 * Primitive：小控件（percent buttons、badges、tabs、tags）。
 * SSOT：docs/foundation/api.md §4
 *
 * 公开轴：variant × size × shape × tone
 */
/** Align press language with Button (§3) — scale, not translate lift. */
const chipPressMotionClass =
  'origin-center hover:scale-[1.008] focus-visible:scale-[1.008] active:scale-[0.992] active:duration-75'

export const chipVariants = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center whitespace-nowrap',
    'transition-[border-color,background-color,color,box-shadow,transform] duration-160 ease-out',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
    chipPressMotionClass,
  ],
  variants: {
    variant: {
      /** no layout border — solid fill only; soft keeps 1px transparent for tab row height parity with outlined */
      solid: 'border-0',
      soft: 'border border-transparent',
      outlined: 'border bg-transparent',
    },
    size: {
      /** caption + py-1.5 → ~22px (dev Coming soon / compact badge) */
      sm: 'px-2 py-1.5 text-[length:var(--type-caption-size)] font-[var(--type-caption-weight)] leading-none tracking-[var(--type-caption-tracking)]',
      /**
       * Percent / segment row — match 4175 flash percent buttons:
       * text-xs · semibold · py-1.25 · ~30×83
       * (fill comes from variant×tone — do not put bg-card on size)
       */
      md: 'justify-center px-1.5 py-1.25 text-xs font-semibold leading-normal tracking-[-0.02em] max-dapp:py-1.5',
      /**
       * FAQ / pill tabs — match 4175 Trade FAQ USD1|AGX|X:
       * text-sm · semibold · leading-snug (19.25) · px-4 py-2 · ~37px
       */
      lg: 'justify-center px-4 py-2 text-sm font-semibold leading-snug tracking-[-0.02em]',
    },
    shape: {
      pill: 'rounded-full',
      /** swap percent SSOT — radius-chip 9px（≠ radius-sm 14px） */
      rounded: 'rounded-chip',
    },
    tone: {
      default: '',
      primary: '',
      /** Figma `accent/primary (coral)` — LIVE/MAX; ≠ token `primary` `#e86a43` */
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

/**
 * Field-adjacent action (Genesis MAX · Community Bind) — soft coral Chip chrome.
 * Pair with `variant="soft" tone="coral" size="md" shape="rounded"`.
 */
export const fieldActionChipClass = cn(
  'h-11 min-w-16 shrink-0 gap-1.5 rounded-control px-[0.9375rem] text-xs font-semibold',
  'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
)

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
