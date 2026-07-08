# Swap 样式栈基线（Phase 0）

Captured from `http://127.0.0.1:4175` · 2026-07-08

## Foundation 组件（5）

| 组件 | 单一 owner | 说明 |
|------|-----------|------|
| Text | `src/shared/ui/text.tsx` variant + tone | 10 + 3 compound（见 text-refactor-plan.md） |
| Button | `src/shared/ui/button.tsx` | variant × size × shape |
| Card | `src/shared/ui/card.tsx` surface | padding/gap 见 component-anatomy.md |
| FaqList | `src/shared/ui/faq-list.tsx` | question + detail |
| AmountInput | `src/shared/ui/amount-input.tsx` | amount token |

## Swap 探针 call site（top 20+）

### dapp-swap-desktop

| ID | Group | Owner | Tag | fontSize | lineHeight | color |
|----|-------|-------|-----|----------|------------|-------|
| rail-tab-swap-active | rail | `dapp-rail.tsx + shellRailItemClass` | span | 12px | 16.5px | oklch(0.6683 0.1625 36.6) |
| rail-tab-cobuild-inactive | rail | `dapp-rail.tsx + shellRailItemClass` | span | 12px | 16.5px | oklch(0 0 0 / 0.7) |
| rail-tab-rewards-inactive | rail | `dapp-rail.tsx + shellRailItemClass` | span | 12px | 16.5px | oklch(0 0 0 / 0.7) |
| rail-tab-community-inactive | rail | `dapp-rail.tsx + shellRailItemClass` | span | 12px | 16.5px | oklch(0 0 0 / 0.7) |
| rail-tab-btn-cobuild | rail-layout | `shellRailItemClass` | button | 12px | 16.5px | oklch(0 0 0 / 0.7) |
| topbar-brand | shell | `header brand Text/link` | span | 18px | 28px | oklch(0.1635 0.0136 264.09) |
| topbar-connect | shell | `.aegis-thirdweb-button-primary` | button | 14px | 14px | oklch(1 0 89.88) |
| topbar-lang | shell | `header lang pill` | — | — | — | — |
| widget-h1 | widget-text | `swap-widget-header / widget-title` | h1 | 21px | 31.5px | oklch(0.1635 0.0136 264.09) |
| widget-subtitle | widget-text | `swap-widget-header / meta` | p | 13px | 18.2px | oklch(0 0 0 / 0.7) |
| mode-card-convert-title | widget-card | `swap-mode-card / headline` | strong | 13px | 19.5px | oklch(0.1635 0.0136 264.09) |
| mode-card-convert-body | widget-card | `swap-mode-card / meta` | span | 13px | 19.5px | oklch(0 0 0 / 0.5) |
| mode-card-trade-title | widget-card | `swap-mode-card / headline` | strong | 13px | 19.5px | oklch(0.1635 0.0136 264.09) |
| mode-card-trade-body | widget-card | `swap-mode-card / meta` | span | 13px | 19.5px | oklch(0 0 0 / 0.5) |
| mode-card-burn-title | widget-card | `swap-mode-card / headline` | strong | 13px | 19.5px | oklch(0.1635 0.0136 264.09) |
| mode-card-burn-body | widget-card | `swap-mode-card / meta` | span | 13px | 19.5px | oklch(0 0 0 / 0.5) |
| mode-card-burn-badge | widget-card | `swap-mode-card / mode-badge` | span | 10px | 10px | rgb(255, 255, 255) |
| mode-card-root-convert | widget-card-layout | `swapModeCard tv` | button | 16px | normal | oklch(0 0 0 / 0.5) |
| widget-connect-promo-title | widget-card | `dapp-connect-promo-card` | — | — | — | — |
| detail-h2-program | detail-text | `swap-hub-content / section` | h2 | 18px | 23.4px | oklch(0.1635 0.0136 264.09) |
| detail-h2-faq | detail-text | `swap-hub-content / section` | h2 | 18px | 23.4px | oklch(0.1635 0.0136 264.09) |
| program-card-0-title | detail-card | `swap-program-card / ProgramCard` | strong | 16px | 24px | oklch(0.1635 0.0136 264.09) |
| program-card-0-body | detail-card | `swap-promo-card / meta` | p | 12px | 18px | oklch(0 0 0 / 0.7) |
| program-card-0-kicker | detail-card | `swap-program-card / kicker` | — | — | — | — |
| about-card-title | detail-card | `swap-promo-card / headline` | strong | 16px | 24px | oklch(0.1635 0.0136 264.09) |
| program-section-grid | detail-layout | `swap-program-cards` | div | 16px | normal | oklch(0 0 0 / 0.5) |
| program-card-hero | detail-card | `swap-program-card / program-body` | button | 16px | normal | oklch(0 0 0 / 0.5) |
| faq-question-0 | detail-card | `faq-list / question` | span | 14px | 18.2px | oklch(0.1635 0.0136 264.09) |
| detail-page-root | detail-layout | `DappDetailPage` | section | 16px | normal | oklch(0 0 0 / 0.5) |

#### 样式栈模板（改前 effective）

```text
Call site: Swap probe — rail-tab-swap-active
Owner: dapp-rail.tsx + shellRailItemClass
Selector: nav[aria-label="DApp sections"] button[role="tab"] span[title]
PC effective: 12px · 400 · 16.5px · oklch(0.6683 0.1625 36.6)
```

```text
Call site: Swap probe — rail-tab-cobuild-inactive
Owner: dapp-rail.tsx + shellRailItemClass
Selector: nav[aria-label="DApp sections"] button[role="tab"] span[title]
PC effective: 12px · 400 · 16.5px · oklch(0 0 0 / 0.7)
```

```text
Call site: Swap probe — rail-tab-rewards-inactive
Owner: dapp-rail.tsx + shellRailItemClass
Selector: nav[aria-label="DApp sections"] button[role="tab"] span[title]
PC effective: 12px · 400 · 16.5px · oklch(0 0 0 / 0.7)
```

```text
Call site: Swap probe — rail-tab-community-inactive
Owner: dapp-rail.tsx + shellRailItemClass
Selector: nav[aria-label="DApp sections"] button[role="tab"] span[title]
PC effective: 12px · 400 · 16.5px · oklch(0 0 0 / 0.7)
```

```text
Call site: Swap probe — rail-tab-btn-cobuild
Owner: shellRailItemClass
Selector: nav[aria-label="DApp sections"] button[role="tab"]
PC effective: 12px · 400 · 16.5px · oklch(0 0 0 / 0.7)
```

```text
Call site: Swap probe — topbar-brand
Owner: header brand Text/link
Selector: header a[aria-label*="home"] span, header .container > a span
PC effective: 18px · 600 · 28px · oklch(0.1635 0.0136 264.09)
```

```text
Call site: Swap probe — topbar-connect
Owner: .aegis-thirdweb-button-primary
Selector: .aegis-thirdweb-button-primary, .aegis-thirdweb-button
PC effective: 14px · 600 · 14px · oklch(1 0 89.88)
```

```text
Call site: Swap probe — widget-h1
Owner: swap-widget-header / widget-title
Selector: [data-dapp-widget-panel] h1
PC effective: 21px · 600 · 31.5px · oklch(0.1635 0.0136 264.09)
```

```text
Call site: Swap probe — widget-subtitle
Owner: swap-widget-header / meta
Selector: [data-dapp-widget-panel] h1 ~ p
PC effective: 13px · 400 · 18.2px · oklch(0 0 0 / 0.7)
```

```text
Call site: Swap probe — mode-card-convert-title
Owner: swap-mode-card / headline
Selector: [data-dapp-widget-panel] button.rounded-md strong, [data-dapp-widget-panel] button.rounded-md span.font-semibold
PC effective: 13px · 600 · 19.5px · oklch(0.1635 0.0136 264.09)
```

```text
Call site: Swap probe — mode-card-convert-body
Owner: swap-mode-card / meta
Selector: [data-dapp-widget-panel] button.rounded-md p, [data-dapp-widget-panel] button.rounded-md span.text-muted-foreground, [data-dapp-widget-panel] button.rounded-md span.text-ink-muted
PC effective: 13px · 400 · 19.5px · oklch(0 0 0 / 0.5)
```

### dapp-swap-h5

| ID | Group | Owner | Tag | fontSize | lineHeight | color |
|----|-------|-------|-----|----------|------------|-------|
| rail-tab-swap-active | rail | `dapp-rail.tsx + shellRailItemClass` | span | 13px | 17.875px | oklch(0.6683 0.1625 36.6) |
| rail-tab-cobuild-inactive | rail | `dapp-rail.tsx + shellRailItemClass` | span | 13px | 17.875px | oklch(0 0 0 / 0.7) |
| rail-tab-rewards-inactive | rail | `dapp-rail.tsx + shellRailItemClass` | span | 13px | 17.875px | oklch(0 0 0 / 0.7) |
| rail-tab-community-inactive | rail | `dapp-rail.tsx + shellRailItemClass` | span | 13px | 17.875px | oklch(0 0 0 / 0.7) |
| rail-tab-btn-cobuild | rail-layout | `shellRailItemClass` | button | 13px | 17.875px | oklch(0 0 0 / 0.7) |
| topbar-brand | shell | `header brand Text/link` | span | 17px | 25.5px | oklch(0.1635 0.0136 264.09) |
| topbar-connect | shell | `.aegis-thirdweb-button-primary` | button | 13px | 13px | oklch(1 0 89.88) |
| topbar-lang | shell | `header lang pill` | — | — | — | — |
| widget-h1 | widget-text | `swap-widget-header / widget-title` | h1 | 21px | 31.5px | oklch(0.1635 0.0136 264.09) |
| widget-subtitle | widget-text | `swap-widget-header / meta` | p | 13px | 18.2px | oklch(0 0 0 / 0.7) |
| mode-card-convert-title | widget-card | `swap-mode-card / headline` | strong | 13px | 19.5px | oklch(0.1635 0.0136 264.09) |
| mode-card-convert-body | widget-card | `swap-mode-card / meta` | span | 13px | 19.5px | oklch(0 0 0 / 0.5) |
| mode-card-trade-title | widget-card | `swap-mode-card / headline` | strong | 13px | 19.5px | oklch(0.1635 0.0136 264.09) |
| mode-card-trade-body | widget-card | `swap-mode-card / meta` | span | 13px | 19.5px | oklch(0 0 0 / 0.5) |
| mode-card-burn-title | widget-card | `swap-mode-card / headline` | strong | 13px | 19.5px | oklch(0.1635 0.0136 264.09) |
| mode-card-burn-body | widget-card | `swap-mode-card / meta` | span | 13px | 19.5px | oklch(0 0 0 / 0.5) |
| mode-card-burn-badge | widget-card | `swap-mode-card / mode-badge` | span | 10px | 10px | rgb(255, 255, 255) |
| mode-card-root-convert | widget-card-layout | `swapModeCard tv` | button | 16px | normal | oklch(0 0 0 / 0.5) |
| widget-connect-promo-title | widget-card | `dapp-connect-promo-card` | — | — | — | — |
| detail-h2-program | detail-text | `swap-hub-content / section` | h2 | 17px | 22.1px | oklch(0.1635 0.0136 264.09) |
| detail-h2-faq | detail-text | `swap-hub-content / section` | h2 | 17px | 22.1px | oklch(0.1635 0.0136 264.09) |
| program-card-0-title | detail-card | `swap-program-card / ProgramCard` | strong | 15px | 21.4286px | oklch(0.1635 0.0136 264.09) |
| program-card-0-body | detail-card | `swap-promo-card / meta` | p | 13px | 19.5px | rgb(91, 100, 114) |
| program-card-0-kicker | detail-card | `swap-program-card / kicker` | — | — | — | — |
| about-card-title | detail-card | `swap-promo-card / headline` | strong | 15px | 21.4286px | oklch(0.1635 0.0136 264.09) |
| program-section-grid | detail-layout | `swap-program-cards` | div | 16px | normal | oklch(0 0 0 / 0.5) |
| program-card-hero | detail-card | `swap-program-card / program-body` | button | 16px | normal | oklch(0 0 0 / 0.5) |
| faq-question-0 | detail-card | `faq-list / question` | span | 15px | 19.5px | oklch(0.1635 0.0136 264.09) |
| detail-page-root | detail-layout | `DappDetailPage` | section | 16px | normal | oklch(0 0 0 / 0.5) |

#### 样式栈模板（改前 effective）

```text
Call site: Swap probe — rail-tab-swap-active
Owner: dapp-rail.tsx + shellRailItemClass
Selector: nav[aria-label="DApp sections"] button[role="tab"] span[title]
PC effective: 13px · 400 · 17.875px · oklch(0.6683 0.1625 36.6)
```

```text
Call site: Swap probe — rail-tab-cobuild-inactive
Owner: dapp-rail.tsx + shellRailItemClass
Selector: nav[aria-label="DApp sections"] button[role="tab"] span[title]
PC effective: 13px · 400 · 17.875px · oklch(0 0 0 / 0.7)
```

```text
Call site: Swap probe — rail-tab-rewards-inactive
Owner: dapp-rail.tsx + shellRailItemClass
Selector: nav[aria-label="DApp sections"] button[role="tab"] span[title]
PC effective: 13px · 400 · 17.875px · oklch(0 0 0 / 0.7)
```

```text
Call site: Swap probe — rail-tab-community-inactive
Owner: dapp-rail.tsx + shellRailItemClass
Selector: nav[aria-label="DApp sections"] button[role="tab"] span[title]
PC effective: 13px · 400 · 17.875px · oklch(0 0 0 / 0.7)
```

```text
Call site: Swap probe — rail-tab-btn-cobuild
Owner: shellRailItemClass
Selector: nav[aria-label="DApp sections"] button[role="tab"]
PC effective: 13px · 400 · 17.875px · oklch(0 0 0 / 0.7)
```

```text
Call site: Swap probe — topbar-brand
Owner: header brand Text/link
Selector: header a[aria-label*="home"] span, header .container > a span
PC effective: 17px · 600 · 25.5px · oklch(0.1635 0.0136 264.09)
```

```text
Call site: Swap probe — topbar-connect
Owner: .aegis-thirdweb-button-primary
Selector: .aegis-thirdweb-button-primary, .aegis-thirdweb-button
PC effective: 13px · 600 · 13px · oklch(1 0 89.88)
```

```text
Call site: Swap probe — widget-h1
Owner: swap-widget-header / widget-title
Selector: [data-dapp-widget-panel] h1
PC effective: 21px · 600 · 31.5px · oklch(0.1635 0.0136 264.09)
```

```text
Call site: Swap probe — widget-subtitle
Owner: swap-widget-header / meta
Selector: [data-dapp-widget-panel] h1 ~ p
PC effective: 13px · 400 · 18.2px · oklch(0 0 0 / 0.7)
```

```text
Call site: Swap probe — mode-card-convert-title
Owner: swap-mode-card / headline
Selector: [data-dapp-widget-panel] button.rounded-md strong, [data-dapp-widget-panel] button.rounded-md span.font-semibold
PC effective: 13px · 600 · 19.5px · oklch(0.1635 0.0136 264.09)
```

```text
Call site: Swap probe — mode-card-convert-body
Owner: swap-mode-card / meta
Selector: [data-dapp-widget-panel] button.rounded-md p, [data-dapp-widget-panel] button.rounded-md span.text-muted-foreground, [data-dapp-widget-panel] button.rounded-md span.text-ink-muted
PC effective: 13px · 400 · 19.5px · oklch(0 0 0 / 0.5)
```
