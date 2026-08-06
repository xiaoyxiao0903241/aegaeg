/**
 * Rewards Hub 的 A5 测量配置。
 *
 * 输入清单与输出文件放在 `tmp/ui-leaf-measure/`（本地自备 JSON，不把 `.scratch` 当唯一来源）。
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '../../..')

/**
 * 把仓库根目录下的相对路径解析为本地绝对路径，供读写奖励总览测量文件。
 *
 * @param {string} rel 仓库根目录下的相对路径
 */
function abs(rel) {
  return join(repoRoot, rel)
}

export const profile = {
  id: 'rewards-hub',
  url: 'http://127.0.0.1:5174/zh/app.html#rewards',
  session: 'a5-rewards-hub',
  inventory: abs('tmp/ui-leaf-measure/213-gdc-merged.json'),
  out: abs('tmp/ui-leaf-measure/213-rewards-hub-measure-full.json'),
  pageSnapshotPath: join(here, 'rewards-hub.page.js'),
  viewport: { width: 1920, height: 1080 },
  waitUntilReadyJs: `(() => {
    for (const item of document.querySelectorAll('[data-faq-item][data-state="open"]')) {
      const trigger = item.querySelector('[data-faq-trigger],button');
      trigger?.click?.();
    }
    const openLeft = document.querySelectorAll('[data-faq-item][data-state="open"]').length;
    const has = (t) => [...document.querySelectorAll('h1,h2,span,p')].some(e => (e.textContent||'').trim() === t);
    const modes = [...document.querySelectorAll('button')].filter(el => {
      const r = el.getBoundingClientRect();
      const spans = [...el.querySelectorAll('span,p')].map(s => (s.textContent||'').trim());
      return r.width > 300 && r.width < 400 && r.height > 90 && spans.some(s => /幸运奖|推荐奖|参与奖/.test(s));
    });
    return openLeft === 0 && has('奖励') && has('总奖励') && has('关于AEGIS X奖励') && modes.length >= 3;
  })()`,
  /** @returns {string} */
  loadPageSnapshotJs() {
    return readFileSync(this.pageSnapshotPath, 'utf8')
  },
}

/**
 * 按奖励 Hub 清单顺序取页面快照节点，产出等长测量映射。
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
  const modes = /** @type {any[]} */ (page.modes ?? [])
  const T = /** @type {any} */ (page.tiles ?? {})
  const A = /** @type {any} */ (page.about ?? {})
  const M = /** @type {any} */ (page.mechanism ?? {})
  const F = /** @type {any} */ (page.faq ?? {})
  const S = /** @type {any} */ (page.shell ?? {})

  // 0–5 左栏标题（设置按钮当前页面未实现，清单允许定位失败）
  add(gdc[0], H.title, 'header.title')
  add(gdc[1], H.subtitle, 'header.subtitle')
  add(gdc[2], H.settings, 'header.settings')
  add(gdc[3], H.settingsIcon, 'header.settingsIcon')
  add(gdc[4], H.menu, 'header.menu')
  add(gdc[5], H.menuIcon, 'header.menuIcon')

  // 6–50：六个奖励入口卡（前五张 7 项，创世卡 10 项）
  const simpleModeKeys = ['card', 'icon', 'title', 'body', 'bal', 'amount', 'approx']
  let gi = 6
  for (let mi = 0; mi < 5; mi++) {
    const pack = modes[mi] ?? {}
    for (const key of simpleModeKeys) {
      add(gdc[gi++], pack[key], `mode[${mi}].${key}`)
    }
  }
  {
    const pack = modes[5] ?? {}
    const genesisKeys = [
      'card',
      'icon',
      'title',
      'badge',
      'badgeText',
      'body',
      'bal',
      'amount',
      'claim',
      'claimIcon',
    ]
    for (const key of genesisKeys) {
      add(gdc[gi++], pack[key], `mode[5].${key}`)
    }
  }

  // 51–78 数据卡
  const tileOrder = [
    { id: 'total', keys: ['card', 'label', 'dot', 'value', 'approx'] },
    { id: 'tier', keys: ['card', 'label', 'value', 'deco'] },
    { id: 'personal', keys: ['card', 'label', 'usd', 'agx'] },
    { id: 'making', keys: ['card', 'label', 'usd', 'agx'] },
    { id: 'small', keys: ['card', 'label', 'usd', 'agx'] },
    { id: 'contrib', keys: ['card', 'label', 'pill', 'pillText', 'pillIcon', 'usd', 'hint'] },
  ]
  for (const { id, keys } of tileOrder) {
    const pack = T[id] ?? {}
    for (const key of keys) {
      add(gdc[gi++], pack[key], `tile.${id}.${key}`)
    }
  }

  // 79–90 关于区
  add(gdc[gi++], A.heading, 'about.heading')
  add(gdc[gi++], A.slide, 'about.slide')
  add(gdc[gi++], A.slideTitle, 'about.slideTitle')
  add(gdc[gi++], A.slideBody, 'about.slideBody')
  add(gdc[gi++], A.wash, 'about.wash')
  add(gdc[gi++], A.mascot, 'about.mascot')
  add(gdc[gi++], A.prev, 'about.prev')
  const dots = /** @type {any[]} */ (A.dots ?? [])
  add(gdc[gi++], dots[0], 'about.dot[0]')
  add(gdc[gi++], dots[1], 'about.dot[1]')
  add(gdc[gi++], dots[2], 'about.dot[2]')
  add(gdc[gi++], dots[3], 'about.dot[3]')
  add(gdc[gi++], A.next, 'about.next')

  // 91–172 机制表
  add(gdc[gi++], M.heading, 'mechanism.heading')
  add(gdc[gi++], M.body, 'mechanism.body')
  add(gdc[gi++], M.tableCard, 'mechanism.tableCard')
  const ths = /** @type {any[]} */ (M.ths ?? [])
  for (let i = 0; i < 5; i++) add(gdc[gi++], ths[i], `mechanism.th[${i}]`)

  const rows = /** @type {any[]} */ (M.rows ?? [])
  // A1–A3：等级行 + 4 个单元格
  for (let ri = 0; ri < 3; ri++) {
    const row = rows[ri] ?? {}
    add(gdc[gi++], row.level, `mechanism.row[${ri}].level`)
    const cells = /** @type {any[]} */ (row.cells ?? [])
    for (let ci = 0; ci < 4; ci++) add(gdc[gi++], cells[ci], `mechanism.row[${ri}].c${ci}`)
  }
  // A4：等级 + 徽标 + 徽标文案 + 4 个单元格（cells 不含等级）
  {
    const row = rows[3] ?? {}
    const cells = /** @type {any[]} */ (row.cells ?? [])
    add(gdc[gi++], row.level, 'mechanism.row[3].level')
    add(gdc[gi++], M.currentBadge, 'mechanism.currentBadge')
    add(gdc[gi++], M.currentBadgeText, 'mechanism.currentBadgeText')
    for (let ci = 0; ci < 4; ci++) add(gdc[gi++], cells[ci], `mechanism.row[3].c${ci}`)
  }
  // A5–A13：等级行 + 4 个单元格（共 9 行）
  for (let ri = 4; ri < 13; ri++) {
    const row = rows[ri] ?? {}
    add(gdc[gi++], row.level, `mechanism.row[${ri}].level`)
    const cells = /** @type {any[]} */ (row.cells ?? [])
    for (let ci = 0; ci < 4; ci++) add(gdc[gi++], cells[ci], `mechanism.row[${ri}].c${ci}`)
  }
  // 终身成就：等级行 + 4 个单元格，末格拆分后可能为 [holding, accounts, team, rate130, globalDiv]
  {
    const row = rows[13] ?? {}
    const cells = /** @type {any[]} */ (row.cells ?? [])
    add(gdc[gi++], row.level, 'mechanism.row[13].level')
    for (let ci = 0; ci < 3; ci++) add(gdc[gi++], cells[ci], `mechanism.row[13].c${ci}`)
    add(gdc[gi++], cells[3], 'mechanism.row[13].rate')
    add(gdc[gi++], M.globalDiv || cells[4], 'mechanism.globalDiv')
  }
  add(gdc[gi++], M.footer, 'mechanism.footer')

  // 173–188 FAQ
  add(gdc[gi++], F.heading, 'faq.heading')
  const faqItems = /** @type {any[]} */ (F.items ?? [])
  for (let i = 0; i < 5; i++) {
    const item = faqItems[i] ?? {}
    add(gdc[gi++], item.row, `faq[${i}].row`)
    add(gdc[gi++], item.q, `faq[${i}].q`)
    add(gdc[gi++], item.chevron, `faq[${i}].chevron`)
  }

  // 189–190 页面分隔外观
  add(gdc[gi++], S.dividerL, 'shell.dividerL')
  add(gdc[gi++], S.dividerR, 'shell.dividerR')

  if (mapped.length !== gdc.length) {
    throw new Error(`mapLeaves length ${mapped.length} !== inventory ${gdc.length} (gi=${gi})`)
  }
  return mapped
}
