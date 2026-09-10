import { deflateRawSync } from 'node:zlib'

import { BOOTSTRAP_SCRIPT_ID, getHtmlLang, type Locale, locales } from '~/i18n'
import { MESSAGE_PAYLOAD_ENCODING } from '~/i18n/message-codec'
import { getMessagesForRender } from '~/i18n/messages-catalog'
import { homeAssets } from '~/shared/assets/home'
import { LEGACY_DOM_POLYFILLS_BOOT_SCRIPT } from '~/shared/lib/legacy-runtime-polyfills'
import { PAGE_SCROLL_RESTORATION_BOOT_SCRIPT } from '~/shared/lib/page-scroll-restoration'
import { themeHex } from '~/shared/styles/theme'

const supportedLocalesJson = JSON.stringify(locales)

// 挂载前：滚动恢复 + DOM 类数组 .at（须在 module 入口之前）；语言 API 见 legacy-core-js + plugin-legacy
const bootScript = PAGE_SCROLL_RESTORATION_BOOT_SCRIPT + LEGACY_DOM_POLYFILLS_BOOT_SCRIPT
const legacyCoreJsScript = '<script type="module" src="/src/shared/lib/legacy-core-js.ts"></script>'

/** HTML 属性值转义，防止动态 meta 文案闭合标签 */
function escapeAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * 文案引导脚本统一序列化：deflate-raw + base64 编码后内联。
 *
 * 编码端（node zlib）与浏览器解码端（message-codec 的 fflate）配对，
 * 线上静态 HTML 不暴露明文文案（防敏感词扫描）。
 * base64 字符集不含 `<`，无需再防 `</script>` 提前闭合。
 *
 * @param locale 目标语言
 * @param bag 序列化的文案袋
 */
function renderMessagesBootstrap(locale: Locale, bag: unknown) {
  const payload = deflateRawSync(JSON.stringify(bag)).toString('base64')
  return `<script type="text/plain" id="${BOOTSTRAP_SCRIPT_ID}" data-locale="${locale}" data-enc="${MESSAGE_PAYLOAD_ENCODING}">${payload}</script>`
}

/**
 * 首页文案引导脚本
 *
 * 把按语言取到的文案子集编码内联进 <script>，
 * 首页只需注入 home、common、errors 三组。解码见 message-codec。
 *
 * @param locale 目标语言
 */
function serializeHomeMessagesBootstrap(locale: Locale) {
  const full = getMessagesForRender(locale)
  const bag = {
    common: full.common,
    errors: full.errors,
    home: full.home,
  }
  return renderMessagesBootstrap(locale, bag)
}

/**
 * DApp 文档文案引导脚本
 *
 * 注入完整文案袋，供应用运行时按语言读取。
 *
 * @param locale 目标语言
 */
function serializeMessagesBootstrap(locale: Locale) {
  return renderMessagesBootstrap(locale, getMessagesForRender(locale))
}

const faviconHead = `
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`

const viewportContent = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'

/**
 * 首页文档模板
 *
 * 纯客户端 SPA 页面容器，不做 SSR 也不预渲染内容；只内联关键引导脚本与
 * 本地化的 <title>/<meta>，页面主体由 /src/boot/home-main.tsx 在客户端挂载。
 *
 * @param locale 目标语言
 */
export function renderHomeDocument(locale: Locale) {
  const lang = getHtmlLang(locale)
  const meta = getMessagesForRender(locale).home.meta

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="${viewportContent}" />
    <meta name="description" content="${escapeAttr(meta.description)}" />
    <meta name="theme-color" content="${themeHex.metaTheme}" />
${faviconHead}
    <link rel="preload" as="image" href="${homeAssets.heroVideoPoster}" fetchpriority="high" />
    <link
      rel="preload"
      href="${homeAssets.font}"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <script>${bootScript}</script>
    <link rel="stylesheet" href="/src/shared/styles/home.css" />
    <title>${escapeAttr(meta.title)}</title>
  </head>
  <body>
    ${serializeHomeMessagesBootstrap(locale)}
    <div id="root"></div>
    ${legacyCoreJsScript}
    <script type="module" src="/src/boot/home-main.tsx"></script>
  </body>
</html>
`
}

/**
 * DApp 应用文档模板
 *
 * 与首页模板结构一致，注入完整文案袋，页面主体由 /src/boot/dapp-main.tsx 在客户端挂载。
 *
 * @param locale 目标语言
 */
export function renderAppDocument(locale: Locale) {
  const lang = getHtmlLang(locale)
  const meta = getMessagesForRender(locale).home.meta

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="${viewportContent}" />
    <meta name="description" content="${escapeAttr(meta.description)}" />
    <meta name="theme-color" content="${themeHex.metaTheme}" />
${faviconHead}
    <link
      rel="preload"
      href="/assets/fonts/montserrat-latin-variable.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <script>${bootScript}</script>
    <title>${escapeAttr(meta.title)}</title>
  </head>
  <body>
    ${serializeMessagesBootstrap(locale)}
    <div id="root"></div>
    ${legacyCoreJsScript}
    <script type="module" src="/src/boot/dapp-main.tsx"></script>
  </body>
</html>
`
}

/**
 * 生成浏览器语言探测脚本
 *
 * 优先读 localStorage 中已保存的语言，其次按浏览器语言匹配，
 * 都不匹配时兜底为英文，随后跳转到对应语言前缀的地址。
 *
 * @param pathSuffix 重定向 URL 追加的路径后缀
 */
function renderBrowserLocaleDetectionScript(pathSuffix = '') {
  return `
        const supported = new Set(${supportedLocalesJson})
        const stored = window.localStorage.getItem('aegis.locale')
        if (supported.has(stored)) {
          window.location.replace('/' + stored + '/${pathSuffix}' + window.location.search + window.location.hash)
          return
        }
        const candidates = [navigator.language, ...(navigator.languages || [])]
        let locale = 'en'
        for (const raw of candidates) {
          if (!raw) continue
          const lower = raw.toLowerCase()
          if (lower.startsWith('zh-tw') || lower.startsWith('zh-hk') || lower.startsWith('zh-hant')) {
            locale = 'zht'
            break
          }
          if (lower.startsWith('zh')) {
            locale = 'zh'
            break
          }
          const base = lower.split('-')[0]
          if (supported.has(base)) {
            locale = base
            break
          }
        }
        window.location.replace('/' + locale + '/${pathSuffix}' + window.location.search + window.location.hash)
      `
}

/** 根路径入口：按浏览器语言重定向到对应语言前缀的首页。 */
export function renderRootRedirectDocument() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="${viewportContent}" />
    <meta name="robots" content="noindex" />
${faviconHead}
    <title>AEGIS X</title>
    <script>
      (() => {${renderBrowserLocaleDetectionScript()}})()
    </script>
  </head>
  <body>
    <a href="/en/">AEGIS X</a>
  </body>
</html>
`
}

/** app.html 入口：按浏览器语言重定向到对应语言前缀的 DApp 页面。 */
export function renderAppRedirectDocument() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="${viewportContent}" />
    <meta name="robots" content="noindex" />
${faviconHead}
    <title>AEGIS X DApp</title>
    <script>
      (() => {${renderBrowserLocaleDetectionScript('app.html')}})()
    </script>
  </head>
  <body>
    <a href="/en/app.html">AEGIS X DApp</a>
  </body>
</html>
`
}
