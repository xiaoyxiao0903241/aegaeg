#!/usr/bin/env node
/**
 * Staging / Prod 切换（Vite 加载顺序：.env → .env.local，后者覆盖前者）
 *
 * - .env        = prod（完整配置，含 thirdweb / RPC / prod 合约）
 * - .env.local  = staging 覆盖（存在时生效；删除后回退 .env prod）
 *
 * Usage:
 *   pnpm env:staging
 *   pnpm env:prod
 *   pnpm env:status
 */

import { copyFileSync, existsSync, unlinkSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const stagingTemplate = resolve(root, 'env/staging.local')
const envLocal = resolve(root, '.env.local')
const envProd = resolve(root, '.env')

function usage() {
  console.log(`Usage: pnpm env:<staging|prod|status>

  pnpm env:staging   env/staging.local → .env.local（staging 覆盖 prod）
  pnpm env:prod      删除 .env.local（仅 .env prod 生效）
  pnpm env:status    查看当前模式`)
}

function ensureProdEnv() {
  if (!existsSync(envProd)) {
    console.warn(`⚠ 未找到 ${envProd}，请先复制 .env.example 并填入 thirdweb Client ID。`)
  }
}

function switchStaging() {
  if (!existsSync(stagingTemplate)) {
    console.error(`Missing staging template: ${stagingTemplate}`)
    process.exit(1)
  }
  ensureProdEnv()
  copyFileSync(stagingTemplate, envLocal)
  console.log('✓ Active: staging')
  console.log(`  ${stagingTemplate}`)
  console.log(`  → ${envLocal}`)
  console.log('  (.env.local 覆盖 .env 中的 API / 合约)')
  console.log('\nRestart `pnpm dev` if it is already running.')
}

function switchProd() {
  ensureProdEnv()
  if (existsSync(envLocal)) {
    unlinkSync(envLocal)
    console.log('✓ Active: prod')
    console.log(`  已删除 ${envLocal}`)
  } else {
    console.log('✓ Active: prod（.env.local 不存在，已在 prod 模式）')
  }
  console.log('  仅 .env 生效')
  console.log('\nRestart `pnpm dev` if it is already running.')
}

function showStatus() {
  const staging = existsSync(envLocal)
  console.log(`Active: ${staging ? 'staging' : 'prod'}`)
  console.log(`  .env       ${existsSync(envProd) ? '✓' : '✗ missing'}`)
  console.log(`  .env.local ${staging ? '✓ (staging overrides)' : '— (not present)'}`)
}

const arg = process.argv[2]

if (!arg || arg === '--help' || arg === '-h') {
  usage()
  process.exit(arg ? 0 : 1)
}

if (arg === 'staging') switchStaging()
else if (arg === 'prod') switchProd()
else if (arg === 'status') showStatus()
else {
  console.error(`Unknown profile "${arg}". Expected: staging | prod | status`)
  usage()
  process.exit(1)
}
