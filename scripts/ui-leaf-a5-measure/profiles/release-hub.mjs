/**
 * Release Hub (`#release` · PC `4298:212`) A5 profile.
 *
 * Inventory/out: `tmp/ui-leaf-measure/`（自备 JSON；禁 `.scratch` SSOT）
 * Order = `221-release-hub-min-leaves.md` 全表.
 * Left: ReleaseHubWidget · Right: ReleaseHubContent
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
  id: 'release-hub',
  url: 'http://127.0.0.1:5175/zh/app.html#release',
  session: 'a5-rh-1785781532',
  inventory: abs('tmp/ui-leaf-measure/221-gdc-a5-inventory.json'),
  out: abs('tmp/ui-leaf-measure/221-release-hub-measure-full.json'),
  pageSnapshotPath: join(here, 'release-hub.page.js'),
  viewport: { width: 1920, height: 1080 },
  waitUntilReadyJs: `(() => {
    // 引导浮层会抢走「释放」文案 / 挡 header → 先点「跳过」
    const skip = [...document.querySelectorAll('button,[data-onboarding-tooltip] button')].find(
      (b) => (b.textContent || '').trim() === '跳过',
    );
    if (skip) skip.click();
    // WebBridge CDP 无法钉 iw（本机会停在 2880）→ 钉 rem=16，避免 site-fluid 整页 2×
    document.documentElement.classList.remove('site-fluid');
    document.documentElement.style.setProperty('font-size', '16px', 'important');
    // 收合 FAQ：每轮只对仍 open 的点一次；勿用 sticky flag（异步未关时会永久跳过 click）
    for (const item of document.querySelectorAll('[data-faq-item][data-state="open"]')) {
      item.querySelector('[data-faq-trigger],button')?.click?.();
    }
    const openLeft = document.querySelectorAll('[data-faq-item][data-state="open"]').length;
    const hasOnboarding = !!document.querySelector('[data-onboarding-tooltip]');
    const widget = document.querySelector('[data-dapp-widget-panel]');
    const hasH1 = [...(widget?.querySelectorAll('h1') || [])].some(
      (e) => (e.textContent || '').trim() === '释放',
    );
    const has = (t) => [...document.querySelectorAll('h1,h2,h3,span,p')].some(e => (e.textContent||'').trim() === t);
    const queue = document.querySelector('[data-slot-id="release-pool-card"]');
    const buffer = document.querySelector('[data-slot-id="buffer-pool-card"]');
    const remOk = Math.abs(parseFloat(getComputedStyle(document.documentElement).fontSize) - 16) < 0.5;
    return (
      remOk &&
      !hasOnboarding &&
      openLeft === 0 &&
      hasH1 &&
      has('释放池') &&
      has('缓冲池') &&
      has('关于释放') &&
      has('收益领取机制') &&
      !!queue &&
      !!buffer
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

  const H = /** @type {any} */ (page.header ?? {})
  const Q = /** @type {any} */ (page.queue ?? {})
  const B = /** @type {any} */ (page.buffer ?? {})
  const A = /** @type {any} */ (page.about ?? {})
  const M = /** @type {any} */ (page.mechanism ?? {})
  const F = /** @type {any} */ (page.faq ?? {})
  const S = /** @type {any} */ (page.shell ?? {})
  const steps = /** @type {any[]} */ (M.steps ?? [])
  const periods = /** @type {any[]} */ (M.periods ?? [])
  const rates = /** @type {any[]} */ (M.rates ?? [])
  const faqItems = /** @type {any[]} */ (F.items ?? [])

  // 0–3 left-header
  add(gdc[0], H.title, 'header.title')
  add(gdc[1], H.subtitle, 'header.subtitle')
  add(gdc[2], H.menu, 'header.menu')
  add(gdc[3], H.menuIcon, 'header.menuIcon')

  // 4–13 queue card
  add(gdc[4], Q.card, 'queue.card')
  add(gdc[5], Q.icon, 'queue.icon')
  add(gdc[6], Q.title, 'queue.title')
  add(gdc[7], Q.pct, 'queue.pct')
  add(gdc[8], Q.releasingLab, 'queue.releasingLab')
  add(gdc[9], Q.releasedLab, 'queue.releasedLab')
  add(gdc[10], Q.amountL, 'queue.amountL')
  add(gdc[11], Q.amountR, 'queue.amountR')
  add(gdc[12], Q.approxL, 'queue.approxL')
  add(gdc[13], Q.approxR, 'queue.approxR')

  // 14–25 buffer card
  add(gdc[14], B.card, 'buffer.card')
  add(gdc[15], B.icon, 'buffer.icon')
  add(gdc[16], B.title, 'buffer.title')
  add(gdc[17], B.pct, 'buffer.pct')
  add(gdc[18], B.totalAgx, 'buffer.totalAgx')
  add(gdc[19], B.gagx, 'buffer.gagx')
  add(gdc[20], B.approxL, 'buffer.approxL')
  add(gdc[21], B.approxR, 'buffer.approxR')
  add(gdc[22], B.releasedLabL, 'buffer.releasedLabL')
  add(gdc[23], B.releasedAmtL, 'buffer.releasedAmtL')
  add(gdc[24], B.releasedLabR, 'buffer.releasedLabR')
  add(gdc[25], B.releasedAmtR, 'buffer.releasedAmtR')

  // 26–30 about（DappAboutCard chrome；deco 本页无 decoSrc → 可 locate_fail）
  add(gdc[26], A.heading, 'about.heading')
  add(gdc[27], A.slide, 'about.slide')
  add(gdc[28], A.slideTitle, 'about.slideTitle')
  add(gdc[29], A.slideBody, 'about.slideBody')
  add(gdc[30], A.deco, 'about.deco')

  // 31–66 mechanism
  add(gdc[31], M.heading, 'mechanism.heading')
  add(gdc[32], M.body, 'mechanism.body')
  add(gdc[33], M.card, 'mechanism.card')
  add(gdc[34], M.connector, 'mechanism.connector')
  add(gdc[35], steps[0]?.title, 'mechanism.step[0].title')
  add(gdc[36], steps[0]?.body, 'mechanism.step[0].body')
  add(gdc[37], steps[1]?.title, 'mechanism.step[1].title')
  add(gdc[38], steps[1]?.body, 'mechanism.step[1].body')
  add(gdc[39], steps[2]?.title, 'mechanism.step[2].title')
  add(gdc[40], steps[2]?.body, 'mechanism.step[2].body')
  add(gdc[41], steps[3]?.title, 'mechanism.step[3].title')
  add(gdc[42], steps[3]?.body, 'mechanism.step[3].body')
  add(gdc[43], steps[0]?.badge, 'mechanism.step[0].badge')
  add(gdc[44], steps[0]?.badgeText, 'mechanism.step[0].badgeText')
  add(gdc[45], steps[1]?.badge, 'mechanism.step[1].badge')
  add(gdc[46], steps[1]?.badgeText, 'mechanism.step[1].badgeText')
  add(gdc[47], steps[2]?.badge, 'mechanism.step[2].badge')
  add(gdc[48], steps[2]?.badgeText, 'mechanism.step[2].badgeText')
  add(gdc[49], steps[3]?.badge, 'mechanism.step[3].badge')
  add(gdc[50], steps[3]?.badgeText, 'mechanism.step[3].badgeText')
  add(gdc[51], M.divider, 'mechanism.divider')
  add(gdc[52], M.purposeTitle, 'mechanism.purposeTitle')
  add(gdc[53], M.purposeBody, 'mechanism.purposeBody')
  add(gdc[54], M.taxTitle, 'mechanism.taxTitle')
  add(gdc[55], M.taxHighlight20, 'mechanism.taxHighlight20')
  add(gdc[56], M.taxHighlight60, 'mechanism.taxHighlight60')
  add(gdc[57], M.taxPeriod, 'mechanism.taxPeriod')
  add(gdc[58], periods[0], 'mechanism.period[0]')
  add(gdc[59], periods[1], 'mechanism.period[1]')
  add(gdc[60], periods[2], 'mechanism.period[2]')
  add(gdc[61], periods[3], 'mechanism.period[3]')
  add(gdc[62], M.taxRate, 'mechanism.taxRate')
  add(gdc[63], rates[0], 'mechanism.rate[0]')
  add(gdc[64], rates[1], 'mechanism.rate[1]')
  add(gdc[65], rates[2], 'mechanism.rate[2]')
  add(gdc[66], rates[3], 'mechanism.rate[3]')

  // 67–82 FAQ（Faq 展开 5× row/q/chevron）
  add(gdc[67], F.heading, 'faq.heading')
  for (let i = 0; i < 5; i++) {
    const item = faqItems[i] ?? {}
    add(gdc[68 + i * 3], item.row, `faq[${i}].row`)
    add(gdc[69 + i * 3], item.q, `faq[${i}].q`)
    add(gdc[70 + i * 3], item.chevron, `faq[${i}].chevron`)
  }

  // 83–84 chrome（shell border；无独立 rect → locate_fail OK）
  add(gdc[83], S.dividerL, 'shell.dividerL')
  add(gdc[84], S.dividerR, 'shell.dividerR')

  if (mapped.length !== gdc.length) {
    throw new Error(`mapLeaves length ${mapped.length} !== inventory ${gdc.length}`)
  }
  return mapped
}
