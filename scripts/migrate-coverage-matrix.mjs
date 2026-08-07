#!/usr/bin/env node
/**
 * Migrate docs/dapp-data-coverage-matrix.md → 14-col schema + Chinese chapters + emoji status.
 * Output tables are compact (no padded columns).
 *
 * Usage: node scripts/migrate-coverage-matrix.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const path = resolve(root, 'docs/dapp-data-coverage-matrix.md')

const CHAPTER = {
  'host+shared': '宿主',
  host: '宿主',
  staking: '质押',
  rewards: '奖励',
  release: '释放',
  exchange: '兑换',
  assets: '资产',
  community: '社区',
  genesis: '共建',
  code: '反查',
  'code 反查': '反查',
}

const SECTION_TITLE = {
  '1. host + shared（`H-`）': '1. 宿主与公共壳（H-）',
  '2. staking（`S-`）': '2. 质押（S-）',
  '3. rewards（`W-`）': '3. 奖励（W-）',
  '4. release（`L-`）': '4. 释放（L-）',
  '5. exchange（`X-`）': '5. 兑换（X-）',
  '6. assets（`A-`）': '6. 资产（A-）',
  '7. community（`CM-`）': '7. 社区（CM-）',
  '8. genesis（`GN-`）': '8. 共建（GN-）',
  '9. code 反查附录（`Z-`）': '9. 代码反查附录（Z-）',
}

const PREFIX_CHAPTER = {
  H: '宿主',
  S: '质押',
  W: '奖励',
  L: '释放',
  X: '兑换',
  A: '资产',
  CM: '社区',
  GN: '共建',
  Z: '反查',
}

/** @param {string} status */
function mapStatus(status) {
  const s = status.trim()
  if (s.includes('✅')) return '✅ 已对齐'
  if (s.includes('❌')) return '❌ 未接入'
  if (s.includes('部分')) return '🟡 部分'
  if (s.includes('待核实')) return '🔍 待核实'
  if (s.includes('不适用')) return '⚪ 不适用'
  if (s.includes('🚫') || s.includes('阻塞')) return '🚫 阻塞'
  return s || '🔍 待核实'
}

/** @param {string} authority */
function splitAuthority(authority) {
  const a = authority.trim()
  if (!a || a === '—') return { docs: '—', api: '—' }
  const apiBits = []
  const docBits = []
  for (const part of a
    .split(/[；;]/)
    .map((p) => p.trim())
    .filter(Boolean)) {
    if (
      /^\/[a-z0-9_\-/{}.]+/i.test(part) ||
      /^(GET|POST|PUT|PATCH|DELETE)\s+\//i.test(part) ||
      /API\s*[`']?\/|`\/[a-z]/i.test(part) ||
      part.includes('/auth/') ||
      part.includes('/team/') ||
      part.includes('/staking') ||
      part.includes('/reward') ||
      part.includes('/asset') ||
      part.includes('/presale') ||
      part.includes('/exchange') ||
      part.includes('`/ ')
    ) {
      apiBits.push(part.replace(/^API\s+/i, ''))
    } else if (/手册|AGENTS|Figma|UI 基线|i18n|OpenAPI|backend-api|onchain|§/.test(part)) {
      docBits.push(part)
    } else if (part.startsWith('`') && part.includes('/')) {
      // ambiguous path-like — prefer docs if looks like file, else keep docs
      docBits.push(part)
    } else {
      docBits.push(part)
    }
  }
  // second pass: extract explicit API paths from mixed strings
  const apiFromDocs = []
  const docsClean = []
  for (const d of docBits) {
    const m = d.match(/API\s+(`[^`]+`|\/[a-zA-Z0-9_\-/{}.]+)/)
    if (m) {
      apiFromDocs.push(m[1].replace(/`/g, ''))
      const rest = d
        .replace(m[0], '')
        .trim()
        .replace(/^[；;·\s]+|[；;·\s]+$/g, '')
      if (rest) docsClean.push(rest)
    } else {
      docsClean.push(d)
    }
  }
  const api = [...apiBits, ...apiFromDocs].filter(Boolean)
  const docs = docsClean.filter(Boolean)
  return {
    docs: docs.length ? docs.join('；') : '—',
    api: api.length ? api.join('；') : '—',
  }
}

/** @param {string} line */
function splitRow(line) {
  const parts = line.trim().split('|')
  return parts.slice(1, parts[parts.length - 1] === '' ? -1 : undefined).map((c) => c.trim())
}

/** @param {string[]} cells */
function rowLine(cells) {
  return `|${cells.map((c) => String(c).trim()).join('|')}|`
}

const NEW_HEADER = [
  '行号',
  '章节',
  '页面/表面',
  '数据或动作',
  '读/写',
  '代码位置',
  '文档位置',
  'API接口',
  '状态',
  'T1归因',
  '修复方法',
  '继承自',
  'A/B/C链',
  '备注',
]

const md = readFileSync(path, 'utf8')
const lines = md.split(/\r?\n/)
const out = []

const rulesBlock = `# Dapp 数据覆盖矩阵

> **SSOT**：dapp 动态数据 / 写路径对齐的现行结论（覆盖证明 + 缺口队列）。
> 规则锁定：[\`docs/decisions/dapp-data-coverage-matrix-wayfinder.md\`](./decisions/dapp-data-coverage-matrix-wayfinder.md)
> 对照源目录：[\`docs/research/dapp-tab-source-index.md\`](./research/dapp-tab-source-index.md)
> 可读页：[\`dapp-data-coverage-matrix.html\`](./dapp-data-coverage-matrix.html)（改本文件后跑 \`pnpm docs:matrix\` 重生）

本文件只记**当前状态**。更新时重读最新手册 / API / 代码后改行；不保留过程史。
表行为精简 \`|cell|\` 写法，**禁止**按列宽对齐（Prettier 不格式化 \`*.md\`）。

## 规则

|项|值|
|---|---|
|范围|dapp 全功能；不含 home；宿主专章 = \`host\` + \`views/dapp/shared\`|
|盘点|UI+Code 双扫；动态位 = Num+Copy（Visible+FAQ）|
|粒度|读 = 字段级；写 = 动作级（门闸 / 预检 / 成功后刷新）|
|UI 基线|**控件布局与可见文案** = Figma PC 验收帧（[\`figma-pages.md\`](./figma-pages.md)）；已实现优先仅作落地次序，**不以离稿实现覆盖稿**；无稿才 HTML 原型|
|数/写 SSOT|金额算法、门闸、刷新 = 链上手册 / API；与 UI 文案分层|
|稿链冲突|可见文案/单位标签**先保留稿面**；T1=\`文案/单位与链不匹配（稿如此）\`；修复默认 **改稿（Figma+i18n）对齐链，或产品确认保留稿面**；**禁止** FE 默认离稿改 i18n|
|读源优先|**overview / summary** 与同页 **API 表聚合/标题** → 采纳 API；仅当字段无同口径 API、属链余额/仓位时才链优先；API 仅作无钱包回退|
|缺数展示|金额/数量**未取到显 \`0\`** → T1=\`设计取舍（缺数显0）\`，状态 **\`✅ 已对齐\`**（视为正确）；**禁止**改成诚实空 \`—\`；仅无字段的指标才 \`—\`/\`⚪\`|
|证据杠|金钱相关：Prod 只读核实后才可 \`✅ 已对齐\`；写路径不真发交易|
|完成门闩|Complete-known（允许 \`🔍 待核实\`，须写原因与下一步）|
|缺口|\`状态\` ≠ \`✅ 已对齐\` / \`⚪ 不适用\` 的行即现行缺口；缺口行 \`修复方法\` 必填|

### 列

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

### 行号前缀

|章|前缀|
|---|---|
|宿主与公共壳|\`H-\`|
|质押|\`S-\`|
|奖励|\`W-\`|
|释放|\`L-\`|
|兑换|\`X-\`|
|资产|\`A-\`|
|社区|\`CM-\`|
|共建|\`GN-\`|
|代码反查附录|\`Z-\`|

### 状态

\`✅ 已对齐\` · \`❌ 未接入\` · \`🟡 部分\` · \`🔍 待核实\` · \`⚪ 不适用\` · \`🚫 阻塞\`

### T1 归因

- 链/手册/API 未提供
- 手册或API与链不符
- 手册↔API打架
- FE 读源/算法/门闸/刷新错误
- FE 缺接线
- 文案/单位与链不匹配（稿如此）
- 设计取舍（故意空/0）
- 设计取舍（缺数显0）
- 待核实

（\`✅ 已对齐\` / \`⚪ 不适用\` 行 T1 默认 \`—\`；例外：\`设计取舍（缺数显0）\` 可标在 ✅ 行。缺口行须填 \`修复方法\`。）

## 全局对照源

见 [\`research/dapp-tab-source-index.md\`](./research/dapp-tab-source-index.md)。

---
`

out.push(rulesBlock.trimEnd())
out.push('')

let i = 0
// skip until first ## numbered section
while (i < lines.length) {
  const h2 = /^##\s+(.+)$/.exec(lines[i])
  if (h2 && /^[0-9]+\./.test(h2[1].trim())) break
  i += 1
}

while (i < lines.length) {
  const line = lines[i]
  const h2 = /^##\s+(.+)$/.exec(line)
  if (h2) {
    const rawTitle = h2[1].trim()
    const title =
      SECTION_TITLE[rawTitle] ??
      rawTitle
        .replace('host + shared', '宿主与公共壳')
        .replace('staking', '质押')
        .replace('rewards', '奖励')
        .replace('release', '释放')
        .replace('exchange', '兑换')
        .replace('assets', '资产')
        .replace('community', '社区')
        .replace('genesis', '共建')
        .replace('code 反查附录', '代码反查附录')
    out.push(`## ${title}`)
    i += 1
    continue
  }

  if (line.startsWith('**') && !line.startsWith('|')) {
    out.push(line)
    i += 1
    continue
  }

  if (line.startsWith('|')) {
    const cells = splitRow(line)
    if (cells[0] === '行号' || cells[0] === '行號') {
      out.push(rowLine(NEW_HEADER))
      out.push(rowLine(NEW_HEADER.map(() => '---')))
      i += 1
      // skip old separator if next
      if (i < lines.length && splitRow(lines[i]).every((c) => /^[-:\s]+$/.test(c))) i += 1
      continue
    }
    if (cells.every((c) => /^[-:\s]+$/.test(c))) {
      i += 1
      continue
    }
    if (/^[A-Z]+-\d+/.test(cells[0] ?? '')) {
      // old: id, chapter, surface, datum, rw, authority, status, t1, inherits, evidence, abc, note
      const [
        id,
        chapter,
        surface,
        datum,
        rw,
        authority,
        status,
        t1,
        inherits,
        evidence,
        abc,
        note,
      ] = [...cells, ...Array(12).fill('')].slice(0, 12)

      const prefix = id.split('-')[0]
      const chapterZh = PREFIX_CHAPTER[prefix] ?? CHAPTER[chapter.trim()] ?? chapter.trim() ?? '—'
      const { docs, api } = splitAuthority(authority)
      const statusNew = mapStatus(status)
      const isGap = !statusNew.startsWith('✅') && !statusNew.startsWith('⚪')
      const fix = isGap ? '待核验后补：对照代码/手册写清修复步骤或解阻条件' : '—'

      out.push(
        rowLine([
          id,
          chapterZh,
          surface,
          datum,
          rw,
          evidence || '—',
          docs,
          api === '—' && /API|\/[a-z]/.test(authority) ? authority : api,
          statusNew,
          t1 || '—',
          fix,
          inherits || '—',
          abc || '—',
          note || '—',
        ]),
      )
      i += 1
      continue
    }
  }

  // blank or other
  if (line.trim() === '' && out[out.length - 1] === '') {
    i += 1
    continue
  }
  // skip old rules already rewritten
  if (line.startsWith('# ') || line.startsWith('## 规则') || line.startsWith('## 全局')) {
    i += 1
    continue
  }
  out.push(line)
  i += 1
}

writeFileSync(path, `${out.join('\n').replace(/\n{3,}/g, '\n\n')}\n`)
console.log(`migrated ${path}`)
