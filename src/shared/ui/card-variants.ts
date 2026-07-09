import { tv } from 'tailwind-variants'

/** Card — four surfaces; fine-tune spacing/radius via className. */
export const cardVariants = tv({
  base: 'bg-card text-card-foreground',
  variants: {
    surface: {
      outlined: 'rounded-md border border-border p-3.5',
      elevated: 'rounded-md bg-card p-3.5 shadow-card',
      /** FAQ / Accordion shell — elevation + radius; body owns padding. */
      soft: 'overflow-hidden rounded-2xl bg-card shadow-faq',
      inverse: 'rounded-md bg-dark p-4 text-white shadow-subtle',
    },
  },
  defaultVariants: {
    surface: 'outlined',
  },
})

export type CardSurface = keyof typeof cardVariants.variants.surface
