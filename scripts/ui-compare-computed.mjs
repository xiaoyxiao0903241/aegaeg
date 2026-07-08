#!/usr/bin/env node
/**
 * 全站 computed style 探针 — dev baseline vs 当前分支。
 * 默认使用真实 Microsoft Edge（有界面），便于连接钱包后探测已连接状态。
 *
 * 前置：
 *   cd /private/tmp/aegis-dev-baseline && pnpm build && pnpm preview --host 127.0.0.1 --port 4175 --strictPort
 *   cd aegis && pnpm dev   # :5174
 *
 * 用法：
 *   pnpm compare:computed
 *   UI_COMPARE_PAUSE=1 pnpm compare:computed   # Playwright Inspector 暂停，手动连钱包
 *
 * 环境变量：
 *   UI_COMPARE_BASE   默认 http://127.0.0.1:4175
 *   UI_COMPARE_CURR   默认 http://127.0.0.1:5174
 *   UI_COMPARE_CHANNEL  默认 msedge（Playwright channel）
 *   UI_COMPARE_HEADLESS 默认 0（必须有界面才能连钱包）
 *   UI_COMPARE_SKIP_WALLET  1 = 不等待钱包，跳过 walletOnly 探针
 *   UI_COMPARE_USE_SYSTEM_PROFILE  1 = 使用本机 Edge 用户配置目录启动 Edge
 *                                    必须先完全退出日常 Edge；且本机须已安装扩展才有效
 *   UI_COMPARE_CDP  例如 http://127.0.0.1:9222 — 附着到你手动打开的 Edge（推荐，扩展/钱包最可靠）
 *   UI_COMPARE_PROFILE  自定义持久化目录（默认 tmp/computed-compare/edge-profile，无扩展）
 *
 * CDP 推荐流程（先另开终端）：
 *   /Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge \
 *     --remote-debugging-port=9222 \
 *     --user-data-dir="$HOME/Library/Application Support/Microsoft Edge" \
 *     --profile-directory=Default
 *   然后：pnpm compare:computed:cdp
 */
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const BASE = process.env.UI_COMPARE_BASE ?? 'http://127.0.0.1:4175'
const CURR = process.env.UI_COMPARE_CURR ?? 'http://127.0.0.1:5174'
const OUT = path.resolve(process.env.UI_COMPARE_OUT ?? 'tmp/computed-compare')
const CHANNEL = process.env.UI_COMPARE_CHANNEL ?? 'msedge'
const HEADLESS = process.env.UI_COMPARE_HEADLESS === '1'
const USE_SYSTEM_PROFILE = process.env.UI_COMPARE_USE_SYSTEM_PROFILE === '1'
const SYSTEM_EDGE_DIR = path.join(
  os.homedir(),
  'Library/Application Support/Microsoft Edge',
)
const PROFILE_DIR = USE_SYSTEM_PROFILE
  ? SYSTEM_EDGE_DIR
  : path.resolve(process.env.UI_COMPARE_PROFILE ?? path.join(OUT, 'edge-profile'))
const SKIP_WALLET = process.env.UI_COMPARE_SKIP_WALLET === '1'
const PAUSE_FOR_WALLET = process.env.UI_COMPARE_PAUSE === '1'
const CDP_URL = process.env.UI_COMPARE_CDP?.trim() || ''

function countInstalledEdgeExtensions() {
  const extDir = path.join(SYSTEM_EDGE_DIR, 'Default/Extensions')
  if (!fs.existsSync(extDir)) return 0
  return fs.readdirSync(extDir).filter((name) => !name.startsWith('.')).length
}

const STYLE_KEYS = [
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'color',
  'fontFamily',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'width',
  'height',
  'minHeight',
  'maxWidth',
  'gap',
  'display',
  'alignItems',
  'justifyContent',
  'borderRadius',
  'borderTopWidth',
  'boxShadow',
]

const IGNORE_STYLE_KEYS = new Set(['fontFamily', 'boxShadow'])

/** @typedef {{ name: string, selector: string, optional?: boolean, walletOnly?: boolean, disconnectedOnly?: boolean }} Probe */
/** @typedef {{ page: string, url: string, mobile?: boolean, scrollHome?: boolean, scrollDapp?: boolean, tab?: string, requiresWallet?: boolean, probes: Probe[] }} Suite */

/** @type {Probe[]} */
const homeProbesFull = [
  { name: 'hero-title', selector: '#hero-title' },
  { name: 'hero-body', selector: '[data-hero-line="body"]' },
  { name: 'hero-eyebrow', selector: '[data-hero-line="eyebrow"]' },
  { name: 'header-brand', selector: 'header[aria-label*="navigation"] a span, header .container > a span' },
  { name: 'header-nav-link', selector: 'header nav a' },
  { name: 'section-head-eyebrow', selector: '[data-section-head] p' },
  { name: 'section-head-title', selector: '[data-section-head] h2' },
  { name: 'section-head-subtitle', selector: '[data-section-head] span.block' },
  { name: 'metrics-value', selector: '[data-count-target]' },
  { name: 'metrics-label', selector: '[data-metrics-panel] article span' },
  { name: 'feature-card-title', selector: '[data-feature-line="title"]' },
  { name: 'feature-card-body', selector: '[data-feature-line="body"]' },
  { name: 'security-check-item', selector: '#security [data-security-check]' },
  { name: 'roadmap-phase-label', selector: '[data-phase-card] span' },
  { name: 'roadmap-dot-done', selector: '[data-phase-dot].text-white' },
  { name: 'roadmap-dot-upcoming', selector: '[data-phase-dot].text-muted-foreground' },
  { name: 'roadmap-card-title', selector: '[data-phase-card] h3' },
  { name: 'roadmap-card-body', selector: '[data-phase-card] p' },
  { name: 'token-symbol', selector: '#token strong, [id="token"] strong' },
  { name: 'partners-chip', selector: '[data-partner-row] > span, [data-partners] [data-partner-row] > *' },
  { name: 'faq-question', selector: '[data-faq-trigger] span' },
  { name: 'faq-answer', selector: '.faq-answer-panel p, [data-faq-answer] p' },
  { name: 'footer-brand-copy', selector: 'footer [data-footer-brand] p, .footer-brand p' },
  { name: 'footer-link', selector: 'footer nav a, .footer-top a' },
  { name: 'footer-copyright', selector: 'footer [data-footer-copyright], .footer-bottom span, .footer-bottom p' },
]

/** @type {Probe[]} */
const dappShellProbes = [
  { name: 'topbar-brand', selector: 'header a[aria-label*="home"] span' },
  { name: 'topbar-actions', selector: 'header .flex.items-center.gap-3' },
  {
    name: 'connect-button',
    selector: '.aegis-thirdweb-button-primary, .aegis-thirdweb-button',
    disconnectedOnly: true,
    optional: true,
  },
  {
    name: 'connected-wallet-chip',
    selector: '.aegis-connected-wallet-chip',
    walletOnly: true,
    optional: true,
  },
  {
    name: 'network-pill',
    selector: 'header .rounded-full.border-border span, header .rounded-full.border-border',
    walletOnly: true,
    optional: true,
  },
  { name: 'panel-title', selector: 'main h1, [class*="shell"] h1, h1' },
  { name: 'panel-subtitle', selector: 'h1 ~ p' },
]

/** @type {Suite[]} */
const suites = [
  {
    page: 'home-desktop',
    url: '/en/',
    scrollHome: true,
    probes: homeProbesFull,
  },
  {
    page: 'home-h5',
    url: '/en/',
    mobile: true,
    scrollHome: true,
    probes: homeProbesFull,
  },
  {
    page: 'dapp-swap-desktop',
    url: '/en/app.html',
    tab: 'swap',
    probes: [
      ...dappShellProbes,
      { name: 'swap-amount-label', selector: 'section.rounded-md span', optional: true, walletOnly: true },
      { name: 'swap-amount-input', selector: 'section.rounded-md input', optional: true, walletOnly: true },
      { name: 'swap-content-heading', selector: 'main h2', optional: true },
      { name: 'swap-promo-text', selector: '[data-reveal] strong', optional: true },
      {
        name: 'swap-coming-soon-badge',
        selector: '[data-dapp-widget-panel] span.rounded-full',
      },
    ],
  },
  {
    page: 'dapp-swap-h5',
    url: '/en/app.html',
    mobile: true,
    tab: 'swap',
    scrollDapp: true,
    probes: [
      ...dappShellProbes,
      { name: 'swap-amount-label', selector: 'section.rounded-md span', optional: true, walletOnly: true },
      { name: 'swap-content-heading', selector: 'main h2', optional: true },
      {
        name: 'swap-coming-soon-badge',
        selector: '[data-dapp-widget-panel] span.rounded-full',
      },
    ],
  },
  {
    page: 'dapp-genesis-desktop',
    url: '/en/app.html',
    tab: 'genesis',
    probes: [
      ...dappShellProbes,
      { name: 'genesis-season-title', selector: '[role="radiogroup"] p', optional: true },
      { name: 'genesis-kicker', selector: '[data-reveal] span.uppercase, .uppercase', optional: true },
      { name: 'genesis-content-heading', selector: 'main h2', optional: true },
    ],
  },
  {
    page: 'dapp-genesis-h5',
    url: '/en/app.html',
    mobile: true,
    tab: 'genesis',
    scrollDapp: true,
    probes: [...dappShellProbes, { name: 'genesis-season-title', selector: '[role="radiogroup"] p', optional: true }],
  },
  {
    page: 'dapp-rewards-desktop',
    url: '/en/app.html',
    tab: 'rewards',
    requiresWallet: true,
    probes: [
      ...dappShellProbes,
      { name: 'rewards-metric-label', selector: 'article p', optional: true },
      { name: 'rewards-metric-value', selector: 'article strong', optional: true },
      { name: 'rewards-kicker', selector: '[data-reveal] .uppercase, p.uppercase', optional: true },
      { name: 'rewards-rank-title', selector: '.rank-card strong, article strong', optional: true },
    ],
  },
  {
    page: 'dapp-rewards-h5',
    url: '/en/app.html',
    mobile: true,
    tab: 'rewards',
    scrollDapp: true,
    requiresWallet: true,
    probes: [...dappShellProbes, { name: 'rewards-metric-value', selector: 'article strong', optional: true }],
  },
  {
    page: 'dapp-community-desktop',
    url: '/en/app.html',
    tab: 'community',
    requiresWallet: true,
    probes: [
      ...dappShellProbes,
      { name: 'community-stat-label', selector: '.community-stat span', optional: true },
      { name: 'community-stat-value', selector: '.community-stat strong', optional: true },
      { name: 'community-stat-volume', selector: '.community-stat b', optional: true },
      { name: 'community-widget-title', selector: 'aside h3, aside strong', optional: true },
    ],
  },
  {
    page: 'dapp-community-h5',
    url: '/en/app.html',
    mobile: true,
    tab: 'community',
    scrollDapp: true,
    requiresWallet: true,
    probes: [
      ...dappShellProbes,
      { name: 'community-stat-value', selector: '.community-stat strong', optional: true },
    ],
  },
]

async function scrollHomeForReveals(page) {
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

const TAB_HASH = {
  swap: 'swap',
  genesis: 'genesis',
  reward: 'rewards',
  rewards: 'rewards',
  community: 'community',
}

async function setDappTab(page, tabKey) {
  const hash = TAB_HASH[tabKey] ?? tabKey
  await page.evaluate((h) => {
    window.location.hash = h
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    const widget = document.querySelector('[data-dapp-widget-panel]')
    const detail = document.querySelector('[data-dapp-detail]')
    if (widget instanceof HTMLElement) widget.scrollTop = 0
    if (detail instanceof HTMLElement) detail.scrollTop = 0
    window.scrollTo(0, 0)
  }, hash)
  await page.waitForTimeout(1200)
}

async function scrollDappViewport(page) {
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
    const widget = document.querySelector('[data-dapp-widget-panel]')
    const detail = document.querySelector('[data-dapp-detail]')
    if (widget instanceof HTMLElement) widget.scrollTop = 0
    if (detail instanceof HTMLElement) detail.scrollTop = 0
  })
  await page.waitForTimeout(400)
}

async function prepare(page, suite, root) {
  await page.goto(root + suite.url, { waitUntil: 'networkidle', timeout: 120_000 })
  if (suite.scrollHome) await scrollHomeForReveals(page)
  else await page.waitForTimeout(1500)
  if (suite.tab) await setDappTab(page, suite.tab)
  if (suite.scrollDapp) await scrollDappViewport(page)
}

async function isWalletConnected(page) {
  return (await page.locator('.aegis-connected-wallet-chip').count()) > 0
}

async function waitForWalletPair(pageBase, pageCurr) {
  if (SKIP_WALLET) {
    console.log('UI_COMPARE_SKIP_WALLET=1 — 跳过钱包等待，仅跑未连接态探针\n')
    return
  }

  const poll = async () => ({
    base: await isWalletConnected(pageBase),
    curr: await isWalletConnected(pageCurr),
  })

  let { base: baseOk, curr: currOk } = await poll()
  if (baseOk && currOk) return

  console.log('\n╔══════════════════════════════════════════════════════════╗')
  console.log('║  请在 Edge 的两个标签页分别连接钱包（同一钱包即可）           ║')
  console.log('╠══════════════════════════════════════════════════════════╣')
  console.log(`║  基线 (dev):  ${BASE}/en/app.html`)
  console.log(`║  当前分支:    ${CURR}/en/app.html`)
  console.log('║  提示: 两个端口是不同 origin，需要各连一次。               ║')
  console.log('║  跳过: UI_COMPARE_SKIP_WALLET=1 pnpm compare:computed      ║')
  console.log('╚══════════════════════════════════════════════════════════╝\n')

  if (PAUSE_FOR_WALLET) {
    console.log('UI_COMPARE_PAUSE=1 — 打开 Inspector，连完钱包后点 Resume\n')
    await pageBase.pause()
    return
  }

  const deadline = Date.now() + 600_000
  while (Date.now() < deadline) {
    ;({ base: baseOk, curr: currOk } = await poll())
    process.stdout.write(
      `\r  钱包状态 — 基线: ${baseOk ? '已连接' : '未连接'} | 当前: ${currOk ? '已连接' : '未连接'}   `,
    )
    if (baseOk && currOk) {
      console.log('\n钱包已连接，继续探测…\n')
      return
    }
    await new Promise((r) => setTimeout(r, 2000))
  }
  console.log('\n等待钱包超时（10min），继续未连接态探针…\n')
}

async function readProbe(page, selector) {
  const el = page.locator(selector).first()
  if ((await el.count()) === 0) return null
  await el.scrollIntoViewIfNeeded().catch(() => {})
  return el.evaluate((node, keys) => {
    const cs = getComputedStyle(node)
    const rect = node.getBoundingClientRect()
    const out = { rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height } }
    for (const key of keys) out[key] = cs[key]
    return out
  }, STYLE_KEYS)
}

function parsePx(value) {
  if (typeof value !== 'string') return null
  const m = value.match(/^(-?\d+(?:\.\d+)?)px$/)
  return m ? Number(m[1]) : null
}

function diffStyles(a, b) {
  const diffs = []
  for (const key of STYLE_KEYS) {
    if (IGNORE_STYLE_KEYS.has(key)) continue
    const va = a[key]
    const vb = b[key]
    if (va === vb) continue
    const na = parsePx(va)
    const nb = parsePx(vb)
    if (na != null && nb != null && Math.abs(na - nb) <= 0.5) continue
    diffs.push({ key, base: va, curr: vb })
  }
  const ra = a.rect
  const rb = b.rect
  for (const [k, va, vb] of [
    ['rect.w', ra.w, rb.w],
    ['rect.h', ra.h, rb.h],
  ]) {
    if (Math.abs(va - vb) > 0.5) diffs.push({ key: k, base: va, curr: vb })
  }
  return diffs
}

function shouldRunProbe(probe, walletConnected) {
  if (probe.walletOnly && !walletConnected) return false
  if (probe.disconnectedOnly && walletConnected) return false
  return true
}

fs.mkdirSync(OUT, { recursive: true })
if (!CDP_URL) fs.mkdirSync(PROFILE_DIR, { recursive: true })

const edgeExtensionCount = countInstalledEdgeExtensions()

/** @type {import('@playwright/test').BrowserContext} */
let context
/** @type {import('@playwright/test').Browser | null} */
let cdpBrowser = null

if (CDP_URL) {
  console.log(`Connecting to Edge via CDP: ${CDP_URL}`)
  console.log('  使用你手动打开的 Edge（扩展、已登录钱包会保留）。\n')
  try {
    cdpBrowser = await chromium.connectOverCDP(CDP_URL)
    context = cdpBrowser.contexts()[0] ?? (await cdpBrowser.newContext())
  } catch (err) {
    console.error('\n无法连接 CDP。请先完全退出 Edge，再另开终端执行：')
    console.error('  /Applications/Microsoft\\ Edge.app/Contents/MacOS/Microsoft\\ Edge \\')
    console.error('    --remote-debugging-port=9222 \\')
    console.error('    --user-data-dir="$HOME/Library/Application Support/Microsoft Edge" \\')
    console.error('    --profile-directory=Default')
    console.error('\n然后运行：pnpm compare:computed:cdp\n')
    throw err
  }
} else {
  console.log(`Launching Edge (${CHANNEL}, headless=${HEADLESS})…`)
  if (USE_SYSTEM_PROFILE) {
    console.log(`Profile: 系统 Edge 用户数据目录`)
    console.log(`  ${PROFILE_DIR}`)
    if (edgeExtensionCount === 0) {
      console.log('  ⚠ 本机 Edge Default 未检测到任何扩展（Extensions 目录为空）。')
      console.log('    工具栏不会出现 MetaMask；DApp 仍可用 WalletConnect 连手机钱包。')
    } else {
      console.log(`  已检测到 ${edgeExtensionCount} 个扩展目录。`)
    }
    console.log('  ⚠ 请先完全退出日常 Edge（Cmd+Q），再运行本脚本。\n')
  } else {
    console.log(`Profile: 独立空配置（无扩展、无登录态）`)
    console.log(`  ${PROFILE_DIR}`)
    console.log('  要看到钱包扩展 / 用日常 Edge，请任选其一：')
    console.log('  · pnpm compare:computed:cdp  （推荐：先手动开带调试端口的 Edge）')
    console.log('  · UI_COMPARE_USE_SYSTEM_PROFILE=1 pnpm compare:computed')
    console.log('  · 在此窗口安装 MetaMask 一次，会写入上述目录并保留\n')
  }

  const launchArgs = [
    ...(HEADLESS ? [] : ['--start-maximized']),
    ...(USE_SYSTEM_PROFILE ? ['--profile-directory=Default'] : []),
  ]

  context = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: CHANNEL,
    headless: HEADLESS,
    locale: 'en-US',
    viewport: { width: 1440, height: 900 },
    args: launchArgs,
  })
}

const results = []
let walletPrimed = false

try {
  for (const suite of suites) {
    console.log(`\n▶ ${suite.page} …`)
    const vp = suite.mobile
      ? { width: 390, height: 844 }
      : { width: 1440, height: 900 }
    const pageA = await context.newPage()
    const pageB = await context.newPage()
    await pageA.setViewportSize(vp)
    await pageB.setViewportSize(vp)

    try {
      await Promise.all([prepare(pageA, suite, BASE), prepare(pageB, suite, CURR)])

      const needsWallet =
        suite.requiresWallet || suite.probes.some((p) => p.walletOnly)

      if (suite.url.includes('app.html') && needsWallet && !walletPrimed) {
        await waitForWalletPair(pageA, pageB)
        walletPrimed = true
        if (suite.tab) {
          await Promise.all([setDappTab(pageA, suite.tab), setDappTab(pageB, suite.tab)])
        }
      }

      const walletNow =
        suite.url.includes('app.html') &&
        (await isWalletConnected(pageA)) &&
        (await isWalletConnected(pageB))

      for (const probe of suite.probes) {
        if (!shouldRunProbe(probe, walletNow)) {
          results.push({
            suite: suite.page,
            probe: probe.name,
            status: 'skipped',
            reason: probe.walletOnly ? 'wallet-not-connected' : 'disconnected-only',
          })
          continue
        }

        const [styleA, styleB] = await Promise.all([
          readProbe(pageA, probe.selector),
          readProbe(pageB, probe.selector),
        ])

        if (!styleA && !styleB) {
          results.push({
            suite: suite.page,
            probe: probe.name,
            status: probe.optional ? 'optional-missing' : 'missing-both',
            selector: probe.selector,
          })
          continue
        }
        if (!styleA || !styleB) {
          results.push({
            suite: suite.page,
            probe: probe.name,
            status: styleA ? 'missing-curr' : 'missing-base',
            selector: probe.selector,
          })
          continue
        }

        const diffs = diffStyles(styleA, styleB)
        results.push({
          suite: suite.page,
          probe: probe.name,
          selector: probe.selector,
          status: diffs.length ? 'diff' : 'match',
          diffs,
        })
      }
    } catch (error) {
      results.push({
        suite: suite.page,
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      })
    } finally {
      await pageA.close()
      await pageB.close()
      const suiteMatches = results.filter(
        (r) => r.suite === suite.page && r.status === 'match',
      ).length
      const suiteDiffs = results.filter(
        (r) => r.suite === suite.page && r.status === 'diff',
      ).length
      console.log(`  ✓ ${suite.page} — match ${suiteMatches}, diff ${suiteDiffs}`)
    }
  }
} finally {
  if (cdpBrowser) {
    console.log('\nCDP 模式：不断开你的 Edge，仅结束脚本。')
    await cdpBrowser.disconnect()
  } else {
    if (!HEADLESS && process.stdin.isTTY) {
      console.log('\n按 Enter 关闭 Edge…')
      await new Promise((resolve) => {
        process.stdin.resume()
        process.stdin.once('data', resolve)
      })
    }
    await context.close()
  }
}

fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(results, null, 2))

const matches = results.filter((r) => r.status === 'match')
const mismatches = results.filter((r) => r.status === 'diff')
const missing = results.filter((r) => r.status?.includes('missing'))
const skipped = results.filter((r) => r.status === 'skipped')

console.log(`\n=== Computed style compare: ${BASE} vs ${CURR} ===`)
console.log(`Suites: ${suites.length} | Probes run: ${results.length}`)
console.log(`Match: ${matches.length} | Diff: ${mismatches.length} | Missing: ${missing.length} | Skipped: ${skipped.length}`)

for (const row of mismatches) {
  console.log(`\n[${row.suite}] ${row.probe}`)
  for (const d of row.diffs ?? []) {
    console.log(`  ${d.key}: ${d.base} → ${d.curr}`)
  }
}

if (missing.length) {
  console.log('\n--- Missing ---')
  for (const row of missing.slice(0, 30)) {
    console.log(`[${row.suite}] ${row.probe} ${row.status}`)
  }
  if (missing.length > 30) console.log(`… +${missing.length - 30} more`)
}

console.log(`\nReport: ${path.join(OUT, 'report.json')}`)
