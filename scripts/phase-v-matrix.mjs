/**
 * Phase V visual matrix — logged-out / logged-in × pages × dual-pane scroll positions.
 *
 * Uses independent WebBridge sessions per port (avoids origin clash).
 *
 *   UI_COMPARE_AUTH=out|in|both   default both
 *   UI_COMPARE_PAGES=swap-hub,genesis,...
 *   UI_COMPARE_SCROLL=top,mid,bottom   default top,mid,bottom
 *
 * Output: tmp/phase-v/<auth>/<port>-<page>-<pane>-<scroll>.png + hm-*.png + report.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { PNG } = require('pngjs')

const BASE = process.env.UI_COMPARE_BASE ?? 'http://127.0.0.1:4175'
const CURR = process.env.UI_COMPARE_CURR ?? 'http://127.0.0.1:5174'
const WB = process.env.KIMI_WEBBRIDGE_URL ?? 'http://127.0.0.1:10086/command'
const OUT = path.resolve(process.env.UI_COMPARE_OUT ?? 'tmp/phase-v')
const THRESHOLD = Number(process.env.UI_COMPARE_DIFF_THRESHOLD ?? 40)
const AUTH_MODE = (process.env.UI_COMPARE_AUTH ?? 'both').toLowerCase()
const SCROLLS = (process.env.UI_COMPARE_SCROLL ?? 'top,mid,bottom')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const ALL_PAGES = [
  { id: 'swap-hub', hash: 'swap', swapView: null },
  { id: 'swap-convert', hash: 'swap', swapView: 'flash' },
  { id: 'swap-trade', hash: 'swap', swapView: 'trade' },
  { id: 'genesis', hash: 'genesis', swapView: null },
  { id: 'rewards', hash: 'rewards', swapView: null },
  { id: 'community', hash: 'community', swapView: null },
]

const pageFilter = process.env.UI_COMPARE_PAGES?.trim()
const PAGES = pageFilter
  ? ALL_PAGES.filter((p) => pageFilter.split(/[\s,]+/).includes(p.id))
  : ALL_PAGES

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function portOf(origin) {
  try {
    return new URL(origin).port || (origin.includes('4175') ? '4175' : '5174')
  } catch {
    return '5174'
  }
}

function sessionFor(origin, auth) {
  const p = portOf(origin)
  return auth === 'in' ? `aegis-port-${p}` : `aegis-phasev-out-${p}`
}

async function wb(session, action, args) {
  const body = { action, session }
  if (args !== undefined) body.args = args
  const res = await fetch(WB, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`webbridge ${action} HTTP ${res.status}`)
  return res.json()
}

async function evaluate(session, code) {
  const r = await wb(session, 'evaluate', { code })
  const data = r?.data ?? r
  // WebBridge wraps primitives as { type: 'string'|'number'|..., value }
  if (data && typeof data === 'object' && 'value' in data && 'type' in data) {
    return data.value
  }
  return data
}

async function navigate(session, url) {
  await wb(session, 'navigate', { url })
  await sleep(900)
}

async function waitForShell(session, { timeoutMs = 12000 } = {}) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const ok = await evaluate(
      session,
      `(() => Boolean(document.querySelector('[data-dapp-window]')))()`,
    )
    if (ok) return true
    await sleep(400)
  }
  return false
}

async function setTab(session, hash) {
  // HMR / soft-nav can drop the shell; recover via full app.html navigation.
  let hasShell = await evaluate(
    session,
    `(() => Boolean(document.querySelector('[data-dapp-window]')))()`,
  )
  if (!hasShell) {
    const origin = await evaluate(session, `(() => location.origin)()`)
    await navigate(session, `${origin}/en/app.html#${hash}`)
    hasShell = await waitForShell(session)
    if (!hasShell) throw new Error(`setTab(${hash}): shell missing after reload`)
  }

  await evaluate(
    session,
    `(() => {
      window.location.hash = ${JSON.stringify(hash)};
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      const widget = document.querySelector('[data-dapp-widget-panel]');
      const detail = document.querySelector('[data-dapp-detail]');
      if (widget instanceof HTMLElement) widget.scrollTop = 0;
      if (detail instanceof HTMLElement) detail.scrollTop = 0;
      window.scrollTo(0, 0);
      return window.location.hash;
    })()`,
  )
  await sleep(1000)

  let tab = await evaluate(
    session,
    `(() => document.querySelector('[data-tab]')?.getAttribute('data-tab') ?? null)()`,
  )
  if (tab !== hash) {
    // Fallback: click rail / mobile nav by aria-label (selectTab uses replaceState — more reliable than hash alone when desynced)
    await evaluate(
      session,
      `(() => {
        const label = ${JSON.stringify(hash)};
        const btn = [...document.querySelectorAll('button')].find((b) => {
          const a = (b.getAttribute('aria-label') || '').toLowerCase();
          return a === label;
        });
        if (btn) btn.click();
        return Boolean(btn);
      })()`,
    )
    await sleep(1000)
    tab = await evaluate(
      session,
      `(() => document.querySelector('[data-tab]')?.getAttribute('data-tab') ?? null)()`,
    )
  }
  if (tab !== hash) {
    throw new Error(`setTab(${hash}) failed, data-tab=${JSON.stringify(tab)}`)
  }
}

async function setSwapView(session, swapView) {
  if (!swapView) return
  const label = swapView === 'flash' ? 'Convert' : swapView === 'trade' ? 'Trade' : null
  if (!label) throw new Error(`unknown swapView: ${swapView}`)

  // Back to hub first. swap-view-store ignores setView while motion=true (320ms) —
  // wait out the hub transition before clicking the next mode card.
  await evaluate(
    session,
    `(() => {
      for (let i = 0; i < 4; i++) {
        const b = [...document.querySelectorAll('button')].find((x) =>
          /Back|返回/.test(x.textContent || ''),
        );
        if (b) b.click();
        else break;
      }
      return 1;
    })()`,
  )
  await sleep(700)

  let last = null
  for (let attempt = 0; attempt < 3; attempt++) {
    last = await evaluate(
      session,
      `(() => {
        const panel = document.querySelector('[data-dapp-widget-panel]');
        if (!panel) return { ok: false, reason: 'no-panel' };
        const label = ${JSON.stringify(label)};
        let card = [...panel.querySelectorAll('button')].find((btn) => {
          const t = (btn.innerText || '').trim();
          return t === label || t.startsWith(label + '\\n') || t.startsWith(label + ' ');
        });
        if (!card) {
          const rows = [...panel.querySelectorAll('button')].filter((btn) => {
            const cls = btn.className?.toString?.() ?? '';
            return cls.includes('rounded-md') && cls.includes('w-full');
          });
          card = rows[label === 'Convert' ? 0 : 1];
          if (!card) return { ok: false, reason: 'no-card', count: rows.length, label };
        }
        card.click();
        return { ok: true, title: (card.innerText || '').trim().slice(0, 48), attempt: ${attempt} };
      })()`,
    )
    if (!last?.ok) throw new Error(`setSwapView(${swapView}) ${JSON.stringify(last)}`)
    await sleep(900)
    const verify = await evaluate(
      session,
      `(() => {
        const back = [...document.querySelectorAll('button')].some((b) =>
          /Back|返回/.test(b.textContent || ''),
        );
        return { back, hash: location.hash };
      })()`,
    )
    if (verify?.back) return
    // Still on hub — likely motion lock; wait and retry.
    await sleep(400)
  }
  throw new Error(`setSwapView(${swapView}) did not leave hub after retries: ${JSON.stringify(last)}`)
}

async function readAuth(session) {
  return evaluate(
    session,
    `(() => {
      const shell = document.querySelector('[data-dapp-window]');
      const chip = document.querySelector('.aegis-connected-wallet-chip');
      const sessionReady = shell?.getAttribute('data-session-ready') === 'true';
      return { sessionReady, connectedChip: Boolean(chip), loggedIn: sessionReady && Boolean(chip) };
    })()`,
  )
}

/**
 * Best-effort: click Connect Wallet and wait for chip + sessionReady.
 * Extension / WC approval may still need a human once; subsequent runs reuse session.
 */
async function ensureLoggedIn(session, { timeoutMs = 45000 } = {}) {
  let wallet = await readAuth(session)
  if (wallet?.loggedIn) return wallet

  const clicked = await evaluate(
    session,
    `(() => {
      const btn = [...document.querySelectorAll('header button, button')].find((b) =>
        /Connect Wallet|连接钱包|Connect/i.test((b.textContent || '').trim()),
      );
      if (btn instanceof HTMLElement) {
        btn.click();
        return { clicked: true, label: (btn.textContent || '').trim().slice(0, 40) };
      }
      return { clicked: false };
    })()`,
  )
  console.log(`  connect click: ${JSON.stringify(clicked)}`)

  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    await sleep(800)
    wallet = await readAuth(session)
    if (wallet?.loggedIn) {
      console.log(`  wallet connected: ${JSON.stringify(wallet)}`)
      return wallet
    }
    // Modal may need a second click on injected wallet row
    await evaluate(
      session,
      `(() => {
        const row = [...document.querySelectorAll('button, [role="button"]')].find((b) =>
          /MetaMask|Rabby|Injected|Browser Wallet|OKX/i.test(b.textContent || ''),
        );
        if (row instanceof HTMLElement) { row.click(); return true; }
        return false;
      })()`,
    )
  }
  console.warn(`  ⚠ ensureLoggedIn timed out: ${JSON.stringify(wallet)}`)
  return wallet
}

/** Best-effort disconnect for auth=out (thirdweb auto-reconnect otherwise). */
async function forceLoggedOut(session) {
  await evaluate(
    session,
    `(() => {
      // Clear thirdweb / wallet local persistence then reload.
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (/thirdweb|wallet|wagmi|walletconnect|tw_/i.test(k)) keys.push(k);
      }
      for (const k of keys) localStorage.removeItem(k);
      try {
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const k = sessionStorage.key(i);
          if (k && /thirdweb|wallet|wagmi|walletconnect|tw_/i.test(k)) sessionStorage.removeItem(k);
        }
      } catch {}
      return { cleared: keys.length };
    })()`,
  )
  await evaluate(session, `(() => { location.reload(); return 1; })()`)
  await sleep(2000)
  // If still connected, try UI disconnect
  await evaluate(
    session,
    `(() => {
      const chip = document.querySelector('.aegis-connected-wallet-chip');
      if (chip instanceof HTMLElement) chip.click();
      return Boolean(chip);
    })()`,
  )
  await sleep(500)
  await evaluate(
    session,
    `(() => {
      const btn = [...document.querySelectorAll('button')].find((b) =>
        /Disconnect|断开|Log out|Sign out/i.test(b.textContent || ''),
      );
      if (btn) { btn.click(); return true; }
      return false;
    })()`,
  )
  await sleep(1200)
}

async function scrollPane(session, pane, position) {
  // pane: widget | detail | both
  return evaluate(
    session,
    `(() => {
      const widget = document.querySelector('[data-dapp-widget-panel]');
      const detail = document.querySelector('[data-dapp-detail]');
      const targets = [];
      if (${JSON.stringify(pane)} === 'widget' || ${JSON.stringify(pane)} === 'both') {
        if (widget instanceof HTMLElement) targets.push(widget);
      }
      if (${JSON.stringify(pane)} === 'detail' || ${JSON.stringify(pane)} === 'both') {
        if (detail instanceof HTMLElement) targets.push(detail);
      }
      if (targets.length === 0) {
        window.scrollTo(0, ${JSON.stringify(position)} === 'bottom' ? document.documentElement.scrollHeight : 0);
        return { ok: true, mode: 'window' };
      }
      const pos = ${JSON.stringify(position)};
      for (const el of targets) {
        const max = Math.max(0, el.scrollHeight - el.clientHeight);
        el.scrollTop = pos === 'top' ? 0 : pos === 'bottom' ? max : Math.floor(max / 2);
      }
      return {
        ok: true,
        panes: targets.map((el) => ({
          top: el.scrollTop,
          max: Math.max(0, el.scrollHeight - el.clientHeight),
          h: el.clientHeight,
          sh: el.scrollHeight,
        })),
      };
    })()`,
  )
}

async function freezeMotion(session) {
  await evaluate(
    session,
    `(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.setAttribute('data-visible', 'true'));
      document.documentElement.style.setProperty('--home-reveal-duration', '0ms');
      return 1;
    })()`,
  )
  await sleep(200)
}

async function screenshot(session, filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  const r = await wb(session, 'screenshot', { path: filePath })
  if (!fs.existsSync(filePath)) {
    throw new Error(`screenshot missing: ${filePath} (${JSON.stringify(r).slice(0, 200)})`)
  }
  return filePath
}

function loadRgb(filePath) {
  const buf = fs.readFileSync(filePath)
  const png = PNG.sync.read(buf)
  return { width: png.width, height: png.height, data: png.data }
}

function diffPair(basePath, currPath, hmPath) {
  const a = loadRgb(basePath)
  const b = loadRgb(currPath)
  const w = Math.min(a.width, b.width)
  const h = Math.min(a.height, b.height)
  let red = 0
  const out = Buffer.alloc(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ai = (y * a.width + x) * 4
      const bi = (y * b.width + x) * 4
      const oi = (y * w + x) * 4
      const dr = Math.abs(a.data[ai] - b.data[bi])
      const dg = Math.abs(a.data[ai + 1] - b.data[bi + 1])
      const db = Math.abs(a.data[ai + 2] - b.data[bi + 2])
      const delta = dr + dg + db
      out[oi] = b.data[bi]
      out[oi + 1] = b.data[bi + 1]
      out[oi + 2] = b.data[bi + 2]
      out[oi + 3] = 255
      if (delta > THRESHOLD) {
        red++
        out[oi] = 220
        out[oi + 1] = 40
        out[oi + 2] = 40
      }
    }
  }
  const png = new PNG({ width: w, height: h })
  out.copy(png.data)
  fs.writeFileSync(hmPath, PNG.sync.write(png))
  return { pct: (100 * red) / (w * h), wh: [w, h], red }
}

async function captureAuth(auth) {
  const dir = path.join(OUT, auth)
  fs.mkdirSync(dir, { recursive: true })
  const report = []

  for (const origin of [BASE, CURR]) {
    const session = sessionFor(origin, auth)
    const port = portOf(origin)
    console.log(`\n== ${auth} @ ${port} session=${session} ==`)

    await navigate(session, `${origin}/en/app.html#swap`)
    if (auth === 'out') {
      let wallet = await readAuth(session)
      if (wallet?.loggedIn || wallet?.connectedChip) {
        console.log(`  forcing logout (was ${JSON.stringify(wallet)})`)
        await forceLoggedOut(session)
        await navigate(session, `${origin}/en/app.html#swap`)
        wallet = await readAuth(session)
      }
      console.log(`  wallet: ${JSON.stringify(wallet)}`)
      if (wallet?.loggedIn) {
        console.warn(`  ⚠ still logged-in after force — out shots contaminated`)
      }
    } else {
      let wallet = await readAuth(session)
      console.log(`  wallet: ${JSON.stringify(wallet)}`)
      if (!wallet?.loggedIn) {
        console.log(`  attempting Connect Wallet…`)
        wallet = await ensureLoggedIn(session)
      }
      if (!wallet?.loggedIn) {
        console.warn(`  ⚠ expected logged-in but session not ready — continue with warning`)
      }
    }

    for (const page of PAGES) {
      await setTab(session, page.hash)
      if (page.swapView) await setSwapView(session, page.swapView)
      else {
        // ensure hub for swap-hub
        if (page.id === 'swap-hub') {
          await evaluate(
            session,
            `(() => {
              for (let i = 0; i < 3; i++) {
                const b = [...document.querySelectorAll('button')].find((x) => /Back|返回/.test(x.textContent || ''));
                if (b) b.click();
              }
              return 1;
            })()`,
          )
          await sleep(400)
        }
      }
      await freezeMotion(session)

      for (const scroll of SCROLLS) {
        // both panes to same relative position for comparable full-window shots
        await scrollPane(session, 'both', scroll)
        await sleep(250)
        const file = path.join(dir, `${port}-${page.id}-${scroll}.png`)
        await screenshot(session, file)
        console.log(`  shot ${page.id} ${scroll}`)
      }
    }
  }

  // diffs
  for (const page of PAGES) {
    for (const scroll of SCROLLS) {
      const basePath = path.join(dir, `4175-${page.id}-${scroll}.png`)
      const currPath = path.join(dir, `5174-${page.id}-${scroll}.png`)
      if (!fs.existsSync(basePath) || !fs.existsSync(currPath)) continue
      const hmPath = path.join(dir, `hm-${page.id}-${scroll}.png`)
      const d = diffPair(basePath, currPath, hmPath)
      const row = { auth, page: page.id, scroll, pct: Number(d.pct.toFixed(2)), wh: d.wh, red: d.red }
      report.push(row)
      console.log(`  diff ${auth} ${page.id} ${scroll}: ${row.pct}%`)
    }
  }

  fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(report, null, 2))
  return report
}

async function main() {
  console.log('Phase V matrix')
  console.log(`BASE=${BASE} CURR=${CURR}`)
  console.log(`AUTH=${AUTH_MODE} PAGES=${PAGES.map((p) => p.id).join(',')} SCROLLS=${SCROLLS.join(',')}`)
  console.log(`OUT=${OUT}`)

  const auths = AUTH_MODE === 'both' ? ['out', 'in'] : AUTH_MODE === 'in' ? ['in'] : ['out']
  const all = []
  for (const auth of auths) {
    all.push(...(await captureAuth(auth)))
  }
  fs.mkdirSync(OUT, { recursive: true })
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(all, null, 2))
  console.log('\nDone. See', path.join(OUT, 'report.json'))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
