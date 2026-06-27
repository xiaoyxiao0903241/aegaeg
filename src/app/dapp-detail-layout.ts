import { cn } from '~/lib/utils'

/**
 * DApp detail / widget spacing SSOT — Figma dcol `dl` pb-[16px], section pt-[34px].
 * All values are rem-based (@ 16px root) and scale with site-fluid.
 */

/** Page / section title → first content block (Figma 16px / H5 12px) */
export const dappDetailTitleGapClass = 'pb-4 max-dapp:pb-3'

/** Detail column scroll bottom inset — PC shadow bleed only (shell window owns H5 page inset). */
export const dappDetailPageBottomClass =
  'dapp:pb-[calc(1.875rem+var(--shadow-bleed))]'

/** Major block → next block (Figma 34px ≈ 8.5 / H5 24px) */
export const dappDetailSectionGapClass = 'mt-8.5 max-dapp:mt-6'

/** Widget connect / promo card top gap — same rhythm as title→content */
export const dappWidgetFooterTopGapClass = 'mt-3.5 max-dapp:mt-3'

/** Genesis season carousel — Figma `4150:19854` @ 16px root */
export const seasonCarouselMaxWidthClass = 'w-full min-w-0'
export const seasonCardSizeClass = 'min-h-[7.8125rem] w-[8.75rem]'
export const seasonCarouselSlideGapClass = 'pl-2.5'
export const seasonCarouselTrackBleedClass = '-ml-2.5'
export const seasonCarouselViewportClass = 'w-full min-w-0 overflow-x-hidden overflow-y-visible'
export const seasonCarouselControlsGapClass = 'gap-2.5'

/** w-5 fade sits in px gutter — not over card edges (same bleed pattern as token carousel) */
export const seasonCarouselEdgeBleedClass = '-mx-5 min-w-0 w-[calc(100%+2.5rem)] px-5'

export const seasonCardTitleClass =
  'text-[length:var(--dapp-season-title-size)] font-semibold leading-[1.3] tracking-[-0.02em] text-ink-strong'
export const seasonCardMetaClass =
  'text-[length:var(--dapp-season-meta-size)] leading-[1.5] tracking-[-0.02em] text-muted-foreground'
export const seasonCardBadgeClass =
  'text-[length:var(--dapp-season-badge-size)] font-medium leading-[1.3]'
export const seasonCardRadiusClass = 'rounded-[length:var(--dapp-season-card-radius)]'
export const seasonCardRadioClass =
  'size-[length:var(--dapp-season-radio-size)] rounded-[calc(var(--dapp-season-radio-size)/2)]'

export function seasonCarouselEdgeFadeClass(side: 'left' | 'right', visible: boolean) {
  return cn(
    'pointer-events-none absolute inset-y-0 z-[1] w-5 from-card to-transparent transition-opacity duration-200',
    side === 'left' ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l',
    visible ? 'opacity-100' : 'opacity-0',
  )
}
