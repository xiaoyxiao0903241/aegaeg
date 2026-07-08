#!/usr/bin/env node
/**
 * 启动 dev 分支基线 dev server（4175）。
 * worktree SSOT：/private/tmp/aegis-dev-baseline（branch dev）
 *
 * 用法：pnpm dev:baseline
 * 或：  node scripts/dev-baseline.mjs
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

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

console.log(`[dev:baseline] ${BASELINE} → http://${HOST}:${PORT}/`)
const child = spawn(
  'pnpm',
  ['dev', '--host', HOST, '--port', PORT, '--strictPort'],
  { cwd: BASELINE, stdio: 'inherit', env: process.env },
)

child.on('exit', (code) => process.exit(code ?? 0))
