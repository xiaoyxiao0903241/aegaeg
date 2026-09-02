import type { Locale } from '~/i18n/locales'
import type { CatalogMessages } from '~/i18n/messages-catalog'

export type Messages = CatalogMessages

const BOOTSTRAP_SCRIPT_ID = 'aegis-messages'

const messagesCache = new Map<Locale, Messages>()

function readBootstrappedMessages(): { locale: Locale; messages: Messages } | null {
  if (typeof document === 'undefined') return null

  const el = document.getElementById(BOOTSTRAP_SCRIPT_ID)
  if (!el?.textContent?.trim()) return null

  const localeAttr = el.getAttribute('data-locale')
  if (!localeAttr) return null

  try {
    const messages = JSON.parse(el.textContent) as Messages
    return { locale: localeAttr as Locale, messages }
  } catch {
    return null
  }
}

type LocaleMessagesModule = { readonly default: Messages }

/**
 * One dynamic import per locale — keeps Home/DApp entries from bundling every bag.
 * Module defaults are asserted once at the loader boundary (locale files are
 * structurally checked via `messages-catalog` + unit tests).
 */
const loadLocaleMessages = {
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

async function importMessages(locale: Locale): Promise<Messages> {
  const mod = (await loadLocaleMessages[locale]()) as LocaleMessagesModule
  return mod.default
}

/**
 * First paint: read `#aegis-messages` injected by `home-renderer` for the URL locale.
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

/** Locale switch / warm cache — one locale chunk per call. */
export function loadMessages(locale: Locale): Promise<Messages> {
  const cached = messagesCache.get(locale)
  if (cached) return Promise.resolve(cached)

  return importMessages(locale).then((messages) => {
    messagesCache.set(locale, messages)
    return messages
  })
}

export { BOOTSTRAP_SCRIPT_ID }
