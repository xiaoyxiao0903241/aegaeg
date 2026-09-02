import fsSync from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createServer } from 'vite'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/**
 * 单测 SSR 与 Vite 文档序对齐：`.env` → `.env.local`（后者覆盖）。
 * IDE/shell 预注入的 `process.env.VITE_*` 会盖过 `.env.local`，导致 contracts 漂移失败。
 */
function applyViteFileEnvToProcess() {
  const merged = {}
  for (const name of ['.env', '.env.local']) {
    const filePath = path.join(projectRoot, name)
    if (!fsSync.existsSync(filePath)) continue
    for (const line of fsSync.readFileSync(filePath, 'utf8').split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex === -1) continue
      const key = trimmed.slice(0, separatorIndex)
      if (!key.startsWith('VITE_')) continue
      merged[key] = trimmed.slice(separatorIndex + 1).trim()
    }
  }
  for (const [key, value] of Object.entries(merged)) {
    process.env[key] = value
  }
}

const testServerConfig = {
  root: projectRoot,
  configFile: false,
  appType: 'custom',
  logLevel: 'error',
  optimizeDeps: { noDiscovery: true },
  resolve: {
    alias: {
      '~': path.join(projectRoot, 'src'),
      '@tanstack/react-query': path.join(projectRoot, 'node_modules/@tanstack/react-query'),
    },
    dedupe: ['@tanstack/react-query', 'react', 'react-dom'],
  },
  server: {
    hmr: false,
    ws: false,
    middlewareMode: true,
    watch: null,
  },
}

let testServerPromise = null

/** 与 `test:unit` 的 `--test-isolation=none` 配套：全套单测共用一台 Vite。 */
export async function getTestViteServer() {
  if (!testServerPromise) {
    applyViteFileEnvToProcess()
    testServerPromise = createServer(testServerConfig)
  }
  return testServerPromise
}

export async function loadModule(specifier) {
  const server = await getTestViteServer()
  return server.ssrLoadModule(specifier)
}

export async function closeTestViteServer() {
  if (!testServerPromise) return
  const server = await testServerPromise.catch(() => null)
  testServerPromise = null
  if (server) {
    await server.close()
  }
}

if (!globalThis.__aegisTestViteCleanupRegistered) {
  globalThis.__aegisTestViteCleanupRegistered = true
  // isolation=none 下不能 test.after()：会在第一个测试文件结束时关掉共用 Vite。
  process.once('beforeExit', () => {
    void closeTestViteServer()
  })
}
