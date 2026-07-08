#!/usr/bin/env node
/**
 * 4175 vs 5174 — 长图（滚动拼接）像素 diff via Kimi WebBridge（系统 Edge）。
 *
 * 默认 captureMode=fullPage：WebBridge CDP captureBeyondViewport 原生整页（保留 Edge/钱包）。
 * UI_COMPARE_CAPTURE=longPage：视口分段滚动拼接（legacy fallback）。
 * 单视口（文档高度 ≤ viewport）时退化为一张截图。
 *
 * 前置（双 dev 模式）：
 *   Kimi WebBridge 守护进程 + Edge 扩展已连接
 *   4175: cd /private/tmp/aegis-dev-baseline && pnpm dev --host 127.0.0.1 --port 4175 --strictPort
 *   5174: cd aegis && pnpm dev --host 127.0.0.1 --port 5174 --strictPort
 *
 * 每个 target：顺序截图（4175 → close_tab → 5174），origin 门禁；禁止双标签 + find_tab。
 * 流程 SSOT：docs/visual-parity-workflow.md
 * 用法：pnpm compare:screenshots
 *       UI_COMPARE_CAPTURE=longPage  # legacy 视口拼接
 *       UI_COMPARE_CAPTURE=viewport  # 强制单视口（不推荐）
 */
import fs from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'

const BASE = process.env.UI_COMPARE_BASE ?? 'http://127.0.0.1:4175'
const CURR = process.env.UI_COMPARE_CURR ?? 'http://127.0.0.1:5174'
const BASE_ORIGIN = new URL(BASE).origin
const CURR_ORIGIN = new URL(CURR).origin
const WB = 'http://127.0.0.1:10086/command'
const OUT = path.resolve(process.env.UI_COMPARE_OUT ?? 'tmp/screenshot-diff')
const THRESHOLD = Number(process.env.UI_COMPARE_DIFF_THRESHOLD ?? 8)
/** fullPage（默认，WebBridge CDP 原生长图）| longPage（视口拼接）| viewport */
const CAPTURE_MODE = process.env.UI_COMPARE_CAPTURE ?? 'fullPage'
const TILE_SCROLL_PAUSE_MS = Number(process.env.UI_COMPARE_TILE_PAUSE_MS ?? 120)
const CMD_TIMEOUT_MS = 120_000
/** 固定 session，便于 close_session 清理 */
const RUN_SESSION = process.env.UI_COMPARE_WB_SESSION ?? 'aegis-visual-compare'
const SKIP_WALLET = process.env.UI_COMPARE_SKIP_WALLET === '1'
/** DApp 截图前等待 SIWE 就绪（ms）；0 = 不等待。默认 120s，skip-wallet 时忽略 */
const WAIT_WALLET_MS = SKIP_WALLET
  ? 0
  : Number(process.env.UI_COMPARE_WAIT_WALLET_MS ?? 120_000)
/** 1 = 不 close_tab / 不每 target close_session；优先 find_tab 复用已登录标签 */
const REUSE_TABS = process.env.UI_COMPARE_REUSE_TABS === '1'

async function closeSessionQuiet() {
  try {
    const data = await wb('close_session', {})
    return data?.closed ?? 0
  } catch {
    return 0
  }
}

/** @typedef {{ id: string, url: string, viewport: { width: number, height: number }, tab?: string, swapView?: 'hub' | 'flash' | 'trade', scrollHome?: boolean, scrollDapp?: boolean, waitMs?: number, capture?: 'longPage' | 'viewport' }} Target */

/** @type {Target[]} */
const TARGETS = [
  { id: 'home-desktop', url: '/en/', viewport: { width: 1440, height: 900 }, scrollHome: true, waitMs: 1200, capture: 'longPage' },
  { id: 'home-h5', url: '/en/', viewport: { width: 390, height: 844 }, scrollHome: true, waitMs: 1200, capture: 'longPage' },
  { id: 'dapp-swap-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'swap', waitMs: 1500, capture: 'longPage' },
  { id: 'dapp-swap-h5', url: '/en/app.html', viewport: { width: 390, height: 844 }, tab: 'swap', scrollDapp: true, waitMs: 1500, capture: 'longPage' },
  /** Swap subpages: hub → Convert(flash) / Trade via mode-card click (store not on window). */
  { id: 'dapp-swap-convert-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'swap', swapView: 'flash', waitMs: 1500, capture: 'longPage' },
  { id: 'dapp-swap-convert-h5', url: '/en/app.html', viewport: { width: 390, height: 844 }, tab: 'swap', swapView: 'flash', scrollDapp: true, waitMs: 1500, capture: 'longPage' },
  { id: 'dapp-swap-trade-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'swap', swapView: 'trade', waitMs: 1500, capture: 'longPage' },
  { id: 'dapp-swap-trade-h5', url: '/en/app.html', viewport: { width: 390, height: 844 }, tab: 'swap', swapView: 'trade', scrollDapp: true, waitMs: 1500, capture: 'longPage' },
  { id: 'dapp-genesis-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'genesis', waitMs: 1200, capture: 'longPage' },
  { id: 'dapp-genesis-h5', url: '/en/app.html', viewport: { width: 390, height: 844 }, tab: 'genesis', scrollDapp: true, waitMs: 1200, capture: 'longPage' },
  { id: 'dapp-rewards-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'rewards', waitMs: 1200, capture: 'longPage' },
  { id: 'dapp-rewards-h5', url: '/en/app.html', viewport: { width: 390, height: 844 }, tab: 'rewards', scrollDapp: true, waitMs: 1200, capture: 'longPage' },
  { id: 'dapp-community-desktop', url: '/en/app.html', viewport: { width: 1440, height: 900 }, tab: 'community', waitMs: 1200, capture: 'longPage' },
  { id: 'dapp-community-h5', url: '/en/app.html', viewport: { width: 390, height: 844 }, tab: 'community', scrollDapp: true, waitMs: 1200, capture: 'longPage' },
]

function resolveTargets() {
  const raw = process.env.UI_COMPARE_TARGETS?.trim()
  if (!raw) return TARGETS
  const ids = new Set(raw.split(/[\s,]+/).filter(Boolean))
  const picked = TARGETS.filter((t) => ids.has(t.id))
  if (!picked.length) {
    throw new Error(`UI_COMPARE_TARGETS 无匹配: ${raw}（可用: ${TARGETS.map((t) => t.id).join(', ')}）`)
  }
  return picked
}

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

/**
 * 截图前：强制 reveal 终态，再冻结动效/视频。
 * 否则 scroll 未触发的 [data-reveal] / timeline cards 会停在 opacity:0，
 * freeze 后再截图会把整段 roadmap/security 打成假红块。
 */
async function freezeMotion() {
  await wb('evaluate', {
    code: `(() => {
      document.querySelectorAll('video').forEach((v) => {
        try {
          v.pause()
          v.currentTime = 0
        } catch {}
      })
      // Eager-load lazy images so freeze doesn't capture empty icon tiles.
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        img.loading = 'eager'
        if (!img.complete) {
          try {
            img.decode?.()
          } catch {}
        }
      })
      document.querySelectorAll('[data-reveal], [data-metrics-reveal], [data-timeline], [data-security-grid], [data-protocol-grid], [data-engine-grid], [data-token-grid]').forEach((el) => {
        el.setAttribute('data-visible', 'true')
        el.setAttribute('data-reveal-instant', 'true')
      })
      let style = document.getElementById('__compare-freeze')
      if (!style) {
        style = document.createElement('style')
        style.id = '__compare-freeze'
        document.head.appendChild(style)
      }
      style.textContent =
        '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }' +
        '[data-timeline] [data-phase-card], [data-timeline] [data-phase-dot], [data-security-grid] > *, [data-security-grid] [data-security-art] img, [data-security-grid] [data-security-check], [data-security-grid] [data-security-line], [data-metrics-reveal] [data-metrics-panel], [data-metrics-reveal] [data-metrics-panel] article { opacity: 1 !important; transform: none !important; filter: none !important; clip-path: none !important; }'
      return true
    })()`,
  })
  await sleep(150)
}

async function scrollHome() {
  await wb('evaluate', {
    code: `(() => new Promise(async (resolve) => {
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
      resolve(max)
    }))()`,
  })
  await sleep(600)
}

async function scrollDappViewport() {
  await wb('evaluate', {
    code: `(() => new Promise(async (resolve) => {
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
      await delay(200)
      resolve(max)
    }))()`,
  })
  await sleep(400)
}

const TAB_HASH = {
  swap: 'swap',
  genesis: 'genesis',
  reward: 'rewards',
  rewards: 'rewards',
  community: 'community',
}

/** DApp tab SSOT：hash 路由（见 getInitialTab），比点 H5 底栏更可靠 */
async function setDappTab(tabKey) {
  const hash = TAB_HASH[tabKey] ?? tabKey
  await wb('evaluate', {
    code: `(() => {
      window.location.hash = ${JSON.stringify(hash)}
      window.dispatchEvent(new HashChangeEvent('hashchange'))
      const widget = document.querySelector('[data-dapp-widget-panel]')
      const detail = document.querySelector('[data-dapp-detail]')
      if (widget instanceof HTMLElement) widget.scrollTop = 0
      if (detail instanceof HTMLElement) detail.scrollTop = 0
      window.scrollTo(0, 0)
      return window.location.hash
    })()`,
  })
  await sleep(1200)
}

/**
 * Swap hub → Convert(flash) / Trade：点左侧 mode card（zustand 不挂 window）。
 * flash = 第 1 张可点 mode card，trade = 第 2 张（与 SwapHubWidget 顺序一致）。
 */
async function setSwapView(swapView) {
  if (!swapView || swapView === 'hub') return
  const index = swapView === 'flash' ? 0 : swapView === 'trade' ? 1 : -1
  if (index < 0) throw new Error(`unknown swapView: ${swapView}`)
  const r = await wb('evaluate', {
    code: `(() => {
      const panel = document.querySelector('[data-dapp-widget-panel]')
      if (!panel) return { ok: false, reason: 'no-panel' }
      // Mode cards are full-width outlined Card-as-button rows (not IconButton / toggle).
      const cards = [...panel.querySelectorAll('button')].filter((btn) => {
        const cls = btn.className?.toString?.() ?? ''
        return cls.includes('rounded-md') && cls.includes('w-full')
      })
      const card = cards[${index}]
      if (!card) return { ok: false, reason: 'no-card', count: cards.length }
      card.click()
      return { ok: true, title: (card.innerText || '').trim().slice(0, 48), count: cards.length }
    })()`,
  })
  const value = r?.value ?? r
  if (!value?.ok) {
    throw new Error(`setSwapView(${swapView}) failed: ${JSON.stringify(value)}`)
  }
  await sleep(900)
}

async function readPageOrigin() {
  const r = await wb('evaluate', {
    code: `(() => ({ origin: location.origin, href: location.href, port: location.port }))()`,
  })
  return r?.value ?? r
}

/** 登录态 SSOT：topbar `.aegis-connected-wallet-chip` + shell `data-session-ready` */
async function readWalletState() {
  const r = await wb('evaluate', {
    code: `(() => {
      const shell = document.querySelector('[data-dapp-window]')
      const chip = document.querySelector('.aegis-connected-wallet-chip')
      const chipText = chip?.querySelector('span.truncate')?.textContent?.trim() ?? null
      const connectBtn = document.querySelector('.aegis-thirdweb-button-primary')
      const connectText = connectBtn?.textContent?.trim().replace(/\\s+/g, ' ') ?? null
      let authedAddressCount = 0
      try {
        const parsed = JSON.parse(localStorage.getItem('aegis.auth.store') || '{}')
        const state = parsed?.state ?? parsed
        authedAddressCount = Object.keys(state?.sessionsByAddress ?? {}).length
      } catch {}
      const sessionReady = shell?.getAttribute('data-session-ready') === 'true'
      const walletReady = shell?.getAttribute('data-wallet-ready') === 'true'
      const connectedChip = !!chip
      return {
        sessionReady,
        walletReady,
        connectedChip,
        loggedIn: sessionReady && connectedChip,
        buttonLabel: chipText ?? connectText ?? null,
        authedAddressCount,
      }
    })()`,
  })
  return r?.value ?? r
}

/** DApp：轮询 topbar chip + data-session-ready，避免新标签未 SIWE 就截图 */
async function waitForWalletLogin(expectedOrigin, label, target) {
  const wallet = await readWalletState()
  if (SKIP_WALLET || !target.url.includes('app.html') || WAIT_WALLET_MS <= 0) {
    return wallet
  }
  if (wallet.loggedIn) return wallet

  console.log(`\n  ⏳ ${label}：请在 WebBridge 打开的标签连接钱包并完成 SIWE（${expectedOrigin}）`)
  const deadline = Date.now() + WAIT_WALLET_MS
  while (Date.now() < deadline) {
    const page = await readPageOrigin()
    if (page.origin !== expectedOrigin) {
      throw new Error(`[${label}] origin 漂移：期望 ${expectedOrigin}，实际 ${page.origin}`)
    }
    const w = await readWalletState()
    if (w.loggedIn) {
      console.log(`  ✓ ${label} 已登录: ${w.buttonLabel}`)
      return w
    }
    await sleep(2000)
  }
  const final = await readWalletState()
  console.log(
    `  ⚠ ${label} 等待 ${WAIT_WALLET_MS / 1000}s 后仍未登录: ${final.buttonLabel ?? '?'} (session=${final.sessionReady})`,
  )
  return final
}

/** find_tab 在双 localhost 标签时会误匹配端口 — 截图前必须断言 origin */
async function assertPageOrigin(expectedOrigin, label) {
  const page = await readPageOrigin()
  if (page.origin !== expectedOrigin) {
    throw new Error(
      `[${label}] 标签 origin 错误：期望 ${expectedOrigin}，实际 ${page.origin}（${page.href}）。` +
        ' 请勿同时打开 4175/5174 两个标签；脚本已改为顺序截图，若仍失败请 close_session 后重试。',
    )
  }
  return page
}

async function readScrollMetrics() {
  const r = await wb('evaluate', {
    code: `(() => ({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      scrollHeight: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0),
      bodyW: document.body.getBoundingClientRect().width,
      scrollW: document.documentElement.scrollWidth,
    }))()`,
  })
  return r?.value ?? r
}

async function readMetrics() {
  return readScrollMetrics()
}

function resolveCaptureMode(target) {
  if (CAPTURE_MODE === 'viewport' || CAPTURE_MODE === 'fullPage') return CAPTURE_MODE
  return target.capture ?? CAPTURE_MODE
}

/** @param {Array<{ scrollY: number, path: string }>} tiles */
function stitchWindowTiles(tiles, width, totalHeight, viewportHeight) {
  const out = new PNG({ width, height: totalHeight })
  for (const { path: tilePath, scrollY } of tiles) {
    const tile = PNG.sync.read(fs.readFileSync(tilePath))
    const copyH = Math.min(viewportHeight, totalHeight - scrollY, tile.height)
    for (let y = 0; y < copyH; y++) {
      for (let x = 0; x < width; x++) {
        if (x >= tile.width) continue
        const srcIdx = (y * tile.width + x) * 4
        const dstIdx = ((scrollY + y) * width + x) * 4
        out.data[dstIdx] = tile.data[srcIdx]
        out.data[dstIdx + 1] = tile.data[srcIdx + 1]
        out.data[dstIdx + 2] = tile.data[srcIdx + 2]
        out.data[dstIdx + 3] = 255
      }
    }
  }
  return out
}

function scrollPositions(scrollHeight, viewportHeight) {
  /** @type {number[]} */
  const positions = []
  if (scrollHeight <= viewportHeight) return [0]
  let y = 0
  const maxScroll = scrollHeight - viewportHeight
  while (y < maxScroll) {
    positions.push(y)
    y += viewportHeight
  }
  positions.push(maxScroll)
  return positions
}

async function captureLongPage(outPath, viewport) {
  const metrics = await readScrollMetrics()
  const scrollHeight = metrics.scrollHeight
  const vh = viewport.height
  const vw = viewport.width

  if (scrollHeight <= vh) {
    await wb('evaluate', { code: '(() => { window.scrollTo(0, 0); return 0; })()' })
    await sleep(100)
    await screenshotTo(outPath)
    return { captureMode: 'viewport-fallback', scrollHeight, tileCount: 1, stitchedHeight: vh }
  }

  const positions = scrollPositions(scrollHeight, vh)
  const tileDir = path.join(path.dirname(outPath), `.tiles-${path.basename(outPath, '.png')}`)
  fs.mkdirSync(tileDir, { recursive: true })
  /** @type {Array<{ scrollY: number, path: string }>} */
  const tiles = []

  for (let i = 0; i < positions.length; i++) {
    const scrollY = positions[i]
    await wb('evaluate', {
      code: `(() => { window.scrollTo(0, ${scrollY}); return window.scrollY; })()`,
    })
    await sleep(TILE_SCROLL_PAUSE_MS)
    const tilePath = path.join(tileDir, `tile-${String(i).padStart(3, '0')}.png`)
    await screenshotTo(tilePath)
    tiles.push({ scrollY, path: tilePath })
  }

  const stitched = stitchWindowTiles(tiles, vw, scrollHeight, vh)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, PNG.sync.write(stitched))
  fs.rmSync(tileDir, { recursive: true, force: true })

  return {
    captureMode: 'longPage',
    scrollHeight,
    tileCount: tiles.length,
    stitchedHeight: scrollHeight,
    stitchedWidth: vw,
  }
}

async function captureScreenshot(outPath, target) {
  const mode = resolveCaptureMode(target)
  if (mode === 'fullPage') {
    return cdpFullPageScreenshot(outPath, target.viewport)
  }
  if (mode === 'longPage') {
    return captureLongPage(outPath, target.viewport)
  }
  await wb('evaluate', { code: '(() => { window.scrollTo(0, 0); return 0; })()' })
  await sleep(100)
  await screenshotTo(outPath)
  const metrics = await readScrollMetrics()
  return {
    captureMode: 'viewport',
    scrollHeight: metrics.scrollHeight,
    tileCount: 1,
    stitchedHeight: target.viewport.height,
  }
}

async function prepareTab(tabUrl, target, expectedOrigin, label) {
  await wb('find_tab', { url: tabUrl })
  await assertPageOrigin(expectedOrigin, `${label} after find_tab`)
  await setViewport(target.viewport)
  if (target.scrollHome) await scrollHome()
  if (target.tab) await setDappTab(target.tab)
  if (target.swapView) await setSwapView(target.swapView)
  if (target.scrollDapp) await scrollDappViewport()
  await sleep(target.waitMs ?? 1000)
  if (target.scrollHome || target.scrollDapp) await freezeMotion()
  const metrics = await readMetrics()
  let wallet = await waitForWalletLogin(expectedOrigin, label, target)
  const page = await assertPageOrigin(expectedOrigin, `${label} before screenshot`)
  return { ...metrics, origin: page.origin, href: page.href, wallet }
}

async function openSideTab(fullUrl, target, expectedOrigin, label) {
  const needle = `${expectedOrigin}/en/app.html`
  if (REUSE_TABS) {
    try {
      await wb('find_tab', { url: needle })
      await assertPageOrigin(expectedOrigin, `${label} find_tab`)
      return { url: needle, tabId: null, reused: true }
    } catch {
      /* fall through to navigate */
    }
  }
  const nav = await wb('navigate', {
    url: fullUrl,
    newTab: true,
    group_title: `screenshot ${target.id}`,
  })
  return { url: nav.url ?? fullUrl, tabId: nav.tabId ?? null, reused: false }
}

async function captureSide({ fullUrl, outPath, target, expectedOrigin, label }) {
  const opened = await openSideTab(fullUrl, target, expectedOrigin, label)
  const tabUrl = opened.url
  const metrics = await prepareTab(tabUrl, target, expectedOrigin, label)
  await assertPageOrigin(expectedOrigin, `${label} immediately before screenshot`)
  const captureMeta = await captureScreenshot(outPath, target)
  if (!REUSE_TABS) await wb('close_tab', {})
  return { tabUrl, metrics: { ...metrics, ...captureMeta }, shotPath: outPath, tabId: opened.tabId, reusedTab: opened.reused }
}

async function screenshotTo(outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  const data = await wb('screenshot', { format: 'png', path: outPath })
  const shotPath = data?.path ?? outPath
  if (!fs.existsSync(shotPath)) throw new Error(`screenshot missing: ${shotPath}`)
  return shotPath
}

/** WebBridge CDP 原生整页截图 — Page.getLayoutMetrics + captureBeyondViewport */
async function cdpFullPageScreenshot(outPath, viewport) {
  await wb('evaluate', { code: '(() => { window.scrollTo(0, 0); return 0; })()' })
  await sleep(100)

  const layout = await wb('cdp', { method: 'Page.getLayoutMetrics', params: {} })
  const css = layout?.cssContentSize ?? layout?.result?.cssContentSize
  if (!css?.width || !css?.height) {
    throw new Error(`Page.getLayoutMetrics 缺少 cssContentSize: ${JSON.stringify(layout)}`)
  }

  const metrics = await readScrollMetrics()
  const shot = await wb('cdp', {
    method: 'Page.captureScreenshot',
    params: {
      format: 'png',
      captureBeyondViewport: true,
      fromSurface: true,
      clip: { x: 0, y: 0, width: css.width, height: css.height, scale: 1 },
    },
  })
  const b64 = shot?.data ?? shot?.result?.data
  if (!b64) {
    throw new Error(`Page.captureScreenshot 无 data: ${JSON.stringify(Object.keys(shot ?? {}))}`)
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, Buffer.from(b64, 'base64'))

  return {
    captureMode: 'webbridge-fullPage',
    scrollHeight: metrics.scrollHeight,
    cssContentSize: css,
    tileCount: 1,
    stitchedHeight: css.height,
    stitchedWidth: css.width,
    viewport,
  }
}

function writeDiff(aPath, bPath, outPath) {
  const a = PNG.sync.read(fs.readFileSync(aPath))
  const b = PNG.sync.read(fs.readFileSync(bPath))
  const w = Math.min(a.width, b.width)
  const h = Math.min(a.height, b.height)
  const overlay = new PNG({ width: w, height: h })
  const heatmap = new PNG({ width: w, height: h })
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
        // 叠加 diff：以 curr 为底，差异像素标红（保留主界面上下文）
        overlay.data[o] = Math.min(255, Math.round(b.data[j] * 0.35 + 255 * 0.65))
        overlay.data[o + 1] = Math.round(b.data[j + 1] * 0.35)
        overlay.data[o + 2] = Math.round(b.data[j + 2] * 0.35)
        overlay.data[o + 3] = 255
        heatmap.data[o] = 255
        heatmap.data[o + 1] = 0
        heatmap.data[o + 2] = 0
        heatmap.data[o + 3] = 255
        diffPx++
      } else {
        overlay.data[o] = b.data[j]
        overlay.data[o + 1] = b.data[j + 1]
        overlay.data[o + 2] = b.data[j + 2]
        overlay.data[o + 3] = 255
        heatmap.data[o] = 40
        heatmap.data[o + 1] = 40
        heatmap.data[o + 2] = 40
        heatmap.data[o + 3] = 255
      }
    }
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, PNG.sync.write(overlay))
  fs.writeFileSync(
    path.join(path.dirname(outPath), 'diff-heatmap.png'),
    PNG.sync.write(heatmap),
  )
  return {
    diffPx,
    total: w * h,
    pct: Number(((100 * diffPx) / (w * h)).toFixed(2)),
    baseSize: { w: a.width, h: a.height },
    currSize: { w: b.width, h: b.height },
    widthMismatch,
    heatmapPath: path.join(path.dirname(outPath), 'diff-heatmap.png'),
  }
}

fs.mkdirSync(OUT, { recursive: true })

await closeSessionQuiet()

console.log(`Kimi WebBridge screenshot diff: ${BASE} vs ${CURR}`)
console.log(
  CAPTURE_MODE === 'fullPage'
    ? `Capture: fullPage（WebBridge CDP captureBeyondViewport，原生整页，保留 Edge/钱包）`
    : `Capture: ${CAPTURE_MODE}（longPage = 视口滚动拼接长图）`,
)
console.log(`Session: ${RUN_SESSION}${REUSE_TABS ? '（复用已开标签 UI_COMPARE_REUSE_TABS=1）' : '（每个 target 完成后关闭标签）'}`)
console.log(`Output: ${OUT}\n`)

const report = []
const activeTargets = resolveTargets()
if (process.env.UI_COMPARE_TARGETS) {
  console.log(`Targets: ${activeTargets.map((t) => t.id).join(', ')}\n`)
}

try {
for (const target of activeTargets) {
  process.stdout.write(`▶ ${target.id} … `)
  if (!REUSE_TABS) await closeSessionQuiet()

  const baseFull = BASE + target.url
  const currFull = CURR + target.url

  const baseDir = path.join(OUT, target.id)
  const basePath = path.join(baseDir, 'base-4175.png')
  const currPath = path.join(baseDir, 'curr-5174.png')
  const diffPath = path.join(baseDir, 'diff.png')

  const baseCapture = await captureSide({
    fullUrl: baseFull,
    outPath: basePath,
    target,
    expectedOrigin: BASE_ORIGIN,
    label: `${target.id} base`,
  })
  const currCapture = await captureSide({
    fullUrl: currFull,
    outPath: currPath,
    target,
    expectedOrigin: CURR_ORIGIN,
    label: `${target.id} curr`,
  })

  const stats = writeDiff(baseCapture.shotPath, currCapture.shotPath, diffPath)
  const row = {
    id: target.id,
    viewport: target.viewport,
    captureMode: baseCapture.metrics?.captureMode ?? resolveCaptureMode(target),
    baseMetrics: baseCapture.metrics,
    currMetrics: currCapture.metrics,
    baseTab: { url: baseCapture.tabUrl, tabId: baseCapture.tabId, origin: BASE_ORIGIN },
    currTab: { url: currCapture.tabUrl, tabId: currCapture.tabId, origin: CURR_ORIGIN },
    ...stats,
    paths: { base: baseCapture.shotPath, curr: currCapture.shotPath, diff: diffPath, heatmap: stats.heatmapPath },
  }
  report.push(row)

  const flag = stats.pct === 0 && !stats.widthMismatch ? '✓' : '≠'
  const baseWallet = baseCapture.metrics?.wallet
  const currWallet = currCapture.metrics?.wallet
  const walletNote =
    baseWallet && currWallet
      ? ` wallet[4175=${baseWallet.loggedIn ? 'in' : 'out'} 5174=${currWallet.loggedIn ? 'in' : 'out'}]`
      : ''
  const sizeNote = stats.widthMismatch
    ? ` 尺寸 ${stats.baseSize.w}×${stats.baseSize.h} vs ${stats.currSize.w}×${stats.currSize.h}`
    : ''
  const longNote =
    baseCapture.metrics?.captureMode === 'longPage' ||
    baseCapture.metrics?.captureMode === 'webbridge-fullPage' ||
    currCapture.metrics?.captureMode === 'longPage' ||
    currCapture.metrics?.captureMode === 'webbridge-fullPage'
      ? ` 长图 ${stats.baseSize.h}px`
      : ''
  console.log(`${flag} ${stats.pct}%${sizeNote}${longNote}${walletNote}`)
  if (baseWallet && currWallet && (!baseWallet.loggedIn || !currWallet.loggedIn)) {
    console.log(
      `  ⚠ 登录态不一致或未登录 — 4175: ${baseWallet.buttonLabel ?? '?'} (session=${baseWallet.sessionReady}) | 5174: ${currWallet.buttonLabel ?? '?'} (session=${currWallet.sessionReady})`,
    )
  }

  const closed = await closeSessionQuiet()
  if (closed > 0) process.stdout.write(`  (已关 ${closed} 标签) `)
}
} finally {
  const closed = await closeSessionQuiet()
  if (closed > 0) console.log(`\n收尾关闭 ${closed} 个标签`)
}

fs.writeFileSync(
  path.join(OUT, 'report.json'),
  JSON.stringify(
    {
      engine: 'kimi-webbridge',
      captureMode: CAPTURE_MODE,
      base: BASE,
      curr: CURR,
      session: RUN_SESSION,
      report,
    },
    null,
    2,
  ),
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
