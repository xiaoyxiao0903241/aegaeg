/**
 * DApp detail / widget spacing + left-card chrome SSOT — rem @ 16px root, scales with site-fluid.
 *
 * ## Rhythm (do not mix axes)
 *
 * | Axis | Token | PC | H5 | Applied on |
 * |------|-------|----|----|------------|
 * | Block → block | `dappDetailSectionGapClass` | 34px (`mt-8.5`) | 24px (`mt-6`) | `<section>` / `DappSection` |
 * | Title → content | `dappDetailTitleGapClass` | 16px (`pb-4`) | 16px (`pb-4`) | headings, section titles, FAQs |
 * | Detail page top | `DappDetailPage` `[&>section:first-child]:mt-0` | 0 | 0 | first `DappSection` (e.g. Community invite when disconnected) |
 * | Widget stack | `dappWidgetBodyClass` | 8px (`gap-2`) | same | left-column children |
 * | Detail section title | Text `section` via `DappContentHeading` / `DappSection` | token | token | **no** per-tab tracking/leading |
 * | Widget title / desc | Text `panel` + `copy` via `DappPanelHeader` | token | token | **no** per-tab size/tracking |
 * | Primary pill CTA | `DappActionButton` density | card **42** · external **44** · inverse **38** | same | Claim/Copy / Swap·Join / dark promo |
 *
 * ## Usage
 * - `DappContentHeading` + free-form block = one visual section; the **next** `DappSection`
 *   still gets `dappDetailSectionGapClass`.
 * - `DappCollapsibleSection`: title button carries `dappDetailTitleGapClass`; outer h3 uses `pb-0`.
 * - Do **not** re-pad left cards with `px-4 py-3.5` — Card / `DappSideCard` owns chrome.
 * - Do **not** override pill `min-h-*` at call sites — use `DappActionButton` density.
 *
 * ## Anti-patterns
 * - `group-data-[tab=*]/shell:max-dapp:mt-0` on `DappSection` to “tighten H5”.
 * - Extra `mt-*` inside `DappSection` for title→content — use `pb-4` on title.
 * - Per-tab title tracking / leading / size forks on headings or panel header.
 * - Parallel MetricCard chrome on Swap vs Genesis — use `metricCardChromeClass` / MetricCard defaults.
 *
 * Season card / carousel styles live in `season-card.ts` (`tv()`), not here.
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

/**
 * Left-column outlined card chrome — matches Card `surface="outlined"`.
 * Prefer `DappSideCard` / bare Card; use this only when composing without those wrappers.
 */
export const dappSideCardChromeClass = 'rounded-md p-3.5'
