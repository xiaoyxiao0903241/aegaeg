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
 *
 * Season card / carousel styles live in `season-selector.tsx` (`tv()`), not here.
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
