#!/usr/bin/env node
/**
 * Optional — Swap PC/H5 computed snapshot（legacy Phase0 helper）。
 *
 * 用法：pnpm capture:phase0-baseline
 * 产出：tmp/baselines/swap-pc-computed.json（默认；docs/baselines 已删除）
 *
 * 视觉 SSOT：当前分支 + Figma（docs/foundation/）。本脚本仅可选回归对照。
 */
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.UI_COMPARE_BASE ?? 'http://127.0.0.1:4175'
const OUT_DIR = path.join(ROOT, process.env.UI_COMPARE_BASELINE_DIR ?? 'tmp/baselines')
const CHANNEL = process.env.UI_COMPARE_CHANNEL ?? 'msedge'

const STYLE_KEYS = [
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'color',
  'backgroundColor',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'gap',
  'width',
  'height',
  'borderRadius',
  'display',
]

/** @typedef {{ id: string, group: string, owner: string, selector: string, nth?: number, optional?: boolean }} CatalogEntry */

/** @type {Record<string, { url: string, tab?: string, viewport: { width: number, height: number }, waitMs?: number, outFile: string }>} */
const PAGES = {
  'dapp-swap-desktop': {
    url: '/en/app.html',
    tab: 'swap',
    viewport: { width: 1440, height: 900 },
    waitMs: 1500,
    outFile: 'swap-pc-computed.json',
  },
  'dapp-swap-h5': {
    url: '/en/app.html',
    tab: 'swap',
    viewport: { width: 390, height: 844 },
    waitMs: 1500,
    outFile: 'swap-h5-computed.json',
  },
}

/** @type {CatalogEntry[]} — shared with ui-compare-style-baseline.mjs */
const SWAP_CATALOG = [
  { id: 'rail-tab-swap-active', group: 'rail', owner: 'dapp-rail.tsx + shellRailItemClass', selector: 'nav[aria-label="DApp sections"] button[role="tab"] span[title]', nth: 0 },
  { id: 'rail-tab-cobuild-inactive', group: 'rail', owner: 'dapp-rail.tsx + shellRailItemClass', selector: 'nav[aria-label="DApp sections"] button[role="tab"] span[title]', nth: 1 },
  { id: 'rail-tab-rewards-inactive', group: 'rail', owner: 'dapp-rail.tsx + shellRailItemClass', selector: 'nav[aria-label="DApp sections"] button[role="tab"] span[title]', nth: 2 },
  { id: 'rail-tab-community-inactive', group: 'rail', owner: 'dapp-rail.tsx + shellRailItemClass', selector: 'nav[aria-label="DApp sections"] button[role="tab"] span[title]', nth: 3 },
  { id: 'rail-tab-btn-cobuild', group: 'rail-layout', owner: 'shellRailItemClass', selector: 'nav[aria-label="DApp sections"] button[role="tab"]', nth: 1 },
  { id: 'topbar-brand', group: 'shell', owner: 'header brand Text/link', selector: 'header a[aria-label*="home"] span, header .container > a span' },
  { id: 'topbar-connect', group: 'shell', owner: 'WalletConnectChip / Button primary', selector: 'header button.bg-primary' },
  { id: 'topbar-lang', group: 'shell', owner: 'header lang pill', selector: 'header button.rounded-full, header .rounded-full.border-border' },
  { id: 'widget-h1', group: 'widget-text', owner: 'swap-widget-header / widget-title', selector: '[data-dapp-widget-panel] h1' },
  { id: 'widget-subtitle', group: 'widget-text', owner: 'swap-widget-header / meta', selector: '[data-dapp-widget-panel] h1 ~ p' },
  { id: 'mode-card-convert-title', group: 'widget-card', owner: 'swap-mode-card / headline', selector: '[data-dapp-widget-panel] button.rounded-md strong, [data-dapp-widget-panel] button.rounded-md span.font-semibold', nth: 0 },
  { id: 'mode-card-convert-body', group: 'widget-card', owner: 'swap-mode-card / meta', selector: '[data-dapp-widget-panel] button.rounded-md p, [data-dapp-widget-panel] button.rounded-md span.text-muted-foreground, [data-dapp-widget-panel] button.rounded-md span.text-ink-muted', nth: 0 },
  { id: 'mode-card-trade-title', group: 'widget-card', owner: 'swap-mode-card / headline', selector: '[data-dapp-widget-panel] button.rounded-md strong, [data-dapp-widget-panel] button.rounded-md span.font-semibold', nth: 1 },
  { id: 'mode-card-trade-body', group: 'widget-card', owner: 'swap-mode-card / meta', selector: '[data-dapp-widget-panel] button.rounded-md p, [data-dapp-widget-panel] button.rounded-md span.text-muted-foreground, [data-dapp-widget-panel] button.rounded-md span.text-ink-muted', nth: 1 },
  { id: 'mode-card-burn-title', group: 'widget-card', owner: 'swap-mode-card / headline', selector: '[data-dapp-widget-panel] button.rounded-md strong, [data-dapp-widget-panel] button.rounded-md span.font-semibold', nth: 2 },
  { id: 'mode-card-burn-body', group: 'widget-card', owner: 'swap-mode-card / meta', selector: '[data-dapp-widget-panel] button.rounded-md p, [data-dapp-widget-panel] button.rounded-md span.text-muted-foreground, [data-dapp-widget-panel] button.rounded-md span.text-ink-muted', nth: 2 },
  { id: 'mode-card-burn-badge', group: 'widget-card', owner: 'swap-mode-card / mode-badge', selector: '[data-dapp-widget-panel] span.rounded-full.bg-\\[\\#FF9500\\], [data-dapp-widget-panel] .rounded-full[class*="FF9500"]' },
  { id: 'mode-card-root-convert', group: 'widget-card-layout', owner: 'swapModeCard tv', selector: '[data-dapp-widget-panel] button.rounded-md.border-border', nth: 0 },
  { id: 'widget-connect-promo-title', group: 'widget-card', owner: 'dapp-connect-promo-card', selector: '[data-dapp-widget-panel] section strong, [data-dapp-widget-panel] [data-reveal] strong', optional: true },
  { id: 'detail-h2-program', group: 'detail-text', owner: 'swap-hub-content / section', selector: '[data-dapp-detail] h2, main h2', nth: 0 },
  { id: 'detail-h2-faq', group: 'detail-text', owner: 'swap-hub-content / section', selector: '[data-dapp-detail] h2, main h2', nth: 1 },
  { id: 'program-card-0-title', group: 'detail-card', owner: 'swap-program-card / ProgramCard', selector: '[data-dapp-detail] article h3, [data-dapp-detail] article strong', nth: 0 },
  { id: 'program-card-0-body', group: 'detail-card', owner: 'swap-promo-card / meta', selector: '[data-dapp-detail] article p', nth: 0 },
  { id: 'program-card-0-kicker', group: 'detail-card', owner: 'swap-program-card / kicker', selector: '[data-dapp-detail] article span.uppercase, [data-dapp-detail] article .uppercase', nth: 0, optional: true },
  { id: 'about-card-title', group: 'detail-card', owner: 'swap-promo-card / headline', selector: '[data-dapp-detail] [data-reveal] strong', optional: true },
  { id: 'program-section-grid', group: 'detail-layout', owner: 'swap-program-cards', selector: '[data-dapp-detail] section:nth-of-type(2) .grid.gap-2' },
  { id: 'program-card-hero', group: 'detail-card', owner: 'swap-program-card / program-body', selector: '[data-dapp-detail] section:nth-of-type(2) button', nth: 0 },
  { id: 'faq-question-0', group: 'detail-card', owner: 'faq-list / question', selector: '[data-dapp-detail] [data-faq-item] [data-faq-trigger] span', nth: 0 },
  { id: 'detail-page-root', group: 'detail-layout', owner: 'DappDetailPage', selector: '[data-dapp-detail]' },
]

async function preparePage(page, root, pageDef) {
  await page.goto(root + pageDef.url, { waitUntil: 'networkidle', timeout: 120_000 })
  if (pageDef.tab) {
    await page.evaluate((hash) => {
      window.location.hash = hash
      window.dispatchEvent(new HashChangeEvent('hashchange'))
      window.scrollTo(0, 0)
    }, pageDef.tab)
    await page.waitForTimeout(1200)
  }
  await page.waitForTimeout(pageDef.waitMs ?? 1000)
}

async function probeEntry(page, entry) {
  return page.evaluate(
    ({ STYLE_KEYS, selector, nth }) => {
      const el =
        nth != null
          ? (document.querySelectorAll(selector)[nth] ?? null)
          : document.querySelector(selector)
      if (!el) return { missing: true }
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      const styles = {}
      for (const k of STYLE_KEYS) styles[k] = cs[k]
      return {
        missing: false,
        tag: el.tagName.toLowerCase(),
        cls: String(el.className ?? '').slice(0, 160),
        text: (el.textContent ?? '').trim().slice(0, 48),
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        styles,
      }
    },
    { STYLE_KEYS, selector: entry.selector, nth: entry.nth ?? null },
  )
}

async function capturePage(pageId, pageDef) {
  const browser = await chromium.launch({ channel: CHANNEL, headless: true })
  const page = await browser.newPage()
  await page.setViewportSize(pageDef.viewport)

  try {
    await preparePage(page, BASE, pageDef)
    /** @type {Record<string, unknown>} */
    const probes = {}
    for (const entry of SWAP_CATALOG) {
      probes[entry.id] = await probeEntry(page, entry)
    }
    return {
      pageId,
      viewport: pageDef.viewport,
      source: BASE,
      capturedAt: new Date().toISOString(),
      catalog: SWAP_CATALOG.map(({ id, group, owner, selector, nth, optional }) => ({
        id,
        group,
        owner,
        selector,
        nth: nth ?? null,
        optional: optional ?? false,
      })),
      probes,
    }
  } finally {
    await page.close()
    await browser.close()
  }
}

function buildStyleStackMarkdown(captures) {
  const lines = [
    '# Swap 样式栈基线（Phase 0）',
    '',
    `Captured from \`${BASE}\` · ${new Date().toISOString().slice(0, 10)}`,
    '',
    '## Foundation 组件（5）',
    '',
    '| 组件 | 单一 owner | 说明 |',
    '|------|-----------|------|',
    '| Text | `src/shared/ui/text.tsx` variant + tone | 见 docs/foundation/api.md |',
    '| Button | `src/shared/ui/button.tsx` | variant × size × shape |',
    '| Card | `src/shared/ui/card.tsx` surface | 见 docs/foundation/api.md |',
    '| FaqList | `src/shared/ui/faq-list.tsx` | question + detail |',
    '| AmountInput | `src/shared/ui/amount-input.tsx` | amount token |',
    '',
    '## Swap 探针 call site（top 20+）',
    '',
  ]

  for (const capture of captures) {
    lines.push(`### ${capture.pageId}`, '')
    lines.push('| ID | Group | Owner | Tag | fontSize | lineHeight | color |')
    lines.push('|----|-------|-------|-----|----------|------------|-------|')
    for (const entry of SWAP_CATALOG) {
      const probe = capture.probes[entry.id]
      if (probe?.missing) {
        lines.push(`| ${entry.id} | ${entry.group} | \`${entry.owner}\` | — | — | — | — |`)
        continue
      }
      const s = probe.styles
      lines.push(
        `| ${entry.id} | ${entry.group} | \`${entry.owner}\` | ${probe.tag} | ${s.fontSize} | ${s.lineHeight} | ${String(s.color).slice(0, 40)} |`,
      )
    }
    lines.push('')
    lines.push('#### 样式栈模板（改前 effective）', '')
    for (const entry of SWAP_CATALOG.slice(0, 12)) {
      const probe = capture.probes[entry.id]
      if (probe?.missing) continue
      lines.push('```text', `Call site: Swap probe — ${entry.id}`, `Owner: ${entry.owner}`, `Selector: ${entry.selector}`, `PC effective: ${probe.styles.fontSize} · ${probe.styles.fontWeight} · ${probe.styles.lineHeight} · ${probe.styles.color}`, '```', '')
    }
  }

  return lines.join('\n')
}

fs.mkdirSync(OUT_DIR, { recursive: true })
console.log(`Phase 0 baseline capture from ${BASE}\n`)

/** @type {unknown[]} */
const captures = []
for (const [pageId, pageDef] of Object.entries(PAGES)) {
  console.log(`▶ ${pageId} …`)
  const data = await capturePage(pageId, pageDef)
  const outPath = path.join(OUT_DIR, pageDef.outFile)
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2))
  console.log(`  → ${outPath}`)
  captures.push(data)
}

const stackPath = path.join(OUT_DIR, 'swap-style-stack.md')
fs.writeFileSync(stackPath, buildStyleStackMarkdown(captures))
console.log(`  → ${stackPath}`)
console.log('\nPhase 0 capture done.')
