#!/usr/bin/env node
/**
 * Render docs/dapp-data-coverage-matrix.md → docs/dapp-data-coverage-matrix.html
 *
 * Markdown remains SSOT. Regenerates a self-contained review UI (search / filters / sections).
 *
 * Usage: node scripts/render-coverage-matrix.mjs
 *        pnpm docs:matrix
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const srcPath = resolve(root, 'docs/dapp-data-coverage-matrix.md')
const outPath = resolve(root, 'docs/dapp-data-coverage-matrix.html')

const HEADER_TO_KEY = {
  行号: 'id',
  行號: 'id',
  章节: 'chapter',
  章節: 'chapter',
  '页面/表面': 'surface',
  '頁面/表面': 'surface',
  数据或动作: 'datum',
  數據或動作: 'datum',
  '读/写': 'rw',
  '讀/寫': 'rw',
  代码位置: 'code',
  代碼位置: 'code',
  文档位置: 'docs',
  文檔位置: 'docs',
  API接口: 'api',
  权威来源: 'authority',
  權威來源: 'authority',
  是否正确接入: 'status',
  是否正確接入: 'status',
  状态: 'status',
  狀態: 'status',
  T1归因: 't1',
  T1歸因: 't1',
  修复方法: 'fix',
  修復方法: 'fix',
  继承自: 'inherits',
  繼承自: 'inherits',
  证据: 'evidence',
  證據: 'evidence',
  'A/B/C链': 'abc',
  'A/B/C鏈': 'abc',
  备注: 'note',
  備註: 'note',
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** @param {string} line */
function splitRow(line) {
  const raw = line.trim()
  if (!raw.startsWith('|')) return null
  const parts = raw.split('|')
  const cells = parts.slice(1, parts[parts.length - 1] === '' ? -1 : undefined).map((c) => c.trim())
  return cells
}

/** @param {string[]} cells */
function isSeparator(cells) {
  return cells.length > 0 && cells.every((c) => /^[-:\s]+$/.test(c))
}

/**
 * @param {string} md
 * @returns {{ sections: Array<{ title: string, slug: string, meta: string[], rows: Record<string,string>[] }>, rulesHtml: string }}
 */
function parseMatrix(md) {
  const lines = md.split(/\r?\n/)
  /** @type {Array<{ title: string, slug: string, meta: string[], rows: Record<string,string>[] }>} */
  const sections = []
  /** @type {{ title: string, slug: string, meta: string[], rows: Record<string,string>[] } | null} */
  let current = null
  /** @type {'none' | 'table'} */
  let mode = 'none'
  /** @type {string[] | null} */
  let headerKeys = null
  const ruleLines = []
  let inRules = false

  for (const line of lines) {
    const h2 = /^##\s+(.+)$/.exec(line)
    if (h2) {
      const title = h2[1].trim()
      if (title === '规则' || title.startsWith('全局对照源')) {
        inRules = title === '规则'
        mode = 'none'
        headerKeys = null
        current = null
        if (inRules) ruleLines.push(`<h2>${escapeHtml(title)}</h2>`)
        continue
      }
      inRules = false
      const slug = title
        .replace(/[（(].*$/, '')
        .replace(/[^\w\u4e00-\u9fff-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase()
      current = { title, slug: slug || `s-${sections.length}`, meta: [], rows: [] }
      sections.push(current)
      mode = 'none'
      headerKeys = null
      continue
    }

    if (inRules) {
      if (line.startsWith('|')) {
        const cells = splitRow(line)
        if (!cells || isSeparator(cells)) continue
        if (cells[0] === '项' || cells[0] === '行号' || cells[0] === '章') {
          ruleLines.push(`<tr>${cells.map((c) => `<th>${escapeHtml(c)}</th>`).join('')}</tr>`)
        } else {
          ruleLines.push(`<tr>${cells.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`)
        }
      } else if (line.startsWith('###')) {
        ruleLines.push(`<h3>${escapeHtml(line.replace(/^###\s+/, ''))}</h3>`)
      } else if (line.startsWith('- ')) {
        ruleLines.push(`<li>${escapeHtml(line.slice(2))}</li>`)
      } else if (line.trim()) {
        ruleLines.push(`<p>${escapeHtml(line.trim())}</p>`)
      }
      continue
    }

    if (!current) continue

    if (line.startsWith('**') && !line.startsWith('|')) {
      current.meta.push(line.replace(/\*\*/g, '').trim())
      continue
    }

    if (line.startsWith('|')) {
      const cells = splitRow(line)
      if (!cells) continue
      if (isSeparator(cells)) continue
      if (cells[0] === '行号' || cells[0] === '行號') {
        headerKeys = cells.map((h) => HEADER_TO_KEY[h] ?? null)
        mode = 'table'
        continue
      }
      if (mode === 'table' && headerKeys) {
        /** @type {Record<string, string>} */
        const row = {
          id: '',
          chapter: '',
          surface: '',
          datum: '',
          rw: '',
          code: '',
          docs: '',
          api: '',
          authority: '',
          status: '',
          t1: '',
          fix: '',
          inherits: '',
          evidence: '',
          abc: '',
          note: '',
        }
        for (let i = 0; i < headerKeys.length; i++) {
          const key = headerKeys[i]
          if (key) row[key] = cells[i] ?? ''
        }
        // legacy: evidence → code if code empty; authority kept for display fallback
        if (!row.code && row.evidence) row.code = row.evidence
        if (!row.docs && row.authority) row.docs = row.authority
        if (!row.fix) {
          const sc = statusClass(row.status)
          row.fix = sc === 'ok' || sc === 'na' ? '—' : '待核验后补'
        }
        if (/^[A-Z]+-\d+/.test(row.id)) current.rows.push(row)
      }
    }
  }

  let rulesHtml = ''
  let inList = false
  for (const chunk of ruleLines) {
    if (chunk.startsWith('<li>')) {
      if (!inList) {
        rulesHtml += '<ul>'
        inList = true
      }
      rulesHtml += chunk
    } else {
      if (inList) {
        rulesHtml += '</ul>'
        inList = false
      }
      rulesHtml += chunk
    }
  }
  if (inList) rulesHtml += '</ul>'
  rulesHtml = rulesHtml.replace(/(?:<tr>.*?<\/tr>\s*)+/gs, (block) => {
    if (!block.includes('<tr>')) return block
    return `<div class="table-wrap"><table class="rules">${block}</table></div>`
  })

  return { sections, rulesHtml }
}

/** @param {string} status */
function statusClass(status) {
  if (status.includes('✅')) return 'ok'
  if (status.includes('❌')) return 'bad'
  if (status.includes('📘') || status.includes('稿链文案')) return 'copy'
  if (status.includes('🟡') || status.includes('部分')) return 'partial'
  if (status.includes('🔍') || status.includes('待核实')) return 'pending'
  if (status.includes('🚫') || status.includes('阻塞')) return 'blocked'
  if (status.includes('⚪') || status.includes('不适用')) return 'na'
  return 'unknown'
}

/**
 * @param {ReturnType<typeof parseMatrix>} data
 * @param {string} generatedAt
 */
function renderHtml(data, generatedAt) {
  const allRows = data.sections.flatMap((s) => s.rows)
  const counts = {
    total: allRows.length,
    ok: allRows.filter((r) => statusClass(r.status) === 'ok').length,
    bad: allRows.filter((r) => statusClass(r.status) === 'bad').length,
    partial: allRows.filter((r) => statusClass(r.status) === 'partial').length,
    copy: allRows.filter((r) => statusClass(r.status) === 'copy').length,
    pending: allRows.filter((r) => statusClass(r.status) === 'pending').length,
    blocked: allRows.filter((r) => statusClass(r.status) === 'blocked').length,
    na: allRows.filter((r) => statusClass(r.status) === 'na').length,
  }

  const sectionNav = data.sections
    .map(
      (s) =>
        `<a href="#${escapeHtml(s.slug)}" data-section-nav="${escapeHtml(s.slug)}">${escapeHtml(s.title)} <span>${s.rows.length}</span></a>`,
    )
    .join('')

  const sectionsHtml = data.sections
    .map((s) => {
      const rows = s.rows
        .map((r) => {
          const sc = statusClass(r.status)
          const fix = r.fix || '—'
          const fixHot = fix !== '—' && fix !== ''
          const search = [
            r.id,
            r.chapter,
            r.surface,
            r.datum,
            r.rw,
            r.code,
            r.docs,
            r.api,
            r.authority,
            r.status,
            r.t1,
            fix,
            r.inherits,
            r.evidence,
            r.abc,
            r.note,
          ]
            .join(' ')
            .toLowerCase()
          return `<article class="row" data-status="${sc}" data-section="${escapeHtml(s.slug)}" data-search="${escapeHtml(search)}">
  <button type="button" class="row-main" aria-expanded="false">
    <span class="id mono">${escapeHtml(r.id)}</span>
    <span class="surface">${escapeHtml(r.surface)}</span>
    <span class="datum">${escapeHtml(r.datum)}</span>
    <span class="rw pill">${escapeHtml(r.rw)}</span>
    <span class="status badge ${sc}">${escapeHtml(r.status)}</span>
    <span class="chev" aria-hidden="true"></span>
  </button>
  <div class="row-detail" hidden>
    <dl>
      <div><dt>章节</dt><dd>${escapeHtml(r.chapter)}</dd></div>
      <div><dt>T1 归因</dt><dd>${escapeHtml(r.t1)}</dd></div>
      <div><dt>继承自</dt><dd>${escapeHtml(r.inherits)}</dd></div>
      <div><dt>A/B/C 链</dt><dd>${escapeHtml(r.abc)}</dd></div>
      <div class="wide"><dt>代码位置</dt><dd>${escapeHtml(r.code || r.evidence || '—')}</dd></div>
      <div class="wide"><dt>文档位置</dt><dd>${escapeHtml(r.docs || r.authority || '—')}</dd></div>
      <div class="wide"><dt>API 接口</dt><dd>${escapeHtml(r.api || '—')}</dd></div>
      <div class="wide${fixHot ? ' fix-hot' : ''}"><dt>修复方法</dt><dd>${escapeHtml(fix)}</dd></div>
      <div class="wide"><dt>备注</dt><dd>${escapeHtml(r.note)}</dd></div>
    </dl>
  </div>
</article>`
        })
        .join('\n')

      const meta = s.meta.map((m) => `<p class="meta">${escapeHtml(m)}</p>`).join('')
      return `<section class="chapter" id="${escapeHtml(s.slug)}" data-section="${escapeHtml(s.slug)}">
  <header class="chapter-head">
    <h2>${escapeHtml(s.title)}</h2>
    <span class="count">${rows.length ? s.rows.length : 0}</span>
  </header>
  ${meta}
  <div class="rows">${rows}</div>
</section>`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Dapp 数据覆盖矩阵</title>
<style>
  :root {
    --bg: #12141a;
    --bg-elev: #1a1d26;
    --bg-row: #161922;
    --bg-row-hover: #1e2330;
    --line: #2a3140;
    --text: #e8eaef;
    --muted: #8b93a7;
    --faint: #5c657a;
    --accent: #d4a35a;
    --accent-dim: rgba(212, 163, 90, 0.14);
    --ok: #3dba7e;
    --ok-bg: rgba(61, 186, 126, 0.12);
    --bad: #e85d5d;
    --bad-bg: rgba(232, 93, 93, 0.12);
    --partial: #e0a84c;
    --partial-bg: rgba(224, 168, 76, 0.14);
    --copy: #5ec8c0;
    --copy-bg: rgba(94, 200, 192, 0.14);
    --pending: #6b9fff;
    --pending-bg: rgba(107, 159, 255, 0.12);
    --blocked: #c77dff;
    --blocked-bg: rgba(199, 125, 255, 0.14);
    --na: #7a8296;
    --na-bg: rgba(122, 130, 150, 0.12);
    --radius: 12px;
    --font: "IBM Plex Sans", "Segoe UI", "PingFang SC", "Noto Sans SC", sans-serif;
    --mono: "IBM Plex Mono", "SF Mono", Menlo, Consolas, monospace;
    --shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    font-family: var(--font);
    background:
      radial-gradient(1200px 600px at 10% -10%, rgba(212, 163, 90, 0.08), transparent 55%),
      radial-gradient(900px 500px at 100% 0%, rgba(107, 159, 255, 0.06), transparent 50%),
      var(--bg);
    color: var(--text);
    line-height: 1.45;
    min-height: 100vh;
  }

  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }

  .shell {
    max-width: 1180px;
    margin: 0 auto;
    padding: 28px 20px 80px;
  }

  .hero {
    display: grid;
    gap: 18px;
    margin-bottom: 22px;
  }
  .hero h1 {
    margin: 0;
    font-size: clamp(1.6rem, 3vw, 2.15rem);
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  .hero .lede {
    margin: 0;
    color: var(--muted);
    max-width: 62ch;
    font-size: 0.98rem;
  }
  .hero .ssot {
    font-size: 0.85rem;
    color: var(--faint);
  }

  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .stat {
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    background: var(--bg-elev);
    border: 1px solid var(--line);
    font-size: 0.85rem;
    color: var(--muted);
  }
  .stat strong {
    color: var(--text);
    font-variant-numeric: tabular-nums;
    font-size: 1rem;
  }
  .stat.ok strong { color: var(--ok); }
  .stat.bad strong { color: var(--bad); }
  .stat.partial strong { color: var(--partial); }
  .stat.copy strong { color: var(--copy); }
  .stat.pending strong { color: var(--pending); }
  .stat.blocked strong { color: var(--blocked); }
  .stat.na strong { color: var(--na); }

  .toolbar {
    position: sticky;
    top: 0;
    z-index: 20;
    display: grid;
    gap: 12px;
    padding: 14px 0 12px;
    margin: 0 0 18px;
    background: linear-gradient(180deg, rgba(18, 20, 26, 0.96) 60%, rgba(18, 20, 26, 0.75) 100%);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--line);
  }

  .toolbar-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .search {
    flex: 1 1 220px;
    min-width: 180px;
    position: relative;
  }
  .search input {
    width: 100%;
    appearance: none;
    border: 1px solid var(--line);
    background: var(--bg-elev);
    color: var(--text);
    border-radius: 10px;
    padding: 11px 14px 11px 38px;
    font: inherit;
    font-size: 0.95rem;
    outline: none;
  }
  .search input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-dim);
  }
  .search::before {
    content: "";
    position: absolute;
    left: 14px;
    top: 50%;
    width: 14px;
    height: 14px;
    transform: translateY(-50%);
    border: 2px solid var(--faint);
    border-radius: 50%;
    box-shadow: 6px 6px 0 -5px var(--faint);
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .filters button {
    appearance: none;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--muted);
    border-radius: 999px;
    padding: 7px 12px;
    font: inherit;
    font-size: 0.82rem;
    cursor: pointer;
  }
  .filters button[aria-pressed="true"] {
    color: var(--text);
    border-color: transparent;
  }
  .filters button[data-filter="all"][aria-pressed="true"] {
    background: var(--accent-dim);
    color: var(--accent);
  }
  .filters button[data-filter="ok"][aria-pressed="true"] { background: var(--ok-bg); color: var(--ok); }
  .filters button[data-filter="bad"][aria-pressed="true"] { background: var(--bad-bg); color: var(--bad); }
  .filters button[data-filter="partial"][aria-pressed="true"] { background: var(--partial-bg); color: var(--partial); }
  .filters button[data-filter="copy"][aria-pressed="true"] { background: var(--copy-bg); color: var(--copy); }
  .filters button[data-filter="pending"][aria-pressed="true"] { background: var(--pending-bg); color: var(--pending); }
  .filters button[data-filter="blocked"][aria-pressed="true"] { background: var(--blocked-bg); color: var(--blocked); }
  .filters button[data-filter="na"][aria-pressed="true"] { background: var(--na-bg); color: var(--na); }

  .match-count {
    margin-left: auto;
    color: var(--faint);
    font-size: 0.82rem;
    font-variant-numeric: tabular-nums;
  }

  .toc {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
    scrollbar-width: thin;
  }
  .toc a {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 11px;
    border-radius: 8px;
    background: var(--bg-elev);
    border: 1px solid var(--line);
    color: var(--muted);
    font-size: 0.78rem;
    text-decoration: none;
    white-space: nowrap;
  }
  .toc a span {
    font-variant-numeric: tabular-nums;
    color: var(--faint);
  }
  .toc a:hover { color: var(--text); border-color: var(--accent); }

  .rules-panel {
    margin: 0 0 28px;
    padding: 18px 20px;
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }
  .rules-panel h2 { margin: 0 0 12px; font-size: 1.05rem; }
  .rules-panel h3 { margin: 16px 0 8px; font-size: 0.92rem; color: var(--accent); }
  .rules-panel p, .rules-panel li { color: var(--muted); font-size: 0.9rem; }
  .rules-panel ul { margin: 0; padding-left: 1.2rem; }
  .table-wrap { overflow-x: auto; margin: 10px 0; }
  table.rules {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }
  table.rules th, table.rules td {
    border-bottom: 1px solid var(--line);
    padding: 8px 10px;
    text-align: left;
    vertical-align: top;
  }
  table.rules th { color: var(--faint); font-weight: 500; }

  .chapter {
    margin: 0 0 28px;
    scroll-margin-top: 120px;
  }
  .chapter[hidden], .chapter.is-empty { display: none; }
  .chapter-head {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin: 0 0 10px;
  }
  .chapter-head h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .chapter-head .count {
    color: var(--faint);
    font-variant-numeric: tabular-nums;
    font-size: 0.85rem;
  }
  .meta {
    margin: 0 0 6px;
    color: var(--faint);
    font-size: 0.82rem;
  }

  .rows {
    display: grid;
    gap: 6px;
  }

  .row {
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--bg-row);
    overflow: hidden;
  }
  .row[hidden] { display: none; }
  .row.is-open { background: var(--bg-row-hover); border-color: #3a4358; }

  .row-main {
    width: 100%;
    display: grid;
    grid-template-columns: 72px minmax(120px, 1.1fr) minmax(140px, 1.4fr) 56px 88px 18px;
    gap: 10px;
    align-items: center;
    padding: 12px 14px;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .row-main:hover { background: rgba(255,255,255,0.02); }

  .mono { font-family: var(--mono); font-size: 0.8rem; color: var(--accent); }
  .surface { font-size: 0.88rem; color: var(--text); }
  .datum { font-size: 0.86rem; color: var(--muted); }
  .pill {
    display: inline-flex;
    justify-content: center;
    padding: 3px 8px;
    border-radius: 999px;
    border: 1px solid var(--line);
    font-size: 0.72rem;
    color: var(--muted);
    white-space: nowrap;
  }
  .badge {
    display: inline-flex;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    white-space: nowrap;
  }
  .badge.ok { background: var(--ok-bg); color: var(--ok); }
  .badge.bad { background: var(--bad-bg); color: var(--bad); }
  .badge.partial { background: var(--partial-bg); color: var(--partial); }
  .badge.copy { background: var(--copy-bg); color: var(--copy); }
  .badge.pending { background: var(--pending-bg); color: var(--pending); }
  .badge.blocked { background: var(--blocked-bg); color: var(--blocked); }
  .badge.na { background: var(--na-bg); color: var(--na); }
  .fix-hot dd { color: #ffb4a2; }

  .chev {
    width: 8px;
    height: 8px;
    border-right: 2px solid var(--faint);
    border-bottom: 2px solid var(--faint);
    transform: rotate(-45deg);
    transition: transform 0.15s ease;
    justify-self: end;
  }
  .row.is-open .chev { transform: rotate(45deg); }

  .row-detail {
    border-top: 1px solid var(--line);
    padding: 12px 14px 16px;
    background: rgba(0,0,0,0.18);
  }
  .row-detail dl {
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 18px;
  }
  .row-detail .wide { grid-column: 1 / -1; }
  .row-detail dt {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--faint);
    margin-bottom: 4px;
  }
  .row-detail dd {
    margin: 0;
    font-size: 0.88rem;
    color: var(--muted);
    word-break: break-word;
  }

  .empty {
    display: none;
    margin: 40px 0;
    text-align: center;
    color: var(--faint);
  }
  .empty.show { display: block; }

  footer.gen {
    margin-top: 36px;
    padding-top: 16px;
    border-top: 1px solid var(--line);
    color: var(--faint);
    font-size: 0.78rem;
  }

  @media (max-width: 860px) {
    .row-main {
      grid-template-columns: 64px 1fr 80px 16px;
      grid-template-areas:
        "id surface status chev"
        "id datum datum chev";
    }
    .id { grid-area: id; }
    .surface { grid-area: surface; }
    .datum { grid-area: datum; }
    .status { grid-area: status; justify-self: end; }
    .chev { grid-area: chev; }
    .rw { display: none; }
    .row-detail dl { grid-template-columns: 1fr; }
  }
</style>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="shell">
    <header class="hero">
      <div>
        <h1>Dapp 数据覆盖矩阵</h1>
        <p class="lede">动态数据与写路径对齐的现行结论。点开一行查看代码 / 文档 / API / 修复方法；用搜索与状态筛缺口。</p>
        <p class="ssot">SSOT：<a href="./dapp-data-coverage-matrix.md">dapp-data-coverage-matrix.md</a>
          · 规则：<a href="./decisions/dapp-data-coverage-matrix-wayfinder.md">wayfinder</a>
          · 重生：<code>pnpm docs:matrix</code></p>
      </div>
      <div class="stats" aria-label="状态汇总">
        <div class="stat"><span>合计</span><strong>${counts.total}</strong></div>
        <div class="stat ok"><span>✅</span><strong>${counts.ok}</strong></div>
        <div class="stat bad"><span>❌</span><strong>${counts.bad}</strong></div>
        <div class="stat partial"><span>🟡</span><strong>${counts.partial}</strong></div>
        <div class="stat copy"><span>📘</span><strong>${counts.copy}</strong></div>
        <div class="stat pending"><span>🔍</span><strong>${counts.pending}</strong></div>
        <div class="stat blocked"><span>🚫</span><strong>${counts.blocked}</strong></div>
        <div class="stat na"><span>⚪</span><strong>${counts.na}</strong></div>
      </div>
    </header>

    <div class="toolbar">
      <div class="toolbar-row">
        <label class="search"><input id="q" type="search" placeholder="搜索行号、表面、代码、API、修复…" autocomplete="off" /></label>
        <div class="filters" role="group" aria-label="按接入状态筛选">
          <button type="button" data-filter="all" aria-pressed="true">全部</button>
          <button type="button" data-filter="ok" aria-pressed="false">✅</button>
          <button type="button" data-filter="bad" aria-pressed="false">❌</button>
          <button type="button" data-filter="partial" aria-pressed="false">🟡</button>
          <button type="button" data-filter="copy" aria-pressed="false">📘</button>
          <button type="button" data-filter="pending" aria-pressed="false">🔍</button>
          <button type="button" data-filter="blocked" aria-pressed="false">🚫</button>
          <button type="button" data-filter="na" aria-pressed="false">⚪</button>
          <button type="button" data-filter="gap" aria-pressed="false">仅缺口</button>
        </div>
        <div class="match-count" id="matchCount"></div>
      </div>
      <nav class="toc" aria-label="章节">${sectionNav}</nav>
    </div>

    <details class="rules-panel">
      <summary style="cursor:pointer;font-weight:600;margin-bottom:8px">规则（可展开）</summary>
      ${data.rulesHtml}
    </details>

    <div id="chapters">${sectionsHtml}</div>
    <p class="empty" id="empty">没有匹配的行。试试清空筛选或换关键词。</p>

    <footer class="gen">由 <code>scripts/render-coverage-matrix.mjs</code> 生成于 ${escapeHtml(generatedAt)}。请勿手改本 HTML；改 md 后运行 <code>pnpm docs:matrix</code>。</footer>
  </div>
<script>
(() => {
  const q = document.getElementById('q');
  const matchCount = document.getElementById('matchCount');
  const empty = document.getElementById('empty');
  const rows = [...document.querySelectorAll('.row')];
  const chapters = [...document.querySelectorAll('.chapter')];
  const filterBtns = [...document.querySelectorAll('.filters [data-filter]')];
  let statusFilter = 'all';

  function apply() {
    const needle = (q.value || '').trim().toLowerCase();
    let visible = 0;
    for (const row of rows) {
      const st = row.dataset.status;
      const statusOk =
        statusFilter === 'all' ||
        (statusFilter === 'gap' ? st !== 'ok' && st !== 'na' : st === statusFilter);
      const textOk = !needle || (row.dataset.search || '').includes(needle);
      const show = statusOk && textOk;
      row.hidden = !show;
      if (show) visible += 1;
    }
    for (const ch of chapters) {
      const any = [...ch.querySelectorAll('.row')].some((r) => !r.hidden);
      ch.classList.toggle('is-empty', !any);
    }
    matchCount.textContent = '显示 ' + visible + ' / ${counts.total}';
    empty.classList.toggle('show', visible === 0);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      statusFilter = btn.dataset.filter;
      filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      apply();
    });
  });
  q.addEventListener('input', apply);

  document.getElementById('chapters').addEventListener('click', (e) => {
    const main = e.target.closest('.row-main');
    if (!main) return;
    const row = main.closest('.row');
    const detail = row.querySelector('.row-detail');
    const open = row.classList.toggle('is-open');
    main.setAttribute('aria-expanded', String(open));
    detail.hidden = !open;
  });

  apply();
})();
</script>
</body>
</html>
`
}

function main() {
  const md = readFileSync(srcPath, 'utf8')
  const data = parseMatrix(md)
  const total = data.sections.reduce((n, s) => n + s.rows.length, 0)
  if (total < 100) {
    console.error(`Parsed only ${total} rows — aborting (expected ~400+).`)
    process.exit(1)
  }
  const html = renderHtml(data, new Date().toISOString())
  writeFileSync(outPath, html, 'utf8')
  console.log(`✓ Wrote ${outPath}`)
  console.log(`  sections=${data.sections.length} rows=${total}`)
}

main()
