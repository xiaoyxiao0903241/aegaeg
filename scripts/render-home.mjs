/**
 * 渲染各语言入口 HTML。
 *
 * 先用临时 HTML 建立 locale 目录，再通过 Vite SSR 加载首页渲染器，
 * 把根入口和各 locale 的 `index.html` / `app.html` 写成最终静态产物。
 */
import { readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createServer } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const placeholderHtml = '<!doctype html><html><head></head><body></body></html>\n'
/** 语言列表唯一来源：`src/i18n/locales.json`，与 `locale-codes.ts` 保持一致。 */
const locales = JSON.parse(readFileSync(resolve(root, 'src/i18n/locales.json'), 'utf8'))

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
  } = await server.ssrLoadModule('/src/views/home/home-renderer.ts')

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
