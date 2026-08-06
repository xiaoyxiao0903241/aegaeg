/**
 * Community Hub 的 A5 测量配置，优先按子项切片。
 *
 * 输入清单与输出文件放在 `tmp/ui-leaf-measure/`（本地自备 JSON，不把 `.scratch` 当唯一来源）。
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '../../..')

/**
 * 把仓库根目录下的相对路径解析为本地绝对路径，供读取清单与输出文件。
 *
 * @param {string} rel 仓库根目录下的相对路径
 */
function abs(rel) {
  return join(repoRoot, rel)
}

export const profile = {
  id: 'community-hub',
  url: 'http://127.0.0.1:5175/zh/app.html#community',
  session: 'a5-community-224',
  inventory: abs('tmp/ui-leaf-measure/224-gdc-a5-inventory.json'),
  out: abs('tmp/ui-leaf-measure/224-community-hub-measure-full.json'),
  pageSnapshotPath: join(here, 'community-hub.page.js'),
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
    const remOk = Math.abs(parseFloat(getComputedStyle(document.documentElement).fontSize) - 16) < 0.5;
    const has = (t) =>
      [...document.querySelectorAll('h1,h2,h3,span,p')].some((e) => (e.textContent || '').trim() === t);
    return remOk && has('社区') && (has('我的社区') || has('开始邀请 · 共享生态成长价值'));
  })()`,
  /** @returns {string} */
  loadPageSnapshotJs() {
    return readFileSync(this.pageSnapshotPath, 'utf8')
  },
}

/**
 * 按清单节点 id 把页面快照数据映射为测量结果。
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

  for (const leaf of gdc) {
    const id = leaf.nodeId
    if (id === '4300:365') add(leaf, page.referralLink, 'referral-link')
    else if (id === '4300:370') add(leaf, page.inviterCard, 'inviter-card')
    else if (id === '4300:372') add(leaf, page.inviterAvatar, 'inviter-avatar')
    else if (id === '4300:374') add(leaf, page.inviterCopy, 'inviter-copy')
    else if (id === '4301:212') add(leaf, page.myCommunityHeading, 'my-community-h')
    else if (id === '4301:213') add(leaf, page.statDirect, 'stat-direct')
    else if (id === '4301:217') add(leaf, page.statTeam, 'stat-team')
    else if (id === '4301:221') add(leaf, page.statRank, 'stat-rank')
    else if (id === '4301:226') add(leaf, page.inviteSteps, 'invite-steps')
    else if (id === '4301:241') add(leaf, page.programsHeading, 'programs-h')
    else if (id === '4301:242') add(leaf, page.programGenesis, 'program-genesis')
    else if (id === '4794:3825') add(leaf, page.programAcademy, 'program-academy')
    else if (id === '4301:252') add(leaf, page.membersHeading, 'members-h')
    else if (id === '4301:253') add(leaf, page.membersEmpty, 'members-empty')
    else if (id === '4301:255') add(leaf, page.faqHeading, 'faq-h')
    else add(leaf, null, `unmapped:${id}`)
  }
  return mapped
}
