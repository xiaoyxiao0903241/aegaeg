#!/usr/bin/env node
/**
 * Screenshot 4173 vs 5174 with optional logged-in localStorage.
 *
 * Export from browser console (on either port while logged in):
 *   copy(JSON.stringify(Object.fromEntries([...localStorage.entries()])))
 * Save to e.g. /tmp/aegis-auth-localStorage.json
 *
 * Usage:
 *   node scripts/ui-compare-screenshots.mjs --storage /tmp/aegis-auth-localStorage.json
 */
import { chromium, devices } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'

const OUT = process.env.UI_COMPARE_OUT ?? '/tmp/aegis-ui-compare/live'
const storageArg = process.argv.indexOf('--storage')
const storagePath = storageArg >= 0 ? process.argv[storageArg + 1] : null
const storageEntries = storagePath && fs.existsSync(storagePath)
  ? JSON.parse(fs.readFileSync(storagePath, 'utf8'))
  : null

const BASES = { dev: 'http://127.0.0.1:4173', ref: 'http://127.0.0.1:5174' }
const PAGES = ['swap', 'genesis', 'rewards', 'community']

function writeDiff(aPath, bPath, outPath) {
  const a = PNG.sync.read(fs.readFileSync(aPath))
  const b = PNG.sync.read(fs.readFileSync(bPath))
  const w = Math.min(a.width, b.width)
  const h = Math.min(a.height, b.height)
  const out = new PNG({ width: w, height: h })
  let diffPx = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * a.width + x) * 4
      const j = (y * b.width + x) * 4
      const o = (y * w + x) * 4
      const d =
        Math.abs(a.data[i] - b.data[j]) +
        Math.abs(a.data[i + 1] - b.data[j + 1]) +
        Math.abs(a.data[i + 2] - b.data[j + 2])
      if (d > 30) {
        out.data[o] = 255
        out.data[o + 1] = 0
        out.data[o + 2] = 0
        out.data[o + 3] = 255
        diffPx++
      } else {
        out.data[o] = 30
        out.data[o + 1] = 30
        out.data[o + 2] = 30
        out.data[o + 3] = 255
      }
    }
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, PNG.sync.write(out))
  return { diffPx, total: w * h, pct: ((100 * diffPx) / (w * h)).toFixed(2) }
}

async function shot(page, base, hash) {
  await page.goto(`${base}/zh/app.html#${hash}`, { waitUntil: 'networkidle', timeout: 60000 })
  if (storageEntries) {
    await page.evaluate((entries) => {
      for (const [key, value] of Object.entries(entries)) {
        localStorage.setItem(key, value)
      }
    }, storageEntries)
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
  } else {
    await page.waitForTimeout(1000)
  }
}

const browser = await chromium.launch()
const report = []

for (const pageName of PAGES) {
  for (const [label, base] of Object.entries(BASES)) {
    const ctx = await browser.newContext(devices['iPhone 13'])
    const page = await ctx.newPage()
    await shot(page, base, pageName)
    const suffix = label === 'dev' ? 'dev' : 'refactor'
    const out = path.join(OUT, `logged-${pageName}-mobile-${suffix}.png`)
    await page.screenshot({ path: out, fullPage: false })
    await ctx.close()
  }
  const stats = writeDiff(
    path.join(OUT, `logged-${pageName}-mobile-dev.png`),
    path.join(OUT, `logged-${pageName}-mobile-refactor.png`),
    path.join(OUT, `diff-logged-${pageName}-mobile.png`),
  )
  report.push({ page: pageName, ...stats, loggedIn: Boolean(storageEntries) })
}

await browser.close()
console.log(JSON.stringify(report, null, 2))
if (!storageEntries) {
  console.error('\n⚠ No --storage file: captured DISCONNECTED state. Export localStorage while logged in.')
}
