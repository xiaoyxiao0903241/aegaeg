import { createServer } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/** Per-worker cache — avoids parallel test files fighting over node_modules/.vite/deps. */
function getTestCacheDir() {
  return path.join(projectRoot, 'node_modules', `.vite-test-${process.pid}`)
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

/** One Vite server per test worker process; shared by all loadModule() calls. */
export async function getTestViteServer() {
  testServerPromise ??= createServer(testServerConfig)
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

test.after(async () => {
  await closeTestViteServer()
})
