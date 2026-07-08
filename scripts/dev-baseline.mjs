#!/usr/bin/env node
/**
 * 启动 dev 分支基线 dev server（4175）。
 * worktree SSOT：/private/tmp/aegis-dev-baseline（branch dev）
 *
 * 启动前把当前仓库的 `.env` / `.env.local` 同步到 worktree，
 * 保证 4175 与 5174 使用同一套合约 / API / RPC（否则同钱包数据会分叉）。
 *
 * 用法：pnpm dev:baseline
 * 或：  node scripts/dev-baseline.mjs
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASELINE = process.env.AEGIS_DEV_BASELINE ?? '/private/tmp/aegis-dev-baseline'
const PORT = process.env.AEGIS_DEV_BASELINE_PORT ?? '4175'
const HOST = process.env.AEGIS_DEV_BASELINE_HOST ?? '127.0.0.1'

if (!fs.existsSync(path.join(BASELINE, 'package.json'))) {
  console.error(
    `缺少 baseline worktree：${BASELINE}\n` +
      '创建：git worktree add /private/tmp/aegis-dev-baseline dev\n' +
      '然后：cd /private/tmp/aegis-dev-baseline && pnpm install',
  )
  process.exit(1)
}

/** Copy env files from current repo → baseline worktree (never commit secrets). */
function syncEnvFiles() {
  const skip = process.env.AEGIS_DEV_BASELINE_SKIP_ENV_SYNC === '1'
  if (skip) {
    console.log('[dev:baseline] skip env sync (AEGIS_DEV_BASELINE_SKIP_ENV_SYNC=1)')
    return
  }
  for (const name of ['.env', '.env.local']) {
    const src = path.join(ROOT, name)
    const dest = path.join(BASELINE, name)
    if (!fs.existsSync(src)) {
      console.warn(`[dev:baseline] missing ${name} in repo — baseline may use code fallbacks`)
      continue
    }
    fs.copyFileSync(src, dest)
    console.log(`[dev:baseline] synced ${name} → worktree`)
  }
}

syncEnvFiles()

console.log(`[dev:baseline] ${BASELINE} → http://${HOST}:${PORT}/`)
const child = spawn(
  'pnpm',
  ['dev', '--host', HOST, '--port', PORT, '--strictPort'],
  { cwd: BASELINE, stdio: 'inherit', env: process.env },
)

child.on('exit', (code) => process.exit(code ?? 0))
