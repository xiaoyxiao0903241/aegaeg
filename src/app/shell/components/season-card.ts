import { tv } from 'tailwind-variants'

/**
 * Genesis season card — Figma `4150:19854` @ 16px root.
 * Layout / color only — typography via `<Text>` (runbook: no parallel type scale).
 * Colors: `coral` selected/LIVE · `coral-emphasis` discount · `band` Ended.
 * H5 sizes via `--dapp-season-*` (+1 KEEP) as display-size overrides on Text.
 */
export const seasonCard = tv({
  slots: {
    root: [
      'flex shrink-0 flex-col gap-1.5 border bg-card p-3',
      'min-h-[7.8125rem] w-[8.75rem]',
      'rounded-[length:var(--dapp-season-card-radius)]',
    ],
    /** Display size only — weight/leading/tracking from Text variant. */
    title: 'text-[length:var(--dapp-season-title-size)] text-foreground',
    meta: 'm-0 text-[length:var(--dapp-season-meta-size)] text-muted-foreground',
    metaAccent: 'text-coral-emphasis',
    radio:
      'size-[length:var(--dapp-season-radio-size)] rounded-[calc(var(--dapp-season-radio-size)/2)]',
    badge:
      'flex w-full items-center justify-center rounded-full px-2.25 py-0.5 whitespace-nowrap text-[length:var(--dapp-season-badge-size)]',
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
    root: 'flex min-w-0 w-full flex-col gap-2.5 overflow-visible',
    bleed: 'relative -mx-5 min-w-0 w-[calc(100%+2.5rem)] overflow-visible px-5',
    track: 'flex -ml-2.5 items-stretch',
    viewport: 'w-full min-w-0 overflow-x-hidden overflow-y-visible',
    slide: 'shrink-0 grow-0 basis-auto pl-2.5',
    fade: 'pointer-events-none absolute inset-y-0 z-[1] w-5 from-card to-transparent transition-opacity duration-200',
  },
  variants: {
    fadeSide: {
      left: { fade: 'left-0 bg-gradient-to-r' },
      right: { fade: 'right-0 bg-gradient-to-l' },
    },
    fadeVisible: {
      true: { fade: 'opacity-100' },
      false: { fade: 'opacity-0' },
    },
  },
})
