/**
 * Assets Stake 的 A5 测量配置。
 *
 * 输入清单与输出文件放在 `tmp/ui-leaf-measure/`（本地自备 JSON，不把 `.scratch` 当唯一来源），
 * 测量顺序按最小清单 / leaf 表顺序。
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '../../..')

/**
 * 把仓库根目录下的相对路径解析为绝对路径，供读取资产质押清单与输出。
 *
 * @param {string} rel 仓库根目录下的相对路径
 */
function abs(rel) {
  return join(repoRoot, rel)
}

export const profile = {
  id: 'assets-stake',
  url: 'http://127.0.0.1:5174/zh/app.html#assets/stake',
  session: 'a5-assets-stake-r3',
  inventory: abs('tmp/ui-leaf-measure/212-assets-stake-a5-inventory.json'),
  out: abs('tmp/ui-leaf-measure/212-assets-stake-measure-full.json'),
  pageSnapshotPath: join(here, 'assets-stake.page.js'),
  viewport: { width: 1920, height: 1080 },
  waitUntilReadyJs: `(() => {
    const has = (t) => [...document.querySelectorAll('span,p,h1,h2,strong')].some(e => (e.textContent||'').trim() === t);
    return has('质押仓位') && has('仓位数据') && has('操作记录') && has('FAQs');
  })()`,
  /** @returns {string} */
  loadPageSnapshotJs() {
    return readFileSync(this.pageSnapshotPath, 'utf8')
  },
}

/**
 * 按资产质押清单顺序取页面快照节点，产出等长测量映射。
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

  const S = /** @type {any} */ (page.shell)
  const L = /** @type {any} */ (page.left)
  const R = /** @type {any} */ (page.right)
  const cards = /** @type {any[]} */ (L.cards ?? [])
  const c0 = cards[0] ?? {}
  const c1 = cards[1] ?? {}
  const c2 = cards[2] ?? {}
  const c3 = cards[3] ?? {}
  const c4 = cards[4] ?? {}
  const stats = /** @type {any[]} */ (R.stats ?? [])
  const s0 = stats[0] ?? {}

  // 0-1 页面容器
  add(gdc[0], S.rail, 'shell.rail')
  add(gdc[1], S.header, 'shell.header')

  // 2-13 左栏界面外观与工具栏
  add(gdc[2], L.backIcon, 'left.backIcon')
  add(gdc[3], L.backLabel, 'left.backLabel')
  add(gdc[4], L.menuBtn, 'left.menuBtn')
  add(gdc[5], L.menuIcon, 'left.menuIcon')
  add(gdc[6], L.title, 'left.title')
  add(gdc[7], L.subtitle, 'left.subtitle')
  add(gdc[8], L.sortPill, 'left.sortPill')
  add(gdc[9], L.sortText, 'left.sortText')
  add(gdc[10], L.sortChevron, 'left.sortChevron')
  add(gdc[11], L.quoteLabel, 'left.quoteLabel')
  add(gdc[12], L.quoteToggle, 'left.quoteToggle')
  add(gdc[13], L.quoteAgx, 'left.quoteAgx')
  add(gdc[14], L.quoteUsd, 'left.quoteUsd')

  // 15-33 第 0 张卡：活期 + 隐藏的 boost
  add(gdc[15], c0.card, 'card[0].card')
  add(gdc[16], c0.periodPill, 'card[0].periodPill')
  add(gdc[17], c0.periodText, 'card[0].periodText')
  add(gdc[18], c0.remainLab, 'card[0].remainLab')
  add(gdc[19], c0.remainVal, 'card[0].remainVal')
  add(gdc[20], c0.amtLab, 'card[0].amtLab')
  add(gdc[21], c0.amtVal, 'card[0].amtVal')
  add(gdc[22], c0.lockChip, 'card[0].lockChip')
  add(gdc[23], c0.lockIcon, 'card[0].lockIcon')
  add(gdc[24], c0.lockText, 'card[0].lockText')
  add(gdc[25], c0.yldLab, 'card[0].yldLab')
  add(gdc[26], c0.yldVal, 'card[0].yldVal')
  add(gdc[27], c0.boostChip, 'card[0].boostChip')
  add(gdc[28], c0.boostIcon, 'card[0].boostIcon')
  add(gdc[29], c0.boostText, 'card[0].boostText')
  add(gdc[30], c0.claimBtn, 'card[0].claimBtn')
  add(gdc[31], c0.claimText, 'card[0].claimText')
  add(gdc[32], c0.redeemBtn, 'card[0].redeemBtn')
  add(gdc[33], c0.redeemText, 'card[0].redeemText')

  // 34-49 第 1 张卡：随时（无 boost）
  add(gdc[34], c1.card, 'card[1].card')
  add(gdc[35], c1.periodPill, 'card[1].periodPill')
  add(gdc[36], c1.periodText, 'card[1].periodText')
  add(gdc[37], c1.remainLab, 'card[1].remainLab')
  add(gdc[38], c1.remainVal, 'card[1].remainVal')
  add(gdc[39], c1.amtLab, 'card[1].amtLab')
  add(gdc[40], c1.amtVal, 'card[1].amtVal')
  add(gdc[41], c1.lockChip, 'card[1].lockChip')
  add(gdc[42], c1.lockIcon, 'card[1].lockIcon')
  add(gdc[43], c1.lockText, 'card[1].lockText')
  add(gdc[44], c1.yldLab, 'card[1].yldLab')
  add(gdc[45], c1.yldVal, 'card[1].yldVal')
  add(gdc[46], c1.claimBtn, 'card[1].claimBtn')
  add(gdc[47], c1.claimText, 'card[1].claimText')
  add(gdc[48], c1.redeemBtn, 'card[1].redeemBtn')
  add(gdc[49], c1.redeemText, 'card[1].redeemText')

  // 50-70 第 2 张卡：锁仓 + 凭证 + boost
  add(gdc[50], c2.card, 'card[2].card')
  add(gdc[51], c2.periodPill, 'card[2].periodPill')
  add(gdc[52], c2.periodText, 'card[2].periodText')
  add(gdc[53], c2.remainLab, 'card[2].remainLab')
  add(gdc[54], c2.remainVal, 'card[2].remainVal')
  add(gdc[55], c2.amtLab, 'card[2].amtLab')
  add(gdc[56], c2.amtVal, 'card[2].amtVal')
  add(gdc[57], c2.lockChip, 'card[2].lockChip')
  add(gdc[58], c2.lockIcon, 'card[2].lockIcon')
  add(gdc[59], c2.lockText, 'card[2].lockText')
  add(gdc[60], c2.yldLab, 'card[2].yldLab')
  add(gdc[61], c2.yldVal, 'card[2].yldVal')
  add(gdc[62], c2.boostChip, 'card[2].boostChip')
  add(gdc[63], c2.boostIcon, 'card[2].boostIcon')
  add(gdc[64], c2.boostText, 'card[2].boostText')
  add(gdc[65], c2.voucherLab, 'card[2].voucherLab')
  add(gdc[66], c2.voucherVal, 'card[2].voucherVal')
  add(gdc[67], c2.claimBtn, 'card[2].claimBtn')
  add(gdc[68], c2.claimText, 'card[2].claimText')
  add(gdc[69], c2.redeemBtn, 'card[2].redeemBtn')
  add(gdc[70], c2.redeemText, 'card[2].redeemText')

  // 71-72 复用的卡面
  add(gdc[71], c3.card, 'card[3].card')
  add(gdc[72], c4.card, 'card[4].card')

  // 73-78 列表分页
  const P = L.pager ?? {}
  add(gdc[73], P.totalText, 'pager.totalText')
  add(gdc[74], P.prevBtn, 'pager.prevBtn')
  add(gdc[75], P.prevText, 'pager.prevText')
  add(gdc[76], P.pageInd, 'pager.pageInd')
  add(gdc[77], P.nextBtn, 'pager.nextBtn')
  add(gdc[78], P.nextText, 'pager.nextText')

  // 79-89 统计区（首卡展开 + 5 个复用卡面）
  add(gdc[79], R.statsTitle, 'right.statsTitle')
  add(gdc[80], s0.card, 'stat[0].card')
  add(gdc[81], s0.label, 'stat[0].label')
  add(gdc[82], s0.token, 'stat[0].token')
  add(gdc[83], s0.value, 'stat[0].value')
  add(gdc[84], s0.approx, 'stat[0].approx')
  for (let i = 1; i <= 5; i++) {
    add(gdc[84 + i], stats[i]?.card, `stat[${i}].card`)
  }

  // 90-109 操作记录与分页
  add(gdc[90], R.opsTitle, 'right.opsTitle')
  add(gdc[91], R.tableCard, 'right.tableCard')
  const cols = R.cols ?? []
  for (let i = 0; i < 4; i++) add(gdc[92 + i], cols[i], `ops.col[${i}]`)
  const row0 = R.row0 ?? []
  for (let i = 0; i < 4; i++) add(gdc[96 + i], row0[i], `ops.row0[${i}]`)
  add(gdc[100], R.trowRest, 'ops.trowRest')
  const Op = R.opsPag ?? {}
  add(gdc[101], Op.total, 'opsPag.total')
  add(gdc[102], Op.perPage, 'opsPag.perPage')
  add(gdc[103], Op.prevBtn, 'opsPag.prevBtn')
  add(gdc[104], Op.prevIcon, 'opsPag.prevIcon')
  add(gdc[105], Op.indicator, 'opsPag.indicator')
  add(gdc[106], Op.pageText, 'opsPag.pageText')
  add(gdc[107], Op.dropdown, 'opsPag.dropdown')
  add(gdc[108], Op.nextBtn, 'opsPag.nextBtn')
  add(gdc[109], Op.nextIcon, 'opsPag.nextIcon')

  // 110-113 FAQ 与分隔线
  add(gdc[110], R.faqTitle, 'right.faqTitle')
  add(gdc[111], R.faqList, 'right.faqList')
  add(gdc[112], S.dividerNav, 'shell.dividerNav')
  add(gdc[113], S.dividerCols, 'shell.dividerCols')

  if (mapped.length !== gdc.length) {
    throw new Error(`mapLeaves length ${mapped.length} !== inventory ${gdc.length}`)
  }
  return mapped
}
