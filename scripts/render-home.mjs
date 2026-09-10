/**
 * 渲染各语言入口 HTML 与编码语言包。
 *
 * 先用临时 HTML 建立 locale 目录，再通过 Vite SSR 加载首页渲染器，
 * 把根入口和各 locale 的 `index.html` / `app.html` 写成最终静态产物；
 * 同时把每个语言的完整文案袋 deflate 后写入 `public/i18n/<locale>.bin`，
 * 供运行时切换语言时 fetch —— 线上静态文件不出现明文文案。
 */
import { readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateRawSync } from 'node:zlib'

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

// 先在 server 内取文案（ssrLoadModule 依赖 vite），再关 server、落盘 .bin
// —— 避免写 public/ 触发 watcher 与 server.close() 的竞态（ERR_CLOSED_SERVER）。
let localeBins
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

  const { getMessagesForRender } = await server.ssrLoadModule('/src/i18n/messages-catalog.ts')
  localeBins = locales.map((locale) => [
    locale,
    deflateRawSync(JSON.stringify(getMessagesForRender(locale))),
  ])
} finally {
  await server.close()
}

// 编码语言包：与 message-codec 的 inflateMessages 配对（deflate-raw，无 zlib 头）。
const binDir = resolve(root, 'public/i18n')
await mkdir(binDir, { recursive: true })
for (const [locale, bin] of localeBins) {
  await writeFile(resolve(binDir, `${locale}.bin`), bin)
}
