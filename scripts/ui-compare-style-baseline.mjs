#!/usr/bin/env node
/**
 * Computed 样式基线表 — 4175 vs 5174，按语义节点逐行对比。
 *
 * 前置：双 dev（4175 baseline worktree + 5174 当前分支）
 * 用法：pnpm compare:style-baseline
 *       pnpm compare:style-baseline -- dapp-swap-desktop
 *
 * SSOT：docs/foundation/runbook.md（可选回归；当前分支 = baseline）
 * 输出：tmp/parity-baseline/<page>.json + .md
 */
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.UI_COMPARE_BASE ?? 'http://127.0.0.1:4175'
const CURR = process.env.UI_COMPARE_CURR ?? 'http://127.0.0.1:5174'
const OUT = path.resolve(process.env.UI_COMPARE_OUT ?? 'tmp/parity-baseline')
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

const LAYOUT_KEYS = ['width', 'height', 'gap', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight']

/** @typedef {{ id: string, group: string, owner: string, selector: string, nth?: number, optional?: boolean }} CatalogEntry */

/** @type {Record<string, { url: string, tab?: string, viewport: { width: number, height: number }, waitMs?: number }>} */
const PAGES = {
  'dapp-swap-desktop': {
    url: '/en/app.html',
    tab: 'swap',
    viewport: { width: 1440, height: 900 },
    waitMs: 1500,
  },
  'dapp-swap-h5': {
    url: '/en/app.html',
    tab: 'swap',
    viewport: { width: 390, height: 844 },
    waitMs: 1500,
  },
}

/** @type {CatalogEntry[]} */
const SWAP_CATALOG = [
  // —— Shell / Rail ——
  { id: 'rail-tab-swap-active', group: 'rail', owner: 'dapp-rail.tsx + shellRailItemClass', selector: 'nav[aria-label="DApp sections"] button[role="tab"] span[title]', nth: 0 },
  { id: 'rail-tab-cobuild-inactive', group: 'rail', owner: 'dapp-rail.tsx + shellRailItemClass', selector: 'nav[aria-label="DApp sections"] button[role="tab"] span[title]', nth: 1 },
  { id: 'rail-tab-rewards-inactive', group: 'rail', owner: 'dapp-rail.tsx + shellRailItemClass', selector: 'nav[aria-label="DApp sections"] button[role="tab"] span[title]', nth: 2 },
  { id: 'rail-tab-community-inactive', group: 'rail', owner: 'dapp-rail.tsx + shellRailItemClass', selector: 'nav[aria-label="DApp sections"] button[role="tab"] span[title]', nth: 3 },
  { id: 'rail-tab-btn-cobuild', group: 'rail-layout', owner: 'shellRailItemClass', selector: 'nav[aria-label="DApp sections"] button[role="tab"]', nth: 1 },
  { id: 'topbar-brand', group: 'shell', owner: 'header brand Text/link', selector: 'header a[aria-label*="home"] span, header .container > a span' },
  { id: 'topbar-connect', group: 'shell', owner: 'WalletConnectChip / Button primary', selector: 'header button.bg-primary' },
  { id: 'topbar-lang', group: 'shell', owner: 'header lang pill', selector: 'header button.rounded-full, header .rounded-full.border-border' },

  // —— Widget column ——
  { id: 'widget-h1', group: 'widget-text', owner: 'swap-widget-header / swap-hub-title', selector: '[data-dapp-widget-panel] h1' },
  { id: 'widget-subtitle', group: 'widget-text', owner: 'swap-widget-header / compact-body', selector: '[data-dapp-widget-panel] h1 ~ p' },
  { id: 'mode-card-convert-title', group: 'widget-card', owner: 'swap-mode-card / compact-title', selector: '[data-dapp-widget-panel] button.rounded-md strong, [data-dapp-widget-panel] button.rounded-md span.font-semibold', nth: 0 },
  { id: 'mode-card-convert-body', group: 'widget-card', owner: 'swap-mode-card / compact-body', selector: '[data-dapp-widget-panel] button.rounded-md p, [data-dapp-widget-panel] button.rounded-md span.text-muted-foreground, [data-dapp-widget-panel] button.rounded-md span.text-ink-muted', nth: 0 },
  { id: 'mode-card-trade-title', group: 'widget-card', owner: 'swap-mode-card', selector: '[data-dapp-widget-panel] button.rounded-md strong, [data-dapp-widget-panel] button.rounded-md span.font-semibold', nth: 1 },
  { id: 'mode-card-trade-body', group: 'widget-card', owner: 'swap-mode-card', selector: '[data-dapp-widget-panel] button.rounded-md p, [data-dapp-widget-panel] button.rounded-md span.text-muted-foreground, [data-dapp-widget-panel] button.rounded-md span.text-ink-muted', nth: 1 },
  { id: 'mode-card-burn-title', group: 'widget-card', owner: 'swap-mode-card', selector: '[data-dapp-widget-panel] button.rounded-md strong, [data-dapp-widget-panel] button.rounded-md span.font-semibold', nth: 2 },
  { id: 'mode-card-burn-body', group: 'widget-card', owner: 'swap-mode-card', selector: '[data-dapp-widget-panel] button.rounded-md p, [data-dapp-widget-panel] button.rounded-md span.text-muted-foreground, [data-dapp-widget-panel] button.rounded-md span.text-ink-muted', nth: 2 },
  { id: 'mode-card-burn-badge', group: 'widget-card', owner: 'swap-mode-card / mode-badge', selector: '[data-dapp-widget-panel] span.rounded-full.bg-\\[\\#FF9500\\], [data-dapp-widget-panel] .rounded-full[class*="FF9500"]' },
  { id: 'mode-card-root-convert', group: 'widget-card-layout', owner: 'swapModeCard tv', selector: '[data-dapp-widget-panel] button.rounded-md.border-border', nth: 0 },
  { id: 'widget-connect-promo-title', group: 'widget-card', owner: 'dapp-connect-promo-card', selector: '[data-dapp-widget-panel] section strong, [data-dapp-widget-panel] [data-reveal] strong', optional: true },

  // —— Detail column ——
  { id: 'detail-h2-program', group: 'detail-text', owner: 'swap-hub-content / detail-section-title', selector: '[data-dapp-detail] h2, main h2', nth: 0 },
  { id: 'detail-h2-faq', group: 'detail-text', owner: 'swap-hub-content / detail-section-title', selector: '[data-dapp-detail] h2, main h2', nth: 1 },
  { id: 'program-card-0-title', group: 'detail-card', owner: 'swap-program-card / ProgramCard', selector: '[data-dapp-detail] article h3, [data-dapp-detail] article strong', nth: 0 },
  { id: 'program-card-0-body', group: 'detail-card', owner: 'swap-promo-card / panel-subtitle', selector: '[data-dapp-detail] article p', nth: 0 },
  { id: 'program-card-0-kicker', group: 'detail-card', owner: 'swap-program-card / kicker', selector: '[data-dapp-detail] article span.uppercase, [data-dapp-detail] article .uppercase', nth: 0 },
  { id: 'about-card-title', group: 'detail-card', owner: 'swap-promo-card / promo-title', selector: '[data-dapp-detail] [data-reveal] strong', optional: true },
  { id: 'program-section-grid', group: 'detail-layout', owner: 'swap-program-cards', selector: '[data-dapp-detail] section:nth-of-type(2) .grid.gap-2' },
  { id: 'program-card-hero', group: 'detail-card', owner: 'swap-program-card / program-body', selector: '[data-dapp-detail] section:nth-of-type(2) button', nth: 0 },
  { id: 'faq-question-0', group: 'detail-card', owner: 'faq-list / faq-question', selector: '[data-dapp-detail] [data-faq-item] [data-faq-trigger] span', nth: 0 },
  { id: 'detail-page-root', group: 'detail-layout', owner: 'DappDetailPage', selector: '[data-dapp-detail]' },
]

function parseArgs() {
  const args = process.argv.slice(2)
  const dash = args.indexOf('--')
  const ids = dash === -1 ? [] : args.slice(dash + 1)
  return ids.length ? ids : Object.keys(PAGES)
}

function diffStyles(a, b) {
  /** @type {string[]} */
  const out = []
  for (const k of STYLE_KEYS) {
    if (a[k] !== b[k]) out.push(`${k}: ${a[k]} → ${b[k]}`)
  }
  return out
}

function typographyDiffs(diffs) {
  return diffs.filter((d) => /fontSize|fontWeight|lineHeight|letterSpacing|color/.test(d))
}

function layoutDiffs(diffs) {
  return diffs.filter((d) => LAYOUT_KEYS.some((k) => d.startsWith(k + ':')))
}

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
        cls: String(el.className ?? '').slice(0, 120),
        text: (el.textContent ?? '').trim().slice(0, 40),
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        styles,
      }
    },
    {
      STYLE_KEYS,
      selector: entry.selector,
      nth: entry.nth ?? null,
    },
  )
}

function mdEscape(s) {
  return String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function toMarkdown(pageId, rows) {
  const lines = [
    `# Parity baseline — ${pageId}`,
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `Base: ${BASE} · Curr: ${CURR}`,
    '',
    '## Summary',
    '',
    `| Status | Count |`,
    `|--------|-------|`,
    `| MATCH | ${rows.filter((r) => r.status === 'match').length} |`,
    `| DIFF | ${rows.filter((r) => r.status === 'diff').length} |`,
    `| MISSING | ${rows.filter((r) => r.status === 'missing').length} |`,
    '',
    '## Full table',
    '',
    '| Group | ID | Owner | Status | fontSize | lineHeight | color (4175→5174) | Layout diffs | Typography diffs |',
    '|-------|-----|-------|--------|----------|------------|-------------------|--------------|------------------|',
  ]
  for (const r of rows) {
    const b = r.base?.styles
    const c = r.curr?.styles
    lines.push(
      `| ${r.group} | ${r.id} | ${mdEscape(r.owner)} | **${r.status}** | ${b?.fontSize ?? '—'} → ${c?.fontSize ?? '—'} | ${b?.lineHeight ?? '—'} → ${c?.lineHeight ?? '—'} | ${mdEscape(b?.color ?? '—')} → ${mdEscape(c?.color ?? '—')} | ${mdEscape(r.layoutDiffs.join('; ') || '—')} | ${mdEscape(r.typographyDiffs.join('; ') || '—')} |`,
    )
  }
  lines.push('', '## Diff detail', '')
  for (const r of rows.filter((x) => x.status === 'diff')) {
    lines.push(`### ${r.id} (${r.group})`, '', `- Owner: \`${r.owner}\``, '')
    for (const d of r.allDiffs) lines.push(`- ${d}`)
    lines.push('')
  }
  return lines.join('\n')
}

async function runPage(pageId, catalog) {
  const pageDef = PAGES[pageId]
  if (!pageDef) throw new Error(`Unknown page: ${pageId}`)

  const browser = await chromium.launch({ channel: CHANNEL, headless: true })
  /** @type {Record<string, unknown>} */
  const side = { base: null, curr: null }

  try {
    for (const [port, key, root] of [
      [4175, 'base', BASE],
      [5174, 'curr', CURR],
    ]) {
      const page = await browser.newPage()
      await page.setViewportSize(pageDef.viewport)
      await preparePage(page, root, pageDef)
      /** @type {Record<string, unknown>} */
      const probes = {}
      for (const entry of catalog) {
        probes[entry.id] = await probeEntry(page, entry)
      }
      side[key] = probes
      await page.close()
    }
  } finally {
    await browser.close()
  }

  /** @type {Array<Record<string, unknown>>} */
  const rows = []
  for (const entry of catalog) {
    const base = side.base[entry.id]
    const curr = side.curr[entry.id]
    let status = 'match'
    /** @type {string[]} */
    const allDiffs = []
    if (base?.missing && curr?.missing) status = entry.optional ? 'missing-optional' : 'missing'
    else if (base?.missing || curr?.missing) status = 'missing'
    else {
      allDiffs.push(...diffStyles(base.styles, curr.styles))
      if (base.rect.w !== curr.rect.w || base.rect.h !== curr.rect.h) {
        allDiffs.push(`rect.w: ${base.rect.w} → ${curr.rect.w}`)
        allDiffs.push(`rect.h: ${base.rect.h} → ${curr.rect.h}`)
      }
      if (Math.abs(base.rect.y - curr.rect.y) > 0.5) {
        allDiffs.push(`rect.y: ${base.rect.y} → ${curr.rect.y}`)
      }
      if (allDiffs.length) status = 'diff'
    }
    rows.push({
      id: entry.id,
      group: entry.group,
      owner: entry.owner,
      optional: entry.optional ?? false,
      status,
      base,
      curr,
      allDiffs,
      typographyDiffs: typographyDiffs(allDiffs),
      layoutDiffs: layoutDiffs(allDiffs),
    })
  }

  fs.mkdirSync(OUT, { recursive: true })
  const jsonPath = path.join(OUT, `${pageId}.json`)
  const mdPath = path.join(OUT, `${pageId}.md`)
  fs.writeFileSync(
    jsonPath,
    JSON.stringify({ pageId, base: BASE, curr: CURR, at: new Date().toISOString(), rows }, null, 2),
  )
  fs.writeFileSync(mdPath, toMarkdown(pageId, rows))

  const diffs = rows.filter((r) => r.status === 'diff')
  console.log(`\n${pageId}: match=${rows.filter((r) => r.status === 'match').length} diff=${diffs.length} missing=${rows.filter((r) => r.status === 'missing' || r.status === 'missing-optional').length}`)
  console.log(`  → ${mdPath}`)
  return { pageId, rows, mdPath, jsonPath }
}

const pageIds = parseArgs()
const catalogByPage = {
  'dapp-swap-desktop': SWAP_CATALOG,
  'dapp-swap-h5': SWAP_CATALOG,
}

fs.mkdirSync(OUT, { recursive: true })
console.log(`Style baseline: ${BASE} vs ${CURR}`)
console.log(`Output: ${OUT}\n`)

for (const id of pageIds) {
  const catalog = catalogByPage[id]
  if (!catalog) {
    console.warn(`Skip ${id}: no catalog`)
    continue
  }
  await runPage(id, catalog)
}
