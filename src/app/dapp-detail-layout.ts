import { cn } from '~/lib/utils'

/**
 * DApp detail / widget spacing SSOT — rem @ 16px root, scales with site-fluid.
 *
 * ## Two-axis rhythm (do not mix)
 *
 * | Axis | Token | PC | H5 | Applied on |
 * |------|-------|----|----|------------|
 * | Block → block | `dappDetailSectionGapClass` | 34px (`mt-8.5`) | 24px (`mt-6`) | `<section>` / `DappSection` |
 * | Title → content | `dappDetailTitleGapClass` | 16px (`pb-4`) | 16px (`pb-4`) | headings, section titles, FAQs title → first item |
 *
 * ## Usage
 * - `DappContentHeading` + free-form block (e.g. `MetricGrid`) = one visual section; the **next**
 *   `DappSection` still gets `dappDetailSectionGapClass` — do not zero `mt` unless it is the first
 *   major block in the detail column.
 * - `DappCollapsibleSection`: title button carries `dappDetailTitleGapClass`; outer h3 uses `pb-0`.
 * - Widget footer promo: `dappWidgetFooterTopGapClass` (14px PC / 12px H5).
 *
 * ## Anti-patterns
 * - `group-data-[tab=*]/shell:max-dapp:mt-0` on `DappSection` to “tighten H5” — removes block gap;
 *   fix shell/widget stacking instead.
 * - Extra `mt-*` on content wrappers inside `DappSection` for title→content gap — use `pb-4` on title.
 * - Per-page `pb-*` on section titles — import tokens from this file.
 */

/** Page / section title → first content block (16px @ 16px root); FAQs title → first item uses the same token */
export const dappDetailTitleGapClass = 'pb-4'

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
