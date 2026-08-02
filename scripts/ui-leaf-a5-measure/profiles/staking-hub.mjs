/**
 * Staking Hub (`#staking` · PC `4287:212`) A5 profile.
 *
 * Inventory: `.scratch/dapp-7rail-parity/research/207-gdc-merged.json` (N=136)
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
  id: 'staking-hub',
  url: 'http://127.0.0.1:5174/zh/app.html#staking',
  session: 'a5-staking-hub',
  inventory: abs('.scratch/dapp-7rail-parity/research/207-gdc-merged.json'),
  out: abs('.scratch/dapp-7rail-parity/research/207-staking-hub-measure-full.json'),
  pageSnapshotPath: join(here, 'staking-hub.page.js'),
  viewport: { width: 1920, height: 1080 },
  waitUntilReadyJs: `(() => {
    const has = (t) => [...document.querySelectorAll('h1,h2,span,p')].some(e => (e.textContent||'').trim() === t);
    const modes = [...document.querySelectorAll('button')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 300 && r.width < 380 && r.height > 50 && r.height < 90 && /收益计算器|LP债券/.test(el.textContent||'');
    });
    return has('数据总览') && has('质押周期与收益') && modes.length >= 2;
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

  const H = /** @type {any} */ (page.header)
  const modes = /** @type {any[]} */ (page.modes ?? [])
  const O = /** @type {any} */ (page.overview)
  const T = /** @type {any} */ (page.tiles ?? {})
  const P = /** @type {any} */ (page.period ?? {})
  const C = /** @type {any} */ (page.chart ?? {})
  const F = /** @type {any} */ (page.faq ?? {})

  add(gdc[0], H.title, 'header.title')
  add(gdc[1], H.subtitle, 'header.subtitle')
  add(gdc[2], H.menuBtn, 'header.menuBtn')
  add(gdc[3], H.menuIcon, 'header.menuIcon')

  let gi = 4
  for (let mi = 0; mi < 5; mi++) {
    const pack = modes[mi] ?? {}
    add(gdc[gi++], pack.card, `mode[${mi}].card`)
    add(gdc[gi++], pack.icon, `mode[${mi}].icon`)
    add(gdc[gi++], pack.title, `mode[${mi}].title`)
    add(gdc[gi++], pack.body, `mode[${mi}].body`)
  }

  add(gdc[24], O.title, 'overview.title')

  const tileOrder = [
    { id: 'tvl', keys: ['card', 'label', 'info', 'value', 'approx'] },
    { id: 'mcap', keys: ['card', 'label', 'info', 'value'] },
    { id: 'circ', keys: ['card', 'label', 'info', 'value'] },
    { id: 'treasury', keys: ['card', 'label', 'info', 'value', 'approx'] },
    { id: 'price', keys: ['card', 'label', 'info', 'value'] },
    { id: 'burn', keys: ['card', 'label', 'info', 'value'] },
    { id: 'rebase', keys: ['card', 'label', 'info', 'value'] },
    { id: 'runway', keys: ['card', 'label', 'info', 'value'] },
    { id: 'stakers', keys: ['card', 'label', 'info', 'value'] },
  ]
  gi = 25
  for (const { id, keys } of tileOrder) {
    const pack = T[id] ?? {}
    for (const key of keys) {
      add(gdc[gi++], pack[key], `tile.${id}.${key}`)
    }
  }

  // token icons after tiles (inventory order)
  add(gdc[63], T.tvl?.token, 'tile.tvl.token')
  add(gdc[64], T.circ?.token, 'tile.circ.token')
  add(gdc[65], T.treasury?.token, 'tile.treasury.token')
  add(gdc[66], T.price?.token, 'tile.price.token')
  add(gdc[67], T.burn?.token, 'tile.burn.token')

  add(gdc[68], P.title, 'period.title')
  const tabs = P.tabs ?? []
  add(gdc[69], tabs[0]?.surface, 'period.tab[0].surface')
  add(gdc[70], tabs[1]?.surface, 'period.tab[1].surface')
  add(gdc[71], tabs[2]?.surface, 'period.tab[2].surface')
  add(gdc[72], tabs[0]?.text, 'period.tab[0].text')
  add(gdc[73], tabs[1]?.text, 'period.tab[1].text')
  add(gdc[74], tabs[2]?.text, 'period.tab[2].text')
  add(gdc[75], P.tableCard, 'period.tableCard')
  const cols = P.cols ?? []
  add(gdc[76], cols[0], 'period.col[0]')
  add(gdc[77], cols[1], 'period.col[1]')
  add(gdc[78], cols[2], 'period.col[2]')
  add(gdc[79], cols[3], 'period.col[3]')
  const rows = P.rows ?? []
  gi = 80
  for (let ri = 0; ri < 4; ri++) {
    const row = rows[ri] ?? {}
    add(gdc[gi++], row.period, `period.row[${ri}].period`)
    add(gdc[gi++], row.base, `period.row[${ri}].base`)
    add(gdc[gi++], row.bonus, `period.row[${ri}].bonus`)
    add(gdc[gi++], row.yield, `period.row[${ri}].yield`)
  }

  add(gdc[96], C.title, 'chart.title')
  const metricTabs = C.metricTabs ?? []
  add(gdc[97], metricTabs[0], 'chart.metricTab[0]')
  add(gdc[98], metricTabs[1], 'chart.metricTab[1]')
  add(gdc[99], C.card, 'chart.card')
  add(gdc[100], C.value, 'chart.value')
  add(gdc[101], C.delta, 'chart.delta')
  const ranges = C.ranges ?? []
  for (let i = 0; i < 4; i++) add(gdc[102 + i], ranges[i], `chart.range[${i}]`)
  const xaxis = C.xaxis ?? []
  for (let i = 0; i < 6; i++) add(gdc[106 + i], xaxis[i], `chart.xaxis[${i}]`)
  add(gdc[112], C.area, 'chart.area')
  add(gdc[113], C.line, 'chart.line')

  add(gdc[114], F.title, 'faq.title')
  const faqItems = F.items ?? []
  gi = 115
  for (let i = 0; i < 7; i++) {
    const item = faqItems[i] ?? {}
    add(gdc[gi++], item.row, `faq[${i}].row`)
    add(gdc[gi++], item.q, `faq[${i}].q`)
    add(gdc[gi++], item.chevron, `faq[${i}].chevron`)
  }

  if (mapped.length !== gdc.length) {
    throw new Error(`mapLeaves length ${mapped.length} !== inventory ${gdc.length}`)
  }
  return mapped
}
