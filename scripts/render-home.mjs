import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const placeholderHtml = '<!doctype html><html><head></head><body></body></html>\n'
const locales = ['en', 'zh', 'zh-tw', 'ko', 'ja', 'vi', 'es', 'ru']

for (const locale of locales) {
  const localeRoot = resolve(root, locale)
  await mkdir(localeRoot, { recursive: true })
  await writeFile(resolve(localeRoot, 'index.html'), placeholderHtml, 'utf8')
  await writeFile(resolve(localeRoot, 'app.html'), placeholderHtml, 'utf8')
}

const server = await createServer({
  appType: 'custom',
  logLevel: 'error',
  root,
  server: { middlewareMode: true },
})

try {
  const {
    renderAppRedirectDocument,
    renderAppDocument,
    renderHomeDocument,
    renderRootRedirectDocument,
  } = await server.ssrLoadModule('/src/home/home-renderer.ts')

  await writeFile(resolve(root, 'index.html'), renderRootRedirectDocument(), 'utf8')
  await writeFile(resolve(root, 'app.html'), renderAppRedirectDocument(), 'utf8')

  for (const locale of locales) {
    const localeRoot = resolve(root, locale)
    await writeFile(resolve(localeRoot, 'index.html'), renderHomeDocument(locale), 'utf8')
    await writeFile(resolve(localeRoot, 'app.html'), renderAppDocument(locale), 'utf8')
  }
} finally {
  await server.close()
}
