/**
 * Release Buffer (`#release/buffer` · PC `4469:220`) A5 profile.
 *
 * Inventory/out: `tmp/ui-leaf-measure/`（自备 JSON；禁 `.scratch` SSOT）
 * Order = `223-release-buffer-min-leaves.md` 全表。
 * Left: ReleaseBufferWidget · Right: ReleaseBufferContent
 *
 * 机制否决 DappProcessSteps → 全叶（icon/line/conn/strip）
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '../../..')

/** @param {string} rel */
function abs(rel) {
  return join(repoRoot, rel)
}

export const profile = {
  id: 'release-buffer',
  url: 'http://127.0.0.1:5175/zh/app.html#release/buffer',
  session: 'a5-rb-1785781532',
  inventory: abs('tmp/ui-leaf-measure/223-gdc-a5-inventory.json'),
  out: abs('tmp/ui-leaf-measure/223-release-buffer-measure-full.json'),
  pageSnapshotPath: join(here, 'release-buffer.page.js'),
  viewport: { width: 1920, height: 1080 },
  waitUntilReadyJs: `(() => {
    const skip = [...document.querySelectorAll('button,[data-onboarding-tooltip] button')].find(
      (b) => (b.textContent || '').trim() === '跳过',
    );
    if (skip) skip.click();
    document.documentElement.classList.remove('site-fluid');
    document.documentElement.style.setProperty('font-size', '16px', 'important');
    for (const item of document.querySelectorAll('[data-faq-item][data-state="open"]')) {
      item.querySelector('[data-faq-trigger],button')?.click?.();
    }
    const openLeft = document.querySelectorAll('[data-faq-item][data-state="open"]').length;
    const hasOnboarding = !!document.querySelector('[data-onboarding-tooltip]');
    const widget = document.querySelector('[data-dapp-widget-panel]');
    const hasH1 = [...(widget?.querySelectorAll('h1') || [])].some(
      (e) => (e.textContent || '').trim() === '缓冲池',
    );
    const has = (t) =>
      [...document.querySelectorAll('h1,h2,h3,span,p')].some((e) => (e.textContent || '').trim() === t);
    const remOk = Math.abs(parseFloat(getComputedStyle(document.documentElement).fontSize) - 16) < 0.5;
    const leftPills = [...(widget?.querySelectorAll('span') || [])].filter((e) => {
      const t = (e.textContent || '').trim();
      return t === 'AGX' || t === 'gAGX';
    });
    return (
      remOk &&
      !hasOnboarding &&
      openLeft === 0 &&
      hasH1 &&
      has('缓冲池数据') &&
      has('缓冲池记录') &&
      has('资金释放机制') &&
      leftPills.length >= 2
    );
  })()`,
  /** @returns {string} */
  loadPageSnapshotJs() {
    return readFileSync(this.pageSnapshotPath, 'utf8')
  },
}

/**
 * @param {Array<{ nodeId: string, kind: string, name?: string }>} gdc
 * @param {Record<string, unknown>} page
 */
export function mapLeaves(gdc, page) {
  /** @type {Array<{ leaf: (typeof gdc)[0], measured: object | null, locator: string }>} */
  const mapped = []
  const add = (leaf, measured, locator) => {
    mapped.push({ leaf, measured: measured ?? null, locator })
  }

  const S = /** @type {any} */ (page.shell ?? {})
  const H = /** @type {any} */ (page.header ?? {})
  const bufs = /** @type {Record<string, any>} */ (page.bufs ?? {})
  const St = /** @type {any} */ (page.stats ?? {})
  const wide = /** @type {Record<string, any>} */ (St.wide ?? {})
  const R = /** @type {any} */ (page.records ?? {})
  const M = /** @type {any} */ (page.mech ?? {})
  const F = /** @type {any} */ (page.faq ?? {})
  const headers = /** @type {any[]} */ (R.headers ?? [])
  const rows = /** @type {any[]} */ (R.rows ?? [])
  const P = /** @type {any} */ (R.pager ?? {})
  const steps = /** @type {any[]} */ (M.steps ?? [])
  const conns = /** @type {any[]} */ (M.conns ?? [])
  const benefits = /** @type {any[]} */ (M.benefits ?? [])

  // 0–1 chrome dividers
  add(gdc[0], S.dividerL, 'shell.dividerL')
  add(gdc[1], S.dividerR, 'shell.dividerR')

  // 2 DappTabHeader
  add(gdc[2], H.tabHeader, 'header.tabHeader')

  // 3–30 buf×2（AGX / gAGX · 各 14 leaf：card→claimText；radio 稿有现码可无→null）
  const tokens = ['AGX', 'gAGX']
  let gi = 3
  for (const tok of tokens) {
    const b = bufs[tok] ?? {}
    add(gdc[gi++], b.card, `bufs[${tok}].card`)
    add(gdc[gi++], b.icon, `bufs[${tok}].icon`)
    add(gdc[gi++], b.pill, `bufs[${tok}].pill`)
    add(gdc[gi++], b.pillText, `bufs[${tok}].pillText`)
    add(gdc[gi++], b.refresh, `bufs[${tok}].refresh`)
    add(gdc[gi++], b.releasedLab, `bufs[${tok}].releasedLab`)
    add(gdc[gi++], b.releasedAmt, `bufs[${tok}].releasedAmt`)
    add(gdc[gi++], b.releasingLab, `bufs[${tok}].releasingLab`)
    add(gdc[gi++], b.releasingAmt, `bufs[${tok}].releasingAmt`)
    add(gdc[gi++], b.bar, `bufs[${tok}].bar`)
    add(gdc[gi++], b.pct, `bufs[${tok}].pct`)
    add(gdc[gi++], b.approx, `bufs[${tok}].approx`)
    add(gdc[gi++], b.claimBtn, `bufs[${tok}].claimBtn`)
    add(gdc[gi++], b.claimText, `bufs[${tok}].claimText`)
  }

  // 31–55 stats（heading + wide×2 × 12）
  add(gdc[gi++], St.heading, 'stats.heading')
  for (const tok of tokens) {
    const w = wide[tok] ?? {}
    const metrics = /** @type {any[]} */ (w.metrics ?? [])
    add(gdc[gi++], w.card, `stats.wide[${tok}].card`)
    add(gdc[gi++], w.icon, `stats.wide[${tok}].icon`)
    add(gdc[gi++], w.tokenLabel, `stats.wide[${tok}].tokenLabel`)
    for (let i = 0; i < 3; i++) {
      const m = metrics[i] ?? {}
      add(gdc[gi++], m.label, `stats.wide[${tok}].m[${i}].label`)
      add(gdc[gi++], m.value, `stats.wide[${tok}].m[${i}].value`)
      add(gdc[gi++], m.approx, `stats.wide[${tok}].m[${i}].approx`)
    }
  }

  // 56–81 records
  add(gdc[gi++], R.heading, 'records.heading')
  add(gdc[gi++], R.tableCard, 'records.tableCard')
  for (let i = 0; i < 4; i++) add(gdc[gi++], headers[i], `records.header[${i}]`)
  for (let ri = 0; ri < 5; ri++) {
    const cells = rows[ri] ?? []
    for (let ci = 0; ci < 4; ci++) add(gdc[gi++], cells[ci], `records.row[${ri}].c[${ci}]`)
  }

  // 82–90 pager
  add(gdc[gi++], P.total, 'pager.total')
  add(gdc[gi++], P.perPage, 'pager.perPage')
  add(gdc[gi++], P.prevBtn, 'pager.prevBtn')
  add(gdc[gi++], P.prevIcon, 'pager.prevIcon')
  add(gdc[gi++], P.indicator, 'pager.indicator')
  add(gdc[gi++], P.pageText, 'pager.pageText')
  add(gdc[gi++], P.dropdown, 'pager.dropdown')
  add(gdc[gi++], P.nextBtn, 'pager.nextBtn')
  add(gdc[gi++], P.nextIcon, 'pager.nextIcon')

  // 91–117 mechanism（title/subtitle/fcard + steps×4{icon,line1,line2}+conns×3 + strip + benefits×4）
  add(gdc[gi++], M.title, 'mech.title')
  add(gdc[gi++], M.subtitle, 'mech.subtitle')
  add(gdc[gi++], M.fcard, 'mech.fcard')
  for (let i = 0; i < 4; i++) {
    const s = steps[i] ?? {}
    add(gdc[gi++], s.icon, `mech.steps[${i}].icon`)
    add(gdc[gi++], s.line1, `mech.steps[${i}].line1`)
    add(gdc[gi++], s.line2, `mech.steps[${i}].line2`)
    if (i < 3) add(gdc[gi++], conns[i], `mech.conns[${i}]`)
  }
  add(gdc[gi++], M.strip, 'mech.strip')
  for (let i = 0; i < 4; i++) {
    const b = benefits[i] ?? {}
    add(gdc[gi++], b.check, `mech.benefits[${i}].check`)
    add(gdc[gi++], b.text, `mech.benefits[${i}].text`)
  }

  // 118 FaqList
  add(gdc[gi++], F.list, 'faq.list')

  if (mapped.length !== gdc.length) {
    throw new Error(`mapLeaves length ${mapped.length} !== inventory ${gdc.length} (gi=${gi})`)
  }
  return mapped
}
