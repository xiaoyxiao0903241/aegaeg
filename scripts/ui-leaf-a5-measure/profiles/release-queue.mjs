/**
 * Release Queue (`#release/queue` · PC `4466:220`) A5 profile.
 *
 * Inventory: `.scratch/dapp-7rail-parity/research/222-gdc-a5-inventory.json` (N=111)
 * Order = `222-release-queue-min-leaves.md` 全表（§2.3a）。
 * Left: ReleaseQueueWidget · Right: ReleaseQueueContent
 * §8.2a reuse: DappTabHeader · FaqList（各 1 leaf）
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
  id: 'release-queue',
  url: 'http://127.0.0.1:5175/zh/app.html#release/queue',
  session: 'a5-rq-1785781532',
  inventory: abs('.scratch/dapp-7rail-parity/research/222-gdc-a5-inventory.json'),
  out: abs('.scratch/dapp-7rail-parity/research/222-release-queue-measure-full.json'),
  pageSnapshotPath: join(here, 'release-queue.page.js'),
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
      (e) => (e.textContent || '').trim() === '释放池',
    );
    const has = (t) =>
      [...document.querySelectorAll('h1,h2,h3,span,p')].some((e) => (e.textContent || '').trim() === t);
    const planList = document.querySelector('[data-slot-id="release-queue-plan-list"]');
    const plan5 = document.querySelector('[data-slot-id="release-queue-plan-5"]');
    const remOk = Math.abs(parseFloat(getComputedStyle(document.documentElement).fontSize) - 16) < 0.5;
    return (
      remOk &&
      !hasOnboarding &&
      openLeft === 0 &&
      hasH1 &&
      has('释放池数据') &&
      has('释放池记录') &&
      !!planList &&
      !!plan5
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
  const plans = /** @type {any[]} */ (page.plans ?? [])
  const St = /** @type {any} */ (page.stats ?? {})
  const R = /** @type {any} */ (page.records ?? {})
  const F = /** @type {any} */ (page.faq ?? {})
  const statCards = /** @type {any[]} */ (St.cards ?? [])
  const headers = /** @type {any[]} */ (R.headers ?? [])
  const rows = /** @type {any[]} */ (R.rows ?? [])
  const P = /** @type {any} */ (R.pager ?? {})

  // 0–1 chrome dividers
  add(gdc[0], S.dividerL, 'shell.dividerL')
  add(gdc[1], S.dividerR, 'shell.dividerR')

  // 2 DappTabHeader（§8.2a reuse · 整块）
  add(gdc[2], H.tabHeader, 'header.tabHeader')

  // 3–58 plan×4（每档 14 leaf：card→claimText）
  const planDays = [5, 20, 40, 60]
  let gi = 3
  for (let pi = 0; pi < 4; pi++) {
    const p = plans[pi] ?? {}
    const d = planDays[pi]
    add(gdc[gi++], p.card, `plan[${d}].card`)
    add(gdc[gi++], p.icon, `plan[${d}].icon`)
    add(gdc[gi++], p.pill, `plan[${d}].pill`)
    add(gdc[gi++], p.pillText, `plan[${d}].pillText`)
    add(gdc[gi++], p.refresh, `plan[${d}].refresh`)
    add(gdc[gi++], p.releasedLab, `plan[${d}].releasedLab`)
    add(gdc[gi++], p.releasedAmt, `plan[${d}].releasedAmt`)
    add(gdc[gi++], p.releasingLab, `plan[${d}].releasingLab`)
    add(gdc[gi++], p.releasingAmt, `plan[${d}].releasingAmt`)
    add(gdc[gi++], p.bar, `plan[${d}].bar`)
    add(gdc[gi++], p.pct, `plan[${d}].pct`)
    add(gdc[gi++], p.approx, `plan[${d}].approx`)
    add(gdc[gi++], p.claimBtn, `plan[${d}].claimBtn`)
    add(gdc[gi++], p.claimText, `plan[${d}].claimText`)
  }

  // 59–74 stats
  add(gdc[gi++], St.heading, 'stats.heading')
  for (let i = 0; i < 3; i++) {
    const c = statCards[i] ?? {}
    add(gdc[gi++], c.card, `stat[${i}].card`)
    add(gdc[gi++], c.label, `stat[${i}].label`)
    add(gdc[gi++], c.icon, `stat[${i}].icon`)
    add(gdc[gi++], c.value, `stat[${i}].value`)
    add(gdc[gi++], c.approx, `stat[${i}].approx`)
  }

  // 75–100 records
  add(gdc[gi++], R.heading, 'records.heading')
  add(gdc[gi++], R.tableCard, 'records.tableCard')
  for (let i = 0; i < 4; i++) add(gdc[gi++], headers[i], `records.header[${i}]`)
  for (let ri = 0; ri < 5; ri++) {
    const cells = rows[ri] ?? []
    for (let ci = 0; ci < 4; ci++) add(gdc[gi++], cells[ci], `records.row[${ri}].c[${ci}]`)
  }

  // 101–109 pager
  add(gdc[gi++], P.total, 'pager.total')
  add(gdc[gi++], P.perPage, 'pager.perPage')
  add(gdc[gi++], P.prevBtn, 'pager.prevBtn')
  add(gdc[gi++], P.prevIcon, 'pager.prevIcon')
  add(gdc[gi++], P.indicator, 'pager.indicator')
  add(gdc[gi++], P.pageText, 'pager.pageText')
  add(gdc[gi++], P.dropdown, 'pager.dropdown')
  add(gdc[gi++], P.nextBtn, 'pager.nextBtn')
  add(gdc[gi++], P.nextIcon, 'pager.nextIcon')

  // 110 FaqList（§8.2a reuse · 整块）
  add(gdc[gi++], F.list, 'faq.list')

  if (mapped.length !== gdc.length) {
    throw new Error(`mapLeaves length ${mapped.length} !== inventory ${gdc.length} (gi=${gi})`)
  }
  return mapped
}
