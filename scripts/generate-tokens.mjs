#!/usr/bin/env node
/**
 * Generate theme.css and tokens.ts from tokens.json.
 *
 * SSOT: src/shared/styles/tokens/tokens.json
 * Outputs:
 *   - src/shared/styles/tokens/theme.css
 *   - src/shared/styles/tokens/tokens.ts
 *
 * Usage:
 *   node scripts/generate-tokens.mjs
 *   node scripts/generate-tokens.mjs --watch
 */
import { readFileSync, watch, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const tokensPath = resolve(root, 'src/shared/styles/tokens/tokens.json')
const cssOutPath = resolve(root, 'src/shared/styles/tokens/theme.css')
const tsOutPath = resolve(root, 'src/shared/styles/tokens/tokens.ts')

/**
 * @typedef {object} ColorToken
 * @property {string} [hex]
 * @property {string} [oklch]
 * @property {string} [ref]
 *
 * @typedef {object} TypeBreakpoint
 * @property {string} size
 * @property {string} weight
 * @property {string} leading
 * @property {string} tracking
 * @property {string} [transform]
 *
 * @typedef {object} TypeToken
 * @property {TypeBreakpoint} pc
 * @property {TypeBreakpoint} h5
 *
 * @typedef {object} ShadowToken
 * @property {string} x
 * @property {string} y
 * @property {string} blur
 * @property {string} color
 *
 * @typedef {object} TokenSet
 * @property {Record<string, ColorToken>} colors
 * @property {Record<string, TypeToken>} type
 * @property {Record<string, string>} space
 * @property {Record<string, string>} radius
 * @property {Record<string, ShadowToken>} shadows
 */

/**
 * Load tokens from JSON.
 * @returns {TokenSet}
 */
function loadTokens() {
  const raw = readFileSync(tokensPath, 'utf8')
  return JSON.parse(raw)
}

/**
 * Build the :root color block.
 * @param {Record<string, ColorToken>} colors
 * @returns {string}
 */
function buildColorVars(colors) {
  const lines = ['  /* ---- semantic colors (hex first for Chromium <111) ---- */']
  for (const [key, token] of Object.entries(colors)) {
    if (token.ref) {
      lines.push(`  --${key}: var(--${token.ref});`)
    } else {
      lines.push(`  --${key}: ${token.hex};`)
      if (token.oklch) {
        lines.push(`  --${key}: ${token.oklch};`)
      }
    }
  }
  return lines.join('\n')
}

/**
 * Build the :root typography block.
 * @param {Record<string, TypeToken>} type
 * @returns {string}
 */
function buildTypeVars(type) {
  const props = ['size', 'weight', 'leading', 'tracking']
  const lines = ['  /* ---- Typography Tier A (rem @16px; scales with html.site-fluid) ---- */']
  for (const [key, token] of Object.entries(type)) {
    for (const prop of props) {
      const value = token.pc[prop]
      if (value !== undefined) {
        lines.push(`  --type-${key}-${prop}: ${value};`)
      }
    }
  }
  return lines.join('\n')
}

/**
 * Build the H5 typography media query.
 * @param {Record<string, TypeToken>} type
 * @returns {string}
 */
function buildH5TypeMedia(type) {
  const props = ['size', 'weight', 'leading', 'tracking']
  const overrides = []
  for (const [key, token] of Object.entries(type)) {
    for (const prop of props) {
      const pcValue = token.pc[prop]
      const h5Value = token.h5[prop]
      if (h5Value !== undefined && h5Value !== pcValue) {
        overrides.push(`    --type-${key}-${prop}: ${h5Value};`)
      }
    }
  }
  if (overrides.length === 0) return ''
  return `/* H5 typography — per-variant Figma table (not blanket +1) */\n@media (max-width: 820px) {\n  :root {\n${overrides.join('\n')}\n  }\n}\n`
}

/**
 * Build space variables.
 * @param {Record<string, string>} space
 * @returns {string}
 */
function buildSpaceVars(space) {
  const lines = Object.entries(space).map(([key, value]) => `  --space-${key}: ${value};`)
  return ['  /* ---- spacing scale ---- */', ...lines].join('\n')
}

/**
 * Build radius variables.
 * @param {Record<string, string>} radius
 * @returns {string}
 */
function buildRadiusVars(radius) {
  const lines = Object.entries(radius).map(([key, value]) => `  --radius-${key}: ${value};`)
  return ['  /* ---- radius scale ---- */', ...lines, '  --radius: 1rem;'].join('\n')
}

/**
 * Build elevation variables from shadows.
 * @param {Record<string, ShadowToken>} shadows
 * @returns {string}
 */
function buildElevationVars(shadows) {
  const lines = Object.entries(shadows).map(([, token], index) => {
    const value = `${token.x} ${token.y} ${token.blur} ${token.color}`
    return `  --elevation-e${index + 1}: ${value};`
  })
  return ['  /* ---- elevation primitives (E1–En from tokens.json shadows) ---- */', ...lines].join(
    '\n',
  )
}

/**
 * Build @theme block.
 * @param {Record<string, ShadowToken>} shadows
 * @param {Record<string, string>} radius
 * @returns {string}
 */
function buildThemeBlock(shadows, radius) {
  const radiusLines = Object.keys(radius).map((key) => `  --radius-${key}: var(--radius-${key});`)
  const shadowKeys = Object.keys(shadows)
  const shadowLines = shadowKeys.map(
    (key, index) => `  --shadow-${key}: var(--elevation-e${index + 1});`,
  )
  return `@theme {\n${radiusLines.join('\n')}\n\n${shadowLines.join('\n')}\n}\n`
}

/**
 * Build @theme inline block.
 * @param {Record<string, ColorToken>} colors
 * @returns {string}
 */
function buildThemeInline(colors) {
  const lines = Object.keys(colors).map((key) => `  --color-${key}: var(--${key});`)
  return `@theme inline {\n${lines.join('\n')}\n}\n`
}

/**
 * Resolve hex for a color key (follows `ref`).
 * @param {Record<string, ColorToken>} colors
 * @param {string} key
 * @returns {string | undefined}
 */
function resolveColorHex(colors, key) {
  const token = colors[key]
  if (!token) return undefined
  if (token.hex) return token.hex
  if (token.ref) return resolveColorHex(colors, token.ref)
  return undefined
}

/**
 * Build kebab→hex map for JS runtime (theme-color meta, thirdweb, etc.).
 * @param {Record<string, ColorToken>} colors
 * @returns {Record<string, string>}
 */
function buildColorHexMap(colors) {
  /** @type {Record<string, string>} */
  const map = {}
  for (const key of Object.keys(colors)) {
    const hex = resolveColorHex(colors, key)
    if (hex) map[key] = hex
  }
  return map
}

/**
 * Build tokens.ts content.
 * @param {TokenSet} tokens
 * @returns {string}
 */
function buildTokensTs(tokens) {
  const colorKeys = Object.keys(tokens.colors)
  const typeKeys = Object.keys(tokens.type)
  const spaceKeys = Object.keys(tokens.space)
  const radiusKeys = Object.keys(tokens.radius)
  const shadowKeys = Object.keys(tokens.shadows)
  const colorHex = buildColorHexMap(tokens.colors)

  return `// Auto-generated from src/shared/styles/tokens/tokens.json
// Do not edit manually. Run: pnpm build:tokens

export const colors = ${JSON.stringify(colorKeys, null, 2)} as const

export type ColorToken = (typeof colors)[number]

/** Hex (or rgba) from tokens.json — JS runtime SSOT; CSS prefers oklch in theme.css */
export const colorHex = ${JSON.stringify(colorHex, null, 2)} as const

export type ColorHexToken = keyof typeof colorHex

export const typeVariants = ${JSON.stringify(typeKeys, null, 2)} as const

export type TypeVariant = (typeof typeVariants)[number]

export const space = ${JSON.stringify(spaceKeys, null, 2)} as const

export type SpaceToken = (typeof space)[number]

export const radii = ${JSON.stringify(radiusKeys, null, 2)} as const

export type RadiusToken = (typeof radii)[number]

export const shadows = ${JSON.stringify(shadowKeys, null, 2)} as const

export type ShadowToken = (typeof shadows)[number]
`
}

/**
 * Static engineering variables that are not design tokens.
 * These are layout, app chrome, home namespace and scrollbar concerns.
 * They remain hand-written and are appended after generated tokens.
 * @returns {string}
 */
function staticEngineeringVars() {
  return `
/* ---- layout / app chrome / home namespace / scrollbars ---- */
/* These are engineering variables, not Figma design tokens.     */

:root {
  --container: 75rem;
  --breakpoint-dapp: 821px;
  --fluid-scale: 1;

  --app-h5-gradient-top: #fbeae1;
  --dapp-h5-gradient-top: var(--app-h5-gradient-top);
  /* Home/DApp body wash — was bare oklch in shared.css */
  --app-body-wash: oklch(96% 0.028 45 / 70%);
  /* Claim Mixed restake rail — alias of semantic claim-restake (tokens.json → --claim-restake) */
  --app-claim-restake: var(--claim-restake);

  --shadow-bleed: 1.5rem;
  --shadow-bleed-subtle: 1.75rem;
  --shadow-bleed-h5: 1.125rem;
  --carousel-h5-viewport-pad-y: 0.875rem;
  --carousel-h5-indicator-pt: 0.75rem;
  --carousel-pc-indicator-pt: 0.75rem;
  /* 奖励 about 轮播右侧 lavender wash · Figma 4297:214 */
  --rewards-carousel-wash: #e7defa;
  /* 机制表「当前」行底 · Figma 4699:234 */
  --rewards-tier-current-bg: #fdf8f5;

  /* DApp motion — shared timing / easing / travel (CSS animations + transitions) */
  --motion-dapp-fast: 120ms;
  --motion-dapp-base: 220ms;
  --motion-dapp-emphasis: 300ms;
  --motion-dapp-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-dapp-rise: 6px;
  --motion-dapp-slide: 1.5rem;
  /*
   * Hub↔subview push — keep in sync with DAPP_VIEW_MOTION_MS in create-dapp-subview-store.
   * Longer + softer than emphasis so the slide reads as deliberate, not snappy.
   */
  --motion-dapp-subview: 440ms;
  --motion-dapp-subview-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-dapp-subview-slide: 2rem;
  --motion-dapp-subview-rise: 10px;
  /* Tab content crossfade — out then in (JS timeouts must match) */
  --motion-dapp-fade-out: 160ms;
  --motion-dapp-fade-in: 220ms;

  /* App chrome (rem @ 16px; scales with site-fluid) */
  --app-icon-xs: 0.75rem;
  --app-icon-sm: 0.8125rem;
  --app-icon-md: 0.875rem;
  --app-icon-base: 1rem;
  --app-icon-action: 0.9375rem;
  --app-icon-lg: 1.125rem;
  --app-icon-xl: 1.25rem;
  --app-icon-rail: 1.375rem;
  --app-icon-token: 1.5rem;
  --app-icon-brand: 1.75rem;

  --dapp-icon-xs: var(--app-icon-xs);
  --dapp-icon-sm: var(--app-icon-sm);
  --dapp-icon-md: var(--app-icon-md);
  --dapp-icon-base: var(--app-icon-base);
  --dapp-icon-action: var(--app-icon-action);
  --dapp-icon-lg: var(--app-icon-lg);
  --dapp-icon-xl: var(--app-icon-xl);
  --dapp-icon-rail: var(--app-icon-rail);
  --dapp-icon-token: var(--app-icon-token);
  --dapp-icon-brand: var(--app-icon-brand);

  --app-season-title-size: 0.8125rem;
  --app-season-meta-size: 0.6875rem;
  --app-season-badge-size: 0.625rem;
  --app-season-radio-size: 1.125rem;
  --app-season-card-radius: 0.8125rem;

  --dapp-season-title-size: var(--app-season-title-size);
  --dapp-season-meta-size: var(--app-season-meta-size);
  --dapp-season-badge-size: var(--app-season-badge-size);
  --dapp-season-radio-size: var(--app-season-radio-size);
  --dapp-season-card-radius: var(--app-season-card-radius);

  /* Language menu — Figma lang-popup 4140:286 @ 16px root; scales with site-fluid */
  --app-lang-menu-width: 16.5rem;
  --app-lang-menu-row-height: 2.625rem;
  /* 行圆角跟 DropdownMenuItem：--radius-control（禁平行 0.625rem） */
  --app-lang-menu-row-radius: var(--radius-control);
  --app-lang-menu-meta-size: 0.6875rem;

  --dapp-lang-menu-width: var(--app-lang-menu-width);
  --dapp-lang-menu-row-height: var(--app-lang-menu-row-height);
  --dapp-lang-menu-row-radius: var(--app-lang-menu-row-radius);
  --dapp-lang-menu-meta-size: var(--app-lang-menu-meta-size);

  /* Wallet details modal — Figma 4040:5234 @ 16px root */
  --app-wallet-modal-max-width: 22.5rem;
  --app-wallet-modal-close-size: 2.125rem;
  --app-wallet-modal-orb-size: 4.875rem;
  --app-wallet-modal-orb-icon: 2.125rem;
  --app-wallet-modal-balance-size: 1.0625rem;
  --app-wallet-modal-unit-size: 0.9375rem;

  --dapp-wallet-modal-max-width: var(--app-wallet-modal-max-width);
  --dapp-wallet-modal-close-size: var(--app-wallet-modal-close-size);
  --dapp-wallet-modal-orb-size: var(--app-wallet-modal-orb-size);
  --dapp-wallet-modal-orb-icon: var(--app-wallet-modal-orb-icon);
  --dapp-wallet-modal-balance-size: var(--app-wallet-modal-balance-size);
  --dapp-wallet-modal-unit-size: var(--app-wallet-modal-unit-size);

  --app-pagination-menu-item-height: 2rem;
  --app-pagination-menu-gap: 0.375rem;
  --app-pagination-menu-viewport-padding: 0.5rem;
  --app-pagination-menu-max-visible: 5;

  --dapp-pagination-menu-item-height: var(--app-pagination-menu-item-height);
  --dapp-pagination-menu-gap: var(--app-pagination-menu-gap);
  --dapp-pagination-menu-viewport-padding: var(--app-pagination-menu-viewport-padding);
  --dapp-pagination-menu-max-visible: var(--app-pagination-menu-max-visible);

  --app-table-cell-min-width: 5.5rem;
  --app-table-empty-padding: 1.875rem 1.5rem;
  --app-table-empty-padding-h5: 1.375rem 1rem;
  --app-community-stat-padding: 0.8125rem 0.75rem;
  --app-skeleton-chip-size: 1.125rem;
  /* Tooltip bubble — Figma 76:17 @ 16px root (py 9 / px 12; arrow 14×7) */
  --app-tooltip-offset: 0.5rem;
  --app-tooltip-padding: 0.5625rem 0.75rem;
  --app-tooltip-arrow-width: 0.875rem;
  --app-tooltip-arrow-height: 0.4375rem;
  --app-tooltip-arrow-padding-center: 0.5rem;
  --app-tooltip-arrow-padding-edge: 1.125rem;
  --app-tooltip-max-width: 18rem;
  --app-tooltip-collision-padding: 1rem;
  --app-progress-meter-height: 0.4375rem;
  --app-sheet-max-height: 40rem;
  --app-scroll-fade: 1.5rem;

  /* Glass / drawer / wallet chrome (engineering — not Figma color axes) */
  --glass-drawer: linear-gradient(165deg, oklch(100% 0 0 / 92%), oklch(100% 0 0 / 78%));
  --glass-panel: linear-gradient(165deg, oklch(100% 0 0 / 96%), oklch(100% 0 0 / 86%));
  --app-shadow-drawer: 1.25rem 0 3.75rem oklch(18% 0.04 265 / 25%);
  --app-shadow-primary-orb: 0 0.875rem 2.125rem oklch(66.83% 0.1625 36.6 / 40%), inset 0 1px 0 oklch(100% 0 0 / 50%);
  --app-shadow-roadmap-ring: 0 0 0 8px oklch(94.92% 0.0224 45.6 / 96%);
  --roadmap-ripple-68: 0 0 0 6px oklch(94.92% 0.0224 45.6 / 68%);
  --roadmap-ripple-100: 0 0 0 9px oklch(94.92% 0.0224 45.6 / 100%);
  --toaster-bg: oklch(0% 0 0);
  --toaster-border: oklch(100% 0 0 / 12%);
  --toaster-text: oklch(100% 0 0);
  --toaster-shadow: 0 0.75rem 2rem oklch(0% 0 0 / 28%);
  --icon-info-disc: #9999a6;
  --icon-info-glyph: #4d4d59;
  --hero-rays-hub: #8a8f98;
  --hero-rays-wedge: #868b94;
  --home-token-sheen: linear-gradient(135deg, oklch(100% 0 0 / 16%), transparent 58%);
  --home-token-hover-shadow: 0 20px 56px oklch(22% 0.04 265 / 18%);
  --home-token-tile-shadow: 0 10px 26px oklch(0% 0 0 / 12%);
  --home-hero-wash: linear-gradient(180deg, var(--background), oklch(95.6% 0 0));
  --home-hero-glow: radial-gradient(circle, oklch(94% 0.035 45 / 42%), transparent 58%);
  --home-metrics-rays: radial-gradient(18rem 7rem at 50% -2%, oklch(100% 0 0 / 16%), transparent 72%), repeating-conic-gradient(from -90deg at 50% -12%, oklch(100% 0 0 / 10%) 0deg 0.28deg, transparent 0.28deg 2.4deg);

  --dapp-table-cell-min-width: var(--app-table-cell-min-width);
  --dapp-table-empty-padding: var(--app-table-empty-padding);
  --dapp-table-empty-padding-h5: var(--app-table-empty-padding-h5);
  --dapp-community-stat-padding: var(--app-community-stat-padding);
  --dapp-skeleton-chip-size: var(--app-skeleton-chip-size);
  --dapp-tooltip-offset: var(--app-tooltip-offset);
  --dapp-tooltip-padding: var(--app-tooltip-padding);
  --dapp-tooltip-arrow-width: var(--app-tooltip-arrow-width);
  --dapp-tooltip-arrow-height: var(--app-tooltip-arrow-height);
  --dapp-tooltip-arrow-padding-center: var(--app-tooltip-arrow-padding-center);
  --dapp-tooltip-arrow-padding-edge: var(--app-tooltip-arrow-padding-edge);
  --dapp-tooltip-max-width: var(--app-tooltip-max-width);
  --dapp-tooltip-collision-padding: var(--app-tooltip-collision-padding);
  --dapp-progress-meter-height: var(--app-progress-meter-height);
  --dapp-sheet-max-height: var(--app-sheet-max-height);
  --dapp-scroll-fade: var(--app-scroll-fade);

  /* Home layout namespace */
  --home-security-section-min-h: 49.625rem;
  --home-security-section-min-h-h5: 44.4375rem;
  --home-security-block-max: 52.625rem;
  --home-security-art-w: 20.625rem;
  --home-security-list-max: 29rem;
  --home-security-art-h5-w: 10.875rem;
  --home-token-tile-size: 3.25rem;
  --home-token-tile-size-h5: 2.875rem;
  --home-token-icon-size: 1.875rem;
  --home-token-icon-size-h5: 1.625rem;
  --home-feature-icon-size: 5rem;
  --home-feature-icon-size-h5: 2.75rem;
  --home-partner-icon-size: 1.5rem;
  --home-partner-icon-size-h5: 1.25rem;
  --home-security-icon-wrap-size: 1.625rem;
  --home-security-icon-wrap-size-h5: 1.5rem;
  --home-security-icon-size: 0.875rem;

  /* Scrollbars */
  --scrollbar-size: 8px;
  --scrollbar-thumb: rgba(0, 0, 0, 0.14);
  --scrollbar-thumb: oklch(0% 0 0 / 14%);
  --scrollbar-thumb-hover: rgba(0, 0, 0, 0.26);
  --scrollbar-thumb-hover: oklch(0% 0 0 / 26%);
  --scrollbar-thumb-active: rgba(232, 106, 67, 0.52);
  --scrollbar-thumb-active: oklch(66.83% 0.1625 36.6 / 52%);
  --scrollbar-thumb-idle: rgba(0, 0, 0, 0.09);
  --scrollbar-thumb-idle: oklch(0% 0 0 / 9%);
  --scrollbar-thumb-dark: rgba(255, 255, 255, 0.18);
  --scrollbar-thumb-dark: oklch(100% 0 0 / 18%);
  --scrollbar-thumb-dark-hover: rgba(255, 255, 255, 0.32);
  --scrollbar-thumb-dark-hover: oklch(100% 0 0 / 32%);
  --scrollbar-thumb-dark-active: rgba(240, 168, 138, 0.62);
  --scrollbar-thumb-dark-active: oklch(80.08% 0.0962 39.91 / 62%);
  --scrollbar-thumb-dark-idle: rgba(255, 255, 255, 0.1);
  --scrollbar-thumb-dark-idle: oklch(100% 0 0 / 10%);
  --scrollbar-track: rgba(0, 0, 0, 0.1);
  --scrollbar-track: oklch(0% 0 0 / 10%);
}

/* site-fluid — continuous rem scale (endpoints ≡ breakpoints.ts)
 * ≤1920: 16px / scale 1 · 1920→3840: linear 16→48px / 1→3 · ≥3840: cap
 */
html.site-fluid {
  font-size: clamp(16px, calc(16px + (100vw - 1920px) / 60), 48px);
  --fluid-scale: clamp(1, calc(1 + (100vw - 1920px) / 960px), 3);
}
`
}

/**
 * Extra @theme entries that are not derived from tokens.json but are still used by source.
 * Keep during P0–P7; reconsider in P8 cleanup.
 * @returns {string}
 */
function staticExtraTheme() {
  return `
/* ---- extra theme entries (component-specific shadows / layout) ---- */

@theme {
  --shadow-card-strong: var(--elevation-e4);
  --shadow-window-compact: 0 1rem 2.5rem rgba(18, 26, 51, 0.1);
  --shadow-primary-hover: 0 0.625rem 1.5rem rgba(232, 106, 67, 0.24);
  --shadow-token: 0 1rem 3.125rem rgba(18, 26, 51, 0.12);
  --shadow-drawer: var(--app-shadow-drawer);
  --shadow-primary-orb: var(--app-shadow-primary-orb);
  --shadow-roadmap-ring: var(--app-shadow-roadmap-ring);

  --shadow-bleed: 1.5rem;
  --shadow-bleed-subtle: 1.75rem;
  --shadow-bleed-h5: 1.125rem;
  --carousel-h5-viewport-pad-y: 0.875rem;
  --carousel-h5-indicator-pt: 0.75rem;
  --carousel-pc-indicator-pt: 0.75rem;

  --duration-dapp-fast: var(--motion-dapp-fast);
  --duration-dapp-base: var(--motion-dapp-base);
  --duration-dapp-emphasis: var(--motion-dapp-emphasis);
  --ease-dapp: var(--motion-dapp-ease);
}
`
}

/**
 * Build full theme.css content.
 * @param {TokenSet} tokens
 * @returns {string}
 */
function buildThemeCss(tokens) {
  const colorBlock = buildColorVars(tokens.colors)
  const typeBlock = buildTypeVars(tokens.type)
  const spaceBlock = buildSpaceVars(tokens.space)
  const radiusBlock = buildRadiusVars(tokens.radius)
  const elevationBlock = buildElevationVars(tokens.shadows)
  const h5Media = buildH5TypeMedia(tokens.type)
  const themeBlock = buildThemeBlock(tokens.shadows, tokens.radius)
  const themeInline = buildThemeInline(tokens.colors)

  return `/**
 * Design system tokens — single source of truth
 *
 * GENERATED BY scripts/generate-tokens.mjs
 * Source: src/shared/styles/tokens/tokens.json
 * Do not edit manually; run: pnpm build:tokens
 *
 * - :root — semantic colors, typography (rem @16px), space, radius, elevation
 * - @theme — radius, elevation shadows, Tailwind utilities
 * - @theme inline — color utility mappings
 * - @layer base — global reset
 *
 * Entry CSS: shared.css (base) · app.css · home.css
 */

:root {
${colorBlock}

${typeBlock}

${spaceBlock}

${radiusBlock}

${elevationBlock}
}

${h5Media}/* H5 Tailwind text scale bump (+1px) — ≡ 4175 mobile-type-scale.css (:root, Home+DApp) */
@media (max-width: 820px) {
  :root {
    --text-xs: 0.8125rem;
    --text-sm: 0.9375rem;
    --text-base: 1.0625rem;
    --text-lg: 1.1875rem;
    --text-xl: 1.3125rem;
    --text-2xl: 1.5625rem;
    --text-3xl: 1.9375rem;
    --text-4xl: 2.3125rem;
    --text-5xl: 3.0625rem;
    --text-6xl: 3.8125rem;
    --text-7xl: 4.5625rem;
    --text-8xl: 6.0625rem;
    --text-9xl: 8.0625rem;
  }
}

${themeBlock}
${staticExtraTheme()}${themeInline}
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }

  a {
    text-decoration: none;
  }

  :where(#root) :where(p, h1, h2, h3, h4, h5, h6) {
    margin: 0;
  }
}
${staticEngineeringVars()}
/* H5 Genesis season card — ≡ 4175 dapp-scale.css (+1px); must follow engineering :root */
@media (max-width: 820px) {
  :root {
    --app-season-title-size: 0.875rem;
    --app-season-meta-size: 0.75rem;
    --app-season-badge-size: 0.6875rem;
  }
}
`
}

/**
 * Run the generator.
 */
function generate() {
  const tokens = loadTokens()
  const css = buildThemeCss(tokens)
  const ts = buildTokensTs(tokens)

  writeFileSync(cssOutPath, css)
  writeFileSync(tsOutPath, ts)

  console.log(`✓ Generated ${cssOutPath}`)
  console.log(`✓ Generated ${tsOutPath}`)
}

generate()

if (process.argv.includes('--watch')) {
  console.log(`Watching ${tokensPath} for changes...`)
  watch(tokensPath, () => {
    console.log('tokens.json changed, regenerating...')
    try {
      generate()
    } catch (error) {
      console.error('Generation failed:', error)
    }
  })
}
