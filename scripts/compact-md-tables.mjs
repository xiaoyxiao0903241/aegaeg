#!/usr/bin/env node
/**
 * Compact markdown tables: strip cell padding / aligned separators.
 * Skips onchain-manual* (入仓只读拷贝，禁止改写).
 *
 * Usage: node scripts/compact-md-tables.mjs [--dry]
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dry = process.argv.includes('--dry')

/** @param {string} dir */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === '.git') continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

/** @param {string} line */
function isTableLine(line) {
  const t = line.trim()
  return t.startsWith('|') && t.includes('|', 1)
}

/** @param {string} line */
function compactTableLine(line) {
  const trimmed = line.trimEnd()
  if (!trimmed.startsWith('|')) return line
  const parts = trimmed.split('|')
  // edge empties from leading/trailing pipes
  const inner = parts.slice(1, parts[parts.length - 1] === '' ? -1 : undefined)
  const cells = inner.map((c) => c.trim())
  const isSep = cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c))
  if (isSep) {
    return `|${cells.map(() => '---').join('|')}|`
  }
  return `|${cells.join('|')}|`
}

/** @param {string} text */
function compactMarkdown(text) {
  const lines = text.split(/\r?\n/)
  let changed = false
  const next = lines.map((line) => {
    if (!isTableLine(line)) return line
    const compact = compactTableLine(line)
    if (compact !== line) changed = true
    return compact
  })
  return { text: next.join('\n'), changed }
}

function skipPath(rel) {
  if (rel.startsWith('docs/onchain-manual/') || rel === 'docs/onchain-manual-legacy.md') {
    return true
  }
  return false
}

const files = walk(root).filter((p) => {
  const rel = relative(root, p)
  return !skipPath(rel)
})

let n = 0
for (const file of files) {
  const before = readFileSync(file, 'utf8')
  const { text, changed } = compactMarkdown(before)
  if (!changed) continue
  n += 1
  const rel = relative(root, file)
  if (dry) {
    console.log(`would compact: ${rel}`)
  } else {
    writeFileSync(file, text)
    console.log(`compacted: ${rel}`)
  }
}
console.log(`${dry ? 'would touch' : 'updated'} ${n} files`)
