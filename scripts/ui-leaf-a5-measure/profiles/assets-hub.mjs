/**
 * Assets Hub 的 A5 测量配置。
 *
 * 输入清单与输出文件放在 `tmp/ui-leaf-measure/`（本地自备 JSON，不把 `.scratch` 当唯一来源）。
 * 页面快照 JS 返回结构化数据包，`mapLeaves` 按清单顺序与测量节点对齐。
 * 新增页面时复制本配置，再写 `*.page.js` 与 `mapLeaves`。
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '../../..')

/**
 * 把仓库根目录下的相对路径解析为绝对路径，供读取资产总览清单与输出。
 *
 * @param {string} rel 仓库根目录下的相对路径
 */
function abs(rel) {
  return join(repoRoot, rel)
}

export const profile = {
  id: 'assets-hub',
  url: 'http://127.0.0.1:5174/zh/app.html#assets',
  session: 'a5-assets-hub',
  inventory: abs('tmp/ui-leaf-measure/206-gdc-merged.json'),
  out: abs('tmp/ui-leaf-measure/206-assets-hub-measure-full.json'),
  pageSnapshotPath: join(here, 'assets-hub.page.js'),
  viewport: { width: 1920, height: 1080 },
  /** 等到详情列「资产总览」可见再采（防语言层/未进 tab） */
  waitUntilReadyJs: `(() => {
    const has = (t) => [...document.querySelectorAll('h2,span,p')].some(e => (e.textContent||'').trim() === t);
    return has('资产总览') && has('持仓分布') && [...document.querySelectorAll('article')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 300 && r.width < 380 && (el.textContent||'').includes('0.00%');
    }).length >= 4;
  })()`,
  /** @returns {string} */
  loadPageSnapshotJs() {
    return readFileSync(this.pageSnapshotPath, 'utf8')
  },
}

/**
 * 按资产 Hub 清单顺序取页面快照节点，产出等长测量映射。
 *
 * 映射数量必须等于清单长度，否则说明页面结构或清单发生了变化。
 *
 * @param {Array<{ nodeId: string, kind: string, name: string, w?: number, h?: number, gdc_w?: number, gdc_h?: number, spec?: string }>} gdc 设计清单条目
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
  const modes = /** @type {any[]} */ (page.modes ?? [])
  const O = /** @type {any} */ (page.overview)
  const Ho = /** @type {any} */ (page.holdings)
  const B = /** @type {any} */ (page.buffer)
  const D = /** @type {any} */ (page.distribution)
  const R = /** @type {any} */ (page.rebase)
  const F = /** @type {any} */ (page.faq)
  const faqItems = F?.items ?? []

  add(gdc[0], H.title, 'header.title')
  add(gdc[1], H.subtitle, 'header.subtitle')
  add(gdc[2], H.settingsBtn, 'header.settingsBtn')
  add(gdc[3], H.settingsIcon, 'header.settingsIcon')
  add(gdc[4], H.menuBtn, 'header.menuBtn')
  add(gdc[5], H.menuIcon, 'header.menuIcon')

  const modeKeys = [
    'card',
    'icon',
    'title',
    'apr',
    'info',
    'posLab',
    'yldLab',
    'posVal',
    'yldVal',
    'posApprox',
    'yldApprox',
  ]
  let gi = 6
  for (let mi = 0; mi < 4; mi++) {
    const pack = modes[mi] ?? {}
    for (const key of modeKeys) {
      add(gdc[gi], pack[key], `mode[${mi}].${key}`)
      gi += 1
    }
  }

  add(gdc[50], O.title, 'overview.title')
  add(gdc[51], O.card, 'overview.card')
  add(gdc[52], O.deco, 'overview.deco')
  add(gdc[53], O.totalLab, 'overview.totalLab')
  add(gdc[54], O.info, 'overview.info')
  add(gdc[55], O.main, 'overview.main')
  add(gdc[56], O.claimLab, 'overview.claimLab')
  add(gdc[57], O.gagx?.[0] ?? O.strongs?.[1], 'overview.claimVal')
  add(gdc[58], O.approx?.[0], 'overview.claimApprox')
  add(gdc[59], O.claimedLab, 'overview.claimedLab')
  add(gdc[60], O.gagx?.[1] ?? O.strongs?.[2], 'overview.claimedVal')
  add(gdc[61], O.approx?.[1], 'overview.claimedApprox')
  add(gdc[62], O.contribLab, 'overview.contribLab')
  add(gdc[63], O.strongs?.[3] ?? O.strongs?.at?.(-1), 'overview.contribVal')
  add(gdc[64], O.contribHint, 'overview.contribHint')

  add(gdc[65], Ho.card, 'holdings.card')
  add(gdc[66], Ho.title, 'holdings.title')
  add(gdc[67], Ho.released ?? Ho.labs?.[0], 'holdings.released')
  add(gdc[68], Ho.token, 'holdings.token')
  add(gdc[69], Ho.strongs?.[0], 'holdings.releasedVal')
  add(gdc[70], Ho.approx?.[0], 'holdings.releasedApprox')
  add(gdc[71], Ho.totalLab ?? Ho.labs?.[1], 'holdings.totalLab')
  add(gdc[72], Ho.strongs?.[1], 'holdings.totalVal')
  add(gdc[73], Ho.approx?.[1], 'holdings.totalApprox')

  add(gdc[74], B.card, 'buffer.card')
  add(gdc[75], B.title, 'buffer.title')
  add(gdc[76], B.swapWrap ?? B.swapBtn, 'buffer.swapWrap')
  add(gdc[77], B.swapIcon, 'buffer.swapIcon')
  add(gdc[78], B.assetLab, 'buffer.assetLab')
  add(gdc[79], B.labs?.[0], 'buffer.totalLab')
  add(gdc[80], B.token, 'buffer.token')
  add(gdc[81], B.strongs?.[0], 'buffer.totalVal')
  add(gdc[82], B.approx?.[0], 'buffer.totalApprox')
  add(gdc[83], B.labs?.[1], 'buffer.releasedLab')
  add(gdc[84], B.strongs?.[1], 'buffer.releasedVal')
  add(gdc[85], B.approx?.[1], 'buffer.releasedApprox')

  add(gdc[86], D.title, 'dist.title')
  add(gdc[87], D.emptyShell, 'dist.emptyShell')
  add(gdc[88], D.emptyText, 'dist.emptyText')

  add(gdc[89], R.title, 'rebase.title')
  add(gdc[90], R.subtitle, 'rebase.subtitle')
  add(gdc[91], R.card, 'rebase.card')
  add(gdc[92], R.line, 'rebase.line')
  for (let i = 0; i < 4; i++) {
    add(gdc[93 + i], R.dots?.[i], `rebase.dot[${i}]`)
  }
  const st = R.stepTitles ?? []
  const sb = R.stepBodies ?? []
  add(gdc[97], st[0], 'rebase.stepTitle0')
  add(gdc[98], sb[0], 'rebase.stepBody0')
  add(gdc[99], st[1], 'rebase.stepTitle1')
  add(gdc[100], sb[1], 'rebase.stepBody1')
  add(gdc[101], st[2], 'rebase.stepTitle2')
  add(gdc[102], sb[2], 'rebase.stepBody2')
  add(gdc[103], st[3], 'rebase.stepTitle3')
  add(gdc[104], sb[3], 'rebase.stepBody3')
  add(gdc[105], R.tagsBar, 'rebase.tagsBar')
  const tt = R.tagTexts ?? []
  const tc = R.tagChecks ?? []
  let ti = 106
  for (let i = 0; i < 4; i++) {
    add(gdc[ti++], tc[i], `rebase.tagCheck[${i}]`)
    add(gdc[ti++], tt[i], `rebase.tagText[${i}]`)
  }
  add(gdc[114], R.footer, 'rebase.footer')

  add(gdc[115], F.title, 'faq.title')
  let fi = 116
  for (let i = 0; i < 8; i++) {
    const item = faqItems[i] ?? {}
    add(gdc[fi++], item.row, `faq[${i}].row`)
    add(gdc[fi++], item.q, `faq[${i}].q`)
    add(gdc[fi++], item.chevron, `faq[${i}].chevron`)
  }

  if (mapped.length !== gdc.length) {
    throw new Error(`mapLeaves length ${mapped.length} !== inventory ${gdc.length}`)
  }
  return mapped
}
