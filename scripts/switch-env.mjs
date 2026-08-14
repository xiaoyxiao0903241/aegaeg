#!/usr/bin/env node
/**
 * Staging / Prod 环境切换
 *
 * 入库真源（完整键 + 密钥）：
 *   env/prod.env
 *   env/staging.env
 *
 * 每次切换都整份拷贝，不靠 Vite 叠层补键：
 *   .env       ← env/prod.env
 *   .env.local ← staging 用 env/staging.env；prod 用 env/prod.env
 */

import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const examplePath = resolve(root, '.env.example')
const prodTemplate = resolve(root, 'env/prod.env')
const stagingTemplate = resolve(root, 'env/staging.env')
const envProd = resolve(root, '.env')
const envLocal = resolve(root, '.env.local')
const activeFile = resolve(root, 'env/.active')

function usage() {
  console.log(`Usage: pnpm env:<staging|prod|status>

  pnpm env:staging   写入完整 .env（prod）+ 完整 .env.local（staging）
  pnpm env:prod      写入完整 .env 与 .env.local（均为 prod）
  pnpm env:status    查看当前模式`)
}

function parseEnvValues(text) {
  const values = {}
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue
    values[trimmed.slice(0, separatorIndex)] = trimmed.slice(separatorIndex + 1).trim()
  }
  return values
}

function catalogKeys() {
  if (!existsSync(examplePath)) {
    console.error(`Missing catalog: ${examplePath}`)
    process.exit(1)
  }
  return Object.keys(parseEnvValues(readFileSync(examplePath, 'utf8')))
}

function assertComplete(label, filePath) {
  if (!existsSync(filePath)) {
    console.error(`Missing ${label}: ${filePath}`)
    process.exit(1)
  }
  const values = parseEnvValues(readFileSync(filePath, 'utf8'))
  const missing = []
  const empty = []
  for (const key of catalogKeys()) {
    if (!(key in values)) missing.push(key)
    else if (!values[key]) empty.push(key)
  }
  if (missing.length === 0 && empty.length === 0) return
  if (missing.length) console.error(`${label} missing keys:\n  ${missing.join('\n  ')}`)
  if (empty.length) console.error(`${label} empty keys:\n  ${empty.join('\n  ')}`)
  process.exit(1)
}

function writeProfile(profile) {
  assertComplete('env/prod.env', prodTemplate)
  assertComplete('env/staging.env', stagingTemplate)
  copyFileSync(prodTemplate, envProd)
  copyFileSync(profile === 'staging' ? stagingTemplate : prodTemplate, envLocal)
  writeFileSync(activeFile, `${profile}\n`)
  console.log(`✓ Active: ${profile}`)
  console.log(`  .env       ← env/prod.env`)
  console.log(
    profile === 'staging' ? `  .env.local ← env/staging.env` : `  .env.local ← env/prod.env`,
  )
  console.log('\nRestart `pnpm dev` if it is already running.')
}

function showStatus() {
  const active = existsSync(activeFile)
    ? readFileSync(activeFile, 'utf8').trim()
    : existsSync(envLocal)
      ? 'staging?'
      : 'prod'
  console.log(`Active: ${active}`)
  console.log(`  .env       ${existsSync(envProd) ? '✓' : '✗ missing'}`)
  console.log(`  .env.local ${existsSync(envLocal) ? '✓' : '✗ missing'}`)
}

const arg = process.argv[2]

if (!arg || arg === '--help' || arg === '-h') {
  usage()
  process.exit(arg ? 0 : 1)
}

if (arg === 'staging') writeProfile('staging')
else if (arg === 'prod') writeProfile('prod')
else if (arg === 'status') showStatus()
else {
  console.error(`Unknown profile "${arg}". Expected: staging | prod | status`)
  usage()
  process.exit(1)
}
