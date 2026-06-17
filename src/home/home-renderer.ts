import type { Locale } from '~/i18n/locales'
import { getHtmlLang } from '~/i18n/locale-meta'
import { locales } from '~/i18n/locales'
import { getHomeContent } from '~/home/content'
import { homeAssets } from './assets'

const supportedLocalesJson = JSON.stringify(locales)

// 首页挂载前关闭滚动恢复跳动；hash 由客户端 useLayoutEffect 恢复
const bootScript =
  "try{if('scrollRestoration' in history){history.scrollRestoration='manual'}}catch{}"

function escapeAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * 首页文档：纯客户端 SPA 薄壳（不做 SSR / 不预渲染内容）。
 * 仅内联关键引导脚本与本地化 <title>/<meta>，由 /src/home/main.tsx 客户端挂载。
 */
export function renderHomeDocument(locale: Locale) {
  const lang = getHtmlLang(locale)
  const content = getHomeContent(locale)

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeAttr(content.meta.description)}" />
    <meta name="theme-color" content="#f5f6f8" />
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
    <title>${escapeAttr(content.meta.title)}</title>
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
  const description =
    'AEGIS X DApp community dashboard for BSC wallet access, referral links, programs, and genesis shareholder progress.'

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${description}" />
    <meta name="theme-color" content="#f5f6f8" />
    <link
      rel="preload"
      href="/assets/fonts/montserrat-latin-variable.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <title>AEGIS X DApp — Swap · Genesis · Rewards · Community</title>
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
    <title>AEGIS X</title>
    <script>
      (() => {
        const supported = new Set(${supportedLocalesJson})
        const stored = window.localStorage.getItem('aegis.locale')
        const browser = (() => {
          const tag = (navigator.language || 'en').toLowerCase()
          if (tag.startsWith('zh')) {
            return 'zh'
          }
          const direct = tag.split('-')[0]
          return supported.has(direct) ? direct : 'en'
        })()
        const locale = supported.has(stored) ? stored : browser
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
    <title>AEGIS X DApp</title>
    <script>
      (() => {
        const supported = new Set(${supportedLocalesJson})
        const stored = window.localStorage.getItem('aegis.locale')
        const browser = (() => {
          const tag = (navigator.language || 'en').toLowerCase()
          if (tag.startsWith('zh')) {
            return 'zh'
          }
          const direct = tag.split('-')[0]
          return supported.has(direct) ? direct : 'en'
        })()
        const locale = supported.has(stored) ? stored : browser
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
