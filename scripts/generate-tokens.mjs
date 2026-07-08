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
import { readFileSync, writeFileSync, watch } from 'node:fs'
import { resolve, dirname } from 'node:path'
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
  return ['  /* ---- elevation primitives (E1–E6) ---- */', ...lines].join('\n')
}

/**
 * Build @theme block.
 * @param {Record<string, ShadowToken>} shadows
 * @returns {string}
 */
function buildThemeBlock(shadows) {
  const shadowLines = Object.entries(shadows).map(([key]) => `  --shadow-${key}: var(--elevation-e${Object.keys(shadows).indexOf(key) + 1});`)
  return `@theme {\n  --radius-sm: var(--radius-sm);\n  --radius-md: var(--radius-md);\n  --radius-lg: var(--radius-lg);\n  --radius-xl: var(--radius-xl);\n\n${shadowLines.join('\n')}\n}\n`
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

  return `// Auto-generated from src/shared/styles/tokens/tokens.json
// Do not edit manually. Run: pnpm build:tokens

export const colors = ${JSON.stringify(colorKeys, null, 2)} as const

export type ColorToken = (typeof colors)[number]

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
 * Legacy type aliases so existing source can still resolve old names during P0–P1.
 * Remove in P1 after text.tsx and call sites are migrated to new variant names.
 * @returns {string}
 */
function staticLegacyTypeAliases() {
  return `
/* ---- @deprecated legacy type aliases ---- */
/* Map old Text variant names to new token names; remove in P1. */

:root {
  --type-rail-size: var(--type-caption-size);
  --type-kicker-size: var(--type-eyebrow-size);
  --type-meta-size: var(--type-copy-size);
  --type-widget-title-size: var(--type-panel-size);
  --type-amount-size: var(--type-figure-size);
  --dapp-type-kicker-size: var(--type-eyebrow-size);
  --dapp-type-caption-size: var(--type-copy-size);
  --dapp-type-title-sm-size: var(--type-panel-size);
  --dapp-type-body-lg-size: var(--type-brand-size);
  --dapp-type-amount-size: var(--type-figure-size);
}
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

  --shadow-bleed: 1.5rem;
  --shadow-bleed-subtle: 1.75rem;
  --shadow-bleed-h5: 1.125rem;
  --carousel-h5-viewport-pad-y: 0.875rem;
  --carousel-h5-indicator-pt: 0.75rem;
  --carousel-pc-indicator-pt: 0.75rem;

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
  --app-tooltip-offset: 0.5rem;
  --app-progress-meter-height: 0.4375rem;
  --app-sheet-max-height: 40rem;
  --app-scroll-fade: 1.5rem;

  --dapp-table-cell-min-width: var(--app-table-cell-min-width);
  --dapp-table-empty-padding: var(--app-table-empty-padding);
  --dapp-table-empty-padding-h5: var(--app-table-empty-padding-h5);
  --dapp-community-stat-padding: var(--app-community-stat-padding);
  --dapp-skeleton-chip-size: var(--app-skeleton-chip-size);
  --dapp-tooltip-offset: var(--app-tooltip-offset);
  --dapp-progress-meter-height: var(--app-progress-meter-height);
  --dapp-sheet-max-height: var(--app-sheet-max-height);
  --dapp-scroll-fade: var(--app-scroll-fade);

  /* Home layout namespace */
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
  --scrollbar-thumb-dark: rgba(255, 255, 255, 0.18);
  --scrollbar-thumb-dark: oklch(100% 0 0 / 18%);
  --scrollbar-thumb-dark-hover: rgba(255, 255, 255, 0.32);
  --scrollbar-thumb-dark-hover: oklch(100% 0 0 / 32%);
  --scrollbar-thumb-dark-active: rgba(240, 168, 138, 0.62);
  --scrollbar-thumb-dark-active: oklch(80.08% 0.0962 39.91 / 62%);
}

/* site-fluid — layout/icon rem scales; typography rem @16px also scales */
@media (min-width: 1920px) {
  html.site-fluid {
    font-size: 16px;
    --fluid-scale: 1;
  }
}

@media (min-width: 2080px) {
  html.site-fluid {
    font-size: 18px;
    --fluid-scale: 1.125;
  }
}

@media (min-width: 2240px) {
  html.site-fluid {
    font-size: 20px;
    --fluid-scale: 1.25;
  }
}

@media (min-width: 2400px) {
  html.site-fluid {
    font-size: 22px;
    --fluid-scale: 1.375;
  }
}

@media (min-width: 2560px) {
  html.site-fluid {
    font-size: 24px;
    --fluid-scale: 1.5;
  }
}

@media (min-width: 2720px) {
  html.site-fluid {
    font-size: 26px;
    --fluid-scale: 1.625;
  }
}

@media (min-width: 2880px) {
  html.site-fluid {
    font-size: 28px;
    --fluid-scale: 1.75;
  }
}

@media (min-width: 3040px) {
  html.site-fluid {
    font-size: 30px;
    --fluid-scale: 1.875;
  }
}

@media (min-width: 3200px) {
  html.site-fluid {
    font-size: 32px;
    --fluid-scale: 2;
  }
}

@media (min-width: 3360px) {
  html.site-fluid {
    font-size: 34px;
    --fluid-scale: 2.125;
  }
}

@media (min-width: 3520px) {
  html.site-fluid {
    font-size: 36px;
    --fluid-scale: 2.25;
  }
}

@media (min-width: 3680px) {
  html.site-fluid {
    font-size: 40px;
    --fluid-scale: 2.5;
  }
}

@media (min-width: 3840px) {
  html.site-fluid {
    font-size: 48px;
    --fluid-scale: 3;
  }
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
  --shadow-primary-hover-lg: 0 0.75rem 1.5rem rgba(232, 106, 67, 0.24);
  --shadow-primary-hover-xl: 0 0.875rem 1.75rem rgba(18, 26, 51, 0.18);
  --shadow-coral-sm: 0 0.5rem 1.375rem rgba(232, 106, 67, 0.14);
  --shadow-token: 0 1rem 3.125rem rgba(18, 26, 51, 0.12);

  --shadow-bleed: 1.5rem;
  --shadow-bleed-subtle: 1.75rem;
  --shadow-bleed-h5: 1.125rem;
  --carousel-h5-viewport-pad-y: 0.875rem;
  --carousel-h5-indicator-pt: 0.75rem;
  --carousel-pc-indicator-pt: 0.75rem;
}
`
}

/**
 * Legacy @theme inline mappings so existing Tailwind utility classes keep working.
 * Remove in P8 when legacy colors are deleted.
 * @returns {string}
 */
function staticLegacyThemeInline() {
  return `

/* ---- @deprecated legacy color utility mappings ---- */
/* Remove in P8 when source no longer uses text-ink-*, text-on-dark, etc. */

@theme inline {
  --color-coral-bright: var(--coral-bright);
  --color-on-dark: var(--on-dark);
  --color-bsc: var(--bsc);
  --color-bsc-foreground: var(--bsc-foreground);
  --color-faint: var(--faint);
  --color-ink-muted: var(--ink-muted);
  --color-ink-strong: var(--ink-strong);
  --color-subtle-ink: var(--subtle-ink);
  --color-faq-text: var(--faq-text);
  --color-placeholder: var(--placeholder);
  --color-focus-border: var(--focus-border);
  --color-border-subtle: var(--border-subtle);
  --color-surface-glass: var(--surface-glass);
  --color-surface-wash: var(--surface-wash);
  --color-surface-wash-strong: var(--surface-wash-strong);
  --color-pill-muted-bg: var(--pill-muted-bg);
  --color-coral-hover-border: var(--coral-hover-border);
  --color-coral-strong-border: var(--coral-strong-border);
  --color-status-success-bg: var(--status-success-bg);
}
`
}

/**
 * Legacy color variables that are still referenced by source.
 * They are kept during P1–P7 migration and will be removed in P8.
 * @returns {string}
 */
function staticLegacyColors() {
  return `
/* ---- @deprecated legacy colors ---- */
/* Still used by source during P1–P7 migration; remove in P8. */

:root {
  --coral-bright: #f0a88a;
  --coral-bright: oklch(80.08% 0.0962 39.91);
  --on-dark: #b8c0ce;
  --bsc: #f0b429;
  --bsc: oklch(81.94% 0.1561 84.2);
  --bsc-foreground: #1a1a1a;
  --bsc-foreground: oklch(22.21% 0 89.88);
  --faint: rgba(0, 0, 0, 0.3);
  --faint: oklch(0% 0 0 / 30%);
  --ink-muted: rgba(0, 0, 0, 0.4);
  --ink-muted: oklch(0% 0 0 / 40%);
  --ink-strong: rgba(0, 0, 0, 0.7);
  --ink-strong: oklch(0% 0 0 / 70%);
  --subtle-ink: #5b6472;
  --subtle-ink: oklch(45% 0.02 260);
  --faq-text: #5b6472;
  --placeholder: #c9cfda;
  --placeholder: oklch(82% 0.011 264);
  --focus-border: #4a5060;
  --focus-border: oklch(35% 0.02 260);
  --border-subtle: #e8eaef;
  --border-subtle: oklch(92% 0.01 263);
  --surface-glass: rgba(255, 255, 255, 0.82);
  --surface-glass: oklch(100% 0 0 / 82%);
  --surface-wash: rgba(255, 255, 255, 0.56);
  --surface-wash: oklch(100% 0 0 / 56%);
  --surface-wash-strong: rgba(255, 255, 255, 0.62);
  --surface-wash-strong: oklch(100% 0 0 / 62%);
  --pill-muted-bg: #f4f5f7;
  --pill-muted-bg: oklch(96% 0.006 264);
  --coral-hover-border: rgba(232, 106, 67, 0.38);
  --coral-hover-border: oklch(66.83% 0.1625 36.6 / 38%);
  --coral-strong-border: rgba(232, 106, 67, 0.55);
  --coral-strong-border: oklch(66.83% 0.1625 36.6 / 55%);
  --status-success-bg: rgba(43, 171, 106, 0.7);
  --status-success-bg: oklch(91% 0.075 159 / 70%);
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
  const themeBlock = buildThemeBlock(tokens.shadows)
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

${h5Media}/* Home-only Tailwind text scale bump (+1px); DApp uses --type-* above */
@media (max-width: 820px) {
  html:not(.dapp-app) {
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
${staticLegacyThemeInline()}@layer base {
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
${staticLegacyColors()}${staticLegacyTypeAliases()}${staticEngineeringVars()}`
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
