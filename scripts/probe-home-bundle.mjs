#!/usr/bin/env node
/**
 * Home / DApp entry JS size probe (post `pnpm build`).
 * Usage: node scripts/probe-home-bundle.mjs [distDir]
 */
import { readFileSync, statSync, existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

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
  const hasJa = summary.scripts.some(({ path }) => {
    try {
      return readFileSync(resolve(distDir, path.slice(1)), 'utf8').includes('未来の価値')
    } catch {
      return false
    }
  })
  const hasSlippage = summary.scripts.some(({ path }) => {
    try {
      return readFileSync(resolve(distDir, path.slice(1)), 'utf8').includes('slippage')
    } catch {
      return false
    }
  })
  const hasThirdweb = summary.scripts.some(({ path }) => {
    try {
      return readFileSync(resolve(distDir, path.slice(1)), 'utf8').includes('thirdweb/react')
    } catch {
      return false
    }
  })
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
    syncContainsThirdwebReact: hasThirdweb,
  }
}

const home = probeEntry('home-en', 'en/index.html')
const dapp = probeEntry('dapp-en', 'en/app.html')
const report = {
  generatedAt: new Date().toISOString(),
  distDir,
  home,
  dapp,
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
  for (const row of entry.top) {
    console.log(`    ${String(row.kb).padStart(5)} KB  ${row.path}`)
  }
}

print(home)
print(dapp)
console.log(`\nWrote ${reportPath}`)
