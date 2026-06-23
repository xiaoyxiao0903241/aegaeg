import type { Locale } from '~/i18n/locales'
import { getHtmlLang } from '~/i18n/locale-meta'
import { locales } from '~/i18n/locales'
import { homeMessagesByLocale } from '~/i18n/messages/home'
import { homeAssets } from '~/home/assets'
import { PAGE_SCROLL_RESTORATION_BOOT_SCRIPT } from '~/lib/page-scroll-restoration'

const supportedLocalesJson = JSON.stringify(locales)

// 挂载前关闭浏览器滚动恢复跳动；精确位置由客户端 useLayoutEffect 恢复
const bootScript = PAGE_SCROLL_RESTORATION_BOOT_SCRIPT

function escapeAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const faviconHead = `
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`

/**
 * 首页文档：纯客户端 SPA 薄壳（不做 SSR / 不预渲染内容）。
 * 仅内联关键引导脚本与本地化 <title>/<meta>，由 /src/home/main.tsx 客户端挂载。
 */
export function renderHomeDocument(locale: Locale) {
  const lang = getHtmlLang(locale)
  const meta = homeMessagesByLocale[locale].meta

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeAttr(meta.description)}" />
    <meta name="theme-color" content="#f5f6f8" />
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
    <link rel="stylesheet" href="/src/styles/home.css" />
    <title>${escapeAttr(meta.title)}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/home/main.tsx"></script>
  </body>
</html>
`
}

export function renderAppDocument(locale: Locale) {
  const lang = getHtmlLang(locale)
  const meta = homeMessagesByLocale[locale].meta

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeAttr(meta.description)}" />
    <meta name="theme-color" content="#f5f6f8" />
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
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
}

export function renderRootRedirectDocument() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
${faviconHead}
    <title>AEGIS X</title>
    <script>
      (() => {
        const supported = new Set(${supportedLocalesJson})
        const stored = window.localStorage.getItem('aegis.locale')
        const locale = supported.has(stored) ? stored : 'en'
        window.location.replace('/' + locale + '/' + window.location.search + window.location.hash)
      })()
    </script>
  </head>
  <body>
    <a href="/en/">AEGIS X</a>
  </body>
</html>
`
}

export function renderAppRedirectDocument() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
${faviconHead}
    <title>AEGIS X DApp</title>
    <script>
      (() => {
        const supported = new Set(${supportedLocalesJson})
        const stored = window.localStorage.getItem('aegis.locale')
        const locale = supported.has(stored) ? stored : 'en'
        window.location.replace('/' + locale + '/app.html' + window.location.search + window.location.hash)
      })()
    </script>
  </head>
  <body>
    <a href="/en/app.html">AEGIS X DApp</a>
  </body>
</html>
`
}
