#!/usr/bin/env node
/**
 * 4175 vs 5174 — viewport screenshot pixel diff via Kimi WebBridge（系统 Edge）。
 *
 * 前置（双 dev 模式）：
 *   Kimi WebBridge 守护进程 + Edge 扩展已连接
 *   4175: cd /private/tmp/aegis-dev-baseline && pnpm dev --host 127.0.0.1 --port 4175 --strictPort
 *   5174: cd aegis && pnpm dev --host 127.0.0.1 --port 5174 --strictPort
 *
 * 每个 target 对比完自动 close_session，避免 Edge 标签堆积。
 * 用法：pnpm compare:screenshots
 */
import fs from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'

const BASE = process.env.UI_COMPARE_BASE ?? 'http://127.0.0.1:4175'
const CURR = process.env.UI_COMPARE_CURR ?? 'http://127.0.0.1:5174'
const WB = 'http://127.0.0.1:10086/command'
const OUT = path.resolve(process.env.UI_COMPARE_OUT ?? 'tmp/screenshot-diff')
const THRESHOLD = Number(process.env.UI_COMPARE_DIFF_THRESHOLD ?? 30)
const CMD_TIMEOUT_MS = 120_000
/** 固定 session，便于 close_session 清理 */
const RUN_SESSION = process.env.UI_COMPARE_WB_SESSION ?? 'aegis-visual-compare'

async function closeSessionQuiet() {
  try {
    const data = await wb('close_session', {})
    return data?.closed ?? 0
  } catch {
    return 0
  }
}

/** @typedef {{ id: string, url: string, viewport: { width: number, height: number }, tab?: string, scrollHome?: boolean, waitMs?: number }} Target */

/** @type {Target[]} */
const TARGETS = [
  { id: 'home-desktop', url: '/en/', viewport: { width: 1440, height: 900 }, scrollHome: true, waitMs: 1200 },
  { id: 'home-h5', url: '/en/', viewport: { width: 390, height: 844 }, scrollHome: true, waitMs: 1200 },
  { id: 'dapp-swap-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'swap', waitMs: 1500 },
  { id: 'dapp-swap-h5', url: '/en/app.html', viewport: { width: 390, height: 844 }, tab: 'swap', waitMs: 1500 },
  { id: 'dapp-genesis-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'genesis', waitMs: 1200 },
  { id: 'dapp-rewards-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'reward', waitMs: 1200 },
  { id: 'dapp-community-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'community', waitMs: 1200 },
]

async function wb(action, args = {}) {
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), CMD_TIMEOUT_MS)
  try {
    const res = await fetch(WB, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, args, session: RUN_SESSION }),
      signal: ac.signal,
    })
    const json = await res.json()
    if (!json.ok) throw new Error(`${action}: ${JSON.stringify(json.error ?? json)}`)
    return json.data
  } finally {
    clearTimeout(timer)
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function setViewport(viewport) {
  await wb('cdp', {
    method: 'Emulation.setDeviceMetricsOverride',
    params: {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width < 500,
    },
  })
}

async function scrollHome() {
  await wb('evaluate', {
    code: `(() => {
      const h = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0);
      window.scrollTo(0, h);
      return h;
    })()`,
  })
  await sleep(800)
  await wb('evaluate', { code: '(() => { window.scrollTo(0, 0); return 0; })()' })
  await sleep(250)
}

async function clickTab(label) {
  await wb('evaluate', {
    code: `(() => {
      const re = new RegExp(${JSON.stringify(label)}, 'i');
      const nodes = document.querySelectorAll('nav button, nav a, [role="tab"]');
      for (const n of nodes) {
        if (re.test((n.innerText || '').trim())) { n.click(); return true; }
      }
      return false;
    })()`,
  })
  await sleep(900)
}

async function readMetrics() {
  const r = await wb('evaluate', {
    code: `(() => ({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      bodyW: document.body.getBoundingClientRect().width,
      scrollW: document.documentElement.scrollWidth,
    }))()`,
  })
  return r?.value ?? r
}

async function prepareTab(tabUrl, target) {
  await wb('find_tab', { url: tabUrl })
  await setViewport(target.viewport)
  if (target.scrollHome) await scrollHome()
  if (target.tab) await clickTab(target.tab)
  await sleep(target.waitMs ?? 1000)
  await wb('evaluate', { code: '(() => { window.scrollTo(0, 0); return 0; })()' })
  await sleep(300)
  return readMetrics()
}

async function screenshotTo(outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  const data = await wb('screenshot', { format: 'png', path: outPath })
  const shotPath = data?.path ?? outPath
  if (!fs.existsSync(shotPath)) throw new Error(`screenshot missing: ${shotPath}`)
  return shotPath
}

function writeDiff(aPath, bPath, outPath) {
  const a = PNG.sync.read(fs.readFileSync(aPath))
  const b = PNG.sync.read(fs.readFileSync(bPath))
  const w = Math.min(a.width, b.width)
  const h = Math.min(a.height, b.height)
  const out = new PNG({ width: w, height: h })
  let diffPx = 0
  const widthMismatch = a.width !== b.width || a.height !== b.height

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * a.width + x) * 4
      const j = (y * b.width + x) * 4
      const o = (y * w + x) * 4
      const d =
        Math.abs(a.data[i] - b.data[j]) +
        Math.abs(a.data[i + 1] - b.data[j + 1]) +
        Math.abs(a.data[i + 2] - b.data[j + 2])
      if (d > THRESHOLD) {
        out.data[o] = 255
        out.data[o + 1] = 0
        out.data[o + 2] = 0
        out.data[o + 3] = 255
        diffPx++
      } else {
        out.data[o] = 40
        out.data[o + 1] = 40
        out.data[o + 2] = 40
        out.data[o + 3] = 255
      }
    }
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, PNG.sync.write(out))
  return {
    diffPx,
    total: w * h,
    pct: Number(((100 * diffPx) / (w * h)).toFixed(2)),
    baseSize: { w: a.width, h: a.height },
    currSize: { w: b.width, h: b.height },
    widthMismatch,
  }
}

fs.mkdirSync(OUT, { recursive: true })

await closeSessionQuiet()

console.log(`Kimi WebBridge screenshot diff: ${BASE} vs ${CURR}`)
console.log(`Session: ${RUN_SESSION}（每个 target 完成后关闭标签）`)
console.log(`Output: ${OUT}\n`)

const report = []

try {
for (const target of TARGETS) {
  process.stdout.write(`▶ ${target.id} … `)
  await closeSessionQuiet()

  const baseFull = BASE + target.url
  const currFull = CURR + target.url

  const baseNav = await wb('navigate', {
    url: baseFull,
    newTab: true,
    group_title: `screenshot ${target.id}`,
  })
  const currNav = await wb('navigate', {
    url: currFull,
    newTab: true,
    group_title: `screenshot ${target.id}`,
  })

  const baseDir = path.join(OUT, target.id)
  const basePath = path.join(baseDir, 'base-4175.png')
  const currPath = path.join(baseDir, 'curr-5174.png')
  const diffPath = path.join(baseDir, 'diff.png')

  const baseMetrics = await prepareTab(baseNav.url, target)
  const baseShot = await screenshotTo(basePath)

  const currMetrics = await prepareTab(currNav.url, target)
  const currShot = await screenshotTo(currPath)

  const stats = writeDiff(baseShot, currShot, diffPath)
  const row = {
    id: target.id,
    viewport: target.viewport,
    baseMetrics,
    currMetrics,
    ...stats,
    paths: { base: baseShot, curr: currShot, diff: diffPath },
  }
  report.push(row)

  const flag = stats.pct === 0 && !stats.widthMismatch ? '✓' : '≠'
  const sizeNote = stats.widthMismatch
    ? ` 尺寸 ${stats.baseSize.w}×${stats.baseSize.h} vs ${stats.currSize.w}×${stats.currSize.h}`
    : ''
  console.log(`${flag} ${stats.pct}%${sizeNote}`)

  const closed = await closeSessionQuiet()
  if (closed > 0) process.stdout.write(`  (已关 ${closed} 标签) `)
}
} finally {
  const closed = await closeSessionQuiet()
  if (closed > 0) console.log(`\n收尾关闭 ${closed} 个标签`)
}

fs.writeFileSync(
  path.join(OUT, 'report.json'),
  JSON.stringify({ engine: 'kimi-webbridge', base: BASE, curr: CURR, session: RUN_SESSION, report }, null, 2),
)

console.log('\n=== 有差异的页面 ===')
for (const row of [...report].sort((a, b) => b.pct - a.pct)) {
  if (row.pct === 0 && !row.widthMismatch) continue
  console.log(`\n${row.id}: ${row.pct}%`)
  if (row.widthMismatch) {
    console.log(`  PNG 尺寸: ${row.baseSize.w}×${row.baseSize.h} vs ${row.currSize.w}×${row.currSize.h}`)
  }
  if (row.baseMetrics?.innerWidth !== row.currMetrics?.innerWidth) {
    console.log(`  innerWidth: ${row.baseMetrics?.innerWidth} vs ${row.currMetrics?.innerWidth}`)
  }
  console.log(`  diff → ${row.paths.diff}`)
}

console.log(`\nReport: ${path.join(OUT, 'report.json')}`)

const anyDiff = report.some((r) => r.pct > 0 || r.widthMismatch)
process.exit(anyDiff ? 1 : 0)
