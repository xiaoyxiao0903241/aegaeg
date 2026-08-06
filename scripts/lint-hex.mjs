#!/usr/bin/env node
/**
 * 检查受限 TS 模块中的十六进制颜色字面量。
 *
 * 基线要求：`src/web3` 与 `src/shared/config` 的颜色只能来自
 * `src/shared/styles/theme.ts`。TSX 内的 Tailwind 任意值暂不在此脚本范围内。
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const hexPattern = /#[0-9A-Fa-f]{3,8}\b/g

const allowlist = new Set([resolve(projectRoot, 'src/shared/styles/theme.ts')])

const scanRoots = [resolve(projectRoot, 'src/web3'), resolve(projectRoot, 'src/shared/config')]

/**
 * 递归收集目录下的 `.ts` 文件。
 *
 * @param {string} dir 起始目录
 * @param {string[]} files 已收集的文件路径
 * @returns {string[]} 文件路径列表
 */
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
