import { createServer } from 'vite'

export async function loadModule(specifier) {
  const server = await createServer({
    appType: 'custom',
    logLevel: 'error',
    optimizeDeps: { noDiscovery: true },
    server: { hmr: false, middlewareMode: true },
  })

  try {
    return await server.ssrLoadModule(specifier)
  } finally {
    await server.close()
  }
}
