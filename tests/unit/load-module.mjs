import fsSync from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { createServer } from 'vite'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const testCacheRoot = path.join(projectRoot, '.scratch', 'vite-test')

/** 每 worker 独立 Vite cache（.scratch，勿进 node_modules），避免并行抢 deps。 */
function getTestCacheDir() {
  return path.join(testCacheRoot, String(process.pid))
}

function isPidAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    // EPERM：进程存在但无权限探测，视为仍存活，勿删。
    return error?.code === 'EPERM'
  }
}

/** 关掉 server 后删本 worker 的 cache，防止残留堆盘。 */
async function removeTestCacheDir() {
  await fs.rm(getTestCacheDir(), { recursive: true, force: true }).catch(() => {})
}

function removeTestCacheDirSync() {
  try {
    fsSync.rmSync(getTestCacheDir(), { recursive: true, force: true })
  } catch {
    // ignore
  }
}

/** 清掉已死 worker 的 cache；崩溃/SIGKILL 后的孤儿靠此回收。 */
async function pruneStaleTestCacheDirs() {
  let entries
  try {
    entries = await fs.readdir(testCacheRoot)
  } catch {
    return
  }

  await Promise.all(
    entries.map(async (name) => {
      const pid = Number(name)
      if (!Number.isInteger(pid) || pid <= 0 || pid === process.pid) return
      if (isPidAlive(pid)) return
      await fs.rm(path.join(testCacheRoot, name), { recursive: true, force: true }).catch(() => {})
    }),
  )
}

/** Avoid HMR websocket port collisions when multiple test workers run Vite. */
function getTestHmrPort() {
  return 24_678 + (process.pid % 4_000)
}

const testServerConfig = {
  configFile: path.join(projectRoot, 'vite.config.ts'),
  appType: 'custom',
  logLevel: 'error',
  cacheDir: getTestCacheDir(),
  optimizeDeps: { noDiscovery: true },
  server: {
    hmr: { port: getTestHmrPort() },
    middlewareMode: true,
    watch: null,
  },
}

let testServerPromise = null
let exitCleanupRegistered = false

function registerExitCleanup() {
  if (exitCleanupRegistered) return
  exitCleanupRegistered = true
  // test.after 覆盖正常结束；exit 覆盖未跑 after 的异常退出。
  process.on('exit', removeTestCacheDirSync)
}

/** One Vite server per test worker process; shared by all loadModule() calls. */
export async function getTestViteServer() {
  if (!testServerPromise) {
    registerExitCleanup()
    await pruneStaleTestCacheDirs()
    testServerPromise = createServer(testServerConfig)
  }
  return testServerPromise
}

export async function loadModule(specifier) {
  const server = await getTestViteServer()
  return server.ssrLoadModule(specifier)
}

export async function closeTestViteServer() {
  if (!testServerPromise) {
    await removeTestCacheDir()
    return
  }

  const server = await testServerPromise.catch(() => null)
  testServerPromise = null

  if (server) {
    await server.close()
  }

  await removeTestCacheDir()
}

test.after(async () => {
  await closeTestViteServer()
})
