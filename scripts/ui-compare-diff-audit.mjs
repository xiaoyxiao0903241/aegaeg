#!/usr/bin/env node
/**
 * 标红像素 → DOM → computed diff（4175 vs 5174）
 *
 * 前置：pnpm compare:screenshots 已产出 tmp/screenshot-diff/
 *
 * 用法：
 *   pnpm compare:diff-audit
 *   pnpm compare:diff-audit -- dapp-swap-desktop dapp-swap-h5
 *
 * 输出：tmp/visual-diff-audit/<target>.json + summary.json
 *
 * SSOT：docs/visual-parity-workflow.md §4
 */
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'

const BASE = process.env.UI_COMPARE_BASE ?? 'http://127.0.0.1:4175'
const CURR = process.env.UI_COMPARE_CURR ?? 'http://127.0.0.1:5174'
const SHOT_DIR = path.resolve(process.env.UI_COMPARE_OUT ?? 'tmp/screenshot-diff')
const OUT_DIR = path.resolve(process.env.UI_COMPARE_AUDIT_OUT ?? 'tmp/visual-diff-audit')
const REPORT = path.join(SHOT_DIR, 'report.json')
const MAX_CLUSTERS = Number(process.env.UI_COMPARE_AUDIT_CLUSTERS ?? 12)
const MIN_CLUSTER_PX = Number(process.env.UI_COMPARE_AUDIT_MIN_CLUSTER ?? 20)
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
  'width',
  'height',
  'borderRadius',
  'gap',
  'display',
]

const CONTAINER_TAGS = new Set(['html', 'body', 'header', 'main', 'section', 'article', 'aside', 'nav', 'div'])

/** @typedef {{ id: string, url: string, viewport: { width: number, height: number }, tab?: string, scrollHome?: boolean, scrollDapp?: boolean, waitMs?: number }} ShotTarget */

/** @type {ShotTarget[]} */
const TARGETS = [
  { id: 'home-desktop', url: '/en/', viewport: { width: 1440, height: 900 }, scrollHome: true, waitMs: 1200 },
  { id: 'home-h5', url: '/en/', viewport: { width: 390, height: 844 }, scrollHome: true, waitMs: 1200 },
  { id: 'dapp-swap-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'swap', waitMs: 1500 },
  { id: 'dapp-swap-h5', url: '/en/app.html', viewport: { width: 390, height: 844 }, tab: 'swap', scrollDapp: true, waitMs: 1500 },
  { id: 'dapp-genesis-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'genesis', waitMs: 1200 },
  { id: 'dapp-genesis-h5', url: '/en/app.html', viewport: { width: 390, height: 844 }, tab: 'genesis', scrollDapp: true, waitMs: 1200 },
  { id: 'dapp-rewards-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'rewards', waitMs: 1200 },
  { id: 'dapp-rewards-h5', url: '/en/app.html', viewport: { width: 390, height: 844 }, tab: 'rewards', scrollDapp: true, waitMs: 1200 },
  { id: 'dapp-community-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'community', waitMs: 1200 },
  { id: 'dapp-community-h5', url: '/en/app.html', viewport: { width: 390, height: 844 }, tab: 'community', scrollDapp: true, waitMs: 1200 },
]

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function isHeatmapDiffPixel(png, idx) {
  const i = idx * 4
  // diff-heatmap.png：差异像素为纯红，背景为 rgb(40,40,40)
  return png.data[i] === 255 && png.data[i + 1] === 0 && png.data[i + 2] === 0
}

function resolveClusterSource(diffPath) {
  const heatmapPath = path.join(path.dirname(diffPath), 'diff-heatmap.png')
  if (fs.existsSync(heatmapPath)) {
    return { pngPath: heatmapPath, isDiffPixel: isHeatmapDiffPixel, source: 'diff-heatmap.png' }
  }
  return {
    pngPath: diffPath,
    isDiffPixel: isHeatmapDiffPixel,
    source: 'diff.png (legacy pure-red)',
  }
}

/** @param {PNG} png @param {(png: PNG, idx: number) => boolean} isDiffPixel */
function clusterDiff(png, isDiffPixel, minSize = MIN_CLUSTER_PX) {
  const w = png.width
  const h = png.height
  const seen = new Uint8Array(w * h)
  /** @type {{ px: number, x: number, y: number, w: number, h: number, cx: number, cy: number }[]} */
  const boxes = []

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x
      if (seen[idx] || !isDiffPixel(png, idx)) continue
      let minX = x
      let maxX = x
      let minY = y
      let maxY = y
      let count = 0
      const stack = [[x, y]]
      seen[idx] = 1
      while (stack.length) {
        const [cx, cy] = stack.pop()
        count++
        minX = Math.min(minX, cx)
        maxX = Math.max(maxX, cx)
        minY = Math.min(minY, cy)
        maxY = Math.max(maxY, cy)
        for (const [nx, ny] of [
          [cx + 1, cy],
          [cx - 1, cy],
          [cx, cy + 1],
          [cx, cy - 1],
        ]) {
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
          const nidx = ny * w + nx
          if (!seen[nidx] && isDiffPixel(png, nidx)) {
            seen[nidx] = 1
            stack.push([nx, ny])
          }
        }
      }
      if (count >= minSize) {
        boxes.push({
          px: count,
          x: minX,
          y: minY,
          w: maxX - minX + 1,
          h: maxY - minY + 1,
          cx: Math.round((minX + maxX) / 2),
          cy: Math.round((minY + maxY) / 2),
        })
      }
    }
  }
  return boxes.sort((a, b) => b.px - a.px)
}

/** @param {PNG} png @param {(png: PNG, idx: number) => boolean} isDiffPixel */
function bandStats(png, isDiffPixel) {
  const w = png.width
  const bands = { header: 0, widget: 0, detail: 0 }
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < w; x++) {
      if (!isDiffPixel(png, y * w + x)) continue
      if (y < 80) bands.header++
      else if (x < 520) bands.widget++
      else bands.detail++
    }
  }
  return bands
}

async function scrollHome(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms))
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6))
    let y = 0
    const max = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0)
    while (y < max) {
      window.scrollTo(0, y)
      await delay(100)
      y += step
    }
    window.scrollTo(0, max)
    await delay(300)
    window.scrollTo(0, 0)
    await delay(200)
  })
  await page.waitForTimeout(600)
}

async function setDappTab(page, tabKey) {
  await page.evaluate((hash) => {
    window.location.hash = hash
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    const widget = document.querySelector('[data-dapp-widget-panel]')
    const detail = document.querySelector('[data-dapp-detail]')
    if (widget instanceof HTMLElement) widget.scrollTop = 0
    if (detail instanceof HTMLElement) detail.scrollTop = 0
    window.scrollTo(0, 0)
  }, tabKey)
  await page.waitForTimeout(1200)
}

async function scrollDapp(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms))
    const step = Math.max(180, Math.floor(window.innerHeight * 0.55))
    let y = 0
    const max = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0)
    while (y < max) {
      window.scrollTo(0, y)
      await delay(80)
      y += step
    }
    window.scrollTo(0, max)
    await delay(200)
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(400)
}

async function preparePage(page, target, root) {
  await page.goto(root + target.url, { waitUntil: 'networkidle', timeout: 120_000 })
  if (target.scrollHome) await scrollHome(page)
  else await page.waitForTimeout(1500)
  if (target.tab) await setDappTab(page, target.tab)
  if (target.scrollDapp) await scrollDapp(page)
  await page.waitForTimeout(target.waitMs ?? 1000)
  await page.evaluate(() => {
    document.querySelectorAll('video').forEach((v) => {
      try {
        v.pause()
        v.currentTime = 0
      } catch {}
    })
    let style = document.getElementById('__compare-freeze')
    if (!style) {
      style = document.createElement('style')
      style.id = '__compare-freeze'
      document.head.appendChild(style)
    }
    style.textContent =
      '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }'
  })
  await sleep(200)
}

async function probePoint(page, x, y) {
  const vpHeight = page.viewportSize()?.height ?? 844
  const scrollY = Math.max(0, y - Math.floor(vpHeight / 2))
  return page.evaluate(
    ({ x, y, scrollY, keys, containerTags }) => {
      window.scrollTo(0, scrollY)
      const viewY = y - scrollY
      const offsets = [
        [0, 0],
        [-4, 0],
        [4, 0],
        [0, -4],
        [0, 4],
        [-8, 0],
        [8, 0],
      ]
      /** @type {{ el: Element, score: number, styles: Record<string, string>, rect: DOMRect } | null} */
      let best = null

      function scoreEl(el) {
        const cs = getComputedStyle(el)
        const tag = el.tagName.toLowerCase()
        const fs = cs.fontSize
        const hasText = (el.textContent ?? '').trim().length > 0 && el.children.length <= 3
        let score = 0
        if (!containerTags.includes(tag)) score += 3
        if (hasText) score += 2
        if (fs && fs !== '16px') score += 1
        if (tag === 'button' || tag === 'strong' || tag === 'span' || tag.startsWith('h')) score += 1
        const styles = {}
        for (const k of keys) styles[k] = cs[k]
        return { score, styles, rect: el.getBoundingClientRect() }
      }

      for (const [ox, oy] of offsets) {
        const el = document.elementFromPoint(x + ox, viewY + oy)
        if (!el) continue
        const { score, styles, rect } = scoreEl(el)
        if (!best || score > best.score) {
          best = {
            el,
            score,
            styles,
            rect,
            point: { x: x + ox, y: y + oy },
          }
        }
      }

      if (!best) return null
      const el = best.el
      const tag = el.tagName.toLowerCase()
      return {
        point: best.point,
        tag,
        cls: String(el.className ?? '').slice(0, 160),
        text: (el.textContent ?? '').trim().slice(0, 60),
        rect: { x: best.rect.x, y: best.rect.y, w: best.rect.width, h: best.rect.height },
        styles: best.styles,
        drillScore: best.score,
      }
    },
    { x, y, scrollY, keys: STYLE_KEYS, containerTags: [...CONTAINER_TAGS] },
  )
}

function styleDiffs(a, b) {
  if (!a || !b) return ['missing-side']
  /** @type {string[]} */
  const out = []
  for (const k of STYLE_KEYS) {
    if (a[k] !== b[k]) out.push(`${k}: ${a[k]} → ${b[k]}`)
  }
  return out
}

async function auditTarget(browser, target, reportRow) {
  const diffPath = path.join(SHOT_DIR, target.id, 'diff.png')
  if (!fs.existsSync(diffPath)) {
    return { target: target.id, error: `missing diff: ${diffPath}` }
  }

  const { pngPath, isDiffPixel, source } = resolveClusterSource(diffPath)
  const png = PNG.sync.read(fs.readFileSync(pngPath))
  const clusters = clusterDiff(png, isDiffPixel).slice(0, MAX_CLUSTERS)
  const bands = bandStats(png, isDiffPixel)
  let redPx = 0
  for (let i = 0; i < png.width * png.height; i++) {
    if (isDiffPixel(png, i)) redPx++
  }

  /** @type {import('playwright-core').Page[]} */
  const pages = []
  const probes = { base: [], curr: [] }

  try {
    for (const [port, key] of [
      [4175, 'base'],
      [5174, 'curr'],
    ]) {
      const page = await browser.newPage()
      pages.push(page)
      await page.setViewportSize(target.viewport)
      await preparePage(page, target, port === 4175 ? BASE : CURR)
      for (const c of clusters) {
        const dom = await probePoint(page, c.cx, c.cy)
        probes[key].push(dom)
      }
    }

    const audited = clusters.map((c, i) => ({
      px: c.px,
      bbox: { x: c.x, y: c.y, w: c.w, h: c.h },
      center: { x: c.cx, y: c.y },
      base: probes.base[i] ?? null,
      curr: probes.curr[i] ?? null,
      styleDiffs: styleDiffs(probes.base[i]?.styles, probes.curr[i]?.styles),
      sameTag: probes.base[i]?.tag === probes.curr[i]?.tag,
    }))

    const unmapped = audited.filter((a) => !a.base || !a.curr).map((a) => a.center)
    const withStyleDiff = audited.filter((a) => a.styleDiffs.length > 0 && a.styleDiffs[0] !== 'missing-side')

    return {
      target: target.id,
      url: target.url,
      tab: target.tab ?? null,
      viewport: target.viewport,
      diffPct: reportRow?.pct ?? null,
      redPx,
      bands,
      clusterCount: clusters.length,
      clusters: audited,
      unmapped,
      styleDiffClusterCount: withStyleDiff.length,
      clusterSource: source,
      paths: { diff: diffPath, heatmap: path.join(path.dirname(diffPath), 'diff-heatmap.png') },
    }
  } finally {
    for (const p of pages) await p.close()
  }
}

function parseArgs() {
  const args = process.argv.slice(2)
  const dash = args.indexOf('--')
  if (dash === -1) return args.filter((a) => !a.startsWith('-'))
  return args.slice(dash + 1)
}

if (!fs.existsSync(REPORT)) {
  console.error(`缺少 ${REPORT} — 请先运行: pnpm compare:screenshots`)
  process.exit(1)
}

const report = JSON.parse(fs.readFileSync(REPORT, 'utf8'))
const filterIds = parseArgs()
const targetMap = new Map(TARGETS.map((t) => [t.id, t]))
const reportMap = new Map(report.report.map((r) => [r.id, r]))

/** @type {string[]} */
let ids = report.report.map((r) => r.id)
if (filterIds.length) {
  ids = filterIds.filter((id) => {
    if (!targetMap.has(id)) {
      console.warn(`未知 target: ${id}`)
      return false
    }
    return true
  })
}

// 默认只 audit 有 diff 的；显式传 id 时全跑指定项
const toAudit =
  filterIds.length > 0
    ? ids
    : ids.filter((id) => {
        const row = reportMap.get(id)
        return row && (row.pct > 0 || row.widthMismatch)
      })

if (toAudit.length === 0) {
  console.log('无 pct>0 的 target；传 -- <id> 强制 audit')
  process.exit(0)
}

fs.mkdirSync(OUT_DIR, { recursive: true })

console.log(`Visual diff audit: ${BASE} vs ${CURR}`)
console.log(`Input: ${SHOT_DIR}`)
console.log(`Output: ${OUT_DIR}`)
console.log(`Targets: ${toAudit.join(', ')}\n`)

const browser = await chromium.launch({ channel: CHANNEL, headless: true })
/** @type {unknown[]} */
const summary = []

try {
  for (const id of toAudit) {
    const target = targetMap.get(id)
    if (!target) continue
    process.stdout.write(`▶ ${id} … `)
    const result = await auditTarget(browser, target, reportMap.get(id))
    const outPath = path.join(OUT_DIR, `${id}.json`)
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2))
    summary.push({
      target: id,
      diffPct: result.diffPct,
      redPx: result.redPx,
      styleDiffClusterCount: result.styleDiffClusterCount,
      unmapped: result.unmapped?.length ?? 0,
      path: outPath,
    })
    const n = result.styleDiffClusterCount ?? 0
    console.log(n > 0 ? `≠ ${n} clusters w/ style diff` : '✓ no computed diff at probes')
  }
} finally {
  await browser.close()
}

const summaryPath = path.join(OUT_DIR, 'summary.json')
fs.writeFileSync(
  summaryPath,
  JSON.stringify({ base: BASE, curr: CURR, audited: summary, at: new Date().toISOString() }, null, 2),
)

console.log(`\nSummary: ${summaryPath}`)
const blockers = summary.filter((s) => (s.styleDiffClusterCount ?? 0) > 0 || (s.unmapped ?? 0) > 0)
if (blockers.length) {
  console.log('\n=== 待修 / 待人工下钻 ===')
  for (const s of blockers) {
    console.log(`  ${s.target}: styleDiff clusters=${s.styleDiffClusterCount}, unmapped=${s.unmapped}`)
    console.log(`    → ${s.path}`)
  }
  process.exit(1)
}
