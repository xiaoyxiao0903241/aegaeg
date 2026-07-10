#!/usr/bin/env node
/**
 * Home / DApp entry JS size probe (post `pnpm build`).
 * Usage: node scripts/probe-home-bundle.mjs [distDir]
 *
 * Exits 1 when Home sync graph looks polluted (web3 markers / size / copy leak).
 */
import { readFileSync, statSync, existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  HOME_WEB3_POLLUTION_MARKERS,
  collectHomeBundleFailures,
  matchBundleMarkers,
} from './lib/home-bundle-assertions.mjs'

const distDir = resolve(process.argv[2] ?? 'dist')
const reportPath = resolve(distDir, 'bundle-probe.json')

/** @param {string} htmlPath */
function scriptSrcs(htmlPath) {
  const html = readFileSync(htmlPath, 'utf8')
  return [...html.matchAll(/src="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1])
}

/** @param {string[]} scripts */
function summarize(scripts) {
  /** @type {{ path: string, bytes: number }[]} */
  const rows = []
  let total = 0
  for (const src of scripts) {
    const file = resolve(distDir, src.slice(1))
    if (!existsSync(file)) continue
    const bytes = statSync(file).size
    total += bytes
    rows.push({ path: src, bytes })
  }
  rows.sort((a, b) => b.bytes - a.bytes)
  return { totalBytes: total, scripts: rows, count: rows.length }
}

/** @param {string[]} scripts */
function readSyncScriptTexts(scripts) {
  /** @type {string[]} */
  const texts = []
  for (const src of scripts) {
    const file = resolve(distDir, src.slice(1))
    if (!existsSync(file)) continue
    try {
      texts.push(readFileSync(file, 'utf8'))
    } catch {
      // ignore unreadable assets
    }
  }
  return texts
}

/** @param {string} label @param {string} htmlRel */
function probeEntry(label, htmlRel) {
  const htmlPath = resolve(distDir, htmlRel)
  if (!existsSync(htmlPath)) {
    console.error(`missing ${htmlPath}`)
    process.exit(1)
  }
  const summary = summarize(scriptSrcs(htmlPath))
  const html = readFileSync(htmlPath, 'utf8')
  const injected = html.includes('id="aegis-messages"')
  const texts = readSyncScriptTexts(summary.scripts.map((r) => r.path))
  const joined = texts.join('\n')

  const hasJa = joined.includes('未来の価値')
  const hasSlippage = joined.includes('slippage')
  const hasThirdwebReact = joined.includes('thirdweb/react')
  const matchedPollutionMarkers = [
    ...new Set(matchBundleMarkers(joined, HOME_WEB3_POLLUTION_MARKERS)),
  ]

  return {
    label,
    html: htmlRel,
    injectedMessages: injected,
    syncScriptsKb: Math.round(summary.totalBytes / 1024),
    syncScriptCount: summary.count,
    largestKb: summary.scripts[0] ? Math.round(summary.scripts[0].bytes / 1024) : 0,
    largest: summary.scripts[0]?.path ?? null,
    top: summary.scripts.slice(0, 8).map((r) => ({
      path: r.path,
      kb: Math.round(r.bytes / 1024),
    })),
    /** Home should not embed other-locale copy in sync graph */
    syncContainsJapaneseCopy: hasJa,
    /** Home should ideally avoid DApp-only copy; DApp may contain it */
    syncContainsSlippage: hasSlippage,
    /** Legacy single-string probe — insufficient alone (often minified away). */
    syncContainsThirdwebReact: hasThirdwebReact,
    matchedPollutionMarkers,
  }
}

const home = probeEntry('home-en', 'en/index.html')
const dapp = probeEntry('dapp-en', 'en/app.html')
const homeFailures = collectHomeBundleFailures(home)
const report = {
  generatedAt: new Date().toISOString(),
  distDir,
  home,
  dapp,
  homeFailures,
  ok: homeFailures.length === 0,
}

writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

function print(entry) {
  console.log(`\n== ${entry.label} (${entry.html})`)
  console.log(
    `  sync JS: ${entry.syncScriptsKb} KB across ${entry.syncScriptCount} files` +
      (entry.largest ? ` · largest ${entry.largestKb} KB ${entry.largest}` : ''),
  )
  console.log(`  injected #aegis-messages: ${entry.injectedMessages}`)
  console.log(
    `  sync has JP copy: ${entry.syncContainsJapaneseCopy} · slippage: ${entry.syncContainsSlippage} · thirdweb/react: ${entry.syncContainsThirdwebReact}`,
  )
  console.log(
    `  pollution markers: ${
      entry.matchedPollutionMarkers.length > 0
        ? entry.matchedPollutionMarkers.join(', ')
        : '(none)'
    }`,
  )
  for (const row of entry.top) {
    console.log(`    ${String(row.kb).padStart(5)} KB  ${row.path}`)
  }
}

print(home)
print(dapp)
console.log(`\nWrote ${reportPath}`)

if (homeFailures.length > 0) {
  console.error('\nHome bundle probe FAILED:')
  for (const failure of homeFailures) {
    console.error(`  - ${failure}`)
  }
  process.exit(1)
}

console.log('\nHome bundle probe OK')
