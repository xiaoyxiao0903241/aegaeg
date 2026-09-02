/**
 * Staking Stake 的 A5 测量配置。
 *
 * 输入清单与输出文件放在 `tmp/ui-leaf-measure/`（本地自备 JSON，不把 `.scratch` 当唯一来源）。
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '../../..')

/**
 * 把仓库根目录下的相对路径解析为本地绝对路径，供读写质押操作测量文件。
 *
 * @param {string} rel 仓库根目录下的相对路径
 */
function abs(rel) {
  return join(repoRoot, rel)
}

export const profile = {
  id: 'staking-stake',
  url: 'http://127.0.0.1:5174/zh/app.html#staking/stake',
  session: 'a5-staking-stake',
  inventory: abs('tmp/ui-leaf-measure/208-gdc-merged.json'),
  out: abs('tmp/ui-leaf-measure/208-staking-stake-measure-full.json'),
  pageSnapshotPath: join(here, 'staking-stake.page.js'),
  viewport: { width: 1920, height: 1080 },
  waitUntilReadyJs: `(() => {
    const has = (t) => [...document.querySelectorAll('span,p,h1,h2,strong')].some(e => (e.textContent||'').trim() === t);
    return has('选择质押周期') && has('概览') && has('我的质押记录');
  })()`,
  /** @returns {string} */
  loadPageSnapshotJs() {
    return readFileSync(this.pageSnapshotPath, 'utf8')
  },
}

/**
 * 按质押操作清单顺序取页面快照节点，产出等长测量映射。
 *
 * @param {Array<{ nodeId: string, kind: string, name?: string }>} gdc 设计清单条目
 * @param {Record<string, unknown>} page 页面快照数据包
 * @returns 与清单等长的测量映射数组
 */
export function mapLeaves(gdc, page) {
  /** @type {Array<{ leaf: (typeof gdc)[0], measured: object | null, locator: string }>} */
  const mapped = []
  const add = (leaf, measured, locator) => {
    mapped.push({ leaf, measured: measured ?? null, locator })
  }

  const H = /** @type {any} */ (page.header)
  const F = /** @type {any} */ (page.form)
  const O = /** @type {any} */ (page.overview)
  const P = /** @type {any} */ (page.positions)
  const R = /** @type {any} */ (page.records)
  const M = /** @type {any} */ (page.mechanism)
  const C = /** @type {any} */ (page.chart)
  const Faq = /** @type {any} */ (page.faq)

  add(gdc[0], H.backIcon, 'header.backIcon')
  add(gdc[1], H.backLabel, 'header.backLabel')
  add(gdc[2], H.menuBtn, 'header.menuBtn')
  add(gdc[3], H.menuIcon, 'header.menuIcon')
  add(gdc[4], H.title, 'header.title')
  add(gdc[5], H.subtitle, 'header.subtitle')

  add(gdc[6], F.periodLabel, 'form.periodLabel')
  add(gdc[7], F.periodSeg, 'form.periodSeg')
  const periodTexts = F.periodTexts ?? []
  for (let i = 0; i < 4; i++) add(gdc[8 + i], periodTexts[i], `form.period[${i}]`)

  add(gdc[12], F.amountLabel, 'form.amountLabel')
  add(gdc[13], F.inputBox, 'form.inputBox')
  add(gdc[14], F.amount, 'form.amount')
  add(gdc[15], F.agxToken, 'form.agxToken')
  add(gdc[16], F.agxText, 'form.agxText')
  add(gdc[17], F.maxChip, 'form.maxChip')
  add(gdc[18], F.maxText, 'form.maxText')
  add(gdc[19], F.infoBox, 'form.infoBox')

  const meta = F.meta ?? []
  for (let i = 0; i < 5; i++) {
    add(gdc[20 + i * 2], meta[i]?.label, `form.meta[${i}].label`)
    add(gdc[21 + i * 2], meta[i]?.value, `form.meta[${i}].value`)
  }
  add(gdc[30], F.cta, 'form.cta')
  add(gdc[31], F.ctaText, 'form.ctaText')

  add(gdc[32], O.title, 'overview.title')
  add(gdc[33], O.tvl?.card, 'overview.tvl.card')
  add(gdc[34], O.tvl?.label, 'overview.tvl.label')
  add(gdc[35], O.tvl?.token, 'overview.tvl.token')
  add(gdc[36], O.tvl?.value, 'overview.tvl.value')
  add(gdc[37], O.tvl?.approx, 'overview.tvl.approx')
  add(gdc[38], O.epoch?.card, 'overview.epoch.card')
  add(gdc[39], O.epoch?.label, 'overview.epoch.label')
  add(gdc[40], O.epoch?.value, 'overview.epoch.value')
  add(gdc[41], O.next?.card, 'overview.next.card')
  add(gdc[42], O.next?.label, 'overview.next.label')
  add(gdc[43], O.next?.value, 'overview.next.value')
  add(gdc[44], O.rebase?.card, 'overview.rebase.card')
  add(gdc[45], O.rebase?.label, 'overview.rebase.label')
  add(gdc[46], O.rebase?.value, 'overview.rebase.value')

  add(gdc[47], P.title, 'positions.title')
  add(gdc[48], P.viewBadge, 'positions.viewBadge')
  add(gdc[49], P.viewText, 'positions.viewText')

  const posPacks = [
    ['held', 50],
    ['released', 55],
    ['pending', 60],
    ['rebaseYield', 65],
    ['rebaseBonus', 70],
  ]
  for (const [key, start] of posPacks) {
    const pack = P[key] ?? {}
    add(gdc[start], pack.card, `positions.${key}.card`)
    add(gdc[start + 1], pack.label, `positions.${key}.label`)
    add(gdc[start + 2], pack.token, `positions.${key}.token`)
    add(gdc[start + 3], pack.value, `positions.${key}.value`)
    add(gdc[start + 4], pack.approx, `positions.${key}.approx`)
  }

  add(gdc[75], R.title, 'records.title')
  add(gdc[76], R.tableCard, 'records.tableCard')
  const cols = R.cols ?? []
  for (let i = 0; i < 5; i++) add(gdc[77 + i], cols[i], `records.col[${i}]`)
  const rows = R.rows ?? []
  let gi = 82
  for (let ri = 0; ri < 2; ri++) {
    const cells = rows[ri] ?? []
    for (let ci = 0; ci < 5; ci++) add(gdc[gi++], cells[ci], `records.row[${ri}].c[${ci}]`)
  }
  add(gdc[92], R.footCum, 'records.footCum')
  add(gdc[93], R.footCount, 'records.footCount')

  add(gdc[94], M.title, 'mechanism.title')
  add(gdc[95], M.card, 'mechanism.card')
  const steps = M.steps ?? []
  gi = 96
  for (let i = 0; i < 3; i++) {
    const s = steps[i] ?? {}
    add(gdc[gi++], s.cir, `mechanism.step[${i}].cir`)
    add(gdc[gi++], s.num, `mechanism.step[${i}].num`)
    add(gdc[gi++], s.title, `mechanism.step[${i}].title`)
    add(gdc[gi++], s.body, `mechanism.step[${i}].body`)
  }

  add(gdc[108], C.title, 'chart.title')
  add(gdc[109], C.card, 'chart.card')
  add(gdc[110], C.value, 'chart.value')
  add(gdc[111], C.delta, 'chart.delta')
  const ranges = C.ranges ?? []
  for (let i = 0; i < 4; i++) add(gdc[112 + i], ranges[i], `chart.range[${i}]`)
  add(gdc[116], C.area, 'chart.area')
  add(gdc[117], C.line, 'chart.line')
  const xaxis = C.xaxis ?? []
  for (let i = 0; i < 6; i++) add(gdc[118 + i], xaxis[i], `chart.xaxis[${i}]`)

  const faqItems = Faq.items ?? []
  gi = 124
  for (let i = 0; i < 8; i++) {
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
