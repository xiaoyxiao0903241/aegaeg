import { tv } from 'tailwind-variants'

/**
 * Genesis season card.
 * Layout / color only — typography via `<Text>`.
 * Colors: `coral` selected/LIVE · `coral-emphasis` discount · `band` Ended.
 * H5 sizes via `--dapp-season-*` as display-size overrides on Text.
 */
export const seasonCard = tv({
  slots: {
    root: [
      'flex shrink-0 flex-col gap-1.5 border bg-card p-3',
      'w-35',
      'rounded-(--dapp-season-card-radius)',
    ],
    /** Display size only — weight/leading/tracking from Text variant unless noted. */
    title: 'text-(length:--dapp-season-title-size) text-foreground',
    // Figma 4151:340 — meta Regular (400) via caption; badge Medium (500) override.
    meta: 'm-0 text-(length:--dapp-season-meta-size) text-muted-foreground',
    metaAccent: 'text-coral-emphasis',
    radio: 'size-(--dapp-season-radio-size) rounded-[calc(var(--dapp-season-radio-size)/2)]',
    badge:
      'flex w-full items-center justify-center rounded-full px-2.25 py-0.5 text-(length:--dapp-season-badge-size) font-medium whitespace-nowrap',
  },
  variants: {
    selected: {
      true: {
        root: 'border-coral',
        radio: 'border-coral [&_span]:bg-coral',
      },
      false: {
        root: 'border-border',
      },
    },
    status: {
      live: { badge: 'bg-accent text-coral' },
      ended: { badge: 'bg-band text-muted-foreground' },
    },
  },
  defaultVariants: {
    selected: false,
    status: 'ended',
  },
})

export const seasonCarousel = tv({
  slots: {
    root: 'flex w-full min-w-0 flex-col gap-2.5 overflow-visible',
    bleed: 'relative -mx-5 w-[calc(100%+2.5rem)] min-w-0 overflow-visible px-5',
    track: '-ml-2.5 flex items-stretch',
    viewport: 'w-full min-w-0 overflow-x-hidden overflow-y-visible',
    slide: 'shrink-0 grow-0 basis-auto pl-2.5',
    fade: 'pointer-events-none absolute inset-y-0 z-1 w-5 from-card to-transparent transition-opacity duration-200',
  },
  variants: {
    fadeSide: {
      left: { fade: 'left-0 bg-linear-to-r' },
      right: { fade: 'right-0 bg-linear-to-l' },
    },
    fadeVisible: {
      true: { fade: 'opacity-100' },
      false: { fade: 'opacity-0' },
    },
  },
})
