import { tv } from 'tailwind-variants'

/**
 * Card — four surfaces; fine-tune layout via className.
 * outlined chrome SSOT（hub 左卡 / InteractiveCard）：border · radius/md · p-4 · 无阴影。
 */
export const cardVariants = tv({
  base: 'bg-card text-card-foreground',
  variants: {
    surface: {
      outlined: 'rounded-md border border-border p-4',
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
