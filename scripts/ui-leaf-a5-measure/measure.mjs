#!/usr/bin/env node
/**
 * UI leaf A5 全量测量运行器（§2.3b）。
 *
 * 用法：
 *   pnpm measure:leaf --profile assets-hub
 *   node scripts/ui-leaf-a5-measure/measure.mjs --profile assets-hub
 *   node scripts/ui-leaf-a5-measure/measure.mjs --list
 *
 * 依赖 `pnpm dev` 监听 :5174，以及 Kimi WebBridge 监听 :10086。
 *
 * 约束：
 *   - 读取 A4 清单 JSON（N 行，含 nodeId 与 spec）
 *   - 逐行测量，R 必须等于 N，不做抽检
 *   - 写入 `*-measure-full.json`，包含 R_eq_N / pass / fail / fail_rows
 *   - R≠N 或有 LOCATE_FAIL / compare FAIL 时退出 1（--allow-fail 时只强制 R=N）
 *
 * 新增页面：添加 profiles/<id>.mjs 与 profiles/<id>.page.js，并在下方 PROFILES 注册。
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

import { compareLeaf, parseSpec } from './lib/compare.mjs'
import { createWebBridge } from './lib/webbridge.mjs'

/** @type {Record<string, string>} */
const PROFILES = {
  'assets-hub': './profiles/assets-hub.mjs',
  'assets-stake': './profiles/assets-stake.mjs',
  'staking-hub': './profiles/staking-hub.mjs',
  'staking-stake': './profiles/staking-stake.mjs',
  'rewards-hub': './profiles/rewards-hub.mjs',
  'rewards-lucky': './profiles/rewards-lucky.mjs',
  'release-hub': './profiles/release-hub.mjs',
  'release-queue': './profiles/release-queue.mjs',
  'release-buffer': './profiles/release-buffer.mjs',
  'community-hub': './profiles/community-hub.mjs',
}

/**
 * 打印命令行用法。
 */
function usage() {
  console.log(`Usage:
  pnpm measure:leaf --profile <id>
  pnpm measure:leaf --list

Profiles: ${Object.keys(PROFILES).join(', ') || '(none)'}

Flags:
  --profile <id>   page profile (required unless --list)
  --url <url>      override profile url
  --out <path>     override output json path
  --allow-fail     exit 0 when R==N even if style FAILs remain (still prints fails)
  --dry-run        load profile + inventory only; do not call WebBridge
`)
}

/**
 * 解析命令行参数。
 *
 * @param {string[]} argv 去掉 node/脚本名后的参数
 * @returns {Record<string, string | boolean>} 参数名到值的映射
 */
function parseArgs(argv) {
  /** @type {Record<string, string | boolean>} */
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--list') out.list = true
    else if (a === '--allow-fail') out.allowFail = true
    else if (a === '--dry-run') out.dryRun = true
    else if (a === '--help' || a === '-h') out.help = true
    else if (a === '--profile') out.profile = argv[++i]
    else if (a === '--url') out.url = argv[++i]
    else if (a === '--out') out.out = argv[++i]
    else if (a.startsWith('--profile=')) out.profile = a.slice('--profile='.length)
    else if (a.startsWith('--url=')) out.url = a.slice('--url='.length)
    else if (a.startsWith('--out=')) out.out = a.slice('--out='.length)
  }
  return out
}

/**
 * 等待指定毫秒数。
 *
 * @param {number} ms 等待时长
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * 动态加载测量 profile 模块并校验导出。
 *
 * @param {string} id PROFILES 中注册的 profile id
 * @returns 包含 profile 与 mapLeaves 的模块
 */
async function loadProfile(id) {
  const rel = PROFILES[id]
  if (!rel) {
    throw new Error(`Unknown profile "${id}". Known: ${Object.keys(PROFILES).join(', ')}`)
  }
  const mod = await import(new URL(rel, import.meta.url).href)
  if (!mod.profile || typeof mod.mapLeaves !== 'function') {
    throw new Error(`Profile ${id} must export { profile, mapLeaves }`)
  }
  return mod
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    usage()
    process.exit(0)
  }
  if (args.list) {
    console.log(Object.keys(PROFILES).join('\n') || '(no profiles)')
    process.exit(0)
  }
  if (!args.profile || typeof args.profile !== 'string') {
    usage()
    process.exit(2)
  }

  const { profile, mapLeaves } = await loadProfile(args.profile)
  const url = typeof args.url === 'string' ? args.url : profile.url
  const outPath = typeof args.out === 'string' ? args.out : profile.out

  const gdc = JSON.parse(readFileSync(profile.inventory, 'utf8'))
  if (!Array.isArray(gdc) || gdc.length === 0) {
    throw new Error(`Inventory empty or not an array: ${profile.inventory}`)
  }
  const N = gdc.length
  for (const leaf of gdc) {
    if (!leaf?.nodeId) throw new Error('Inventory row missing nodeId')
  }

  console.log(
    JSON.stringify(
      {
        profile: profile.id,
        N,
        url,
        inventory: profile.inventory,
        out: outPath,
      },
      null,
      2,
    ),
  )

  if (args.dryRun) {
    console.log('dry-run OK')
    process.exit(0)
  }

  const wb = createWebBridge(profile.session ?? `a5-${profile.id}`)
  await wb.navigate(url, { newTab: true })
  await sleep(2200)
  if (profile.viewport) {
    await wb.cdp('Emulation.setDeviceMetricsOverride', {
      width: profile.viewport.width,
      height: profile.viewport.height,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await sleep(400)
  }
  const hash = new URL(url).hash.replace(/^#/, '')
  await wb.evaluate(`(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    if (${JSON.stringify(hash)}) location.hash = ${JSON.stringify(hash)};
    return location.href;
  })()`)
  await sleep(800)
  // 等待 profile 自定义的就绪条件；未配置时走固定等待
  if (typeof profile.waitUntilReadyJs === 'string') {
    for (let i = 0; i < 15; i++) {
      const ready = await wb.evaluate(profile.waitUntilReadyJs)
      if (ready) break
      await sleep(400)
    }
  } else {
    await sleep(1200)
  }

  const pageJs = profile.loadPageSnapshotJs()
  const page = await wb.evaluate(pageJs)
  if (!page || typeof page !== 'object') {
    throw new Error('Page snapshot evaluate returned empty')
  }

  const mapped = mapLeaves(gdc, page)
  if (mapped.length !== N) {
    throw new Error(`R candidate ${mapped.length} !== N ${N}`)
  }

  /** @type {object[]} */
  const rows = []
  /** @type {object[]} */
  const failRows = []

  for (const { leaf, measured, locator } of mapped) {
    const expected = parseSpec(leaf.spec)
    const leafNorm = {
      ...leaf,
      w: leaf.w ?? leaf.gdc_w ?? null,
      h: leaf.h ?? leaf.gdc_h ?? null,
    }
    const { ok, verdicts } = compareLeaf(measured, leafNorm, expected, {
      // 右栏 tile 宽随 detail 内栏与 gap 伸缩；只钉高度，不要用 -mx 顶满容器 padding
      fluidWide: leaf.fluidWide === true || /^tile\//i.test(leaf.name ?? ''),
    })
    const row = {
      nodeId: leaf.nodeId,
      kind: leaf.kind,
      name: leaf.name,
      locator,
      spec: leaf.spec ?? null,
      expected: {
        w: leafNorm.w,
        h: leafNorm.h,
        fs: expected.fs,
        fw: expected.fw,
        color: expected.colorHint,
      },
      measured,
      ok,
      verdicts,
    }
    rows.push(row)
    if (!ok) {
      failRows.push({
        nodeId: row.nodeId,
        name: row.name,
        locator,
        verdicts,
        measured: measured
          ? {
              fs: measured.fs,
              fw: measured.fw,
              color: measured.color,
              w: measured.w,
              h: measured.h,
              text: measured.text,
              src: measured.src,
            }
          : null,
      })
    }
  }

  const result = {
    profile: profile.id,
    generatedAt: new Date().toISOString(),
    N,
    R: rows.length,
    R_eq_N: rows.length === N,
    pass: rows.filter((r) => r.ok).length,
    fail: failRows.length,
    locate_fail: failRows.filter((r) => r.verdicts.includes('LOCATE_FAIL')).length,
    href: page.href ?? null,
    iw: page.iw ?? null,
    rows,
    fail_rows: failRows,
  }

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, JSON.stringify(result, null, 2))

  const summary = {
    N: result.N,
    R: result.R,
    R_eq_N: result.R_eq_N,
    pass: result.pass,
    fail: result.fail,
    locate_fail: result.locate_fail,
    out: outPath,
  }
  console.log(JSON.stringify(summary, null, 2))
  if (failRows.length) {
    console.log('FAIL rows:')
    for (const r of failRows.slice(0, 60)) {
      console.log(`  ${r.nodeId} ${r.name}: ${r.verdicts.join(', ')} @ ${r.locator}`)
    }
    if (failRows.length > 60) console.log(`  … +${failRows.length - 60} more`)
  }

  if (!result.R_eq_N) {
    console.error('A5 FAIL: R !== N')
    process.exit(1)
  }
  if (failRows.length && !args.allowFail) {
    console.error(`A5 FAIL: ${failRows.length} leaf(s) failed compare/locate`)
    process.exit(1)
  }
  console.log(
    result.fail === 0
      ? 'A5 PASS: R==N and 0 FAIL'
      : 'A5 R==N (style FAILs allowed by --allow-fail)',
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
