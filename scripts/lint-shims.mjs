#!/usr/bin/env node
/**
 * Validates migration shims are one-line re-exports and tracks removal target (R8-refactor).
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** @type {{ path: string; removeBy: string }[]} */
const SHIMS = []

const SHIM_PATTERN = /^export \* from '~\/[^']+'\s*;?\s*$/

let failed = false

for (const { path, removeBy } of SHIMS) {
  const absolute = resolve(path)
  let content
  try {
    content = readFileSync(absolute, 'utf8').trim()
  } catch {
    console.error(`lint:shims — missing shim: ${path} (remove by ${removeBy})`)
    failed = true
    continue
  }

  if (!SHIM_PATTERN.test(content)) {
    console.error(`lint:shims — invalid shim (expected one-line export *): ${path}`)
    failed = true
  }
}

if (failed) {
  process.exit(1)
}

console.log(`lint:shims — ${SHIMS.length} shims OK`)
