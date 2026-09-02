/**
 * Rewards Lucky 的 A5 测量配置。
 *
 * 输入清单与输出文件放在 `tmp/ui-leaf-measure/`（本地自备 JSON，不把 `.scratch` 当唯一来源）。
 * 顺序按 `215-lucky-min-leaves.json` 的 leaves[]（与 `215-gdc-merged.json` 同序）。
 * 左栏为 RewardsMixedClaimWidget，右栏为 RewardsLuckyContent。
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '../../..')

/**
 * 把仓库根目录下的相对路径解析为本地绝对路径，供读写幸运奖励测量文件。
 *
 * @param {string} rel 仓库根目录下的相对路径
 */
function abs(rel) {
  return join(repoRoot, rel)
}

export const profile = {
  id: 'rewards-lucky',
  url: 'http://127.0.0.1:5174/zh/app.html#rewards/lucky',
  session: 'a5-rewards-lucky',
  inventory: abs('tmp/ui-leaf-measure/215-lucky-a5-inventory.json'),
  out: abs('tmp/ui-leaf-measure/215-lucky-measure-full.json'),
  pageSnapshotPath: join(here, 'rewards-lucky.page.js'),
  viewport: { width: 1920, height: 1080 },
  waitUntilReadyJs: `(() => {
    const has = (t) => [...document.querySelectorAll('h1,h2,span,p,strong')].some(e => (e.textContent||'').trim() === t);
    return has('幸运奖') && has('可领取') && (has('今日奖池') || has('数据'));
  })()`,
  /** @returns {string} */
  loadPageSnapshotJs() {
    return readFileSync(this.pageSnapshotPath, 'utf8')
  },
}

/**
 * 按幸运奖励清单顺序取页面快照节点，产出等长测量映射。
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

  const S = /** @type {any} */ (page.shell ?? {})
  const H = /** @type {any} */ (page.header ?? {})
  const C = /** @type {any} */ (page.claim ?? {})
  const W = /** @type {any} */ (page.warning ?? {})
  const Sl = /** @type {any} */ (page.slider ?? {})
  const Rel = /** @type {any} */ (page.release ?? {})
  const Res = /** @type {any} */ (page.restake ?? {})
  const Cta = /** @type {any} */ (page.cta ?? {})
  const T = /** @type {any} */ (page.tiles ?? {})
  const Cl = /** @type {any} */ (page.chainlink ?? {})
  const R = /** @type {any} */ (page.results ?? {})
  const Hist = /** @type {any} */ (page.history ?? {})
  const F = /** @type {any} */ (page.faq ?? {})

  // 0–1 页面分隔外观
  add(gdc[0], S.dividerL, 'shell.dividerL')
  add(gdc[1], S.dividerR, 'shell.dividerR')

  // 2–7 左栏标题
  add(gdc[2], H.backIcon, 'header.backIcon')
  add(gdc[3], H.backLabel, 'header.backLabel')
  add(gdc[4], H.menuBtn, 'header.menuBtn')
  add(gdc[5], H.menuIcon, 'header.menuIcon')
  add(gdc[6], H.title, 'header.title')
  add(gdc[7], H.subtitle, 'header.subtitle')

  // 8–13 可领取区
  add(gdc[8], C.card, 'claim.card')
  add(gdc[9], C.label, 'claim.label')
  add(gdc[10], C.tokenIcon, 'claim.tokenIcon')
  add(gdc[11], C.amount, 'claim.amount')
  add(gdc[12], C.contribLabel, 'claim.contribLabel')
  add(gdc[13], C.contribValue, 'claim.contribValue')

  // 14–15 提示区
  add(gdc[14], W.card, 'warning.card')
  add(gdc[15], W.text, 'warning.text')

  // 16 领取区分隔线
  add(gdc[16], S.claimDivider, 'shell.claimDivider')

  // 17–23 滑杆
  add(gdc[17], Sl.card, 'slider.card')
  add(gdc[18], Sl.segL, 'slider.segL')
  add(gdc[19], Sl.segR, 'slider.segR')
  add(gdc[20], Sl.handle, 'slider.handle')
  add(gdc[21], Sl.handleText, 'slider.handleText')
  add(gdc[22], Sl.releaseLab, 'slider.releaseLab')
  add(gdc[23], Sl.restakeLab, 'slider.restakeLab')

  // 24–34 释放卡
  add(gdc[24], Rel.card, 'release.card')
  add(gdc[25], Rel.title, 'release.title')
  add(gdc[26], Rel.into, 'release.into')
  add(gdc[27], Rel.pill, 'release.pill')
  add(gdc[28], Rel.tokenIcon, 'release.tokenIcon')
  add(gdc[29], Rel.tokenText, 'release.tokenText')
  add(gdc[30], Rel.amount, 'release.amount')
  add(gdc[31], Rel.periodLab, 'release.periodLab')
  add(gdc[32], Rel.dropdown, 'release.dropdown')
  add(gdc[33], Rel.dropdownText, 'release.dropdownText')
  add(gdc[34], Rel.chevron, 'release.chevron')

  // 35–45 复投卡
  add(gdc[35], Res.card, 'restake.card')
  add(gdc[36], Res.title, 'restake.title')
  add(gdc[37], Res.into, 'restake.into')
  add(gdc[38], Res.pill, 'restake.pill')
  add(gdc[39], Res.tokenIcon, 'restake.tokenIcon')
  add(gdc[40], Res.tokenText, 'restake.tokenText')
  add(gdc[41], Res.amount, 'restake.amount')
  add(gdc[42], Res.periodLab, 'restake.periodLab')
  add(gdc[43], Res.dropdown, 'restake.dropdown')
  add(gdc[44], Res.dropdownText, 'restake.dropdownText')
  add(gdc[45], Res.chevron, 'restake.chevron')

  // 46–50 主操作按钮
  add(gdc[46], Cta.btn, 'cta.btn')
  add(gdc[47], Cta.releaseLab, 'cta.releaseLab')
  add(gdc[48], Cta.releaseAmt, 'cta.releaseAmt')
  add(gdc[49], Cta.restakeLab, 'cta.restakeLab')
  add(gdc[50], Cta.restakeAmt, 'cta.restakeAmt')

  // 51–63 数据卡
  add(gdc[51], T.dataHeading, 'tiles.dataHeading')
  add(gdc[52], T.pool?.card, 'tiles.pool.card')
  add(gdc[53], T.pool?.label, 'tiles.pool.label')
  add(gdc[54], T.pool?.value, 'tiles.pool.value')
  add(gdc[55], T.pool?.hint, 'tiles.pool.hint')
  add(gdc[56], T.qualify?.card, 'tiles.qualify.card')
  add(gdc[57], T.qualify?.label, 'tiles.qualify.label')
  add(gdc[58], T.qualify?.value, 'tiles.qualify.value')
  add(gdc[59], T.qualify?.hint, 'tiles.qualify.hint')
  add(gdc[60], T.wins?.card, 'tiles.wins.card')
  add(gdc[61], T.wins?.label, 'tiles.wins.label')
  add(gdc[62], T.wins?.value, 'tiles.wins.value')
  add(gdc[63], T.wins?.hint, 'tiles.wins.hint')

  // 64–69 Chainlink 验证卡
  add(gdc[64], Cl.card, 'chainlink.card')
  add(gdc[65], Cl.icon, 'chainlink.icon')
  add(gdc[66], Cl.title, 'chainlink.title')
  add(gdc[67], Cl.verifyBtn, 'chainlink.verifyBtn')
  add(gdc[68], Cl.verifyText, 'chainlink.verifyText')
  add(gdc[69], Cl.body, 'chainlink.body')

  // 70–134 开奖结果
  add(gdc[70], R.heading, 'results.heading')
  add(gdc[71], R.table, 'results.table')
  add(gdc[72], R.dateBtn, 'results.dateBtn')
  add(gdc[73], R.dateText, 'results.dateText')
  add(gdc[74], R.dateChev, 'results.dateChev')
  add(gdc[75], R.summary, 'results.summary')
  add(gdc[76], R.verifyHash, 'results.verifyHash')
  add(gdc[77], R.extLink, 'results.extLink')
  add(gdc[78], R.sepControls, 'results.sepControls')
  const ths = /** @type {any[]} */ (R.ths ?? [])
  for (let i = 0; i < 4; i++) add(gdc[79 + i], ths[i], `results.th[${i}]`)
  add(gdc[83], R.sepHeader, 'results.sepHeader')
  const rows = /** @type {any[]} */ (R.rows ?? [])
  let gi = 84
  for (let ri = 0; ri < 10; ri++) {
    const row = rows[ri] ?? {}
    add(gdc[gi++], row.rank, `results.row[${ri}].rank`)
    add(gdc[gi++], row.addr, `results.row[${ri}].addr`)
    if (ri === 2) {
      add(gdc[gi++], row.meBadge, `results.row[${ri}].meBadge`)
      add(gdc[gi++], row.meText, `results.row[${ri}].meText`)
    }
    add(gdc[gi++], row.stake, `results.row[${ri}].stake`)
    add(gdc[gi++], row.prize, `results.row[${ri}].prize`)
    if (ri < 9) add(gdc[gi++], row.sep, `results.row[${ri}].sep`)
  }

  // 135–175 历史记录
  add(gdc[135], Hist.heading, 'history.heading')
  add(gdc[136], Hist.table, 'history.table')
  const hThs = /** @type {any[]} */ (Hist.ths ?? [])
  for (let i = 0; i < 4; i++) add(gdc[137 + i], hThs[i], `history.th[${i}]`)
  add(gdc[141], Hist.sepHeader, 'history.sepHeader')
  const hRows = /** @type {any[]} */ (Hist.rows ?? [])
  gi = 142
  for (let ri = 0; ri < 5; ri++) {
    const row = hRows[ri] ?? {}
    add(gdc[gi++], row.date, `history.row[${ri}].date`)
    add(gdc[gi++], row.stake, `history.row[${ri}].stake`)
    add(gdc[gi++], row.badge, `history.row[${ri}].badge`)
    add(gdc[gi++], row.badgeText, `history.row[${ri}].badgeText`)
    add(gdc[gi++], row.hash, `history.row[${ri}].hash`)
    add(gdc[gi++], row.extLink, `history.row[${ri}].extLink`)
    if (ri < 4) add(gdc[gi++], row.sep, `history.row[${ri}].sep`)
  }

  // 176–195 FAQ
  add(gdc[176], F.heading, 'faq.heading')
  const faqItems = /** @type {any[]} */ (F.items ?? [])
  // 第 1 项 FAQ：行、问题、箭头、答案
  {
    const item = faqItems[0] ?? {}
    add(gdc[177], item.row, 'faq[0].row')
    add(gdc[178], item.q, 'faq[0].q')
    add(gdc[179], item.chevron, 'faq[0].chevron')
    add(gdc[180], item.answer, 'faq[0].answer')
  }
  // 第 2–6 项 FAQ：行、问题、箭头
  for (let i = 1; i < 6; i++) {
    const item = faqItems[i] ?? {}
    add(gdc[181 + (i - 1) * 3], item.row, `faq[${i}].row`)
    add(gdc[182 + (i - 1) * 3], item.q, `faq[${i}].q`)
    add(gdc[183 + (i - 1) * 3], item.chevron, `faq[${i}].chevron`)
  }

  if (mapped.length !== gdc.length) {
    throw new Error(`mapLeaves length ${mapped.length} !== inventory ${gdc.length} (gi=${gi})`)
  }
  return mapped
}
