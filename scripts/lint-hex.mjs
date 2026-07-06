#!/usr/bin/env node
/**
 * R2 baseline — hex literals in scoped TS modules must live in shared/styles/theme.ts.
 * Tailwind arbitrary values in TSX are out of scope until Typography/variant pass.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const hexPattern = /#[0-9A-Fa-f]{3,8}\b/g

const allowlist = new Set([
  resolve(projectRoot, 'src/shared/styles/theme.ts'),
])

const scanRoots = [
  resolve(projectRoot, 'src/views/dapp/web3'),
  resolve(projectRoot, 'src/shared/config'),
]

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = resolve(dir, name)
    const stat = statSync(path)
    if (stat.isDirectory()) walk(path, files)
    else if (/\.ts$/.test(name)) files.push(path)
  }
  return files
}

let failed = false

for (const root of scanRoots) {
  for (const file of walk(root)) {
    if (allowlist.has(file)) continue

    const content = readFileSync(file, 'utf8')
    const matches = content.match(hexPattern)
    if (!matches?.length) continue

    failed = true
    console.error(
      `lint:hex — ${relative(projectRoot, file)} contains ${matches.length} hex literal(s); use ~/shared/styles/theme.ts`,
    )
  }
}

if (failed) {
  process.exit(1)
}

console.log('lint:hex — scoped TS modules OK')
