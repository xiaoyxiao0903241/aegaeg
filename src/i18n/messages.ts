import type { Locale } from '~/i18n/locales'
import { base64ToBytes, inflateMessages } from '~/i18n/message-codec'
import type { CatalogMessages } from '~/i18n/messages-catalog'

export type Messages = CatalogMessages

const BOOTSTRAP_SCRIPT_ID = 'aegis-messages'

/** 语言包二进制地址 —— render-home.mjs 生成 public/i18n/<locale>.bin。 */
const localeBinUrl = (locale: Locale) => `/i18n/${locale}.bin`

const messagesCache = new Map<Locale, Messages>()

function readBootstrappedMessages(): { locale: Locale; messages: Messages } | null {
  if (typeof document === 'undefined') return null

  const el = document.getElementById(BOOTSTRAP_SCRIPT_ID)
  if (!el?.textContent?.trim()) return null

  const localeAttr = el.getAttribute('data-locale')
  if (!localeAttr) return null

  try {
    const messages = inflateMessages<Messages>(base64ToBytes(el.textContent.trim()))
    return { locale: localeAttr as Locale, messages }
  } catch {
    return null
  }
}

type LocaleMessagesModule = { readonly default: Messages }

/**
 * Dev 直读源码模块，文案改动即时生效。
 * 生产构建里 `import.meta.env.DEV` 被替换为常量 false，本表连同动态导入
 * 一并被摇掉 —— dist 不为文案生成任何明文 chunk（单测 + probe:bundle 防回归）。
 */
const devLocaleImports = {
  en: () => import('~/i18n/messages/en'),
  zh: () => import('~/i18n/messages/zh'),
  zht: () => import('~/i18n/messages/zht'),
  id: () => import('~/i18n/messages/id'),
  ko: () => import('~/i18n/messages/ko'),
  ja: () => import('~/i18n/messages/ja'),
  vi: () => import('~/i18n/messages/vi'),
  es: () => import('~/i18n/messages/es'),
  ru: () => import('~/i18n/messages/ru'),
  hi: () => import('~/i18n/messages/hi'),
  tr: () => import('~/i18n/messages/tr'),
  th: () => import('~/i18n/messages/th'),
} satisfies Record<Locale, () => Promise<unknown>>

/** 生产：fetch 编码 .bin 解压 —— 线上任何静态文件都没有明文文案。 */
async function fetchLocaleMessages(locale: Locale): Promise<Messages> {
  const response = await fetch(localeBinUrl(locale))
  if (!response.ok) {
    throw new Error(`Failed to load messages bin for "${locale}" (HTTP ${response.status}).`)
  }
  return inflateMessages<Messages>(new Uint8Array(await response.arrayBuffer()))
}

/** dev 直读源码模块（HMR 即时）；prod fetch 编码 .bin。 */
async function importMessages(locale: Locale): Promise<Messages> {
  if (!import.meta.env.DEV) return fetchLocaleMessages(locale)
  const mod = (await devLocaleImports[locale]()) as LocaleMessagesModule
  return mod.default
}

/**
 * First paint: read the `#aegis-messages` bootstrap (deflate-b64 encoded)
 * injected by `home-renderer` for the URL locale.
 * Avoids statically bundling all locales into every entry.
 */
export function getMessagesSync(locale: Locale): Messages {
  const cached = messagesCache.get(locale)
  if (cached) return cached

  const boot = readBootstrappedMessages()
  if (boot) {
    messagesCache.set(boot.locale, boot.messages)
    if (boot.locale === locale) {
      return boot.messages
    }
  }

  const again = messagesCache.get(locale)
  if (again) return again

  throw new Error(
    `Missing #${BOOTSTRAP_SCRIPT_ID} bootstrap for locale "${locale}". ` +
      'Ensure render-home injected messages for this HTML entry.',
  )
}

/** Locale switch / warm cache — dev: live module import; prod: fetch encoded bin. */
export function loadMessages(locale: Locale): Promise<Messages> {
  const cached = messagesCache.get(locale)
  if (cached) return Promise.resolve(cached)

  return importMessages(locale).then((messages) => {
    messagesCache.set(locale, messages)
    return messages
  })
}

export { BOOTSTRAP_SCRIPT_ID }
