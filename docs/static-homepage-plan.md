# AEGIS X Static Homepage Implementation Plan

> **代码现状 SSOT**：[`homepage-architecture.md`](./homepage-architecture.md)（今天实际怎么跑）  
> **性能优化路线**：[`homepage-load-optimization.md`](./homepage-load-optimization.md)（待实施）  
> **本文**：产品目标与验收意图；**§ Current vs Target** 列出与代码偏差

## Goal

Implement the official Figma homepage and DApp with high first-load performance, responsive layout, and wallet connection on the **DApp entry** (`app.html`).

Figma source of truth (canonical — same as root `AGENTS.md` §8.4):

`https://www.figma.com/design/sXWXDvBrLeg5r0NnP1SMZH/AEGIS-X--Copy---Copy---Copy-`

(Historical file id `vwsbcJZSSj7ssKaTDGyxzL` in older docs — do not use for new work.)

## Layout Rules

- Website homepage content: centered, `max-width: 1200px` on desktop.
- DApp shell/content: centered, `max-width: 1320px` on desktop.
- DApp desktop shell follows the Figma `app-window`: `84px` rail, `400px` side column, remaining content column, `985px` target height.
- Responsive behavior is required for tablet and mobile; preserve Figma visual hierarchy while adapting columns into stacked layouts.
- The homepage visual source is the Figma website page, not the local prototype.

## Current vs Target

| Topic | **Current (code)** | **Target (this plan)** |
|-------|-------------------|------------------------|
| Home entry | `src/home/main.tsx` + `{locale}/index.html` thin shell | Same routing; see architecture doc |
| Home + thirdweb | Home uses shared `WebRootProviders` → loads thirdweb JS | Home **must not** import `thirdweb/react` or `ThirdwebProvider` |
| Home wallet UX | CTA links to `/{locale}/app.html` (no connect on home) | Same — wallet on DApp, not home modal |
| Wallet island on home CTA | **Not implemented** | Was spec’d for hover preload — **deferred**; use DApp entry |
| HTML body | Empty `#root`, CSR only | Optional SSG (Phase 3 in load-optimization) |
| i18n JS | All 11 locales in one bundle | Per-locale inline or lazy (Phase 2) |
| Chains (DApp) | BSC only in `supportedChains` | First release BSC-only here; multi-chain per root `AGENTS.md` roadmap |

## Performance Rules (target)

- The homepage must not import `thirdweb/react` or wrap the full app with `ThirdwebProvider`. → **Gap: not met today** — fix in [`homepage-load-optimization.md` Phase 1](./homepage-load-optimization.md).
- Homepage CTA buttons are static UI at first paint. → **Met** (`<a href="…/app.html">` + button CSS classes).
- Wallet connection happens on **DApp** (`app.html`) via thirdweb `ConnectButton` / connect modal — not on marketing home.
- ~~On CTA hover/focus/touch/click, preload wallet island on home~~ → **Deferred**; do not implement on home until product revisits.
- Keep BSC chain configuration centralized in `src/web3/thirdweb.ts`.
- Animations: CSS + small IO/rAF via `src/wallet-loader.ts` (**home motion boot**, misnamed — not wallet). See [`homepage-animation-guidelines.md`](./homepage-animation-guidelines.md).
- Hero video: WebM alpha + poster; do not preload video body.

## Token Strategy

- Use Tailwind CSS v4 CSS-first tokens.
- Use shadcn-compatible semantic token names for UI consistency.
- Map token values from Figma, using `oklch()` values in CSS variables where practical.
- Keep AEGIS-specific tokens for brand accents, section bands, and token-card colors.
- `home.css` imports `wallet.css` for **CTA button visuals only** — not wallet SDK (see architecture doc).

## Implemented Pages

Homepage order:

1. Nav
2. Hero
3. Protocol
4. Core Engine
5. Token & Ecosystem
6. Metrics
7. Roadmap
8. Security
9. Ecosystem Partners
10. FAQ
11. Footer

(+ optional API-driven popup notice via `use-home-popup-notice`)

DApp: Swap · Genesis · Rewards · Community tabs via `DappShell` on `app.html`.

## Verification

### Today (before Phase 1)

- `pnpm build` — **expect** thirdweb chunks in `dist/en/index.html` until Phase 1 lands.
- Home: sections, motion (`bootWalletLoader`), locale switch, CTA navigates to `/{locale}/app.html`.
- DApp: thirdweb connect modal works on `app.html`.
- Screenshots: `pnpm test:e2e` vs Figma structure.

### Target (after Phase 1+)

- `pnpm build` — Home entry **does not** preload thirdweb wallet chunks.
- Same functional checks; add bundle assert script (load-optimization §6).

## Related docs

| Doc | Role |
|-----|------|
| [`homepage-architecture.md`](./homepage-architecture.md) | **What the code does now** |
| [`homepage-load-optimization.md`](./homepage-load-optimization.md) | How to close the gap |
| [`homepage-animation-guidelines.md`](./homepage-animation-guidelines.md) | Motion design |
| [`refactor-plan-minimal-world-class.md`](./refactor-plan-minimal-world-class.md) | R7 home folder migration |
