#!/usr/bin/env node
/**
 * 构建后探测 Home / DApp 入口的同步 JS 体积与污染。
 *
 * 用法：`node scripts/probe-home-bundle.mjs [distDir]`。
 * Home 首屏同步图中出现 web3 标记、体积超标或跨语言文案泄漏时，
 * 写入 `bundle-probe.json` 并以非零码退出，用于拦截 bundle 回归。
 */
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  collectHomeBundleFailures,
  HOME_WEB3_POLLUTION_MARKERS,
  matchBundleMarkers,
} from './lib/home-bundle-assertions.mjs'

const distDir = resolve(process.argv[2] ?? 'dist')
const reportPath = resolve(distDir, 'bundle-probe.json')

/**
 * 从 HTML 中提取同步加载的 `/assets/*.js` 路径。
 *
 * @param {string} htmlPath HTML 文件路径
 */
function scriptSrcs(htmlPath) {
  const html = readFileSync(htmlPath, 'utf8')
  return [...html.matchAll(/src="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1])
}

/**
 * 汇总脚本体积并按从大到小排序。
 *
 * @param {string[]} scripts 脚本 URL 列表
 * @returns 总字节数、条目数及按字节数降序的脚本明细
 */
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

/**
 * 读取可访问脚本的文本内容，跳过缺失或不可读文件。
 *
 * @param {string[]} scripts 脚本 URL 列表
 * @returns 已读取的脚本文本
 */
function readSyncScriptTexts(scripts) {
  /** @type {string[]} */
  const texts = []
  for (const src of scripts) {
    const file = resolve(distDir, src.slice(1))
    if (!existsSync(file)) continue
    try {
      texts.push(readFileSync(file, 'utf8'))
    } catch {
      // 不可读的构建产物不影响主探测
    }
  }
  return texts
}

/**
 * 探测单个入口的同步 JS 体积、内联文案注入和 web3 污染标记。
 *
 * @param {string} label 报告里展示的入口名称
 * @param {string} htmlRel dist 目录下的 HTML 相对路径
 */
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
    /** 同步 JS 不应把其他语言的文案带入 Home 首屏 */
    syncContainsJapaneseCopy: hasJa,
    /** DApp 专属文案不应混入 Home 首屏 */
    syncContainsSlippage: hasSlippage,
    /** 单字符串探测仅作辅助，压缩后可能被改写，不能单独作为结论 */
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

/**
 * 打印单个入口的探测结果。
 *
 * @param {object} entry probeEntry 返回的入口数据
 */
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
      entry.matchedPollutionMarkers.length > 0 ? entry.matchedPollutionMarkers.join(', ') : '(none)'
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
